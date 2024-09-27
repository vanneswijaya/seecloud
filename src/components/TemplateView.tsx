import Editor from "@monaco-editor/react";

export const TemplateView = ({
  currentTemplateTree,
}: {
  currentTemplateTree: any;
}) => {
  const currentTemplateValue = JSON.parse(JSON.stringify(currentTemplateTree));
  Object.keys(currentTemplateTree["Resources"]).forEach((key) => {
    const trueKey = Object.keys(currentTemplateValue["Resources"][key])[0];
    currentTemplateValue["Resources"][trueKey] =
      currentTemplateValue["Resources"][key][trueKey];
    delete currentTemplateValue["Resources"][key];
  });

  return (
    <Editor
      height="90vh"
      defaultLanguage="json"
      value={JSON.stringify(currentTemplateValue, null, "\t")}
      options={{ readOnly: true }}
    />
  );
};
