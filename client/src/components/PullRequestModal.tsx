/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Select,
  Flex,
  Button,
  Tabs,
  rem,
  Notification,
  TextInput,
  Input,
  Anchor,
} from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

export const PullRequestModal = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  const [branchList, setBranchList] = useState([]);
  const [commitMsg, setCommitMsg] = useState("");
  const [prTitle, setPrTitle] = useState("");
  const [newBranchName, setNewBranchName] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBaseBranch, setSelectedBaseBranch] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>("existing");
  const [loading, setLoading] = useState(false);
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const [commitSuccess, setCommitSuccess] = useState(false);
  const [prLink, setPrLink] = useState("");
  const editor = useEditor({
    extensions: [StarterKit, Link, Markdown],
    content: "",
  });

  useEffect(() => {
    const fetchBranchList = async () => {
      const url = "http://localhost:8080/list-branches";
      try {
        const response = await axios.get(url);
        setBranchList(response.data.data.map((x: any) => x.name));
      } catch (error) {
        console.error(error);
      }
    };
    fetchBranchList();
  }, []);

  const generatePr = async () => {
    setLoading(true);
    setCommitSuccess(false);
    const url = "http://localhost:8080/generate-pull-request";
    const markdownOutput = editor?.storage.markdown.getMarkdown();
    const data = {
      commitMsg: commitMsg,
      prTitle: prTitle,
      prBody: markdownOutput,
      baseBranch: selectedBaseBranch,
      ...(activeTab === "existing"
        ? {
            existingBranch: selectedBranch,
          }
        : {
            newBranch: newBranchName,
          }),
    };
    try {
      const response = await axios.post(url, data);
      console.log(response);
      setPrLink(response.data);
      setLoading(false);
      setCommitSuccess(true);
      setCommitMsg("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Generate new pull request"
      centered
    >
      <Flex direction="column" gap="md">
        <TextInput
          value={prTitle}
          onChange={(event) => setPrTitle(event.currentTarget.value)}
          label="Pull request title"
          placeholder="Enter a title"
        />
        <Input.Wrapper label="Pull request description">
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
        </Input.Wrapper>

        <TextInput
          value={commitMsg}
          onChange={(event) => setCommitMsg(event.currentTarget.value)}
          label="Commit message"
          placeholder="Enter commit message"
        />
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          variant="pills"
          defaultValue="existing"
        >
          <Flex direction="column" gap="md">
            <Tabs.List>
              <Tabs.Tab value="existing">Use existing branch</Tabs.Tab>
              <Tabs.Tab value="new">Create new branch</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="existing">
              <Flex direction="row" gap="md">
                <Select
                  label="Branch"
                  placeholder="Select existing branch"
                  data={branchList}
                  searchable
                  searchValue={selectedBranch}
                  onSearchChange={setSelectedBranch}
                />
                <IconArrowRight
                  style={{
                    width: rem(14),
                    height: rem(14),
                    marginTop: rem(35),
                  }}
                />
                <Select
                  label="Base branch"
                  placeholder="Choose a base branch"
                  data={branchList}
                  searchable
                  searchValue={selectedBaseBranch}
                  onSearchChange={setSelectedBaseBranch}
                />
              </Flex>
            </Tabs.Panel>
            <Tabs.Panel value="new">
              <Flex direction="row" gap="md">
                <TextInput
                  value={newBranchName}
                  onChange={(event) =>
                    setNewBranchName(event.currentTarget.value)
                  }
                  label="New branch name"
                  placeholder="Enter branch name"
                />
                <IconArrowRight
                  style={{
                    width: rem(14),
                    height: rem(14),
                    marginTop: rem(35),
                  }}
                />
                <Select
                  label="Base branch"
                  placeholder="Choose a base branch"
                  data={branchList}
                  searchable
                  searchValue={selectedBaseBranch}
                  onSearchChange={setSelectedBaseBranch}
                />
              </Flex>
            </Tabs.Panel>
          </Flex>
        </Tabs>
        <div />
        <Button loading={loading} onClick={generatePr}>
          Create pull request
        </Button>
        {commitSuccess && (
          <Notification
            onClose={() => setCommitSuccess(false)}
            icon={checkIcon}
            color="teal"
            title="Successfully generated pull request"
            mt="md"
          >
            <Anchor href={prLink} size="sm" target="_blank">
              Click here to go to pull request
            </Anchor>
          </Notification>
        )}
      </Flex>
    </Modal>
  );
};
