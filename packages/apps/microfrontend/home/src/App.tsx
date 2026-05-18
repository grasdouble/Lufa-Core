import React from 'react';

import { Box, Button, Stack, Text } from '@grasdouble/lufa_design-system';

import styles from './App.module.css';
import { getImageUrl } from './getImageUrl';

function App() {
  return (
    <Box id="lufa-home" className={styles['lufa-home']}>
      <Stack direction="vertical" spacing="default" align="center" justify="center">
        <img src={getImageUrl('Lufa_Logo_no_background')} alt="Centered Logo" className={styles['centered-image']} />
        <Text as="h1" variant="h3" weight="bold" align="center" color="primary">
          Lufa Workspace (WIP) <br /> by Sebastien LE MOUILLOUR
        </Text>
        <Stack direction="horizontal" spacing="compact" wrap justify="center">
          <Button
            as="a"
            href="https://lufa-design.sebastien-lemouillour.fr"
            target="_blank"
            rel="noopener noreferrer"
            type="solid"
            variant="success"
            size="md"
          >
            Lufa Design System (WIP)
          </Button>
          <Button
            as="a"
            href="https://lufa-storybook.sebastien-lemouillour.fr"
            target="_blank"
            rel="noopener noreferrer"
            type="solid"
            variant="danger"
            size="md"
          >
            Lufa Storybook (WIP)
          </Button>
          <Button
            as="a"
            href="https://github.com/grasdouble/Lufa"
            target="_blank"
            rel="noopener noreferrer"
            type="outline"
            variant="neutral"
            size="md"
          >
            Github
          </Button>
          <Button
            as="a"
            href="https://www.linkedin.com/in/sebastienlemouillour/"
            target="_blank"
            rel="noopener noreferrer"
            type="outline"
            variant="info"
            size="md"
          >
            LinkedIn
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default App;
