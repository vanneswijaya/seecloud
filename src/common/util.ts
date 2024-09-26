import { Node } from "konva/lib/Node";

function getRectangleBorderPoint(
  radians: number,
  size: { width: number; height: number },
  sideOffset = 0
) {
  const width = size.width + sideOffset * 2;

  const height = size.height + sideOffset * 2;

  radians %= 2 * Math.PI;
  if (radians < 0) {
    radians += Math.PI * 2;
  }

  const phi = Math.atan(height / width);

  let x = 0,
    y = 0;
  if (
    (radians >= 2 * Math.PI - phi && radians <= 2 * Math.PI) ||
    (radians >= 0 && radians <= phi)
  ) {
    x = width / 2;
    y = Math.tan(radians) * x;
  } else if (radians >= phi && radians <= Math.PI - phi) {
    y = height / 2;
    x = y / Math.tan(radians);
  } else if (radians >= Math.PI - phi && radians <= Math.PI + phi) {
    x = -width / 2;
    y = Math.tan(radians) * x;
  } else if (radians >= Math.PI + phi && radians <= 2 * Math.PI - phi) {
    y = -height / 2;
    x = y / Math.tan(radians);
  }

  return {
    x: -Math.round(x),
    y: Math.round(y),
  };
}

function getCenter(node: Node) {
  return {
    x: node.x() + node.width() / 2 + 90,
    y: node.y() + node.height() / 2 + 90,
  };
}

export function getPoints(r1: Node | null, r2: Node | null) {
  if (!r1 || !r2) {
    return [0, 0, 0, 0];
  }

  const c1 = getCenter(r1);
  const c2 = getCenter(r2);

  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const angle = Math.atan2(-dy, dx);

  const startOffset = getRectangleBorderPoint(angle + Math.PI, r1.size());
  const endOffset = getRectangleBorderPoint(angle, r2.size());

  const start = {
    x: c1.x - startOffset.x,
    y: c1.y - startOffset.y,
  };

  const end = {
    x: c2.x - endOffset.x,
    y: c2.y - endOffset.y,
  };

  return [start.x, start.y, end.x, end.y];
}
