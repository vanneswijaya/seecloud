import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";

export const PolicyStatementModal = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  return (
    <Modal opened={opened} onClose={close} title="Authentication" centered>
      {/* Modal content */}
    </Modal>
  );
};
