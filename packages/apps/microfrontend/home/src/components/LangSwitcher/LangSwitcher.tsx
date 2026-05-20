import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button } from '@grasdouble/lufa_design-system';

import styles from './LangSwitcher.module.css';

export function LangSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('fr') ? 'fr' : 'en';

  return (
    <Box className={styles['lang-switcher']}>
      <Button
        type={currentLang === 'fr' ? 'solid' : 'outline'}
        variant="neutral"
        size="sm"
        onClick={() => void i18n.changeLanguage('fr')}
        aria-label="Switch language to French"
      >
        🇫🇷
      </Button>
      <Button
        type={currentLang === 'en' ? 'solid' : 'outline'}
        variant="neutral"
        size="sm"
        onClick={() => void i18n.changeLanguage('en')}
        aria-label="Switch language to English"
      >
        🇬🇧
      </Button>
    </Box>
  );
}
