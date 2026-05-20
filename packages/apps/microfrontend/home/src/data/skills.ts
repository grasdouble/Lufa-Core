export type SkillVariant = 'info' | 'danger' | 'success' | 'warning' | 'default';

export type Skill = {
  label: string;
  variant: SkillVariant;
};

export const SKILLS: readonly Skill[] = [
  // Frontend core → info (blue)
  { label: 'React', variant: 'info' },
  { label: 'TypeScript', variant: 'info' },
  { label: 'React Router', variant: 'info' },
  { label: 'Redux', variant: 'info' },
  { label: 'React Hook Form', variant: 'info' },
  // Styling → danger (red)
  { label: 'CSS Modules', variant: 'danger' },
  { label: 'SASS', variant: 'danger' },
  // Build & Runtime → success (green)
  { label: 'Vite', variant: 'success' },
  { label: 'Node.js', variant: 'success' },
  { label: 'Express.js', variant: 'success' },
  { label: 'PNPM', variant: 'success' },
  // Architecture → warning (orange)
  { label: 'Design System', variant: 'warning' },
  { label: 'Microfrontend', variant: 'warning' },
  { label: 'Monorepo', variant: 'warning' },
  // Tooling & DevOps → default (gray)
  { label: 'Git', variant: 'default' },
  { label: 'GitHub Actions', variant: 'default' },
  { label: 'Docker', variant: 'default' },
  { label: 'ESLint', variant: 'default' },
  { label: 'Prettier', variant: 'default' },
  { label: 'Grafana', variant: 'default' },
];
