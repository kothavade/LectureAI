import { Text, ActionIcon, Group, Header, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

export const Titlebar = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <Header height={60}>
      <Group sx={{ height: '100%' }} px={20} position="apart">
        <Text
          size="xl"
          weight={600}
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
        >
          Lecture Assistant
        </Text>
        <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
          {colorScheme === 'dark' ? <IconSun size="16px" /> : <IconMoonStars size="16px" />}
        </ActionIcon>{' '}
      </Group>
    </Header>
  );
};
