export type HomeSkillKey = "frontend" | "backend" | "tools";

export interface HomeSkill {
  // Stable key → `home.skills.groups.<key>.name` / `.description`.
  key: HomeSkillKey;
  icon: string;
  items: string[];
  iconSkill: string[];
}
