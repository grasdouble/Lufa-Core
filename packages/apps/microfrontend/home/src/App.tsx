import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, DotNav, useScrollSpy } from '@grasdouble/lufa_design-system';

import './i18n';

import styles from './App.module.css';
import { LangSwitcher, ThemeSelector } from './components';
import {
  ContactSection,
  FooterSection,
  HeroSection,
  ProjectsSection,
  SectionDivider,
  SkillsSection,
} from './components/sections';
import { SECTION_LABEL_KEY, SECTIONS } from './constants';

function App() {
  const { t } = useTranslation();

  const sectionIds = [...SECTIONS];
  const navSections = SECTIONS.map((id) => ({ id, label: t(SECTION_LABEL_KEY[id]) }));

  const { activeId } = useScrollSpy({ ids: sectionIds });

  return (
    <Box id="lufa-home" className={styles['lufa-home']}>
      <DotNav
        sections={navSections}
        activeId={activeId}
        onSelect={(id: string) => {
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        position="right"
      />
      <LangSwitcher />
      <ThemeSelector />

      <main>
        <HeroSection />
        <SectionDivider />
        <SkillsSection />
        <SectionDivider />
        <ProjectsSection />
        <SectionDivider />
        <ContactSection />
      </main>
      <FooterSection />
    </Box>
  );
}

export default App;
