import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        // Read the SKILL.md file from the root directory
        const filePath = path.join(process.cwd(), "SKILL.md");
        const fileContent = fs.readFileSync(filePath, "utf-8");

        return new NextResponse(fileContent, {
            status: 200,
            headers: {
                "Content-Type": "text/markdown",
                // Allow OpenClaw scripts/browsers to fetch this from any origin
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
            },
        });
    } catch (error) {
        console.error("Failed to read SKILL.md:", error);
        return new NextResponse("Skill definition not found", { status: 404 });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}
