/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { AppShell, Burger, Group, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import { ComponentTemplate } from "../common/types";
import { TemplateView } from "./TemplateView";
import { CanvasView } from "./CanvasView";
import { ComponentsMenu } from "./ComponentsMenu";

export default function Main() {
  const [draggedComponentType, setDraggedComponentType] =
    useState<ComponentTemplate | null>(null);
  const [currentTemplateTree, setCurrentTemplateTree] = useState<any>({
    AWSTemplateFormatVersion: "2010-09-09",
    Description: "A sample template",
    Resources: {},
  });
  const [opened, { toggle }] = useDisclosure();

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
        <ComponentsMenu
          onDragComponent={(draggedComponent) =>
            setDraggedComponentType(draggedComponent)
          }
        />
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
              currentTemplateTree={currentTemplateTree}
              updateTemplateTree={(updated) => setCurrentTemplateTree(updated)}
            />
          </Tabs.Panel>
          <Tabs.Panel value="template">
            <br />
            <TemplateView currentTemplateTree={currentTemplateTree} />
          </Tabs.Panel>
        </Tabs>
      </AppShell.Main>
    </AppShell>
  );
}
