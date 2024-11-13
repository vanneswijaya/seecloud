/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Select,
  Input,
  Flex,
  Button,
  Tabs,
  rem,
  Notification,
} from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export const CommitModal = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  const [branchList, setBranchList] = useState([]);
  const commitMsg = useRef<HTMLInputElement>(null);
  const newBranchName = useRef<HTMLInputElement>(null);
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
    const url = "http://localhost:8080/new-commit";
    const data = {
      commitMsg: commitMsg.current?.value,
      ...(activeTab === "existing"
        ? {
            existingBranch: selectedBranch,
          }
        : {
            newBranch: newBranchName.current?.value,
            baseBranch: selectedBaseBranch,
          }),
    };
    try {
      const response = await axios.post(url, data);
      console.log(response);
      setLoading(false);
      setCommitSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Create new commit" centered>
      <Flex direction="column" gap="md">
        <Input.Wrapper label="Commit message" description="" error="">
          <Input ref={commitMsg} placeholder="Enter commit message" />
        </Input.Wrapper>
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
                <Input.Wrapper label="New branch name" description="" error="">
                  <Input ref={newBranchName} placeholder="Enter branch name" />
                </Input.Wrapper>
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
        <Button loading={loading} onClick={createNewCommit}>
          Commit
        </Button>
        {commitSuccess && (
          <Notification
            icon={checkIcon}
            color="teal"
            title="Successfully pushed new commit"
            mt="md"
          >
            {commitMsg.current?.value}
          </Notification>
        )}
      </Flex>
    </Modal>
  );
};
