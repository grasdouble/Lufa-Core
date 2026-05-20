import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Container, Stack, Text } from '@grasdouble/lufa_design-system';

import { getImageUrl } from '../../../getImageUrl';
import sectionStyles from '../section.module.css';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <Box id="hero" as="section" className={styles['section-hero']}>
      <Stack direction="vertical" spacing="spacious" align="center">
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
        </Stack>
        <Container size="md">
          <Stack direction="vertical" spacing="default" align="center">
            <Box className={sectionStyles['section-title-accent']} />
            <Text as="p" variant="body-large" align="center" color="secondary">
              {t('about.p1')}
            </Text>
            <Text as="p" variant="body-large" align="center" color="secondary">
              {t('about.p2')}
            </Text>
            <Text as="p" variant="body-large" align="center" color="secondary">
              {t('about.p3_prefix')}{' '}
              <strong>
                <a
                  href="https://github.com/noofreuuuh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['hero-link']}
                >
                  noofreuuuh
                </a>
              </strong>{' '}
              {t('about.p3_middle')}{' '}
              <strong>
                <a
                  href="https://github.com/smouillour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['hero-link']}
                >
                  smouillour
                </a>
              </strong>{' '}
              {t('about.p3_suffix')} <strong>Talend</strong>.
            </Text>
          </Stack>
        </Container>
      </Stack>
    </Box>
  );
}
