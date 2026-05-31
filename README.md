# Mona - Marketing Agency MCP Server

> A Claude plugin (MCP server) that provides 100 marketing agency skills/roles as AI tools. Use it with Claude Desktop, Claude Code, or any MCP-compatible AI assistant.

## What is this?

Mona is an MCP (Model Context Protocol) server that gives AI assistants access to **100 professional marketing agency roles** — from Brand Strategist to Agency CEO. Each role comes with a complete system prompt including expertise, step-by-step instructions, output format, and example prompts.

## 5 Tools Available

| Tool | Description |
|------|-------------|
| `list_marketing_skills` | List all 100 skills grouped by category |
| `get_marketing_skill` | Get full skill definition by number (1-100) |
| `search_marketing_skills` | Search skills by keyword |
| `get_skills_by_category` | Get all skills in a category (strategy, content, digital, operations) |
| `use_marketing_skill` | Activate a role — AI becomes that marketing expert |

## Skill Categories

| # | Category | Roles |
|---|----------|-------|
| 001-025 | **Strategy & Planning** | Brand Strategist, Market Research, GTM, Positioning, Growth, CRM... |
| 026-050 | **Content & Creative** | Copywriter, SEO Content, Video, Podcasts, UX Writing, Design... |
| 051-075 | **Digital Marketing & Analytics** | PPC, Paid Social, SEO, Analytics, CRO, Programmatic, AI Marketing... |
| 076-100 | **Client Management & Operations** | Account Management, PR, Crisis Comms, MarTech, Fractional CMO, CEO... |

## Installation

### 1. Clone and Build

```bash
git clone https://github.com/SharifulHasanRoky/mona.git
cd mona
npm install
npm run build
```

### 2. Configure Claude Desktop

Add to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mona-marketing-agency": {
      "command": "node",
      "args": ["/absolute/path/to/mona/dist/index.js"]
    }
  }
}
```

### 3. Configure Claude Code

```bash
claude mcp add mona-marketing-agency node /absolute/path/to/mona/dist/index.js
```

### Alternative: npx (after npm publish)

```json
{
  "mcpServers": {
    "mona-marketing-agency": {
      "command": "npx",
      "args": ["mona-marketing-agency-mcp"]
    }
  }
}
```

## Usage Examples

Once connected, ask Claude:

- *"List all marketing skills available"*
- *"I need help with SEO strategy — find the right skill"*
- *"Use skill #26 (Copywriter) to write landing page copy for my SaaS product"*
- *"Act as a Brand Strategist and develop positioning for my startup"*
- *"Show me all digital marketing skills"*
- *"Search for skills related to social media"*

## How It Works

```
┌─────────────────┐     stdio      ┌──────────────────────┐
│  Claude Desktop │ ◄────────────► │  Mona MCP Server     │
│  or Claude Code │                │                      │
└─────────────────┘                │  ┌────────────────┐  │
                                   │  │ 100 MD Skills  │  │
                                   │  └────────────────┘  │
                                   │                      │
                                   │  5 Tools:            │
                                   │  - list              │
                                   │  - get               │
                                   │  - search            │
                                   │  - category          │
                                   │  - use/activate      │
                                   └──────────────────────┘
