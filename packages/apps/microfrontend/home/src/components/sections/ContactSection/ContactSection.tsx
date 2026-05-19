import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Container, Stack, Text } from '@grasdouble/lufa_design-system';

import sectionStyles from '../section.module.css';

export function ContactSection() {
  const { t } = useTranslation();

  return (
    <Container id="contact" as="section" size="lg" paddingBlock="spacious">
      <Stack direction="vertical" spacing="comfortable" align="center">
        <Stack direction="vertical" spacing="compact" align="center">
          <Text as="h2" variant="h2" weight="bold" align="center" color="primary">
            {t('contact.title')}
          </Text>
          <Box className={sectionStyles['section-title-accent']} />
        </Stack>
        <Text as="p" variant="body-large" align="center" color="secondary">
          {t('contact.tagline')}
        </Text>
        <Stack direction="horizontal" spacing="compact" wrap justify="center">
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
  );
}
