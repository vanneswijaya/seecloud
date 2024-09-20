/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import { Stage as StageType } from "konva/lib/Stage";
import { AppShell, Burger, Group, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";

interface ImageType {
  id: string;
  x?: number;
  y?: number;
  src: string;
}

interface ImageTargetType extends EventTarget {
  src: string;
}

const URLImage = ({ image }: { image: ImageType }) => {
  const [img] = useImage(image.src);
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      alt=""
      // I will use offset to set origin to the center of the image
      offsetX={img ? img.width / 2 : 0}
      offsetY={img ? img.height / 2 : 0}
    />
  );
};

export default function Canvas() {
  const stageRef = React.useRef<StageType>(null);
  const [images, setImages] = React.useState<ImageType[]>([]);
  const [dragUrl, setDragUrl] = React.useState<string>("");
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <MantineLogo size={30} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <div>
          Try to drag image into the stage:
          <br />
          <img
            alt="lion"
            src="https://konvajs.org/assets/lion.png"
            draggable="true"
            onDragStart={(e) => {
              const targetImage = e.target as ImageTargetType;
              setDragUrl(targetImage.src);
            }}
          />
          <div
            onDrop={(e) => {
              e.preventDefault();
              // register event position
              stageRef.current?.setPointersPositions(e);
              // add image
              setImages(
                images.concat([
                  {
                    ...stageRef.current?.getPointerPosition(),
                    src: dragUrl,
                    id: images.length.toString(),
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
                {images.map((image) => {
                  return <URLImage key={image.id} image={image} />;
                })}
              </Layer>
            </Stage>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
