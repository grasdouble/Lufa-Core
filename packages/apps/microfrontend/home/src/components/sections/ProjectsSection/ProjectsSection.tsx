import React from 'react';
import { useTranslation } from 'react-i18next';

import { Badge, Box, Button, Card, Cluster, Container, Stack, Text } from '@grasdouble/lufa_design-system';

import { PROJECTS } from '../../../data/projects';
import sectionStyles from '../section.module.css';
import styles from './ProjectsSection.module.css';

export function ProjectsSection() {
  const { t } = useTranslation();

  return (
    <Container id="projects" as="section" size="lg" paddingBlock="spacious">
      <Stack direction="vertical" spacing="comfortable" align="center">
        <Stack direction="vertical" spacing="compact" align="center">
          <Text as="h2" variant="h2" weight="bold" align="center" color="primary">
            {t('projects.title')}
          </Text>
          <Box className={sectionStyles['section-title-accent']} />
        </Stack>
        <Box className={styles['projects-grid']}>
          {PROJECTS.map(({ title, key, links, archived, archivedYear }) => (
            <Card key={title}>
              <Stack direction="vertical" spacing="default">
                <Stack direction="horizontal" spacing="compact" align="center" justify="space-between">
                  <Text as="h3" variant="h4" weight="semibold" color="primary">
                    {title}
                  </Text>
                  {archived && (
                    <Badge variant="default" size="sm">
                      {t('projects.archived')}
                      {archivedYear ? ` · ${archivedYear}` : ''}
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
                      aria-label={label === 'GitHub' ? `View ${title} on GitHub` : label}
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
  );
}
