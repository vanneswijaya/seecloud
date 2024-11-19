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
  Pill,
  Text,
  PillsInput,
} from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import axios from "axios";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";

export const CommitModal = ({
  opened,
  close,
  templateString,
}: {
  opened: boolean;
  close: () => void;
  templateString: string;
}) => {
  const [branchList, setBranchList] = useState([]);
  const [commitMsg, setCommitMsg] = useState("");
  const [newBranchName, setNewBranchName] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBaseBranch, setSelectedBaseBranch] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>("existing");
  const [loading, setLoading] = useState(false);
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const [commitSuccess, setCommitSuccess] = useState(false);

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

  const createNewCommit = async () => {
    setLoading(true);
    setCommitSuccess(false);
    const url = "http://localhost:8080/new-commit";
    const canvasElement = document.querySelector("#capture") as HTMLElement;
    const canvas = await html2canvas(canvasElement || document.body);
    const snapshotUri = canvas
      .toDataURL()
      .replace("data:image/png;base64,", "");
    const data = {
      commitMsg: commitMsg,
      templateContent: templateString,
      snapshotUri: snapshotUri,
      ...(activeTab === "existing"
        ? {
            existingBranch: selectedBranch,
          }
        : {
            newBranch: newBranchName,
            baseBranch: selectedBaseBranch,
          }),
    };
    try {
      const response = await axios.post(url, data);
      console.log(response);
      setLoading(false);
      setCommitSuccess(true);
      setCommitMsg("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Create new commit" centered>
      <Flex direction="column" gap="md">
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
              <Select
                label="Branch"
                placeholder="Select branch for commit"
                data={branchList}
                searchable
                searchValue={selectedBranch}
                onSearchChange={setSelectedBranch}
              />
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
        <Flex>
          <PillsInput label="Files">
            <Pill.Group>
              <Pill>iamCloudFormationTemplate.json</Pill>
              <Pill>diagramSnapshot.png</Pill>
            </Pill.Group>
          </PillsInput>
        </Flex>
        <div />
        <Button loading={loading} onClick={createNewCommit}>
          Commit
        </Button>
        {commitSuccess && (
          <Notification
            onClose={() => setCommitSuccess(false)}
            icon={checkIcon}
            color="teal"
            title="Successfully pushed new commit"
            mt="md"
          ></Notification>
        )}
      </Flex>
    </Modal>
  );
};
