import { Menu, Button, rem, FileInput } from "@mantine/core";
import {
  IconPhoto,
  IconTrash,
  IconArrowsLeftRight,
  IconDownload,
  IconUpload,
  IconGitPullRequest,
  IconBrandGithub,
  IconBrandAws,
  IconClipboard,
  IconFile,
  IconVersions,
  IconGitCommit,
} from "@tabler/icons-react";
import { CommitModal } from "./CommitModal";
import { useDisclosure } from "@mantine/hooks";
import { PullRequestModal } from "./PullRequestModal";
import { Connector, StageComponentInterface } from "@/common/types";
import {
  getJsonTemplateFromStageComponents,
  serializeCanvasToJSON,
} from "@/common/util";
import { AccessAnalyzerModal } from "./AccessAnalyzerModal";
import { VersionHistoryDrawer } from "./VersionHistoryDrawer";
import { useRef } from "react";

export const ActionMenu = ({
  stageComponents,
  exportImage,
  connectors,
  setConnectors,
  setStageComponents,
}: {
  stageComponents: StageComponentInterface[];
  exportImage: () => void;
  connectors: Connector[];
  setConnectors: (updated: Connector[]) => void;
  setStageComponents: (updated: StageComponentInterface[]) => void;
}) => {
  const [commitModalOpened, commitModalHandlers] = useDisclosure(false);
  const [prModalOpened, prModalHandlers] = useDisclosure(false);
  const [versionHistoryDrawerOpened, versionHistoryDrawerHandlers] =
    useDisclosure(false);
  const [accessAnalyzerModalOpened, accessAnalyzerModalHandlers] =
    useDisclosure(false);
  const templateString = getJsonTemplateFromStageComponents(stageComponents);
  const serializedCanvas = serializeCanvasToJSON(stageComponents, connectors);

  const fileInputRef = useRef<HTMLButtonElement>(null);
  const onChangeFile = async (blob: File | null) => {
    if (blob === null) return;
    const blobData = await blob.text();
    const blobJson = JSON.parse(blobData);
    setStageComponents(blobJson.stageComponents);
    setConnectors(blobJson.connectors);
  };

  return (
    <div>
      <FileInput
        onChange={onChangeFile}
        multiple={false}
        ref={fileInputRef}
        display="none"
      />
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button>Action Menu</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Canvas</Menu.Label>
          <Menu.Item
            onClick={() => {
              const blob = new Blob([serializedCanvas], {
                type: "application/json",
              });
              const href = URL.createObjectURL(blob);

              const link = document.createElement("a");
              link.href = href;
              link.download = "seeCloudCanvasData.json";
              document.body.appendChild(link);
              link.click();

              document.body.removeChild(link);
              URL.revokeObjectURL(href);
            }}
            leftSection={
              <IconDownload style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Save diagram
          </Menu.Item>
          <Menu.Item
            onClick={exportImage}
            leftSection={
              <IconPhoto style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Export as image
          </Menu.Item>
          <Menu.Item
            onClick={() => fileInputRef.current?.click()}
            leftSection={
              <IconUpload style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Open diagram
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setStageComponents([]);
              setConnectors([]);
            }}
            color="red"
            leftSection={
              <IconTrash style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Clear diagram
          </Menu.Item>
          <Menu.Label>Template</Menu.Label>
          <Menu.Item
            leftSection={
              <IconFile style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Save template file
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconClipboard style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Copy to clipboard
          </Menu.Item>
          <Menu.Label>Change Manager</Menu.Label>
          <Menu.Item
            onClick={prModalHandlers.open}
            leftSection={
              <IconGitPullRequest style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Generate pull request
          </Menu.Item>
          <Menu.Item
            onClick={commitModalHandlers.open}
            leftSection={
              <IconGitCommit style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Create new commit
          </Menu.Item>
          <Menu.Item
            onClick={versionHistoryDrawerHandlers.open}
            leftSection={
              <IconVersions style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Version History
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>Access Analyzer</Menu.Label>
          <Menu.Item
            onClick={accessAnalyzerModalHandlers.open}
            leftSection={
              <IconArrowsLeftRight
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            Analyze Access
          </Menu.Item>
          {/* <Menu.Label>Integration</Menu.Label>
          <Menu.Item
            leftSection={
              <IconBrandGithub style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Link to GitHub
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconBrandAws style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Link to AWS
          </Menu.Item> */}
        </Menu.Dropdown>
      </Menu>
      <CommitModal
        opened={commitModalOpened}
        close={commitModalHandlers.close}
        templateString={templateString}
        serializedString={serializedCanvas}
      />
      <PullRequestModal
        opened={prModalOpened}
        close={prModalHandlers.close}
        templateString={templateString}
        serializedString={serializedCanvas}
      />
      <AccessAnalyzerModal
        opened={accessAnalyzerModalOpened}
        close={accessAnalyzerModalHandlers.close}
        stageComponents={stageComponents}
        connectors={connectors}
      />
      <VersionHistoryDrawer
        opened={versionHistoryDrawerOpened}
        onClose={versionHistoryDrawerHandlers.close}
        setStageComponents={setStageComponents}
        setConnectors={setConnectors}
      />
    </div>
  );
};
