import { NextRequest, NextResponse } from "next/server";
import { verifyMcpToken, checkIdempotency, saveIdempotencyResponse } from "@/lib/mcp";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
    const auth = await verifyMcpToken(req);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const companyId = auth.companyToken!.companyId;
    const endpoint = "/mcp/projects";

    const { requestHash, cachedResponse, error, status } = await checkIdempotency(req, companyId, endpoint);
    if (error) return NextResponse.json({ error }, { status });
    if (cachedResponse) return NextResponse.json(cachedResponse);

    try {
        const body = await req.json();
        const { customerId, goal, status: projectStatus } = body;

        if (!goal) {
            return NextResponse.json({ error: "goal is required" }, { status: 400 });
        }

        const [project] = await db.insert(projects).values({
            id: randomUUID(),
            companyId,
            customerId: customerId || null,
            goal,
            status: projectStatus || "active",
        }).returning();

        const res = { message: "Project created", project };
        await saveIdempotencyResponse(companyId, endpoint, requestHash!, res);
        return NextResponse.json(res, { status: 201 });
    } catch (err) {
        console.error("Error creating project:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
