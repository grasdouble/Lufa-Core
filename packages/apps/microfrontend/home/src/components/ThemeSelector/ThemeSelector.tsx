import React, { useEffect, useRef, useState } from 'react';

import type { ThemeMode, ThemeName } from '@grasdouble/lufa_design-system';
import { Box, Button, useTheme } from '@grasdouble/lufa_design-system';

import styles from './ThemeSelector.module.css';

type ThemeEntry = {
  id: string;
  label: string;
  emoji: string;
};

const THEMES: ThemeEntry[] = [
  { id: 'lufa', label: 'Default', emoji: '⚪' },
  { id: 'ocean', label: 'Ocean', emoji: '🌊' },
  { id: 'forest', label: 'Forest', emoji: '🌿' },
  { id: 'matrix', label: 'Matrix', emoji: '💻' },
  { id: 'cyberpunk', label: 'Cyberpunk', emoji: '🤖' },
  { id: 'sunset', label: 'Sunset', emoji: '🌅' },
  { id: 'nordic', label: 'Nordic', emoji: '❄️' },
  { id: 'volcano', label: 'Volcano', emoji: '🌋' },
  { id: 'coffee', label: 'Coffee', emoji: '☕' },
  { id: 'volt', label: 'Volt', emoji: '⚡' },
  { id: 'steampunk', label: 'Steampunk', emoji: '⚙️' },
];

const MODE_CYCLE: ThemeMode[] = ['light', 'dark', 'auto'];
const MODE_EMOJI: Record<ThemeMode, string> = { light: '☀️', dark: '🌙', auto: '🔄' };

export function ThemeSelector() {
  const { theme, mode, setTheme, setMode } = useTheme({
    defaultTheme: 'lufa' as ThemeName,
    defaultMode: 'dark',
  });
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const cycleMode = () => {
    const next = MODE_CYCLE[(MODE_CYCLE.indexOf(mode) + 1) % MODE_CYCLE.length];
    setMode(next);
  };

  return (
    <div ref={containerRef} className={styles['theme-selector']}>
      <Box className={styles['trigger-row']}>
        <Button
          type={open ? 'solid' : 'outline'}
          variant="neutral"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open theme selector"
          aria-expanded={open}
        >
          🎨
        </Button>
        <Button
          type="outline"
          variant="neutral"
          size="sm"
          onClick={cycleMode}
          aria-label={`Switch color mode (current: ${mode})`}
        >
          {MODE_EMOJI[mode]}
        </Button>
      </Box>
      {open && (
        <Box className={styles['theme-panel']}>
          {THEMES.map(({ id, label, emoji }) => (
            <Button
              key={id}
              type={theme === id ? 'solid' : 'ghost'}
              variant="neutral"
              size="sm"
              onClick={() => {
                setTheme(id as ThemeName);
                setOpen(false);
              }}
              aria-label={`Select ${label} theme`}
              aria-pressed={theme === id}
            >
              {emoji} {label}
            </Button>
          ))}
        </Box>
      )}
    </div>
  );
}
