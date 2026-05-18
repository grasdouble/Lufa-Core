import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@grasdouble/lufa_design-system';

import './i18n';

import styles from './App.module.css';
import { LangSwitcher, SideNav } from './components';
import {
  AboutSection,
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

  const navSections = SECTIONS.map((id) => ({ id, label: t(SECTION_LABEL_KEY[id]) }));

  return (
    <Box id="lufa-home" className={styles['lufa-home']}>
      <SideNav sections={navSections} />
      <LangSwitcher />

      <HeroSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <SkillsSection />
      <SectionDivider />
      <ProjectsSection />
      <SectionDivider />
      <ContactSection />
      <FooterSection />
    </Box>
  );
}

export default App;
