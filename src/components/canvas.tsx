import { KonvaEventObject } from "konva/lib/Node";
import { Stage as StageType } from "konva/lib/Stage";
import React, { useState, useRef } from "react";
import { Stage, Layer, Circle, Text } from "react-konva";

interface CircleInterface {
  id: string;
  x: number;
  y: number;
  fill: string;
}

export default function Canvas() {
  const initial_state: CircleInterface[] = [];
  const [circles, setCircles] = useState(initial_state);
  const stageRef = useRef<StageType>(null);
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setCircles([
      ...circles,
      {
        id: circles.length.toString(),
        x: e.target.x(),
        y: e.target.y(),
        fill: "red",
      },
    ]);

    const stage: StageType | null = stageRef.current;
    const draggableCircle = stage?.findOne("#draggableCircle");
    draggableCircle?.position({ x: 50, y: 50 });
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
      <Layer>
        <Text
          fontSize={20}
          text="Drag & Drop below circle to add more circles to layer"
          align="center"
          fill="white"
        />
        <Circle
          id="draggableCircle"
          x={50}
          y={50}
          radius={25}
          fill="green"
          draggable
          onDragEnd={handleDragEnd}
        />

        {circles.map((eachCircle) => (
          <Circle
            key={eachCircle.id}
            id={eachCircle.id}
            x={eachCircle.x}
            y={eachCircle.y}
            radius={25}
            fill={eachCircle.fill}
          />
        ))}
      </Layer>
    </Stage>
  );
}
