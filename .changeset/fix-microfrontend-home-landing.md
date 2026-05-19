---
"@grasdouble/lufa_microfrontend_home": minor
---

Add personal developer landing page as a microfrontend parcel.

- New sections: Hero, Skills, Projects, Contact, Footer
- Internationalisation (FR / EN) via i18n with a LangSwitcher component
- SideNav with scroll-spy and active-section highlight
- ThemeSelector component exposing all DS themes + dark/light/auto mode toggle
- Responsive layout using DS components (Container, Stack, Cluster, Card); projects grid uses a custom CSS `auto-fit` layout (not supported by the DS Grid component)
- DS design tokens used for colours; section spacing and logo sizes use fixed rem/px values
