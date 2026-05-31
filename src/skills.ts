import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface Skill {
  id: string;
  number: number;
  name: string;
  filename: string;
  content: string;
}

export function loadSkills(): Skill[] {
  const skillsDir = join(__dirname, "..", "marketing-agency-skills");
  const files = readdirSync(skillsDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  return files.map((filename) => {
    const content = readFileSync(join(skillsDir, filename), "utf-8");
    const number = parseInt(filename.split("-")[0], 10);
    const name = filename
      .replace(/^\d+-/, "")
      .replace(/\.md$/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      id: filename.replace(/\.md$/, ""),
      number,
      name,
      filename,
      content,
    };
  });
}

export function getSkillCategories(): Record<string, Skill[]> {
  const skills = loadSkills();
  return {
    "Strategy & Planning (001-025)": skills.filter(
      (s) => s.number >= 1 && s.number <= 25
    ),
    "Content & Creative (026-050)": skills.filter(
      (s) => s.number >= 26 && s.number <= 50
    ),
    "Digital Marketing & Analytics (051-075)": skills.filter(
      (s) => s.number >= 51 && s.number <= 75
    ),
    "Client Management & Operations (076-100)": skills.filter(
      (s) => s.number >= 76 && s.number <= 100
    ),
  };
}
