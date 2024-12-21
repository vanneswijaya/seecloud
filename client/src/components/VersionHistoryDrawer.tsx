import { PullRequest } from "@/common/types";
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
  IconCheck,
  IconBrandGithub,
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

export const VersionHistoryDrawer = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => {
  const icon = <IconGitMerge style={{ width: rem(12), height: rem(12) }} />;
  const activeIcon = <IconCheck style={{ width: rem(12), height: rem(12) }} />;
  const pendingIcon = (
    <IconGitBranch style={{ width: rem(12), height: rem(12) }} />
  );
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);

  useEffect(() => {
    const fetchPrs = async () => {
      const url = "http://localhost:8080/list-pull-requests";
      try {
        const response = await axios.get(url);
        setPullRequests(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPrs();
  }, []);

  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={onClose}
      title="Version History"
      overlayProps={{ backgroundOpacity: 0 }}
    >
      <br />
      <Timeline
        {...(pullRequests.find((pr) => pr.merged_at) && {
          active: pullRequests.filter((pr) => pr.merged_at).length - 1,
        })}
        reverseActive
        bulletSize={24}
        lineWidth={2}
      >
        {pullRequests
          .filter((pr) => !(pr.state === "closed" && !pr.merged_at))
          .map((pr) => {
            return (
              <Timeline.Item
                title={pr.title}
                {...(pr.merged_at
                  ? {
                      bullet: <IconGitCommit size={12} />,
                    }
                  : {
                      lineVariant: "dashed",
                      bullet: <IconGitPullRequest size={12} />,
                    })}
              >
                <Flex justify="space-between">
                  <Flex direction="column" gap="xs">
                    <Text c="dimmed" size="sm">
                      {pr.head.label}
                    </Text>
                    <Flex gap="xs" align="center">
                      {pr.merged_at ? (
                        <Badge leftSection={icon}>Merged</Badge>
                      ) : (
                        <Badge color="gray" leftSection={pendingIcon}>
                          Pending
                        </Badge>
                      )}
                      <Text size="xs" mt={4}>
                        Last updated {new Date(pr.updated_at).toLocaleString()}
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
                      <a href={pr.html_url} target="_blank">
                        <Menu.Item
                          leftSection={
                            <IconBrandGithub
                              style={{ width: rem(14), height: rem(14) }}
                            />
                          }
                        >
                          Go to GitHub PR
                        </Menu.Item>
                      </a>
                      <Menu.Item
                        leftSection={
                          <IconBrandAws
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        }
                      >
                        Deploy to AWS
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Flex>
              </Timeline.Item>
            );
          })}
      </Timeline>
    </Drawer>
  );
};
