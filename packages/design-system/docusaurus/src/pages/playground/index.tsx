import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';

import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Cluster,
  Divider,
  Grid,
  Input,
  Label,
  Stack,
  Text,
} from '@grasdouble/lufa_design-system';

import DemoSite from './_DemoSite';
import PlaygroundThemeSwitcher from './_PlaygroundThemeSwitcher';
import styles from './playground.module.css';

/**
 * ComponentShowcase - Displays all themable components
 */
function ComponentShowcase() {
  const [inputValue, setInputValue] = useState('');
  const [count, setCount] = useState(0);

  return (
    <Box className={styles.showcase}>
      {/* Typography Section */}
      <Box as="section" className={styles.section}>
        <Text as="h2" variant="h2" className={styles.sectionTitle}>
          Typography
        </Text>
        <Stack direction="vertical" spacing="default">
          <Text as="h1" variant="h1">
            Heading 1
          </Text>
          <Text as="h2" variant="h2">
            Heading 2
          </Text>
          <Text as="h3" variant="h3">
            Heading 3
          </Text>
          <Text variant="body-large">Large body text - adapts to theme</Text>
          <Text>Regular body text - fully themable</Text>
          <Text variant="body-small">Small body text</Text>
        </Stack>
      </Box>

      <Divider />

      {/* Buttons Section */}
      <Box as="section" className={styles.section}>
        <Text as="h2" variant="h2" className={styles.sectionTitle}>
          Buttons
        </Text>
        <Stack direction="vertical" spacing="comfortable">
          <Cluster spacing="default">
            <Button type="solid" variant="primary">
              Primary Solid
            </Button>
            <Button type="outline" variant="primary">
              Primary Outlined
            </Button>
            <Button type="ghost" variant="primary">
              Primary Ghost
            </Button>
          </Cluster>
          <Cluster spacing="default">
            <Button type="solid" variant="secondary">
              Secondary Solid
            </Button>
            <Button type="outline" variant="secondary">
              Secondary Outlined
            </Button>
            <Button type="ghost" variant="secondary">
              Secondary Ghost
            </Button>
          </Cluster>
          <Cluster spacing="default">
            <Button type="solid" variant="success">
              Success
            </Button>
            <Button type="solid" variant="danger">
              Danger
            </Button>
            <Button type="solid" variant="warning">
              Warning
            </Button>
            <Button type="solid" variant="info">
              Info
            </Button>
          </Cluster>
        </Stack>
      </Box>

      <Divider />

      {/* Badges Section */}
      <Box as="section" className={styles.section}>
        <Text as="h2" variant="h2" className={styles.sectionTitle}>
          Badges
        </Text>
        <Stack direction="vertical" spacing="default">
          <Cluster spacing="default">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
          </Cluster>
          <Cluster spacing="default">
            <Badge variant="default" dot>
              Default with dot
            </Badge>
            <Badge variant="success" dot>
              Success with dot
            </Badge>
            <Badge variant="error" dot>
              Error with dot
            </Badge>
            <Badge variant="warning" dot>
              Warning with dot
            </Badge>
            <Badge variant="info" dot>
              Info with dot
            </Badge>
          </Cluster>
        </Stack>
      </Box>

      <Divider />

      {/* Form Elements Section */}
      <Box as="section" className={styles.section}>
        <Text as="h2" variant="h2" className={styles.sectionTitle}>
          Form Elements
        </Text>
        <Stack direction="vertical" spacing="comfortable">
          <Stack direction="vertical" spacing="compact">
            <Label htmlFor="text-input">Text Input</Label>
            <Input
              id="text-input"
              type="text"
              placeholder="Enter some text..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Stack>
          <Stack direction="vertical" spacing="compact">
            <Label htmlFor="email-input">Email Input</Label>
            <Input id="email-input" type="email" placeholder="email@example.com" />
          </Stack>
          <Stack direction="vertical" spacing="compact">
            <Label htmlFor="disabled-input">Disabled Input</Label>
            <Input id="disabled-input" type="text" placeholder="Disabled" disabled />
          </Stack>
        </Stack>
      </Box>

      <Divider />

      {/* Layout Components Section */}
      <Box as="section" className={styles.section}>
        <Text as="h2" variant="h2" className={styles.sectionTitle}>
          Layout Components
        </Text>

        <Stack direction="vertical" spacing="comfortable">
          <Stack direction="vertical" spacing="compact">
            <Text variant="body-small">Box with background:</Text>
            <Box padding="comfortable" background="surface" borderRadius="default">
              <Text>This is a Box component with surface background</Text>
            </Box>
          </Stack>

          <Stack direction="vertical" spacing="compact">
            <Text variant="body-small">Stack (vertical):</Text>
            <Stack direction="vertical" spacing="compact">
              <Box padding="default" background="surface" borderRadius="small">
                Item 1
              </Box>
              <Box padding="default" background="surface" borderRadius="small">
                Item 2
              </Box>
              <Box padding="default" background="surface" borderRadius="small">
                Item 3
              </Box>
            </Stack>
          </Stack>

          <Stack direction="vertical" spacing="compact">
            <Text variant="body-small">Flex (horizontal):</Text>
            <Grid columns={3} gap="default" className={styles.responsiveGrid3}>
              <Box padding="default" background="surface" borderRadius="small">
                Flex Item 1
              </Box>
              <Box padding="default" background="surface" borderRadius="small">
                Flex Item 2
              </Box>
              <Box padding="default" background="surface" borderRadius="small">
                Flex Item 3
              </Box>
            </Grid>
          </Stack>

          <Stack direction="vertical" spacing="compact">
            <Text variant="body-small">Grid (3 columns):</Text>
            <Grid columns={3} gap="default" className={styles.responsiveGrid3}>
              <Box padding="default" background="surface" borderRadius="small">
                Grid 1
              </Box>
              <Box padding="default" background="surface" borderRadius="small">
                Grid 2
              </Box>
              <Box padding="default" background="surface" borderRadius="small">
                Grid 3
              </Box>
            </Grid>
          </Stack>
        </Stack>
      </Box>

      <Divider />

      {/* Card Section */}
      <Box as="section" className={styles.section}>
        <Text as="h2" variant="h2" className={styles.sectionTitle}>
          Card Component
        </Text>
        <Grid columns={2} gap="comfortable" className={styles.responsiveGrid2}>
          <Card>
            <Stack direction="vertical" spacing="compact">
              <Text as="h3" variant="h3">
                Card Title
              </Text>
              <Text variant="body-small">
                This is a card component that automatically adapts to the selected theme mode.
              </Text>
              <Button type="solid" variant="primary" size="sm">
                Action
              </Button>
            </Stack>
          </Card>
          <Card>
            <Stack direction="vertical" spacing="compact">
              <Text as="h3" variant="h3">
                Interactive Card
              </Text>
              <Text variant="body-small">Count: {count}</Text>
              <Cluster spacing="compact">
                <Button type="solid" variant="primary" size="sm" onClick={() => setCount(count + 1)}>
                  Increment
                </Button>
                <Button type="outline" variant="primary" size="sm" onClick={() => setCount(0)}>
                  Reset
                </Button>
              </Cluster>
            </Stack>
          </Card>
        </Grid>
      </Box>

      <Divider />

      {/* Center Component */}
      <Box as="section" className={styles.section}>
        <Text as="h2" variant="h2" className={styles.sectionTitle}>
          Center Component
        </Text>
        <Box padding="comfortable" background="surface" borderRadius="default">
          <Center>
            <Badge variant="info">Centered Content</Badge>
          </Center>
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Main Playground Page
 */
export default function Playground(): ReactNode {
  const playgroundContentRef = useRef<HTMLDivElement>(null);
  const subHeaderRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<'demo' | 'components'>('demo');

  // Dynamically track sub-header height so demoHeader sticky top is precise
  useEffect(() => {
    const el = subHeaderRef.current;
    if (!el) return;
    const update = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--playground-sub-header-height', `${h}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Layout
      title="Interactive Playground"
      description="Test and explore Lufa Design System components with different theme modes"
    >
      {/* Sticky sub-header — outside themed zone, immune to theme/mode changes */}
      <div ref={subHeaderRef} className={styles.playgroundSubHeader}>
        <div className={styles.subHeaderInner}>
          <PlaygroundThemeSwitcher containerRef={playgroundContentRef} />
          <div className={styles.viewToggle} role="tablist" aria-label="Playground view">
            <button
              role="tab"
              aria-selected={view === 'demo'}
              className={`${styles.viewToggleBtn} ${view === 'demo' ? styles.viewToggleBtnActive : ''}`}
              onClick={() => setView('demo')}
            >
              Demo Site
            </button>
            <button
              role="tab"
              aria-selected={view === 'components'}
              className={`${styles.viewToggleBtn} ${view === 'components' ? styles.viewToggleBtnActive : ''}`}
              onClick={() => setView('components')}
            >
              Component Library
            </button>
          </div>
        </div>
      </div>

      {/* Themed content — data-theme / data-mode applied here by PlaygroundThemeSwitcher */}
      <main ref={playgroundContentRef} className={styles.playgroundContent}>
        {view === 'demo' ? <DemoSite /> : <ComponentShowcase />}
      </main>
    </Layout>
  );
}
