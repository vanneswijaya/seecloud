/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Button,
  MultiSelect,
  Flex,
  Text,
  Notification,
  rem,
} from "@mantine/core";
import Editor from "@monaco-editor/react";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

export const DeploymentConfirmationModal = ({
  opened,
  close,
  prNumber,
  activePrNumber,
}: {
  opened: boolean;
  close: () => void;
  prNumber: number | null;
  activePrNumber: number | null;
}) => {
  const [templateString, setTemplateString] = useState<string>("");
  const [changeSetString, setChangeSetString] = useState<string>("");
  const [deploySuccess, setDeploySuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const crossIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

  useEffect(() => {
    const fetchPrTemplateString = async (prNumber: number) => {
      const url = "http://localhost:8080/get-pr-template-data";
      try {
        const data = { prNumber: prNumber };
        const response = await axios.get(url, { params: data });
        setTemplateString(JSON.stringify(response.data, null, "\t"));
      } catch (error) {
        console.error(error);
      }
    };
    if (prNumber !== null) fetchPrTemplateString(prNumber);

    const createChangeSet = async () => {};
    if (activePrNumber !== null) createChangeSet;
  }, [prNumber, activePrNumber]);

  const setActivePr = async () => {
    const url = "http://localhost:8080/set-active-pr";
    try {
      const data = {
        newActivePrNumber: prNumber,
        prevActivePrNumber: activePrNumber,
      };
      const response = await axios.post(url, data);
    } catch (error) {
      console.error(error);
    }
  };

  const createStack = async () => {
    setLoading(true);
    const url = "http://localhost:8080/create-stack";
    try {
      const data = { templateContent: templateString };
      const response = await axios.post(url, data);
      if (response.data === "error") {
        setDeploySuccess(false);
      } else {
        await setActivePr();
        setDeploySuccess(true);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const updateStack = async () => {
    setLoading(true);
    const url = "http://localhost:8080/update-stack";
    try {
      const data = { templateContent: templateString };
      const response = await axios.post(url, data);
      if (response.data === "error") {
        setDeploySuccess(false);
      } else {
        await setActivePr();
        setDeploySuccess(true);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Review your AWS CloudFormation template"
      centered
      size="xl"
    >
      <Flex direction="column" gap="xl">
        <Editor
          height="25vh"
          defaultLanguage="json"
          value={templateString}
          options={{ readOnly: true }}
        />
        {activePrNumber ? (
          <Button loading={loading} onClick={() => updateStack()}>
            Update stack
          </Button>
        ) : (
          <Button loading={loading} onClick={() => createStack()}>
            Create stack
          </Button>
        )}
      </Flex>
      {deploySuccess !== null &&
        (deploySuccess ? (
          <Notification
            onClose={() => setDeploySuccess(null)}
            icon={checkIcon}
            color="teal"
            title={
              activePrNumber
                ? "Successfully updated stack"
                : "Successfully created stack"
            }
            mt="md"
          ></Notification>
        ) : (
          <Notification
            onClose={() => setDeploySuccess(null)}
            icon={crossIcon}
            color="red"
            title={
              activePrNumber ? "Update stack failed" : "Create stack failed"
            }
            mt="md"
          ></Notification>
        ))}
      {}
    </Modal>
  );
};
