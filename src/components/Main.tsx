/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import { AppShell, Burger, Group, Card, Text, Flex, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import {
  ComponentTemplate,
  Connector,
  StageComponentProps,
} from "../common/types";
import { StageComponent } from "./StageComponent";
import jsonData from "../common/master-map.json";
import { getPoints } from "@/common/util";
import { Layer as LayerType } from "konva/lib/Layer";
import { Line } from "konva/lib/shapes/Line";
import { JsonEditor } from "./JsonEditor";

export default function Main() {
  const stageRef = useRef<StageType>(null);
  const layerRef = useRef<LayerType>(null);
  const [stageComponents, setStageComponents] = useState<StageComponentProps[]>(
    []
  );
  const [draggedComponentType, setDraggedComponentType] =
    useState<ComponentTemplate | null>(null);
  const [activeStageComponentIndex, setActiveStageComponentIndex] =
    useState<string>("");
  const [pendingConnect, setPendingConnect] =
    useState<StageComponentProps | null>(null);
  const [connectors, setConnectors] = useState<Connector[]>([]);
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
        IAM Components
        {masterMapValues.map((componentTemplate) => {
          return (
            <Card
              key={componentTemplate.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              draggable="true"
              onDragStart={() => setDraggedComponentType(componentTemplate)}
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
      </AppShell.Navbar>
      <AppShell.Main>
        <Tabs variant="pills" defaultValue="canvas">
          <Tabs.List>
            <Tabs.Tab value="canvas">Canvas</Tabs.Tab>
            <Tabs.Tab value="template">Template</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="canvas">
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
                  onClick={() => setActiveStageComponentIndex("")}
                >
                  <Layer ref={layerRef}>
                    {stageComponents.map((props) => {
                      return (
                        <StageComponent
                          key={props.id}
                          props={props}
                          isActive={activeStageComponentIndex === props.id}
                          componentPendingConnect={pendingConnect}
                          onActivate={() =>
                            setActiveStageComponentIndex(props.id)
                          }
                          onDelete={() => {
                            setStageComponents(
                              stageComponents.filter(
                                (stageComponent) =>
                                  stageComponent.id !== props.id
                              )
                            );
                            const newConnectors: Connector[] = [];
                            connectors.forEach((connector) => {
                              if (
                                connector.from === props.id ||
                                connector.to === props.id
                              ) {
                                layerRef.current
                                  ?.findOne("#" + connector.id)
                                  ?.destroy();
                              } else {
                                newConnectors.push(connector);
                              }
                            });
                            setConnectors(newConnectors);
                          }}
                          onConnect={() => setPendingConnect(props)}
                          onDragMove={() => {
                            connectors.forEach((connector) => {
                              const line: Line | undefined =
                                layerRef.current?.findOne("#" + connector.id);
                              const fromNode = layerRef.current?.findOne(
                                "#" + connector.from
                              );
                              const toNode = layerRef.current?.findOne(
                                "#" + connector.to
                              );
                              line?.points(
                                getPoints(fromNode ?? null, toNode ?? null)
                              );
                            });
                          }}
                          onConfirmConnect={() => {
                            setPendingConnect(null);
                            setActiveStageComponentIndex("");
                            const newLine = new Line({
                              stroke: "black",
                              id: "line" + connectors.length.toString(),
                            });
                            layerRef.current?.add(newLine);
                            newLine.points(
                              getPoints(
                                layerRef.current?.findOne("#" + props.id) ??
                                  null,
                                layerRef.current?.findOne(
                                  "#" + pendingConnect?.id
                                ) ?? null
                              ) ?? [0, 0, 0, 0]
                            );
                            const newConnector: Connector = {
                              id: newLine.id(),
                              from: props.id,
                              to: pendingConnect?.id,
                            };
                            setConnectors(connectors.concat([newConnector]));
                          }}
                        />
                      );
                    })}
                  </Layer>
                </Stage>
              </div>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="template">
            <div>
              <br />
              <JsonEditor></JsonEditor>
            </div>
          </Tabs.Panel>
        </Tabs>
      </AppShell.Main>
    </AppShell>
  );
}
