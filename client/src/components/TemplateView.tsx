import { StageComponentInterface } from "@/common/types";
import { getJsonTemplateFromStageComponents } from "@/common/util";
import Editor from "@monaco-editor/react";

export const TemplateView = ({
  stageComponents,
}: {
  stageComponents: StageComponentInterface[];
}) => {
  const templateString = getJsonTemplateFromStageComponents(stageComponents);

  return (
    <Editor
      height="90vh"
      defaultLanguage="json"
      value={templateString}
      options={{ readOnly: true }}
    />
  );
};
