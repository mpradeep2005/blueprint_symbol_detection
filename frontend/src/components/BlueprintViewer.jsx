import { useEffect, useRef, useState } from 'react'

export default function BlueprintViewer({ imageUrl, detections = [], onCanvasReady }) {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

    useEffect(() => {
        if (!imageUrl || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            // Set canvas size to match container
            const container = containerRef.current
            const containerWidth = container.clientWidth
            const containerHeight = container.clientHeight

            // Calculate scale to fit image in container
            const scaleX = containerWidth / img.width
            const scaleY = containerHeight / img.height
            const fitScale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond 100%

            canvas.width = containerWidth
            canvas.height = containerHeight

            // Center the image
            const scaledWidth = img.width * fitScale
            const scaledHeight = img.height * fitScale
            const x = (containerWidth - scaledWidth) / 2
            const y = (containerHeight - scaledHeight) / 2

            // Draw the image
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

            setImageLoaded(true)
            setScale(fitScale)
            setPosition({ x, y })

            // Notify parent that canvas is ready
            if (onCanvasReady) {
                onCanvasReady(ctx, { img, scale: fitScale, position: { x, y } })
            }
        }

        img.src = imageUrl
    }, [imageUrl, onCanvasReady])

    const handleWheel = (e) => {
        e.preventDefault()
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        setScale(prev => Math.min(Math.max(prev * delta, 0.1), 5))
    }

    const handleMouseDown = (e) => {
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full glass-card overflow-hidden"
            onWheel={handleWheel}
        >
            {!imageLoaded && imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <svg
                            className="animate-spin h-12 w-12 mx-auto mb-4 text-primary-500"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <p className="text-gray-400">Loading blueprint...</p>
                    </div>
                </div>
            )}

            <canvas
                ref={canvasRef}
                className={`
          w-full h-full cursor-move
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        `}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />

            {imageLoaded && (
                <div className="absolute bottom-4 right-4 glass-card px-4 py-2 text-sm text-gray-300">
                    Zoom: {(scale * 100).toFixed(0)}%
                </div>
            )}
        </div>
    )
}
