/* eslint-disable @next/next/no-img-element */
import { Html } from "react-konva-utils";
import { ComponentType, StageComponentInterface } from "../common/types";
import { Rect, Group as KonvaGroup } from "react-konva";
import { Card, Text, Flex, Button, Indicator } from "@mantine/core";

export const StageComponent = ({
  stageComponent,
  isActive,
  componentPendingConnect,
  onActivate,
  onDelete,
  onConnect,
  onDragMove,
  onConfirmConnect,
  onViewDetails,
}: {
  stageComponent: StageComponentInterface;
  isActive: boolean;
  componentPendingConnect: StageComponentInterface | null;
  onActivate: () => void;
  onDelete: () => void;
  onConnect: () => void;
  onDragMove: () => void;
  onConfirmConnect: () => void;
  onViewDetails: () => void;
}) => {
  return (
    <KonvaGroup
      id={stageComponent.id}
      x={stageComponent.position.x}
      y={stageComponent.position.y}
      draggable
      onDragMove={onDragMove}
      onClick={(e) => {
        if (componentPendingConnect) {
          onConfirmConnect();
        } else {
          onActivate();
        }
        e.cancelBubble = true;
      }}
    >
      <Html divProps={{ style: { pointerEvents: "auto" } }}>
        <Flex
          direction="row"
          justify="space-between"
          display={
            isActive && componentPendingConnect === null ? "block" : "none"
          }
        >
          <Button onClick={onViewDetails} variant="default">
            Details
          </Button>
          <Button onClick={onDelete} variant="default">
            Delete
          </Button>
          <Button onClick={onConnect} variant="default">
            Connect
          </Button>
        </Flex>
      </Html>
      <Html divProps={{ style: { pointerEvents: "none" } }}>
        <Indicator
          color="red"
          size={17}
          processing
          disabled={
            componentPendingConnect === null ||
            componentPendingConnect.id === stageComponent.id
          }
        >
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
                  {stageComponent.componentType.typeName}
                </Text>
                <Text fw={700}>{stageComponent.logicalId}</Text>
              </div>
              <img
                height={60}
                width={60}
                alt={stageComponent.componentType.typeName}
                src={stageComponent.componentType.iconPath}
                draggable="false"
              />
            </Flex>
          </Card>
        </Indicator>
      </Html>
      <Rect width={185} height={120} offsetY={-30} fill="white" />
    </KonvaGroup>
  );
};
