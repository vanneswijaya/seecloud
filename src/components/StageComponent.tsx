/* eslint-disable @next/next/no-img-element */
import { Html } from "react-konva-utils";
import { ComponentTemplate, StageComponentProps } from "../common/types";
import { Rect, Group as KonvaGroup } from "react-konva";
import { Card, Text, Flex } from "@mantine/core";

export const StageComponent = ({ props }: { props: StageComponentProps }) => {
  const componentTemplate: ComponentTemplate = props.componentType;

  return (
    <KonvaGroup
      x={props.x}
      y={props.y}
      draggable
      onDragStart={() => {
        console.log("dragstart");
      }}
    >
      <Html divProps={{ style: { pointerEvents: "none" } }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Flex direction="row" justify="space-between" mt="md" mb="xs">
            <Text fw={500}>{componentTemplate.defaultLogicalId}</Text>
            <img
              height={60}
              width={60}
              alt={componentTemplate.id}
              src={componentTemplate.imagePath}
              draggable="false"
            />
          </Flex>
        </Card>
      </Html>
      <Rect width={207} height={215} fill="white" />
    </KonvaGroup>
  );
};