```

## Project Structure

```
mona/
├── src/
│   ├── index.ts          # MCP server with 5 tools
│   └── skills.ts         # Skills loader and categorizer
├── marketing-agency-skills/
│   ├── 001-brand-strategist.md
│   ├── 002-market-research-analyst.md
│   ├── ...
│   └── 100-marketing-agency-ceo.md
├── package.json
├── tsconfig.json
└── README.md
```

## All 100 Skills

<details>
<summary>Click to expand full list</summary>

| # | Skill |
|---|-------|
| 001 | Brand Strategist |
| 002 | Market Research Analyst |
| 003 | Marketing Strategist |
| 004 | Target Audience Analyst |
| 005 | Competitive Intelligence Specialist |
| 006 | Campaign Planner |
| 007 | Media Planner |
| 008 | Creative Director |
| 009 | Positioning Specialist |
| 010 | Go-to-Market Strategist |
| 011 | Customer Journey Mapper |
| 012 | Pricing Strategist |
| 013 | Growth Strategist |
| 014 | Digital Transformation Consultant |
| 015 | Marketing Budget Analyst |
| 016 | Marketing Automation Specialist |
| 017 | CRM Strategist |
| 018 | Partnership Marketing Strategist |
| 019 | Event Marketing Strategist |
| 020 | Product Marketing Manager |
| 021 | Market Entry Strategist |
| 022 | Brand Messaging Architect |
| 023 | Customer Insights Strategist |
| 024 | Seasonal Campaign Specialist |
| 025 | Marketing Operations Specialist |
| 026 | Copywriter |
| 027 | Content Strategist |
| 028 | SEO Content Specialist |
| 029 | Social Media Content Creator |
| 030 | Email Marketing Specialist |
| 031 | Video Content Strategist |
| 032 | Blog Content Writer |
| 033 | Podcast Producer |
| 034 | Graphic Designer |
| 035 | UX Writer |
| 036 | Storytelling Specialist |
| 037 | Thought Leadership Writer |
| 038 | Press Release Writer |
| 039 | Case Study Writer |
| 040 | Whitepaper Author |
| 041 | Infographic Designer |
| 042 | Newsletter Editor |
| 043 | Content Repurposing Specialist |
| 044 | Brand Voice Specialist |
| 045 | Landing Page Specialist |
| 046 | Presentation Designer |
| 047 | Ad Creative Specialist |
| 048 | Scriptwriter |
| 049 | Interactive Content Designer |
| 050 | Content Calendar Manager |
| 051 | PPC Specialist |
| 052 | Paid Social Specialist |
| 053 | SEO Strategist |
| 054 | Analytics Specialist |
| 055 | Conversion Rate Optimizer |
| 056 | Social Media Ads Analyst |
| 057 | Influencer Marketing Manager |
| 058 | Programmatic Advertising Specialist |
| 059 | Marketing Data Analyst |
| 060 | Affiliate Marketing Manager |
| 061 | Community Manager |
| 062 | E-commerce Marketing Specialist |
| 063 | Marketing Attribution Analyst |
| 064 | Local SEO Specialist |
| 065 | A/B Testing Specialist |
| 066 | Web Analytics Consultant |
| 067 | Reputation Manager |
| 068 | Social Listening Analyst |
| 069 | Marketing Dashboard Designer |
| 070 | Customer Acquisition Specialist |
| 071 | Retention Marketing Specialist |
| 072 | AI Marketing Specialist |
| 073 | Mobile Marketing Specialist |
| 074 | Search Engine Marketing Strategist |
| 075 | Performance Marketing Director |
| 076 | Account Manager |
| 077 | New Business Developer |
| 078 | Project Manager |
| 079 | Client Strategist |
| 080 | Proposal Writer |
| 081 | Marketing Consultant |
| 082 | Crisis Communications Manager |
| 083 | Public Relations Specialist |
| 084 | Agency Operations Director |
| 085 | Marketing Talent Recruiter |
| 086 | Client Reporting Specialist |
| 087 | Scope of Work Specialist |
| 088 | Marketing Trainer |
| 089 | Vendor Manager |
| 090 | Brand Compliance Officer |
| 091 | Marketing Technology Manager |
| 092 | Quality Assurance Specialist |
| 093 | Agency Growth Strategist |
| 094 | Client Onboarding Specialist |
| 095 | Marketing Legal Advisor |
| 096 | Sustainability Marketing Specialist |
| 097 | Diversity & Inclusion Marketing Specialist |
| 098 | Marketing Workflow Designer |
| 099 | Fractional CMO |
| 100 | Marketing Agency CEO |

</details>

## License

MIT
