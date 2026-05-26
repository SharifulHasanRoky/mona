// Anthropic Claude API client for AI Marketing Team.
// Docs: https://docs.anthropic.com/en/docs/initial-setup

const BASE = "https://api.anthropic.com/v1";
const MODEL = "claude-sonnet-4-20250514";

function requireKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to .env.local");
  }
  return key;
}

export type MarketingRole =
  | "strategist"
  | "copywriter"
  | "seo_expert"
  | "social_media"
  | "email_marketer"
  | "brand_analyst";

export type MarketingRequest = {
  role: MarketingRole;
  prompt: string;
  context?: string;
};

export type MarketingResponse = {
  role: MarketingRole;
  roleName: string;
  content: string;
};

export type TeamResponse = {
  results: MarketingResponse[];
  summary?: string;
};

const ROLE_CONFIGS: Record<MarketingRole, { name: string; systemPrompt: string }> = {
  strategist: {
    name: "Marketing Strategist",
    systemPrompt: `You are a senior Marketing Strategist on an AI-powered marketing team. Your role is to:
- Develop comprehensive marketing strategies and campaign plans
- Identify target audiences and market positioning
- Create go-to-market frameworks and competitive analyses
- Define KPIs, success metrics, and growth levers
- Align marketing efforts with business objectives

Provide clear, actionable strategic recommendations. Use frameworks (SWOT, Porter's 5 Forces, AIDA) when relevant. Be specific with timelines and milestones.`
  },
  copywriter: {
    name: "Copywriter",
    systemPrompt: `You are an expert Copywriter on an AI-powered marketing team. Your role is to:
- Write compelling headlines, taglines, and body copy
- Create persuasive landing page content and CTAs
- Develop brand voice and messaging frameworks
- Write ad copy for multiple channels (Google, Meta, LinkedIn)
- Craft product descriptions and value propositions

Write with clarity, emotion, and persuasion. Match tone to the brand and audience. Always include multiple variations when creating headlines or taglines.`
  },
  seo_expert: {
    name: "SEO Expert",
    systemPrompt: `You are an SEO Expert on an AI-powered marketing team. Your role is to:
- Conduct keyword research and analysis
- Optimize content for search engines (on-page, technical, off-page)
- Create SEO content briefs and topic clusters
- Analyze search intent and SERP features
- Provide technical SEO recommendations (schema, site speed, crawlability)
- Develop link-building strategies

Provide data-driven recommendations. Include specific keywords, search volumes estimates, and difficulty assessments. Structure advice with clear priorities.`
  },
  social_media: {
    name: "Social Media Manager",
    systemPrompt: `You are a Social Media Manager on an AI-powered marketing team. Your role is to:
- Create engaging social media content for all platforms (X/Twitter, LinkedIn, Instagram, TikTok, Facebook)
- Develop content calendars and posting schedules
- Write platform-specific captions and hashtag strategies
- Plan viral campaigns and community engagement tactics
- Identify trends and timely content opportunities
- Create influencer collaboration strategies

Adapt your writing style to each platform. Include specific posting times, hashtag sets, and engagement hooks. Be creative and trend-aware.`
  },
  email_marketer: {
    name: "Email Marketing Specialist",
    systemPrompt: `You are an Email Marketing Specialist on an AI-powered marketing team. Your role is to:
- Write high-converting email sequences (welcome, nurture, sales, retention)
- Create compelling subject lines and preview text
- Design email flows and automation triggers
- Develop segmentation strategies
- Write newsletter content and product announcements
- Optimize for deliverability and engagement metrics

Include subject line variations, clear CTAs, and segmentation logic. Structure emails with proper hierarchy and scannable formatting.`
  },
  brand_analyst: {
    name: "Brand Analyst",
    systemPrompt: `You are a Brand Analyst on an AI-powered marketing team. Your role is to:
- Analyze brand perception and market positioning
- Develop brand identity guidelines and tone of voice
- Conduct competitor brand audits
- Create brand storytelling frameworks
- Identify brand differentiation opportunities
- Measure brand health and sentiment

Provide analytical, insight-driven recommendations. Use examples and comparisons. Ground your analysis in consumer psychology and market dynamics.`
  }
};

export function getRoleName(role: MarketingRole): string {
  return ROLE_CONFIGS[role]?.name || role;
}

export function getAllRoles(): { role: MarketingRole; name: string }[] {
  return Object.entries(ROLE_CONFIGS).map(([role, config]) => ({
    role: role as MarketingRole,
    name: config.name
  }));
}

export async function generateMarketingContent(
  request: MarketingRequest
): Promise<MarketingResponse> {
  const key = requireKey();
  const config = ROLE_CONFIGS[request.role];

  if (!config) {
    throw new Error(`Unknown marketing role: ${request.role}`);
  }

  const messages: { role: "user"; content: string }[] = [
    {
      role: "user",
      content: request.context
        ? `Context from the team:\n${request.context}\n\nTask: ${request.prompt}`
        : request.prompt
    }
  ];

  const res = await fetch(`${BASE}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      system: config.systemPrompt,
      messages
    })
  });

  if (!res.ok) {
    const text = await safeText(res);
    throw new Error(`Claude (${config.name}): ${res.status} ${text}`);
  }

  const data = await res.json();
  const content =
    data?.content
      ?.filter((block: any) => block.type === "text")
      .map((block: any) => block.text)
      .join("\n") || "";

  if (!content) {
    throw new Error(`Claude (${config.name}): empty response`);
  }

  return {
    role: request.role,
    roleName: config.name,
    content
  };
}

export async function runMarketingTeam(
  prompt: string,
  roles?: MarketingRole[]
): Promise<TeamResponse> {
  const selectedRoles = roles && roles.length > 0 ? roles : (Object.keys(ROLE_CONFIGS) as MarketingRole[]);

  // Run all specialists in parallel
  const results = await Promise.allSettled(
    selectedRoles.map((role) => generateMarketingContent({ role, prompt }))
  );

  const successful: MarketingResponse[] = [];
  const errors: string[] = [];

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      successful.push(result.value);
    } else {
      errors.push(`${getRoleName(selectedRoles[i])}: ${result.reason?.message || "Failed"}`);
    }
  });

  if (successful.length === 0) {
    throw new Error(`All marketing team members failed:\n${errors.join("\n")}`);
  }

  // Generate a team summary if we have multiple results
  let summary: string | undefined;
  if (successful.length > 1) {
    try {
      const summaryContext = successful
        .map((r) => `[${r.roleName}]: ${r.content.slice(0, 500)}`)
        .join("\n\n");

      const summaryResult = await generateMarketingContent({
        role: "strategist",
        prompt: `Based on the team's outputs below, provide a brief 2-3 sentence executive summary of the key recommendations and how they align:\n\n${summaryContext}`,
        context: undefined
      });
      summary = summaryResult.content;
    } catch {
      // Summary is optional; don't fail if it errors
    }
  }

  return { results: successful, summary };
}

async function safeText(res: Response): Promise<string> {
  try {
    const t = await res.text();
    return t.slice(0, 500);
  } catch {
    return "";
  }
}
