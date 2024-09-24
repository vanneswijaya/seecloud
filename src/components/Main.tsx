/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Stage, Layer } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import { AppShell, Burger, Group, Card, Text, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import { ComponentTemplate, StageComponentProps } from "../common/types";
import { StageComponent } from "./StageComponent";
import jsonData from "../common/master-map.json";

export default function Main() {
  const stageRef = React.useRef<StageType>(null);
  const [stageComponents, setStageComponents] = React.useState<
    StageComponentProps[]
  >([]);
  const [draggedComponentType, setDraggedComponentType] =
    React.useState<ComponentTemplate | null>(null);
  const [opened, { toggle }] = useDisclosure();

  const loadData = JSON.parse(JSON.stringify(jsonData));
  const masterMapValues: ComponentTemplate[] = Object.values(loadData);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { desktop: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
          <MantineLogo size={30} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        Navbar
        {masterMapValues.map((componentTemplate) => {
          return (
            <Card
              key={componentTemplate.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              draggable="true"
              onDragStart={() => {
                setDraggedComponentType(componentTemplate);
              }}
            >
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
          );
        })}
      </AppShell.Navbar>
      <AppShell.Main>
        <div>
          Drag components into the stage:
          <br />
          <div
            onDrop={(e) => {
              e.preventDefault();
              stageRef.current?.setPointersPositions(e);
              draggedComponentType &&
                setStageComponents(
                  stageComponents.concat([
                    {
                      ...stageRef.current?.getPointerPosition(),
                      componentType: draggedComponentType,
                      id: stageComponents.length.toString(),
                    },
                  ])
                );
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <Stage
              width={window.innerWidth}
              height={window.innerHeight}
              style={{ border: "1px solid grey" }}
              ref={stageRef}
            >
              <Layer>
                {stageComponents.map((props) => {
                  return <StageComponent key={props.id} props={props} />;
                })}
              </Layer>
            </Stage>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
