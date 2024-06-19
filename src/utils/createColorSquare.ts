export function createColoredSquare(
  color: string,
  strokeColor = '#691812',
): HTMLCanvasElement {
  const size = 6;
  const strokeSize = 1;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = color;
    context.fillRect(
      strokeSize,
      strokeSize,
      size - 2 * strokeSize,
      size - 2 * strokeSize,
    );

    context.strokeStyle = strokeColor;
    context.lineWidth = strokeSize;
    context.strokeRect(
      strokeSize / 2,
      strokeSize / 2,
      size - strokeSize,
      size - strokeSize,
    );
  }
  return canvas;
}
