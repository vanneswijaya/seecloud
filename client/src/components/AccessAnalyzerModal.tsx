import { Connector, StageComponentInterface } from "@/common/types";
import { analyzeAccess } from "@/common/util";
import {
  Modal,
  Select,
  Flex,
  Button,
  rem,
  Notification,
  Text,
  Card,
} from "@mantine/core";
import { IconArrowRight, IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";

export const AccessAnalyzerModal = ({
  opened,
  close,
  stageComponents,
  connectors,
}: {
  opened: boolean;
  close: () => void;
  stageComponents: StageComponentInterface[];
  connectors: Connector[];
}) => {
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const crossIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const subjects: string[] = [];
  const resources: string[] = [];
  const actions: Record<string, string[]> = {};
  stageComponents.forEach((x) => {
    if (
      ["IAM User", "IAM Group", "IAM Role", "EC2 instance"].includes(
        x.componentData.typeName
      )
    ) {
      x.componentData.type !== "generic-service" &&
        subjects.push(
          x.componentData.type === "iam-template"
            ? x.componentData.logicalId || x.componentData.defaultLogicalId
            : x.componentData.instanceId
        );
    }
    if (
      x.componentData.type === "generic-service" ||
      x.componentData.type === "imported-instance"
    ) {
      const id =
        x.componentData.type === "imported-instance"
          ? x.componentData.instanceId
          : x.componentData.typeName;
      resources.push(id);
      actions[id] = x.componentData.actions;
    }
  });
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedResource, setSelectedResource] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [promptResult, setPromptResult] = useState<boolean | null>(null);

  const startAnalyze = () => {
    setLoading(true);
    setPromptResult(
      analyzeAccess(
        stageComponents,
        connectors,
        selectedSubject,
        selectedResource
      )
    );
    setLoading(false);
  };

  return (
    <Modal opened={opened} onClose={close} title="Analyze access" centered>
      <Flex direction="column" gap="md">
        <Flex direction="row" gap="md">
          <Select
            label="Subject"
            placeholder="Choose a subject"
            data={subjects}
            searchable
            searchValue={selectedSubject}
            onSearchChange={setSelectedSubject}
          />
          <IconArrowRight
            style={{
              width: rem(14),
              height: rem(14),
              marginTop: rem(35),
            }}
          />
          <Select
            label="Resource"
            placeholder="Choose a resource"
            data={resources}
            searchable
            searchValue={selectedResource}
            onSearchChange={setSelectedResource}
          />
        </Flex>
        <Select
          label="Action"
          placeholder="Choose an action"
          data={actions[selectedResource]}
          searchable
          searchValue={selectedAction}
          onSearchChange={setSelectedAction}
        />
        {selectedAction && selectedResource && selectedSubject && (
          <div>
            <Text size="sm" fw={500}>
              Generated prompt :
            </Text>
            <Card withBorder shadow="sm">
              <Text size="sm">
                Can {selectedSubject} perform {selectedAction} on{" "}
                {selectedResource}?
              </Text>
            </Card>
          </div>
        )}
        <div />
        <Button loading={loading} onClick={startAnalyze}>
          Analyze
        </Button>
        {promptResult !== null &&
          (promptResult ? (
            <Notification
              onClose={() => setPromptResult(false)}
              icon={checkIcon}
              color="teal"
              title="Prompt returned true"
            >
              <Text size="sm">
                {selectedSubject} can perform {selectedAction} on{" "}
                {selectedResource}
              </Text>
            </Notification>
          ) : (
            <Notification
              onClose={() => setPromptResult(false)}
              icon={crossIcon}
              color="red"
              title="Prompt returned false"
            >
              <Text size="sm">
                {selectedSubject} cannot perform {selectedAction} on{" "}
                {selectedResource}
              </Text>
            </Notification>
          ))}
      </Flex>
    </Modal>
  );
};
