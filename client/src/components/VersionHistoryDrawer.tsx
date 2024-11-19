import {
  Drawer,
  Timeline,
  Text,
  Flex,
  ActionIcon,
  Badge,
  rem,
  Menu,
} from "@mantine/core";
import {
  IconGitPullRequest,
  IconGitCommit,
  IconDots,
  IconGitMerge,
  IconGitBranch,
  IconBrandAws,
  IconGraph,
  IconFileArrowLeft,
} from "@tabler/icons-react";

export const VersionHistoryDrawer = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => {
  const icon = <IconGitMerge style={{ width: rem(12), height: rem(12) }} />;
  const pendingIcon = (
    <IconGitBranch style={{ width: rem(12), height: rem(12) }} />
  );
  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={onClose}
      title="Version History"
      overlayProps={{ backgroundOpacity: 0 }}
    >
      <br />
      <Timeline active={1} reverseActive bulletSize={24} lineWidth={2}>
        <Timeline.Item
          title="[SeeCloud] Added EC2 policy"
          bullet={<IconGitPullRequest size={12} />}
          lineVariant="dashed"
        >
          <Flex justify="space-between">
            <Flex direction="column" gap="xs">
              <Text c="dimmed" size="sm">
                seecloud-branch/new-policy-role-a
              </Text>
              <Flex gap="xs" align="center">
                <Badge color="gray" leftSection={pendingIcon}>
                  Pending
                </Badge>
                <Text size="xs" mt={4}>
                  2 hours ago
                </Text>
              </Flex>
            </Flex>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="outline" aria-label="Settings">
                  <IconDots
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconFileArrowLeft
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                >
                  Open in Canvas
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconBrandAws style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Deploy to AWS
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Timeline.Item>
        <Timeline.Item
          bullet={<IconGitCommit size={12} />}
          title="[SeeCloud] New policy for RoleA"
        >
          <Flex justify="space-between">
            <Flex direction="column" gap="xs">
              <Text c="dimmed" size="sm">
                seecloud-branch/new-policy-role-a
              </Text>
              <Flex gap="xs" align="center">
                <Badge leftSection={icon}>Merged</Badge>
                <Text size="xs" mt={4}>
                  2 hours ago
                </Text>
              </Flex>
            </Flex>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="outline" aria-label="Settings">
                  <IconDots
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconFileArrowLeft
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                >
                  Open in Canvas
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconBrandAws style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Deploy to AWS
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Timeline.Item>
        <Timeline.Item
          bullet={<IconGitCommit size={12} />}
          title="[SeeCloud] New policy for RoleA"
        >
          <Flex justify="space-between">
            <Flex direction="column" gap="xs">
              <Text c="dimmed" size="sm">
                seecloud-branch/new-policy-role-a
              </Text>
              <Flex gap="xs" align="center">
                <Badge leftSection={icon}>Merged</Badge>
                <Text size="xs" mt={4}>
                  2 hours ago
                </Text>
              </Flex>
            </Flex>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="outline" aria-label="Settings">
                  <IconDots
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconFileArrowLeft
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                >
                  Open in Canvas
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconBrandAws style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Deploy to AWS
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Timeline.Item>
      </Timeline>
    </Drawer>
  );
};
