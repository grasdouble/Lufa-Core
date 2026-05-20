import React from 'react';
import { useTranslation } from 'react-i18next';

import { Badge, Box, Cluster, Container, Stack, Text } from '@grasdouble/lufa_design-system';

import { SKILLS } from '../../../data/skills';
import sectionStyles from '../section.module.css';

export function SkillsSection() {
  const { t } = useTranslation();

  return (
    <Container id="skills" as="section" size="lg" paddingBlock="spacious">
      <Stack direction="vertical" spacing="comfortable" align="center">
        <Stack direction="vertical" spacing="compact" align="center">
          <Text as="h2" variant="h2" weight="bold" align="center" color="primary">
            {t('skills.title')}
          </Text>
          <Box className={sectionStyles['section-title-accent']} />
        </Stack>
        <Cluster spacing="compact" align="center">
          {SKILLS.map(({ label, variant }) => (
            <Badge key={label} variant={variant} size="lg">
              {label}
            </Badge>
          ))}
        </Cluster>
      </Stack>
    </Container>
  );
}
