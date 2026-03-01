import { db } from "@/db";
import { lt, and, eq, or } from "drizzle-orm";
import { tasks, taskEvents, incidents } from "@/db/schema";
import { Pool } from "pg";

let isWatchdogRunning = false;
const WATCHDOG_INTERVAL_MS = 60000;

const ADVISORY_LOCK_ID = 20261010; // Unique ID for our watchdog lock

// Helper for raw pg connection to hold lock reliably around transaction
const pool = new Pool({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
});

export function startWatchdog() {
    if (isWatchdogRunning) return;
    isWatchdogRunning = true;
    console.log("Starting Emperor Claw Watchdog...");

    // Run immediately on start, then loop
    runWatchdog();
    setInterval(runWatchdog, WATCHDOG_INTERVAL_MS);
}

async function runWatchdog() {
    const client = await pool.connect();
    try {
        // Attempt to acquire advisory lock
        const lockRes = await client.query('SELECT pg_try_advisory_lock($1) as locked', [ADVISORY_LOCK_ID]);
        if (!lockRes.rows[0].locked) {
            // Another instance holding the lock, skip loop
            return;
        }

        const now = new Date();
        // 1. Reclaim expired leases (Retry / Dead Letter)
        // Find tasks where state = 'running' AND leaseUntil < now
        const expiredTasks = await db.select().from(tasks).where(
            and(eq(tasks.state, 'running'), lt(tasks.leaseUntil, now))
        );

        for (const task of expiredTasks) {
            if (task.retries < task.maxRetries) {
                // Retry
                await db.update(tasks).set({
                    state: 'queued',
                    retries: task.retries + 1,
                    leaseOwner: null,
                    leaseUntil: null,
                    assignedAgentId: null,
                    updatedAt: new Date()
                }).where(eq(tasks.id, task.id));

                await db.insert(taskEvents).values({
                    companyId: task.companyId,
                    taskId: task.id,
                    eventType: 'lease_expired_retry',
                    actorType: 'system',
                    payloadJson: { reason: 'lease expired, retrying' },
                });
            } else {
                // Dead letter
                await db.update(tasks).set({
                    state: 'dead_letter',
                    updatedAt: new Date()
                }).where(eq(tasks.id, task.id));

                await db.insert(taskEvents).values({
                    companyId: task.companyId,
                    taskId: task.id,
                    eventType: 'dead_lettered',
                    actorType: 'system',
                    payloadJson: { reason: 'max retries exceeded' },
                });

                // Create incident
                await db.insert(incidents).values({
                    companyId: task.companyId,
                    projectId: task.projectId,
                    taskId: task.id,
                    severity: 'high',
                    reasonCode: 'max_retries_exceeded',
                    summary: `Task ${task.id} exceeded max retries and was dead-lettered.`,
                });
            }
        }

        // 2. Detect SLA breaches
        // state in ('queued', 'running', 'needs_review') AND slaDueAt < now
        const breachedTasks = await db.select().from(tasks).where(
            and(
                or(eq(tasks.state, 'queued'), eq(tasks.state, 'running'), eq(tasks.state, 'needs_review')),
                lt(tasks.slaDueAt, now)
            )
        );

        for (const task of breachedTasks) {
            // Check if an open incident already exists
            const [existingIncident] = await db.select().from(incidents).where(
                and(
                    eq(incidents.taskId, task.id),
                    eq(incidents.reasonCode, 'sla_breach'),
                    eq(incidents.status, 'open')
                )
            ).limit(1);

            if (!existingIncident) {
                await db.insert(incidents).values({
                    companyId: task.companyId,
                    projectId: task.projectId,
                    taskId: task.id,
                    severity: 'medium',
                    reasonCode: 'sla_breach',
                    summary: `Task ${task.id} breached SLA deadline.`,
                });
            }
        }

    } catch (error) {
        console.error("Watchdog execution error:", error);
    } finally {
        try {
            await client.query('SELECT pg_advisory_unlock($1)', [ADVISORY_LOCK_ID]);
        } catch (unlockErr) {
            console.error("Error releasing lock:", unlockErr);
        }
        client.release();
    }
}
