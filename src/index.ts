#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadSkills, getSkillCategories } from "./skills.js";

const server = new McpServer({
  name: "mona-marketing-agency",
  version: "1.0.0",
});

// Tool 1: List all available marketing skills
server.tool(
  "list_marketing_skills",
  "List all 100 marketing agency skills/roles available, grouped by category",
  {},
  async () => {
    const categories = getSkillCategories();
    let output = "# Marketing Agency Skills (100 Roles)\n\n";

    for (const [category, skills] of Object.entries(categories)) {
      output += `## ${category}\n`;
      for (const skill of skills) {
        output += `- **${skill.number.toString().padStart(3, "0")}** ${skill.name}\n`;
      }
      output += "\n";
    }

    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 2: Get a specific skill by number
server.tool(
  "get_marketing_skill",
  "Get the full skill/role definition for a specific marketing agency role by number (1-100)",
  { skill_number: z.number().min(1).max(100).describe("Skill number from 1 to 100") },
  async ({ skill_number }) => {
    const skills = loadSkills();
    const skill = skills.find((s) => s.number === skill_number);

    if (!skill) {
      return {
        content: [{ type: "text", text: `Skill #${skill_number} not found.` }],
        isError: true,
      };
    }

    return { content: [{ type: "text", text: skill.content }] };
  }
);

// Tool 3: Search skills by keyword
server.tool(
  "search_marketing_skills",
  "Search marketing agency skills by keyword in name or content",
  { query: z.string().describe("Keyword to search for in skill names and content") },
  async ({ query }) => {
    const skills = loadSkills();
    const lowerQuery = query.toLowerCase();
    const matches = skills.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.content.toLowerCase().includes(lowerQuery)
    );

    if (matches.length === 0) {
      return {
        content: [{ type: "text", text: `No skills found matching "${query}".` }],
      };
    }

    let output = `# Search Results for "${query}" (${matches.length} found)\n\n`;
    for (const skill of matches) {
      output += `- **${skill.number.toString().padStart(3, "0")}** ${skill.name}\n`;
    }
    output += `\nUse \`get_marketing_skill\` with the skill number to get full details.`;

    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 4: Get skill by category
server.tool(
  "get_skills_by_category",
  "Get all marketing skills in a specific category: strategy, content, digital, or operations",
  {
    category: z
      .enum(["strategy", "content", "digital", "operations"])
      .describe("Category: strategy (001-025), content (026-050), digital (051-075), operations (076-100)"),
  },
  async ({ category }) => {
    const skills = loadSkills();
    let filtered: typeof skills;
    let categoryName: string;

    switch (category) {
      case "strategy":
        filtered = skills.filter((s) => s.number >= 1 && s.number <= 25);
        categoryName = "Strategy & Planning";
        break;
      case "content":
        filtered = skills.filter((s) => s.number >= 26 && s.number <= 50);
        categoryName = "Content & Creative";
        break;
      case "digital":
        filtered = skills.filter((s) => s.number >= 51 && s.number <= 75);
        categoryName = "Digital Marketing & Analytics";
        break;
      case "operations":
        filtered = skills.filter((s) => s.number >= 76 && s.number <= 100);
        categoryName = "Client Management & Operations";
        break;
    }

    let output = `# ${categoryName} Skills\n\n`;
    for (const skill of filtered) {
      output += `### ${skill.number.toString().padStart(3, "0")} - ${skill.name}\n`;
      // Extract just the role description (first few lines)
      const lines = skill.content.split("\n");
      const roleIdx = lines.findIndex((l) => l.startsWith("## Role"));
      if (roleIdx !== -1) {
        const roleDesc = lines
          .slice(roleIdx + 1, roleIdx + 3)
          .filter((l) => l.trim())
          .join(" ");
        output += `${roleDesc}\n\n`;
      }
    }

    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 5: Use a skill (get the prompt to act as that role)
server.tool(
  "use_marketing_skill",
  "Activate a marketing agency role - returns the full system prompt to act as that professional. Use this to become that marketing expert.",
  {
    skill_number: z.number().min(1).max(100).describe("Skill number (1-100) to activate"),
    task: z.string().optional().describe("Optional: specific task or question for this role"),
  },
  async ({ skill_number, task }) => {
    const skills = loadSkills();
    const skill = skills.find((s) => s.number === skill_number);

    if (!skill) {
      return {
        content: [{ type: "text", text: `Skill #${skill_number} not found.` }],
        isError: true,
      };
    }

    let output = skill.content;
    if (task) {
      output += `\n\n---\n\n## Current Task\n${task}\n\nPlease complete this task following the instructions and output format defined above.`;
    }

    return { content: [{ type: "text", text: output }] };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Mona Marketing Agency MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
