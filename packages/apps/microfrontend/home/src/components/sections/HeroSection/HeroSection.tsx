import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Stack, Text } from '@grasdouble/lufa_design-system';

import { getImageUrl } from '../../../getImageUrl';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <Box id="hero" as="section" className={styles['section-hero']}>
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
  );
}
