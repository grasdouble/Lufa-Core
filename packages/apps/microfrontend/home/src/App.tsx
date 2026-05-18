import React from 'react';
import { useTranslation } from 'react-i18next';

import { Badge, Box, Button, Card, Cluster, Container, Stack, Text } from '@grasdouble/lufa_design-system';

import './i18n';

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
  // ── Archivés — du plus récent au plus ancien ──
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
  },
  {
    title: 'git-dashboard',
    key: 'git-dashboard',
    links: [
      { href: 'https://github.com/grasdouble/git-dashboard', label: 'GitHub', type: 'outline', variant: 'neutral' },
    ],
    archived: true,
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
  },
  {
    title: 'POC Phaser',
    key: 'poc-phaser',
    links: [{ href: 'https://github.com/grasdouble/POC_Phaser', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: true,
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
  },
  {
    title: 'Dashboard',
    key: 'dashboard',
    links: [{ href: 'https://github.com/grasdouble/Dashboard', label: 'GitHub', type: 'outline', variant: 'neutral' }],
    archived: true,
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
  },
] as const;

function App() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('fr') ? 'fr' : 'en';

  return (
    <Box id="lufa-home" className={styles['lufa-home']}>
      {/* ── Language switcher ── */}
      <Box className={styles['lang-switcher']}>
        <Button
          type={currentLang === 'fr' ? 'solid' : 'ghost'}
          variant="neutral"
          size="sm"
          onClick={() => void i18n.changeLanguage('fr')}
        >
          🇫🇷
        </Button>
        <Button
          type={currentLang === 'en' ? 'solid' : 'ghost'}
          variant="neutral"
          size="sm"
          onClick={() => void i18n.changeLanguage('en')}
        >
          🇬🇧
        </Button>
      </Box>

      {/* ── Hero ── */}
      <Box as="section" className={styles['section-hero']}>
        <Stack direction="vertical" spacing="default" align="center">
          <img src={getImageUrl('Lufa_Logo_no_background')} alt="Lufa logo" className={styles['hero-logo']} />
          <Stack direction="vertical" spacing="none" align="center">
            <Text as="h1" variant="h1" weight="bold" align="center" color="primary">
              Sébastien LE MOUILLOUR
            </Text>
            <Text as="p" variant="h4" weight="medium" align="center" color="secondary">
              {t('hero.subtitle')}
            </Text>
          </Stack>
          <Text as="p" variant="body-large" align="center" color="tertiary">
            {t('hero.tagline')}
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
            {t('about.title')}
          </Text>
          <Text as="p" variant="body-large" align="center" color="secondary">
            {t('about.p1')}
          </Text>
          <Text as="p" variant="body-large" align="center" color="secondary">
            {t('about.p2')}
          </Text>
          <Text as="p" variant="body-large" align="center" color="secondary">
            {t('about.p3_prefix')}{' '}
            <strong>
              <a href="https://github.com/noofreuuuh" target="_blank" rel="noopener noreferrer">
                noofreuuuh
              </a>
            </strong>{' '}
            {t('about.p3_middle')}{' '}
            <strong>
              <a href="https://github.com/smouillour" target="_blank" rel="noopener noreferrer">
                smouillour
              </a>
            </strong>{' '}
            {t('about.p3_suffix')} <strong>Talend</strong>.
          </Text>
        </Stack>
      </Container>

      {/* ── Skills ── */}
      <Container as="section" size="lg" className={styles.section}>
        <Stack direction="vertical" spacing="comfortable" align="center">
          <Text as="h2" variant="h2" weight="bold" align="center" color="primary">
            {t('skills.title')}
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
            {t('projects.title')}
          </Text>
          <Box className={styles['projects-grid']}>
            {PROJECTS.map(({ title, key, links, archived }) => (
              <Card key={title}>
                <Stack direction="vertical" spacing="default">
                  <Stack direction="horizontal" spacing="compact" align="center" justify="space-between">
                    <Text as="h3" variant="h4" weight="semibold" color="primary">
                      {title}
                    </Text>
                    {archived && (
                      <Badge variant="default" size="sm">
                        {t('projects.archived')}
                      </Badge>
                    )}
                  </Stack>
                  <Text as="p" variant="body" color="secondary">
                    {t(`projects.${key}`)}
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
            {t('contact.title')}
          </Text>
          <Text as="p" variant="body-large" align="center" color="secondary">
            {t('contact.tagline')}
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
              {t('contact.site')}
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
              {t('contact.linkedin')}
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
              {t('contact.githubPersonal')}
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
              {t('contact.githubPro')}
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* ── Footer ── */}
      <Box as="footer" className={styles.footer}>
        <Stack direction="vertical" spacing="none" align="center">
          <Text as="p" variant="caption" color="tertiary" align="center">
            &copy; {new Date().getFullYear()} Sébastien LE MOUILLOUR — Lufa Workspace
          </Text>
          <Text as="p" variant="caption" color="tertiary" align="center">
            {t('footer.built')}
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}

export default App;
