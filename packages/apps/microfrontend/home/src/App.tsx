import React from 'react';

import { Badge, Box, Button, Card, Cluster, Container, Stack, Text } from '@grasdouble/lufa_design-system';

import styles from './App.module.css';
import { getImageUrl } from './getImageUrl';

const SKILLS = [
  // Frontend core → info (blue)
  { label: 'React', variant: 'info' },
  { label: 'TypeScript', variant: 'info' },
  { label: 'React Router', variant: 'info' },
  { label: 'Redux', variant: 'info' },
  { label: 'React Hook Form', variant: 'info' },
  // Styling → error (red)
  { label: 'CSS Modules', variant: 'error' },
  { label: 'SASS', variant: 'error' },
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
] as const;

const PROJECTS = [
  // ── Actifs — du plus récent au plus ancien ──
  {
    title: 'Lufa Design System',
    description:
      'Un design system React avec tokens sémantiques, compatible dark/light mode. Inclut une documentation Storybook interactive.',
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
    description: "Terrain d'expérimentation pour les nouvelles idées du workspace Lufa.",
    links: [{ href: 'https://github.com/grasdouble/Lufa-Lab', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: false,
  },
  {
    title: 'bmad-manager',
    description: "Gestionnaire d'agents BMad pour automatiser les workflows de développement.",
    links: [
      { href: 'https://github.com/grasdouble/bmad-manager', label: 'GitHub', type: 'outline', variant: 'neutral' },
    ],
    archived: false,
  },
  {
    title: 'Lufa',
    description:
      'Le monorepo open-source qui héberge le workspace Lufa : microfrontends, design system, plugins Vite et configs partagées.',
    links: [{ href: 'https://github.com/grasdouble/Lufa', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: false,
  },
  {
    title: 'Dotfiles',
    description: 'Configuration personnelle : terminal, aliases et environnement de développement.',
    links: [{ href: 'https://github.com/grasdouble/Dotfiles', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: false,
  },
  {
    title: 'Leetcode',
    description: 'Mes solutions aux exercices LeetCode — pratique algorithmique en JavaScript.',
    links: [{ href: 'https://github.com/grasdouble/Leetcode', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: false,
  },
  // ── Archivés — du plus récent au plus ancien ──
  {
    title: 'github-package-visualizer',
    description: 'Visualisateur de dépendances entre packages GitHub.',
    links: [
      {
        href: 'https://github.com/grasdouble/github-package-visualizer',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
  },
  {
    title: 'git-dashboard',
    description: 'Dashboard de visualisation des dépôts et activités Git.',
    links: [
      { href: 'https://github.com/grasdouble/git-dashboard', label: 'GitHub', type: 'outline', variant: 'neutral' },
    ],
    archived: true,
  },
  {
    title: 'spark-ai-app-generator',
    description: "Générateur d'applications IA — expérimentation Spark en TypeScript.",
    links: [
      {
        href: 'https://github.com/grasdouble/spark-ai-app-generator',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
  },
  {
    title: 'spark-token-dependency-vis',
    description: 'Visualisateur de dépendances de design tokens — expérimentation Spark en TypeScript.',
    links: [
      {
        href: 'https://github.com/grasdouble/spark-token-dependency-vis',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
  },
  {
    title: 'spark-pixel-art-converter',
    description: 'Convertisseur de pixel art — expérimentation Spark en TypeScript.',
    links: [
      {
        href: 'https://github.com/grasdouble/spark-pixel-art-converter',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
  },
  {
    title: 'POC Phaser',
    description: 'Proof of concept jeu en Vue.js avec le moteur Phaser.',
    links: [{ href: 'https://github.com/grasdouble/POC_Phaser', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: true,
  },
  {
    title: 'POC Bot Discord',
    description: 'Bot Discord expérimental (Grabot) — proof of concept JavaScript.',
    links: [
      {
        href: 'https://github.com/grasdouble/POC_Bot_Discord-Grabot',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
  },
  {
    title: 'Dashboard',
    description: "Dashboard pour gérer GitHub, Jira et d'autres outils depuis une interface unique.",
    links: [{ href: 'https://github.com/grasdouble/Dashboard', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: true,
  },
  {
    title: 'AnnuaireMusees',
    description: "Annuaire de musées (backend PHP + frontend JavaScript) — l'un de mes premiers projets web.",
    links: [
      {
        href: 'https://github.com/grasdouble/AnnuaireMusees_Front',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
  },
  {
    title: 'Model PassportJS Init',
    description: "Template SailJS avec PassportJS pour l'authentification — référence d'architecture MVC.",
    links: [
      {
        href: 'https://github.com/grasdouble/Model_PassportJS-Init',
        label: 'GitHub',
        type: 'outline',
        variant: 'neutral',
      },
    ],
    archived: true,
  },
] as const;

function App() {
  return (
    <Box id="lufa-home" className={styles['lufa-home']}>
      {/* ── Hero ── */}
      <Box as="section" className={styles['section-hero']}>
        <Stack direction="vertical" spacing="default" align="center">
          <img src={getImageUrl('Lufa_Logo_no_background')} alt="Lufa logo" className={styles['hero-logo']} />
          <Stack direction="vertical" spacing="none" align="center">
            <Text as="h1" variant="h1" weight="bold" align="center" color="primary">
              Sébastien LE MOUILLOUR
            </Text>
            <Text as="p" variant="h4" weight="medium" align="center" color="secondary">
              Développeur Frontend
            </Text>
          </Stack>
          <Text as="p" variant="body-large" align="center" color="tertiary">
            Développeur frontend basé à Nantes — JavaScript, TypeScript, React. Passionné par les design systems, les
            architectures microfrontend et le code propre, bien testé, qui dure.
          </Text>
          <Stack direction="horizontal" spacing="compact" wrap justify="center">
            <Button
              as="a"
              href="https://www.linkedin.com/in/sebastienlemouillour/"
              target="_blank"
              rel="noopener noreferrer"
              type="solid"
              variant="info"
              size="lg"
              iconLeft="user"
            >
              LinkedIn
            </Button>
            <Button
              as="a"
              href="https://github.com/grasdouble"
              target="_blank"
              rel="noopener noreferrer"
              type="outline"
              variant="neutral"
              size="lg"
              iconLeft="external-link"
            >
              GitHub
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* ── About ── */}
      <Container as="section" size="lg" className={styles.section}>
        <Stack direction="vertical" spacing="comfortable" align="center">
          <Text as="h2" variant="h2" weight="bold" align="center" color="primary">
            À propos
          </Text>
          <Text as="p" variant="body-large" align="center" color="secondary">
            Développeur frontend passionné, avec un fort focus sur JavaScript, TypeScript et React. Je prends soin de
            construire des logiciels propres, efficaces et bien testés, qui délivrent de la vraie valeur.
          </Text>
          <Text as="p" variant="body-large" align="center" color="secondary">
            En dehors du code, j&apos;aime passer du temps de qualité avec ma famille, nager, jouer au squash, lire des
            mangas et m&apos;immerger dans les jeux vidéo.
          </Text>
          <Text as="p" variant="body-large" align="center" color="secondary">
            Mon travail est réparti entre deux comptes GitHub :{' '}
            <strong>
              <a href="https://github.com/noofreuuuh" target="_blank" rel="noopener noreferrer">
                noofreuuuh
              </a>
            </strong>{' '}
            pour mes projets personnels et{' '}
            <strong>
              <a href="https://github.com/smouillour" target="_blank" rel="noopener noreferrer">
                smouillour
              </a>
            </strong>{' '}
            pour mes contributions professionnelles chez <strong>Talend</strong>.
          </Text>
        </Stack>
      </Container>

      {/* ── Skills ── */}
      <Container as="section" size="lg" className={styles.section}>
        <Stack direction="vertical" spacing="comfortable" align="center">
          <Text as="h2" variant="h2" weight="bold" align="center" color="primary">
            Compétences
          </Text>
          <Cluster spacing="compact" align="center">
            {SKILLS.map(({ label, variant }) => (
              <Badge key={label} variant={variant} size="lg">
                {label}
              </Badge>
            ))}
          </Cluster>
        </Stack>
      </Container>

      {/* ── Projects ── */}
      <Container as="section" size="lg" className={styles.section}>
        <Stack direction="vertical" spacing="comfortable" align="center">
          <Text as="h2" variant="h2" weight="bold" align="center" color="primary">
            Projets
          </Text>
          <Box className={styles['projects-grid']}>
            {PROJECTS.map(({ title, description, links, archived }) => (
              <Card key={title}>
                <Stack direction="vertical" spacing="default">
                  <Stack direction="horizontal" spacing="compact" align="center" justify="space-between">
                    <Text as="h3" variant="h4" weight="semibold" color="primary">
                      {title}
                    </Text>
                    {archived && (
                      <Badge variant="default" size="sm">
                        Archivé
                      </Badge>
                    )}
                  </Stack>
                  <Text as="p" variant="body" color="secondary">
                    {description}
                  </Text>
                  <Cluster spacing="compact">
                    {links.map(({ href, label, type, variant }) => (
                      <Button
                        key={href}
                        as="a"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        type={type}
                        variant={variant}
                        size="sm"
                        iconRight="external-link"
                      >
                        {label}
                      </Button>
                    ))}
                  </Cluster>
                </Stack>
              </Card>
            ))}
          </Box>
        </Stack>
      </Container>

      {/* ── Contact ── */}
      <Container as="section" size="lg" className={styles.section}>
        <Stack direction="vertical" spacing="comfortable" align="center">
          <Text as="h2" variant="h2" weight="bold" align="center" color="primary">
            Contact
          </Text>
          <Text as="p" variant="body-large" align="center" color="secondary">
            Une opportunité, une collaboration, ou juste envie d&apos;échanger ?
          </Text>
          <Stack direction="horizontal" spacing="compact" wrap justify="center">
            <Button
              as="a"
              href="https://www.sebastien-lemouillour.fr"
              target="_blank"
              rel="noopener noreferrer"
              type="solid"
              variant="neutral"
              size="md"
              iconLeft="external-link"
            >
              Mon site
            </Button>
            <Button
              as="a"
              href="https://www.linkedin.com/in/sebastienlemouillour/"
              target="_blank"
              rel="noopener noreferrer"
              type="solid"
              variant="info"
              size="md"
              iconLeft="user"
            >
              Me contacter sur LinkedIn
            </Button>
            <Button
              as="a"
              href="https://github.com/noofreuuuh"
              target="_blank"
              rel="noopener noreferrer"
              type="outline"
              variant="neutral"
              size="md"
              iconLeft="external-link"
            >
              GitHub perso
            </Button>
            <Button
              as="a"
              href="https://github.com/smouillour"
              target="_blank"
              rel="noopener noreferrer"
              type="outline"
              variant="neutral"
              size="md"
              iconLeft="external-link"
            >
              GitHub pro
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* ── Footer ── */}
      <Box as="footer" className={styles.footer}>
        <Stack direction="vertical" spacing="none" align="center">
          <Text as="p" variant="caption" color="tertiary" align="center">
            © {new Date().getFullYear()} Sébastien LE MOUILLOUR — Lufa Workspace
          </Text>
          <Text as="p" variant="caption" color="tertiary" align="center">
            Construit avec React, TypeScript &amp; Lufa Design System
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}

export default App;
