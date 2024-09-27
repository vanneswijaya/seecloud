import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button } from "@mantine/core";
import Editor from "@monaco-editor/react";

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
      title="Component Details"
      overlayProps={{ backgroundOpacity: 0 }}
    >
      <Editor
        height="90vh"
        defaultLanguage="json"
        value={JSON.stringify({ test: "test" })}
        options={{ readOnly: true }}
      />
    </Drawer>
  );
};
