import { useState } from 'react'

export default function ExportPanel({ detections = [], blueprintId }) {
    const [copied, setCopied] = useState(false)

    const handleExportJSON = () => {
        const jsonData = JSON.stringify(detections, null, 2)
        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `blueprint-${blueprintId || 'detections'}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const handleCopyToClipboard = async () => {
        const jsonData = JSON.stringify(detections, null, 2)
        try {
            await navigator.clipboard.writeText(jsonData)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleDownloadImage = () => {
        // This would require the canvas to be exported
        // For now, show a placeholder message
        alert('Image download will be implemented when integrated with backend')
    }

    return (
        <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Export Results</h2>

            {/* Export JSON */}
            <button
                onClick={handleExportJSON}
                disabled={!detections || detections.length === 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                Export as JSON
            </button>

            {/* Copy to Clipboard */}
            <button
                onClick={handleCopyToClipboard}
                disabled={!detections || detections.length === 0}
                className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {copied ? (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                        Copy to Clipboard
                    </>
                )}
            </button>

            {/* Download Annotated Image */}
            <button
                onClick={handleDownloadImage}
                disabled={!detections || detections.length === 0}
                className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                Download Image
            </button>

            {/* Info */}
            <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400">
                    {detections && detections.length > 0
                        ? `${detections.length} detection${detections.length !== 1 ? 's' : ''} ready to export`
                        : 'No detections available'}
                </p>
            </div>
        </div>
    )
}
