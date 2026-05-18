import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Stack, Text } from '@grasdouble/lufa_design-system';

import styles from './FooterSection.module.css';

export function FooterSection() {
  const { t } = useTranslation();

  return (
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
  );
}
