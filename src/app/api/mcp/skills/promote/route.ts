import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tactics } from "@/db/schema";
import { verifyMcpToken, checkIdempotency, saveIdempotencyResponse, logAudit } from "@/lib/mcp";

export async function POST(req: NextRequest) {
    const authResult = await verifyMcpToken(req);
    if ('error' in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { companyToken } = authResult;
    const companyId = companyToken.companyId;

    const idempotencyResult = await checkIdempotency(req, companyId, "/api/mcp/skills/promote");
    if ('error' in idempotencyResult) {
        return NextResponse.json({ error: idempotencyResult.error }, { status: idempotencyResult.status });
    }
    if ('cachedResponse' in idempotencyResult) {
        return NextResponse.json(idempotencyResult.cachedResponse);
    }
    const { requestHash } = idempotencyResult;

    try {
        const body = await req.json();
        const { name, intent, stepsJson, requiredInputsJson, conditionsJson, successKpisJson, rollbackRulesJson } = body;

        if (!name || !intent || !stepsJson) {
            return NextResponse.json({ error: "Missing required fields (name, intent, stepsJson)" }, { status: 400 });
        }

        const [tactic] = await db.insert(tactics).values({
            companyId,
            name,
            intent,
            version: "1.0",
            status: "proposed", // Requires human or Manager review to distribute globally
            stepsJson,
            requiredInputsJson: requiredInputsJson || {},
            conditionsJson: conditionsJson || {},
            successKpisJson: successKpisJson || {},
            rollbackRulesJson: rollbackRulesJson || {}
        }).returning();

        await logAudit(companyId, "agent", null, "promote_tactic", "tactic", tactic.id, { name, intent });

        const responseObj = { message: "Tactic promoted successfully", tactic };
        await saveIdempotencyResponse(companyId, "/api/mcp/skills/promote", requestHash, responseObj);

        return NextResponse.json(responseObj, { status: 201 });
    } catch (e: any) {
        console.error("MCP Skills Promote Error:", e);
        return NextResponse.json({ error: "Internal server error", details: e.message }, { status: 500 });
    }
}
