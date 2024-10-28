/* eslint-disable @next/next/no-img-element */
import { Card, Text, Flex, rem } from "@mantine/core";
import {
  ComponentData,
  GenericService,
  IamTemplate,
  ImportedInstance,
} from "../common/types";
import jsonData from "../common/component-map.json";
import {
  IconBrandAws,
  IconChevronDown,
  IconFileImport,
  IconLockCheck,
} from "@tabler/icons-react";

interface ImportedInstanceValue {
  iconPath: string;
  typeName: string;
  arnPrefix: string;
  instanceIds: string[];
  actions: string[];
}

export const ComponentsMenu = ({
  onDragComponent,
}: {
  onDragComponent: (draggedComponent: ComponentData) => void;
}) => {
  const loadData = JSON.parse(JSON.stringify(jsonData));
  const iamTemplateValues: IamTemplate[] = Object.values(
    loadData["iam-templates"]
  );
  const genericServiceValues: GenericService[] = Object.values(
    loadData["generic-services"]
  );
  const importedInstanceValues: ImportedInstance[] = (
    Object.values(loadData["imported-instances"]) as ImportedInstanceValue[]
  ).reduce((array: ImportedInstance[], object) => {
    object.instanceIds.forEach((id) =>
      array.push({
        type: "imported-instance",
        iconPath: object.iconPath,
        typeName: object.typeName,
        arn: object.arnPrefix + id,
        instanceId: id,
        actions: object.actions,
      })
    );
    return array;
  }, []);

  return (
    <Flex direction="column" gap="xl">
      <Flex direction="column" gap="sm">
        <Flex justify="space-between">
          <Flex gap="xs">
            <IconLockCheck />
            <Text fw="bolder">IAM Templates</Text>
          </Flex>
          <IconChevronDown />
        </Flex>
        {iamTemplateValues.map((iamTemplate, idx) => {
          return (
            <Card
              key={idx}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              draggable="true"
              onDragStart={() =>
                onDragComponent({ ...iamTemplate, type: "iam-template" })
              }
            >
              <Flex
                direction="row"
                justify="space-between"
                align="center"
                mt="md"
                mb="xs"
              >
                <Text fw={500}>{iamTemplate.typeName}</Text>
                <img
                  height={60}
                  width={60}
                  alt={iamTemplate.typeName}
                  src={iamTemplate.iconPath}
                  draggable="false"
                />
              </Flex>
            </Card>
          );
        })}
      </Flex>
      <Flex direction="column" gap="sm">
        <Flex justify="space-between">
          <Flex gap="xs">
            <IconBrandAws />
            <Text fw="bolder">Generic Services</Text>
          </Flex>
          <IconChevronDown />
        </Flex>
        {genericServiceValues.map((genericService, idx) => {
          return (
            <Card
              key={idx}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              draggable="true"
              onDragStart={() =>
                onDragComponent({ ...genericService, type: "generic-service" })
              }
            >
              <Flex
                direction="row"
                justify="space-between"
                align="center"
                mt="md"
                mb="xs"
              >
                <Text fw={500}>{genericService.typeName}</Text>
                <img
                  height={60}
                  width={60}
                  alt={genericService.typeName}
                  src={genericService.iconPath}
                  draggable="false"
                />
              </Flex>
            </Card>
          );
        })}
      </Flex>
      <Flex direction="column" gap="sm">
        <Flex justify="space-between">
          <Flex gap="xs">
            <IconFileImport />
            <Text fw="bolder">Imported Instances</Text>
          </Flex>
          <IconChevronDown />
        </Flex>
        {importedInstanceValues.map((importedInstance, idx) => {
          return (
            <Card
              key={idx}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              draggable="true"
              onDragStart={() =>
                onDragComponent({
                  ...importedInstance,
                  type: "imported-instance",
                })
              }
            >
              <Flex
                direction="row"
                justify="space-between"
                align="center"
                gap="xl"
                mt="md"
                mb="xs"
              >
                <Flex direction="column">
                  <Text size="xs" fw={500}>
                    {importedInstance.typeName}
                  </Text>
                  <Text fw={700}>{importedInstance.instanceId}</Text>
                </Flex>
                <img
                  height={60}
                  width={60}
                  alt={importedInstance.typeName}
                  src={importedInstance.iconPath}
                  draggable="false"
                />
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </Flex>
  );
};
