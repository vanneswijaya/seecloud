import { StageComponentInterface, Template } from "@/common/types";
import Editor from "@monaco-editor/react";

export const TemplateView = ({
  stageComponents,
}: {
  stageComponents: StageComponentInterface[];
}) => {
  const template: Template = {
    AWSTemplateFormatVersion: "2010-09-09",
    Description: "A sample template",
    Resources: {},
  };
  stageComponents.forEach((stageComponent) => {
    if (
      stageComponent.componentData.type === "iam-template" &&
      stageComponent.componentData.logicalId
    ) {
      template["Resources"][stageComponent.componentData.logicalId] =
        stageComponent.componentData.templateValue;
    }
  });

  return (
    <Editor
      height="90vh"
      defaultLanguage="json"
      value={JSON.stringify(template, null, "\t")}
      options={{ readOnly: true }}
    />
  );
};
