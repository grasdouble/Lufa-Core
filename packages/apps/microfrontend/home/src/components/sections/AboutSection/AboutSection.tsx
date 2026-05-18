import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Container, Stack, Text } from '@grasdouble/lufa_design-system';

import sectionStyles from '../section.module.css';

export function AboutSection() {
  const { t } = useTranslation();

  return (
    <Box id="about" as="section" className={sectionStyles.section}>
      <Container size="lg">
        <Stack direction="vertical" spacing="comfortable" align="center">
          <Stack direction="vertical" spacing="compact" align="center">
            <Text as="h2" variant="h2" weight="bold" align="center" color="primary">
              {t('about.title')}
            </Text>
            <Box className={sectionStyles['section-title-accent']} />
          </Stack>
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
    </Box>
  );
}
