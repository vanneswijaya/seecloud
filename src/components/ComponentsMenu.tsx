/* eslint-disable @next/next/no-img-element */
import { Card, Text, Flex } from "@mantine/core";
import { ComponentTemplate } from "../common/types";
import jsonData from "../common/master-map.json";

export const ComponentsMenu = ({
  onDragComponent,
}: {
  onDragComponent: (draggedComponent: ComponentTemplate) => void;
}) => {
  const loadData = JSON.parse(JSON.stringify(jsonData));
  const masterMapValues: ComponentTemplate[] = Object.values(loadData);

  return (
    <div>
      {masterMapValues.map((componentTemplate) => {
        return (
          <Card
            key={componentTemplate.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            draggable="true"
            onDragStart={() => onDragComponent(componentTemplate)}
          >
            <Flex direction="row" justify="space-between" mt="md" mb="xs">
              <Text fw={500}>{componentTemplate.typeDescription}</Text>
              <img
                height={60}
                width={60}
                alt={componentTemplate.id}
                src={componentTemplate.imagePath}
                draggable="false"
              />
            </Flex>
          </Card>
        );
      })}
    </div>
  );
};
