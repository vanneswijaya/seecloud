import { ServiceConnection, StageComponentInterface } from "@/common/types";
import { processNewPolicyStatement } from "@/common/util";
import { Modal, Button, MultiSelect, Flex } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { useState } from "react";

export const PolicyStatementModal = ({
  opened,
  close,
  serviceConnection,
  onSave,
}: {
  opened: boolean;
  close: () => void;
  serviceConnection: ServiceConnection;
  onSave: (newPolicyStatement: any) => void;
}) => {
  const existingStatement =
    serviceConnection.policy?.componentData.type === "iam-template" &&
    serviceConnection.policy?.componentData.templateValue["Properties"][
      "PolicyDocument"
    ]["Statement"].find(
      (x: any) => x["Sid"] === serviceConnection.policyStatementSid
    );
  const defaultStatement = existingStatement || {
    Sid: serviceConnection.policyStatementSid,
    Effect: "Allow",
    Action: [],
    Resource: "*",
  };
  const [selectedActions, setSelectedActions] = useState<string[]>(
    defaultStatement["Action"]
  );

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Manage policy statement"
      centered
    >
      <Flex direction="column" gap="xl">
        <MultiSelect
          label="Permissions"
          placeholder="Select allowed actions"
          data={
            serviceConnection.service?.componentData.type !== "iam-template"
              ? serviceConnection.service?.componentData.actions
              : []
          }
          defaultValue={selectedActions}
          searchable
          nothingFoundMessage="Nothing found..."
          onChange={setSelectedActions}
        />
        <Editor
          height="25vh"
          defaultLanguage="json"
          value={JSON.stringify(
            { ...defaultStatement, Action: selectedActions },
            null,
            "\t"
          )}
          options={{ readOnly: true }}
        />
        <Button
          onClick={() =>
            onSave({ ...defaultStatement, Action: selectedActions })
          }
        >
          Save
        </Button>
      </Flex>
    </Modal>
  );
};
