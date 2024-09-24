/* eslint-disable @next/next/no-img-element */
import { Html } from "react-konva-utils";
import { ComponentTemplate, StageComponentProps } from "../common/types";
import { Rect, Group as KonvaGroup } from "react-konva";
import { Card, Text, Flex, Button } from "@mantine/core";

export const StageComponent = ({
  props,
  isActive,
  onActivate,
}: {
  props: StageComponentProps;
  isActive: boolean;
  onActivate: () => void;
}) => {
  const componentTemplate: ComponentTemplate = props.componentType;

  return (
    <KonvaGroup
      x={props.x}
      y={props.y}
      draggable
      onDragStart={() => {
        console.log("dragstart");
      }}
      onClick={(e) => {
        onActivate();
        e.cancelBubble = true;
      }}
    >
      <Html divProps={{ style: { pointerEvents: "auto" } }}>
        <Flex direction="row" justify="space-between">
          <Button
            onClick={() => {}}
            variant="default"
            display={isActive ? "block" : "none"}
          >
            Details
          </Button>
          <Button variant="default" display={isActive ? "block" : "none"}>
            Delete
          </Button>
          <Button variant="default" display={isActive ? "block" : "none"}>
            Connect
          </Button>
        </Flex>
      </Html>
      <Html divProps={{ style: { pointerEvents: "none" } }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
          <Flex
            direction="row"
            gap="xl"
            justify="space-between"
            mt="md"
            mb="xs"
          >
            <div>
              <Text size="xs" fw={500}>
                {componentTemplate.typeDescription}
              </Text>
              <Text fw={700}>{componentTemplate.defaultLogicalId}</Text>
            </div>
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
