import { useEffect, useRef } from 'react'
import { drawAllDetections, clearCanvas } from '../utils/drawBoxes'

export default function DetectionOverlay({ imageData, detections = [] }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (!canvasRef.current || !imageData) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // Set canvas size to match the blueprint image
        const { img, scale, position } = imageData
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        // Position canvas over the blueprint
        canvas.style.left = `${position.x}px`
        canvas.style.top = `${position.y}px`

        // Clear previous drawings
        clearCanvas(ctx, canvas.width, canvas.height)

        // Draw all detections
        if (detections && detections.length > 0) {
            // Scale bounding boxes to match the displayed image
            const scaledDetections = detections.map(det => ({
                ...det,
                bbox: det.bbox.map(coord => coord * scale)
            }))
            drawAllDetections(ctx, scaledDetections)
        }
    }, [imageData, detections])

    if (!imageData) return null

    return (
        <canvas
            ref={canvasRef}
            className="absolute pointer-events-none"
            style={{
                mixBlendMode: 'normal',
                zIndex: 10
            }}
        />
    )
}
