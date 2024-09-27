/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import {
  ComponentTemplate,
  Connector,
  StageComponentProps,
} from "../common/types";
import { StageComponent } from "./StageComponent";
import { getPoints } from "@/common/util";
import { Layer as LayerType } from "konva/lib/Layer";
import { Line } from "konva/lib/shapes/Line";
import { useDisclosure } from "@mantine/hooks";
import { ComponentDetailsDrawer } from "./ComponentDetailsDrawer";

export const CanvasView = ({
  draggedComponentType,
  currentTemplateTree,
  updateTemplateTree,
}: {
  draggedComponentType: ComponentTemplate | null;
  currentTemplateTree: any;
  updateTemplateTree: (x: any) => void;
}) => {
  const stageRef = useRef<StageType>(null);
  const layerRef = useRef<LayerType>(null);
  const [stageComponents, setStageComponents] = useState<StageComponentProps[]>(
    []
  );
  const [activeStageComponentIndex, setActiveStageComponentIndex] =
    useState<string>("");
  const [pendingConnect, setPendingConnect] =
    useState<StageComponentProps | null>(null);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [currentConnectorId, setCurrentConnectorId] = useState<number>(0);
  const [currentComponentId, setCurrentComponentId] = useState<number>(0);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div>
      Drag components into the stage:
      <br />
      <div
        onDrop={(e) => {
          e.preventDefault();
          stageRef.current?.setPointersPositions(e);
          if (!draggedComponentType) {
            return;
          }
          setStageComponents(
            stageComponents.concat([
              {
                ...stageRef.current?.getPointerPosition(),
                componentType: draggedComponentType,
                id: currentComponentId.toString(),
              },
            ])
          );
          const updatedTemplateTree = JSON.parse(
            JSON.stringify(currentTemplateTree)
          );
          updatedTemplateTree["Resources"][currentComponentId.toString()] =
            draggedComponentType.templateValue;
          updateTemplateTree(updatedTemplateTree);
          setCurrentComponentId(currentComponentId + 1);
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
                  onActivate={() => setActiveStageComponentIndex(props.id)}
                  onDelete={() => {
                    setStageComponents(
                      stageComponents.filter(
                        (stageComponent) => stageComponent.id !== props.id
                      )
                    );
                    const updatedTemplateTree = JSON.parse(
                      JSON.stringify(currentTemplateTree)
                    );
                    delete updatedTemplateTree["Resources"][props.id];
                    updateTemplateTree(updatedTemplateTree);
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
                      const line: Line | undefined = layerRef.current?.findOne(
                        "#" + connector.id
                      );
                      const fromNode = layerRef.current?.findOne(
                        "#" + connector.from
                      );
                      const toNode = layerRef.current?.findOne(
                        "#" + connector.to
                      );
                      line?.points(getPoints(fromNode ?? null, toNode ?? null));
                    });
                  }}
                  onConfirmConnect={() => {
                    setPendingConnect(null);
                    setActiveStageComponentIndex("");
                    const newLine = new Line({
                      stroke: "black",
                      id: "line" + currentConnectorId.toString(),
                    });
                    setCurrentConnectorId(currentConnectorId + 1);
                    layerRef.current?.add(newLine);
                    newLine.points(
                      getPoints(
                        layerRef.current?.findOne("#" + props.id) ?? null,
                        layerRef.current?.findOne("#" + pendingConnect?.id) ??
                          null
                      ) ?? [0, 0, 0, 0]
                    );
                    const newConnector: Connector = {
                      id: newLine.id(),
                      from: props.id,
                      to: pendingConnect?.id,
                    };
                    setConnectors(connectors.concat([newConnector]));
                  }}
                  onViewDetails={open}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      <ComponentDetailsDrawer opened={opened} onClose={close} />
    </div>
  );
};
