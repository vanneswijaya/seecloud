/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Button, Flex } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

export const PreviewSchemaModal = ({
  opened,
  close,
  prNumber,
}: {
  opened: boolean;
  close: () => void;
  prNumber: number | null;
}) => {
  const [snapshotBase64, setSnapshotBase64] = useState<string>("");

  useEffect(() => {
    const fetchPrDiagramSnapshot = async (prNumber: number) => {
      const url = "http://localhost:8080/get-pr-diagram-snapshot";
      try {
        const data = { prNumber: prNumber };
        const response = await axios.get(url, { params: data });
        setSnapshotBase64(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (prNumber !== null) fetchPrDiagramSnapshot(prNumber);
  }, [prNumber]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Review your AWS CloudFormation template"
      centered
      size="xl"
    >
      <Flex direction="column" gap="xl">
        <img src={"data:image/png;base64, " + snapshotBase64} />
        <Button onClick={close}>Done</Button>
      </Flex>
    </Modal>
  );
};
