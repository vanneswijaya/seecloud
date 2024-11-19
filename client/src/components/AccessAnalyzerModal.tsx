import {
  Modal,
  Select,
  Flex,
  Button,
  Tabs,
  rem,
  Notification,
  TextInput,
  Text,
  Card,
} from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";

export const AccessAnalyzerModal = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  return (
    <Modal opened={opened} onClose={close} title="Analyze access" centered>
      <Flex direction="column" gap="md">
        <Flex direction="row" gap="md">
          <Select
            label="Subject"
            placeholder="Choose a subject"
            data={[]}
            searchable
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
            data={[]}
            searchable
          />
        </Flex>
        <Select
          label="Action"
          placeholder="Choose an action"
          data={[]}
          searchable
        />
        <Text size="sm" fw={500}>
          Generated prompt :
        </Text>
        <Card withBorder shadow="sm">
          <Text size="sm">
            Can User0 perform ec2:RunInstances on ec2:i-12334?
          </Text>
        </Card>
        <div />
        <Button>Analyze</Button>
        <Notification
          onClose={() => {}}
          icon={checkIcon}
          color="teal"
          title="Prompt returned true"
        >
          <Text size="sm">
            User0 can perform ec2:RunInstances on ec2:i-12334
          </Text>
        </Notification>
      </Flex>
    </Modal>
  );
};
