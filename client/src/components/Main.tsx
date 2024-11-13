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
import { ComponentData, StageComponentInterface } from "../common/types";
import { TemplateView } from "./TemplateView";
import { CanvasView } from "./CanvasView";
import { ComponentsMenu } from "./ComponentsMenu";
import { ActionMenu } from "./ActionMenu";

export default function Main() {
  const [draggedComponentType, setDraggedComponentType] =
    useState<ComponentData | null>(null);
  const [stageComponents, setStageComponents] = useState<
    StageComponentInterface[]
  >([]);
  const [opened, { toggle }] = useDisclosure();

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
          <ActionMenu stageComponents={stageComponents} />
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
              updateStageComponents={(updated) => setStageComponents(updated)}
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
