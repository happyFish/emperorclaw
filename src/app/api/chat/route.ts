import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { chatMessages } from "@/db/schema";
import { getCompanyId, getUserId } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    const companyId = await getCompanyId();
    if (!companyId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const messages = await db.select()
            .from(chatMessages)
            .where(eq(chatMessages.companyId, companyId))
            .orderBy(desc(chatMessages.createdAt))
            .limit(50);

        return NextResponse.json({ messages: messages.reverse() });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const companyId = await getCompanyId();
    const userId = await getUserId();
    if (!companyId || !userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { text } = await req.json();
        if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

        const [msg] = await db.insert(chatMessages).values({
            companyId,
            senderType: 'human',
            fromUserId: userId,
            text,
            threadId: 'default'
        }).returning();

        return NextResponse.json({ message: msg });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
