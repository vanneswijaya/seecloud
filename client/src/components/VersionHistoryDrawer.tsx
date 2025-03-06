import {
  Connector,
  PullRequest,
  StageComponentInterface,
} from "@/common/types";
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
  IconImageInPicture,
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { DeploymentConfirmationModal } from "./DeploymentConfirmationModal";
import { useDisclosure } from "@mantine/hooks";
import { PreviewSchemaModal } from "./PreviewSchemaModal";

export const VersionHistoryDrawer = ({
  opened,
  onClose,
  setConnectors,
  setStageComponents,
}: {
  opened: boolean;
  onClose: () => void;
  setConnectors: (updated: Connector[]) => void;
  setStageComponents: (updated: StageComponentInterface[]) => void;
}) => {
  const icon = <IconGitMerge style={{ width: rem(12), height: rem(12) }} />;
  const activeIcon = <IconCheck style={{ width: rem(12), height: rem(12) }} />;
  const pendingIcon = (
    <IconGitBranch style={{ width: rem(12), height: rem(12) }} />
  );
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [prNumber, setPrNumber] = useState<number | null>(null);
  const [activePrNumber, setActivePrNumber] = useState<number | null>(null);

  const [deploymentModalOpened, deploymentModalHandlers] = useDisclosure(false);
  const [previewModalOpened, previewModalHandlers] = useDisclosure(false);

  useEffect(() => {
    const fetchPrs = async () => {
      const url = "http://localhost:8080/list-pull-requests";
      try {
        const response = await axios.get(url);
        setPullRequests(response.data);
        setActivePrNumber(
          response.data.find((pr: { labels: any[] }) =>
            pr.labels.find((label) => label.name === "seecloud-active")
          ).number
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchPrs();
  }, []);

  const fetchPrData = async (prNumber: number) => {
    const url = "http://localhost:8080/get-pr-canvas-data";
    try {
      const data = { prNumber: prNumber };
      const response = await axios.get(url, { params: data });
      setStageComponents(response.data.stageComponents);
      setConnectors(response.data.connectors);
    } catch (error) {
      console.error(error);
    }
  };

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
                key={pr.number}
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
                      {pr.labels.find((x) => x.name === "seecloud-active") && (
                        <Badge color="green" leftSection={activeIcon}>
                          Active
                        </Badge>
                      )}
                      {pr.merged_at ? (
                        <Badge leftSection={icon}>Merged</Badge>
                      ) : (
                        <Badge color="gray" leftSection={pendingIcon}>
                          Pending
                        </Badge>
                      )}
                      <Text size="xs" mt={4}>
                        {new Date(pr.updated_at).toLocaleString()}
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
                        onClick={() => {
                          setPrNumber(pr.number);
                          previewModalHandlers.open();
                        }}
                        leftSection={
                          <IconImageInPicture
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        }
                      >
                        Preview Diagram
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => fetchPrData(pr.number)}
                        leftSection={
                          <IconFileArrowLeft
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        }
                      >
                        Restore to Canvas
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
                        onClick={() => {
                          setPrNumber(pr.number);
                          deploymentModalHandlers.open();
                        }}
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
      <DeploymentConfirmationModal
        opened={deploymentModalOpened}
        close={deploymentModalHandlers.close}
        prNumber={prNumber}
        activePrNumber={activePrNumber}
      />
      <PreviewSchemaModal
        opened={previewModalOpened}
        close={previewModalHandlers.close}
        prNumber={prNumber}
      />
    </Drawer>
  );
};
