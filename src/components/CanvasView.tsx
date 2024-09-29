/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import {
  ComponentType,
  Connector,
  StageComponentInterface,
} from "../common/types";
import { StageComponent } from "./StageComponent";
import { getPoints, processNewOrDeletedConnector } from "@/common/util";
import { Layer as LayerType } from "konva/lib/Layer";
import { Line } from "konva/lib/shapes/Line";
import { useDisclosure } from "@mantine/hooks";
import { ComponentDetailsDrawer } from "./ComponentDetailsDrawer";

export const CanvasView = ({
  draggedComponentType,
  stageComponents,
  updateStageComponents,
}: {
  draggedComponentType: ComponentType | null;
  stageComponents: StageComponentInterface[];
  updateStageComponents: (updated: StageComponentInterface[]) => void;
}) => {
  const stageRef = useRef<StageType>(null);
  const layerRef = useRef<LayerType>(null);

  const [activeStageComponentIndex, setActiveStageComponentIndex] =
    useState<string>("");
  const [openedComponent, setOpenedComponent] =
    useState<StageComponentInterface | null>(null);
  const [pendingConnect, setPendingConnect] =
    useState<StageComponentInterface | null>(null);
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
          updateStageComponents(
            stageComponents.concat([
              {
                id: currentComponentId.toString(),
                position: { ...stageRef.current?.getPointerPosition() },
                componentType: draggedComponentType,
                logicalId:
                  draggedComponentType.defaultLogicalId +
                  currentComponentId.toString(),
                templateValue: draggedComponentType.defaultTemplateValue,
              },
            ])
          );
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
            {stageComponents.map((stageComponent) => {
              return (
                <StageComponent
                  key={stageComponent.id}
                  stageComponent={stageComponent}
                  isActive={activeStageComponentIndex === stageComponent.id}
                  componentPendingConnect={pendingConnect}
                  onActivate={() =>
                    setActiveStageComponentIndex(stageComponent.id)
                  }
                  onDelete={() => {
                    updateStageComponents(
                      stageComponents.filter((x) => x.id !== stageComponent.id)
                    );
                    const newConnectors: Connector[] = [];
                    connectors.forEach((connector) => {
                      if (
                        connector.from.id === stageComponent.id ||
                        connector.to?.id === stageComponent.id
                      ) {
                        layerRef.current
                          ?.findOne("#" + connector.id)
                          ?.destroy();
                        processNewOrDeletedConnector(
                          connector.from,
                          connector.to,
                          stageComponents,
                          true
                        );
                      } else {
                        newConnectors.push(connector);
                      }
                    });
                    setConnectors(newConnectors);
                  }}
                  onConnect={() => setPendingConnect(stageComponent)}
                  onDragMove={() => {
                    connectors.forEach((connector) => {
                      const line: Line | undefined = layerRef.current?.findOne(
                        "#" + connector.id
                      );
                      const fromNode = layerRef.current?.findOne(
                        "#" + connector.from.id
                      );
                      const toNode = layerRef.current?.findOne(
                        "#" + connector.to?.id
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
                        layerRef.current?.findOne("#" + stageComponent.id) ??
                          null,
                        layerRef.current?.findOne("#" + pendingConnect?.id) ??
                          null
                      ) ?? [0, 0, 0, 0]
                    );
                    const newConnector: Connector = {
                      id: newLine.id(),
                      from: stageComponent,
                      to: pendingConnect,
                    };
                    setConnectors(connectors.concat([newConnector]));
                    updateStageComponents(
                      processNewOrDeletedConnector(
                        stageComponent,
                        pendingConnect,
                        stageComponents,
                        false
                      )
                    );
                  }}
                  onViewDetails={() => {
                    setActiveStageComponentIndex("");
                    setOpenedComponent(stageComponent);
                    open();
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      <ComponentDetailsDrawer
        component={openedComponent}
        opened={opened}
        onClose={close}
        onSave={(newId) => {
          updateStageComponents(
            stageComponents.map((stageComponent) => {
              return {
                ...stageComponent,
                logicalId:
                  stageComponent.id === openedComponent?.id
                    ? newId
                    : stageComponent.logicalId,
              };
            })
          );
          close();
        }}
      />
    </div>
  );
};
