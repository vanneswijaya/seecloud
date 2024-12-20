/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  Tabs,
  ScrollArea,
  Text,
  Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  ComponentData,
  Connector,
  StageComponentInterface,
} from "../common/types";
import { TemplateView } from "./TemplateView";
import { CanvasView } from "./CanvasView";
import { ComponentsMenu } from "./ComponentsMenu";
import { ActionMenu } from "./ActionMenu";
import html2canvas from "html2canvas";

export default function Main() {
  const [draggedComponentType, setDraggedComponentType] =
    useState<ComponentData | null>(null);
  const [stageComponents, setStageComponents] = useState<
    StageComponentInterface[]
  >([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [opened, { toggle }] = useDisclosure();

  function downloadURI(uri: string, name: string) {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const handleExport = async () => {
    const canvasElement = document.querySelector("#capture") as HTMLElement;
    const canvas = await html2canvas(canvasElement || document.body);
    downloadURI(canvas.toDataURL(), "diagramSnapshot.png");
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { desktop: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Flex justify="space-between" align="center" p="sm">
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Flex justify="center" align="center" gap="xs">
              <img height={30} width={30} alt="SeeCloud" src="icons/eye.png" />
              <Text fw="bold">SeeCloud</Text>
            </Flex>
          </Group>
          <ActionMenu
            exportImage={handleExport}
            stageComponents={stageComponents}
            connectors={connectors}
          />
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <ScrollArea>
          <ComponentsMenu
            onDragComponent={(draggedComponent) =>
              setDraggedComponentType(draggedComponent)
            }
          />
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main>
        <Tabs variant="pills" defaultValue="canvas">
          <Tabs.List>
            <Tabs.Tab value="canvas">Canvas</Tabs.Tab>
            <Tabs.Tab value="template">Template</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="canvas">
            <CanvasView
              draggedComponentType={draggedComponentType}
              stageComponents={stageComponents}
              updateStageComponents={setStageComponents}
              connectors={connectors}
              setConnectors={setConnectors}
            />
          </Tabs.Panel>
          <Tabs.Panel value="template">
            <br />
            <TemplateView stageComponents={stageComponents} />
          </Tabs.Panel>
        </Tabs>
      </AppShell.Main>
    </AppShell>
  );
}
