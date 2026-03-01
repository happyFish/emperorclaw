import { NextRequest, NextResponse } from "next/server";
import { verifyMcpToken } from "@/lib/mcp";
import { db } from "@/db";
import { chatMessages } from "@/db/schema";
import { eq, and, gt, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    const auth = await verifyMcpToken(req);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const companyId = auth.companyToken!.companyId;
    const { searchParams } = new URL(req.url);
    const since = searchParams.get('since'); // ISO Date string

    try {
        let conditions: any[] = [
            eq(chatMessages.companyId, companyId),
            eq(chatMessages.senderType, 'human') // OpenClaw only needs to pull human directives
        ];

        if (since) {
            const sinceDate = new Date(since);
            if (!isNaN(sinceDate.getTime())) {
                conditions.push(gt(chatMessages.createdAt, sinceDate));
            }
        }

        const messages = await db.select()
            .from(chatMessages)
            .where(and(...conditions))
            .orderBy(desc(chatMessages.createdAt))
            .limit(100);

        return NextResponse.json({
            ok: true,
            messages: messages.reverse() // Return chronological order
        });
    } catch (error) {
        console.error("Failed to sync messages:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
