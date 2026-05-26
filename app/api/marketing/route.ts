import { NextRequest, NextResponse } from "next/server";
import {
  generateMarketingContent,
  runMarketingTeam,
  MarketingRole,
  getAllRoles
} from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 120;

type Body = {
  prompt?: string;
  role?: MarketingRole | "team";
  roles?: MarketingRole[];
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = (body.prompt || "").trim();
  const role = body.role || "team";
  const roles = body.roles;

  if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  if (prompt.length > 5000)
    return NextResponse.json({ error: "Prompt too long (max 5000 chars)" }, { status: 400 });

  try {
    if (role === "team") {
      // Run the full marketing team
      const result = await runMarketingTeam(prompt, roles);
      return NextResponse.json(result);
    } else {
      // Run a single specialist
      const result = await generateMarketingContent({ role, prompt });
      return NextResponse.json({ results: [result] });
    }
  } catch (err: any) {
    const message = err?.message || "Marketing team request failed";
    console.error("[/api/marketing]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ roles: getAllRoles() });
}
