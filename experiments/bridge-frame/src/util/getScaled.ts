const FIGMA_DESIGN_WIDTH = 640
const FRAME_IMAGE_WIDTH = 600

const SCALE = FRAME_IMAGE_WIDTH / FIGMA_DESIGN_WIDTH

// Makes it easier to just use size values from the Figma design files

export const getScaled = (length: number) => {
  return Math.floor(length * SCALE)
}
