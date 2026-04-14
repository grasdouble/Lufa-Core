import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const configDir = resolve(fileURLToPath(import.meta.url), '..');

const config: Config = {
  title: 'Lufa Design System',
  tagline: 'A modern, accessible design system built with React and CSS Modules',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: {
      useCssCascadeLayers: false,
    },
    faster: {
      rspackBundler: true, // Use Rspack instead of Webpack for faster builds
    },
  },

  // Set the production url of your site here
  url: 'https://lufa-ds.grasdouble.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'grasdouble', // Usually your GitHub org/user name.
  projectName: 'Lufa', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // SEO: Head tags for metadata
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'design system, react, css modules, design tokens, accessibility, wcag, components, ui library',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'author',
        content: 'Grasdouble',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'Lufa Design System',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/grasdouble/Lufa/tree/main/packages/design-system/docusaurus/',
          sidebarCollapsible: true,
          sidebarCollapsed: false,
          // Future: Enable versioning when reaching v1.0.0
          // See docs/changelog.md for versioning strategy
          // Uncomment and configure when ready:
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Development (Unreleased)',
              path: '/',
            },
          },
        },
        blog: false, // Disable blog for design system docs
        theme: {
          customCss: ['./src/css/custom.css'],
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    '@docusaurus/theme-live-codeblock',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: '/docs',
      },
    ],
  ],

  plugins: [resolve(configDir, './plugins/rspack-disable-minimizers.js')],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Lufa Design System',
      logo: {
        alt: 'Lufa Logo',
        src: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          href: 'https://github.com/grasdouble/Lufa',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Installation',
              to: '/docs/getting-started/installation',
            },
            {
              label: 'Components',
              to: '/docs/components/overview',
            },
          ],
        },
        {
          title: 'Tokens',
          items: [
            {
              label: 'Colors',
              to: '/docs/tokens/colors',
            },
            {
              label: 'Typography',
              to: '/docs/tokens/typography',
            },
            {
              label: 'Spacing',
              to: '/docs/tokens/spacing',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/grasdouble/Lufa',
            },
            {
              label: 'Contributing',
              to: '/docs/guides/contributing',
            },
            {
              label: 'Accessibility',
              to: '/docs/accessibility',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Grasdouble.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
