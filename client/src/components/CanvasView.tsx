/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import {
  ComponentData,
  Connector,
  StageComponentInterface,
  ServiceConnection,
} from "../common/types";
import { StageComponent } from "./StageComponent";
import {
  getPoints,
  processNewOrDeletedConnector,
  processNewPolicyStatement,
} from "@/common/util";
import { Layer as LayerType } from "konva/lib/Layer";
import { Line } from "konva/lib/shapes/Line";
import { useDisclosure } from "@mantine/hooks";
import { PolicyStatementModal } from "./PolicyStatementModal";
import { ComponentDetailsDrawer } from "./ComponentDetailsDrawer";
import styles from "../common/styles.module.css";

export const CanvasView = ({
  draggedComponentType,
  stageComponents,
  updateStageComponents,
}: {
  draggedComponentType: ComponentData | null;
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
  const [serviceConnection, setServiceConnection] = useState<ServiceConnection>(
    { policy: null, service: null, policyStatementSid: "" }
  );
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [currentConnectorId, setCurrentConnectorId] = useState<number>(0);
  const [currentComponentId, setCurrentComponentId] = useState<number>(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [policyModalOpened, policyModalHandlers] = useDisclosure(false);

  return (
    <div>
      <br />
      <div
        id="capture"
        className={styles.canvas}
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
                componentData: {
                  ...draggedComponentType,
                  ...(draggedComponentType.type === "iam-template" && {
                    logicalId:
                      draggedComponentType.defaultLogicalId +
                      currentComponentId.toString(),
                    templateValue: draggedComponentType.defaultTemplateValue,
                  }),
                },
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
                      strokeWidth: 7,
                    });

                    // i love u bubu
                    // i love u too bini
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
                      policyStatementSid: newLine.id(),
                    };
                    setConnectors(connectors.concat([newConnector]));
                    if (
                      stageComponent.componentData.type === "iam-template" &&
                      pendingConnect?.componentData.type === "iam-template"
                    ) {
                      updateStageComponents(
                        processNewOrDeletedConnector(
                          stageComponent,
                          pendingConnect,
                          stageComponents,
                          false
                        )
                      );
                    } else {
                      newLine.on("mouseenter", () => {
                        newLine.strokeWidth(10);
                        newLine.stroke("red");
                      });
                      newLine.on("mouseleave", () => {
                        newLine.strokeWidth(7);
                        newLine.stroke("black");
                      });
                      const service =
                        stageComponent.componentData.type !== "iam-template"
                          ? stageComponent
                          : pendingConnect;
                      const policy =
                        stageComponent.componentData.type === "iam-template"
                          ? stageComponent
                          : pendingConnect;
                      newLine.on("click", () => {
                        setServiceConnection({
                          policy: policy,
                          service: service,
                          policyStatementSid: newLine.id(),
                        });
                        policyModalHandlers.open();
                      });
                      setServiceConnection({
                        policy: policy,
                        service: service,
                        policyStatementSid: newLine.id(),
                      });
                      policyModalHandlers.open();
                    }
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
              return stageComponent.id === openedComponent?.id
                ? {
                    ...stageComponent,
                    componentData: {
                      ...stageComponent.componentData,
                      logicalId: newId,
                    },
                  }
                : stageComponent;
            })
          );
          close();
        }}
      />
      <PolicyStatementModal
        key={serviceConnection.policyStatementSid}
        opened={policyModalOpened}
        close={policyModalHandlers.close}
        serviceConnection={serviceConnection}
        onSave={(newPolicyStatement: any) => {
          updateStageComponents(
            processNewPolicyStatement(
              newPolicyStatement,
              serviceConnection,
              stageComponents
            )
          );
          policyModalHandlers.close();
        }}
      />
    </div>
  );
};
