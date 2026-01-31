/**
 * Color mapping for different detection labels
 */
const labelColors = {
    wall: '#ef4444',      // red
    door: '#22c55e',      // green
    window: '#3b82f6',    // blue
    room: '#a855f7',      // purple
    default: '#f59e0b'    // amber
}

/**
 * Get consistent color for a label
 * @param {string} label - Detection label (wall, door, window, room)
 * @returns {string} Hex color code
 */
export const getColorForLabel = (label) => {
    return labelColors[label.toLowerCase()] || labelColors.default
}

/**
 * Draw a bounding box on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} bbox - Bounding box coordinates [x, y, width, height]
 * @param {string} label - Detection label
 * @param {number} confidence - Confidence score (0-1)
 * @param {string} color - Optional custom color (uses label color if not provided)
 */
export const drawBoundingBox = (ctx, bbox, label, confidence, color = null) => {
    const [x, y, width, height] = bbox
    const boxColor = color || getColorForLabel(label)

    // Draw box outline
    ctx.strokeStyle = boxColor
    ctx.lineWidth = 3
    ctx.strokeRect(x, y, width, height)

    // Draw semi-transparent fill
    ctx.fillStyle = boxColor + '20' // 20 = 12.5% opacity in hex
    ctx.fillRect(x, y, width, height)

    // Draw label background
    const labelText = `${label} ${(confidence * 100).toFixed(0)}%`
    ctx.font = 'bold 14px Inter, sans-serif'
    const textMetrics = ctx.measureText(labelText)
    const textHeight = 20
    const padding = 6

    ctx.fillStyle = boxColor
    ctx.fillRect(x, y - textHeight - padding, textMetrics.width + padding * 2, textHeight + padding)

    // Draw label text
    ctx.fillStyle = '#ffffff'
    ctx.fillText(labelText, x + padding, y - padding - 4)
}

/**
 * Clear the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export const clearCanvas = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height)
}

/**
 * Draw all detections on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} detections - Array of detection objects
 */
export const drawAllDetections = (ctx, detections) => {
    if (!detections || detections.length === 0) return

    detections.forEach(detection => {
        drawBoundingBox(
            ctx,
            detection.bbox,
            detection.label,
            detection.confidence
        )
    })
}
