/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
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
import { Line as LineType } from "konva/lib/shapes/Line";
import { useDisclosure } from "@mantine/hooks";
import { PolicyStatementModal } from "./PolicyStatementModal";
import { ComponentDetailsDrawer } from "./ComponentDetailsDrawer";
import styles from "../common/styles.module.css";

export const CanvasView = ({
  draggedComponentType,
  stageComponents,
  updateStageComponents,
  connectors,
  setConnectors,
}: {
  draggedComponentType: ComponentData | null;
  stageComponents: StageComponentInterface[];
  updateStageComponents: (updated: StageComponentInterface[]) => void;
  connectors: Connector[];
  setConnectors: (updated: Connector[]) => void;
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
  const [currentConnectorId, setCurrentConnectorId] = useState<number>(0);
  const [currentComponentId, setCurrentComponentId] = useState<number>(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [policyModalOpened, policyModalHandlers] = useDisclosure(false);

  const getNewConnector = (
    from: StageComponentInterface,
    to: StageComponentInterface | null,
    connectorId: string
  ) => {
    const isServiceToPolicy =
      (from.componentData.typeName === "IAM Managed Policy" &&
        to?.componentData.type !== "iam-template") ||
      (to?.componentData.typeName === "IAM Managed Policy" &&
        from.componentData.type !== "iam-template");
    const isGenericToInstance =
      (from.componentData.type === "imported-instance" &&
        to?.componentData.type === "generic-service") ||
      (to?.componentData.type === "imported-instance" &&
        from.componentData.type === "generic-service");

    const newConnector: Connector = {
      id: "line" + connectorId,
      from: from,
      to: to,
      policyStatementSid: "line" + connectorId,
      type: isServiceToPolicy
        ? "service-to-policy"
        : isGenericToInstance
        ? "generic-to-instance"
        : "default",
    };
    return newConnector;
  };

  return (
    <div>
      <br />
      <div
        id="capture"
        data-testid="canvas"
        className={styles.canvas}
        onDrop={(e) => {
          e.preventDefault();
          stageRef.current?.setPointersPositions(e);
          if (!draggedComponentType) {
            return;
          }
          const newStageComponent = {
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
          };
          updateStageComponents(stageComponents.concat([newStageComponent]));
          setCurrentComponentId(currentComponentId + 1);
          const genericToInstanceMap: Record<string, string> = {
            "EC2 (*)": "EC2 instance",
            "S3 (*)": "S3 bucket",
            "RDS (*)": "RDS database",
          };
          Object.keys(genericToInstanceMap).forEach((generic) => {
            if (newStageComponent.componentData.typeName === generic) {
              const newConnectors: Connector[] = [];
              let count = 0;
              stageComponents.forEach((x) => {
                if (
                  x.componentData.typeName === genericToInstanceMap[generic]
                ) {
                  newConnectors.push(
                    getNewConnector(
                      x,
                      newStageComponent,
                      (currentConnectorId + count).toString()
                    )
                  );
                  count += 1;
                }
              });
              setConnectors(connectors.concat(newConnectors));
              setCurrentConnectorId(currentConnectorId + count);
            } else if (
              newStageComponent.componentData.typeName ===
                genericToInstanceMap[generic] &&
              stageComponents.filter(
                (x) => x.componentData.typeName === generic
              )[0]
            ) {
              const newConnector = getNewConnector(
                newStageComponent,
                stageComponents.filter(
                  (x) => x.componentData.typeName === generic
                )[0],
                currentConnectorId.toString()
              );
              setConnectors(connectors.concat([newConnector]));
              setCurrentConnectorId(currentConnectorId + 1);
            }
          });
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
                      const line: LineType | undefined =
                        layerRef.current?.findOne("#" + connector.id);
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
                    const newConnector = getNewConnector(
                      stageComponent,
                      pendingConnect,
                      currentConnectorId.toString()
                    );
                    setConnectors(connectors.concat([newConnector]));
                    setCurrentConnectorId(currentConnectorId + 1);
                    if (
                      (stageComponent.componentData.type === "iam-template" &&
                        pendingConnect?.componentData.type ===
                          "iam-template") ||
                      stageComponent.componentData.typeName === "IAM Role" ||
                      pendingConnect?.componentData.typeName === "IAM Role"
                    ) {
                      updateStageComponents(
                        processNewOrDeletedConnector(
                          stageComponent,
                          pendingConnect,
                          stageComponents,
                          false
                        )
                      );
                    } else if (
                      stageComponent.componentData.typeName ===
                        "IAM Managed Policy" ||
                      pendingConnect?.componentData.typeName ===
                        "IAM Managed Policy"
                    ) {
                      const service =
                        stageComponent.componentData.type !== "iam-template"
                          ? stageComponent
                          : pendingConnect;
                      const policy =
                        stageComponent.componentData.type === "iam-template"
                          ? stageComponent
                          : pendingConnect;

                      setServiceConnection({
                        policy: policy,
                        service: service,
                        policyStatementSid: newConnector.policyStatementSid,
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
            {connectors.map((connector) => {
              return (
                <Line
                  key={connector.id}
                  points={
                    getPoints(
                      layerRef.current?.findOne("#" + connector.from.id) ??
                        null,
                      layerRef.current?.findOne("#" + connector.to?.id) ?? null
                    ) ?? [0, 0, 0, 0]
                  }
                  stroke="black"
                  id={connector.id}
                  strokeWidth={7}
                  {...(connector.type === "generic-to-instance"
                    ? { dash: [33, 10] }
                    : connector.type === "service-to-policy"
                    ? {
                        onMouseEnter: (e) => {
                          e.currentTarget.setAttrs({
                            stroke: "red",
                            strokeWidth: 10,
                          });
                        },
                        onMouseLeave: (e) => {
                          e.currentTarget.setAttrs({
                            stroke: "black",
                            strokeWidth: 7,
                          });
                        },
                        onClick: () => {
                          const service =
                            connector.from.componentData.type !== "iam-template"
                              ? connector.from
                              : connector.to;
                          const policy =
                            connector.from.componentData.type === "iam-template"
                              ? connector.from
                              : connector.to;
                          setServiceConnection({
                            policy: policy,
                            service: service,
                            policyStatementSid: connector.policyStatementSid,
                          });
                          policyModalHandlers.open();
                        },
                      }
                    : {})}
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
