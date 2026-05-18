export type ProjectLinkType = 'solid' | 'outline' | 'ghost';
export type ProjectLinkVariant = 'neutral' | 'info' | 'success' | 'danger' | 'warning' | 'primary' | 'secondary';

export type ProjectLink = {
  href: string;
  label: string;
  type: ProjectLinkType;
  variant: ProjectLinkVariant;
};

export type Project = {
  title: string;
  key: string;
  links: readonly ProjectLink[];
  archived: boolean;
  archivedYear?: number;
};

export const PROJECTS: readonly Project[] = [
  // ── Active — most recent first ──
  {
    title: 'Lufa Design System',
    key: 'lufa-design-system',
    links: [
      {
        href: 'https://lufa-design.sebastien-lemouillour.fr',
        label: 'Design System',
        type: 'solid',
        variant: 'success',
      },
      {
        href: 'https://lufa-storybook.sebastien-lemouillour.fr',
        label: 'Storybook',
        type: 'solid',
        variant: 'success',
      },
      {
        href: 'https://github.com/grasdouble/Lufa-Design-System',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: false,
  },
  {
    title: 'Lufa Lab',
    key: 'lufa-lab',
    links: [{ href: 'https://github.com/grasdouble/Lufa-Lab', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: false,
  },
  {
    title: 'bmad-manager',
    key: 'bmad-manager',
    links: [
      { href: 'https://github.com/grasdouble/bmad-manager', label: 'GitHub', type: 'outline', variant: 'neutral' },
    ],
    archived: false,
  },
  {
    title: 'Lufa',
    key: 'lufa',
    links: [{ href: 'https://github.com/grasdouble/Lufa', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: false,
  },
  {
    title: 'Dotfiles',
    key: 'dotfiles',
    links: [{ href: 'https://github.com/grasdouble/Dotfiles', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: false,
  },
  {
    title: 'Leetcode',
    key: 'leetcode',
    links: [{ href: 'https://github.com/grasdouble/Leetcode', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: false,
  },
  // ── Archived — most recent first ──
  {
    title: 'github-package-visualizer',
    key: 'github-package-visualizer',
    links: [
      {
        href: 'https://github.com/grasdouble/github-package-visualizer',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
    archivedYear: 2026,
  },
  {
    title: 'git-dashboard',
    key: 'git-dashboard',
    links: [
      { href: 'https://github.com/grasdouble/git-dashboard', label: 'GitHub', type: 'outline', variant: 'neutral' },
    ],
    archived: true,
    archivedYear: 2026,
  },
  {
    title: 'spark-ai-app-generator',
    key: 'spark-ai-app-generator',
    links: [
      {
        href: 'https://github.com/grasdouble/spark-ai-app-generator',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
    archivedYear: 2026,
  },
  {
    title: 'spark-token-dependency-vis',
    key: 'spark-token-dependency-vis',
    links: [
      {
        href: 'https://github.com/grasdouble/spark-token-dependency-vis',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
    archivedYear: 2026,
  },
  {
    title: 'spark-pixel-art-converter',
    key: 'spark-pixel-art-converter',
    links: [
      {
        href: 'https://github.com/grasdouble/spark-pixel-art-converter',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
    archivedYear: 2026,
  },
  {
    title: 'POC Phaser',
    key: 'poc-phaser',
    links: [{ href: 'https://github.com/grasdouble/POC_Phaser', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: true,
    archivedYear: 2025,
  },
  {
    title: 'POC Bot Discord',
    key: 'poc-bot-discord',
    links: [
      {
        href: 'https://github.com/grasdouble/POC_Bot_Discord-Grabot',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
    archivedYear: 2025,
  },
  {
    title: 'Dashboard',
    key: 'dashboard',
    links: [{ href: 'https://github.com/grasdouble/Dashboard', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: true,
    archivedYear: 2021,
  },
  {
    title: 'AnnuaireMusees',
    key: 'annuaire-musees',
    links: [
      {
        href: 'https://github.com/grasdouble/AnnuaireMusees_Front',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
    archivedYear: 2021,
  },
  {
    title: 'Model PassportJS Init',
    key: 'model-passportjs-init',
    links: [
      {
        href: 'https://github.com/grasdouble/Model_PassportJS-Init',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
    archivedYear: 2021,
  },
];
