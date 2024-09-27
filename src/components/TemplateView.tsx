import Editor from "@monaco-editor/react";

export const TemplateView = ({
  currentTemplateTree,
}: {
  currentTemplateTree: any;
}) => {
  return (
    <Editor
      height="90vh"
      defaultLanguage="json"
      value={JSON.stringify(currentTemplateTree, null, "\t")}
      options={{ readOnly: true }}
    />
  );
};
