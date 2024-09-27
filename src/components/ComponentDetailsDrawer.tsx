import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button } from "@mantine/core";

export const ComponentDetailsDrawer = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => {
  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={onClose}
      title="Authentication"
    >
      {/* Drawer content */}
    </Drawer>
  );
};
