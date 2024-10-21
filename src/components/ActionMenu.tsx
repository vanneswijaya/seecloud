import { Menu, Button, Text, rem } from "@mantine/core";
import {
  IconPhoto,
  IconTrash,
  IconArrowsLeftRight,
  IconDownload,
  IconUpload,
  IconGitPullRequest,
  IconBrandGithub,
  IconBrandAws,
} from "@tabler/icons-react";

export const ActionMenu = () => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button>Action Menu</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Basic</Menu.Label>
        <Menu.Item
          leftSection={
            <IconDownload style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Save diagram
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconPhoto style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Export as image
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconUpload style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Upload diagram
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Clear diagram
        </Menu.Item>
        <Menu.Label>Change Manager</Menu.Label>
        <Menu.Item
          leftSection={
            <IconGitPullRequest style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Generate pull request
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Access Analyzer</Menu.Label>
        <Menu.Item
          leftSection={
            <IconArrowsLeftRight style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Analyze Access
        </Menu.Item>

        <Menu.Label>Integration</Menu.Label>
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
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
