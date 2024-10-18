// import { Drawer, Button, Input } from "@mantine/core";
// import Editor from "@monaco-editor/react";
// import { StageComponentInterface } from "@/common/types";
// import { useRef } from "react";

// export const ComponentDetailsDrawer = ({
//   component,
//   opened,
//   onClose,
//   onSave,
// }: {
//   component: StageComponentInterface | null;
//   opened: boolean;
//   onClose: () => void;
//   onSave: (newId: string) => void;
// }) => {
//   const templateValue = component?.templateValue;
//   const logicalIdRef = useRef<HTMLInputElement>(null);
//   return (
//     <Drawer
//       position="right"
//       opened={opened}
//       onClose={onClose}
//       title="Component Details"
//       overlayProps={{ backgroundOpacity: 0 }}
//     >
//       <Input.Wrapper label="Logical ID" description="" error="">
//         <Input
//           ref={logicalIdRef}
//           defaultValue={component ? component.logicalId : ""}
//           placeholder="Enter logical ID for this resource"
//         />
//       </Input.Wrapper>
//       <br />
//       Resource configuration
//       <Editor
//         height="50vh"
//         defaultLanguage="json"
//         value={JSON.stringify(templateValue, null, "\t")}
//         options={{ readOnly: true }}
//       />
//       <Button
//         onClick={() => onSave(logicalIdRef.current?.value ?? "")}
//         variant="default"
//       >
//         Save
//       </Button>
//     </Drawer>
//   );
// };
