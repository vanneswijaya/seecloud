/* eslint-disable @next/next/no-img-element */
import { Card, Text, Flex } from "@mantine/core";
import { ComponentType } from "../common/types";
import jsonData from "../common/master-map.json";

export const ComponentsMenu = ({
  onDragComponent,
}: {
  onDragComponent: (draggedComponent: ComponentType) => void;
}) => {
  const loadData = JSON.parse(JSON.stringify(jsonData));
  const masterMapValues: ComponentType[] = Object.values(loadData);

  return (
    <div>
      {masterMapValues.map((componentType, idx) => {
        return (
          <Card
            key={idx}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            draggable="true"
            onDragStart={() => onDragComponent(componentType)}
          >
            <Flex direction="row" justify="space-between" mt="md" mb="xs">
              <Text fw={500}>{componentType.typeName}</Text>
              <img
                height={60}
                width={60}
                alt={componentType.typeName}
                src={componentType.iconPath}
                draggable="false"
              />
            </Flex>
          </Card>
        );
      })}
    </div>
  );
};
