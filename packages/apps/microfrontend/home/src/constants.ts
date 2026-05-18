export const SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact'] as const;
export type SectionId = (typeof SECTIONS)[number];

export const SECTION_LABEL_KEY: Record<SectionId, string> = {
  hero: 'hero.nav',
  about: 'about.title',
  skills: 'skills.title',
  projects: 'projects.title',
  contact: 'contact.title',
};
