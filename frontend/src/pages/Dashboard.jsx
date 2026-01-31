import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import BlueprintViewer from '../components/BlueprintViewer'
import DetectionOverlay from '../components/DetectionOverlay'
import StatsPanel from '../components/StatsPanel'
import ExportPanel from '../components/ExportPanel'
import { blueprintAPI } from '../services/api'

export default function Dashboard() {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [detecting, setDetecting] = useState(false)
    const [error, setError] = useState(null)
    const [imageData, setImageData] = useState(null)
    const [detections, setDetections] = useState([])
    const [selectedClass, setSelectedClass] = useState(null)

    // Mock data for demonstration when no backend is available
    const useMockData = !id

    // Filter detections based on selected class
    const filteredDetections = selectedClass
        ? detections.filter(d => d.label.toLowerCase() === selectedClass.toLowerCase())
        : detections

    useEffect(() => {
        if (useMockData) {
            // Load mock data for demonstration
            setDetections([
                { label: 'wall', confidence: 0.95, bbox: [50, 50, 200, 10] },
                { label: 'door', confidence: 0.89, bbox: [120, 50, 40, 60] },
                { label: 'window', confidence: 0.92, bbox: [200, 80, 50, 40] },
                { label: 'room', confidence: 0.87, bbox: [50, 50, 200, 150] },
            ])
        } else if (id) {
            fetchResults()
        }
    }, [id, useMockData])

    const fetchResults = async () => {
        setLoading(true)
        setError(null)

        try {
            // Try to get existing results
            const results = await blueprintAPI.getResults(id)
            setDetections(results.detections || [])
        } catch (err) {
            // If no results, try to run detection
            if (err.response?.status === 404) {
                await runDetection()
            } else {
                setError(err.response?.data?.message || 'Failed to load results')
            }
        } finally {
            setLoading(false)
        }
    }

    const runDetection = async () => {
        setDetecting(true)
        setError(null)

        try {
            const response = await blueprintAPI.detectElements(id)
            setDetections(response.detections || [])
        } catch (err) {
            setError(err.response?.data?.message || 'Detection failed')
        } finally {
            setDetecting(false)
        }
    }

    const handleCanvasReady = (ctx, data) => {
        setImageData(data)
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="p-6 glass-card mx-6 mt-6 rounded-2xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold gradient-text">Blueprint AI</h1>
                        </Link>
                    </div>
                    <nav className="flex gap-4 items-center">
                        <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                            ← Back to Home
                        </Link>
                        {id && (
                            <span className="glass-card px-3 py-1 text-sm text-gray-400">
                                ID: {id.substring(0, 8)}...
                            </span>
                        )}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="max-w-7xl mx-auto h-full">
                    {useMockData ? (
                        /* Demo Mode - No backend */
                        <div className="h-full grid lg:grid-cols-[1fr,350px] gap-6">
                            {/* Blueprint Viewer */}
                            <div className="glass-card p-6 flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-white">Blueprint View</h2>
                                    <div className="glass-card px-3 py-1 text-sm text-amber-400">
                                        Demo Mode
                                    </div>
                                </div>
                                <div className="flex-1 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <svg className="w-24 h-24 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <h3 className="text-xl font-bold text-white mb-2">No Blueprint Loaded</h3>
                                        <p className="text-gray-400 mb-4">
                                            Upload a blueprint from the home page to see live detection results
                                        </p>
                                        <Link to="/" className="btn-primary inline-block">
                                            Upload Blueprint
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <StatsPanel
                                    detections={detections}
                                    selectedClass={selectedClass}
                                    onSelectClass={setSelectedClass}
                                />
                                <ExportPanel detections={detections} blueprintId="demo" />
                            </div>
                        </div>
                    ) : loading || detecting ? (
                        /* Loading State */
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <svg className="animate-spin h-16 w-16 mx-auto mb-4 text-primary-500" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <p className="text-xl text-white font-semibold">
                                    {detecting ? 'Running detection...' : 'Loading...'}
                                </p>
                                <p className="text-gray-400 mt-2">This may take a few moments</p>
                            </div>
                        </div>
                    ) : error ? (
                        /* Error State */
                        <div className="h-full flex items-center justify-center">
                            <div className="glass-card p-8 max-w-md text-center border-red-500/50 bg-red-500/10">
                                <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-bold text-white mb-2">Error</h3>
                                <p className="text-red-400 mb-4">{error}</p>
                                <button onClick={fetchResults} className="btn-primary">
                                    Retry
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Results View */
                        <div className="h-full grid lg:grid-cols-[1fr,350px] gap-6">
                            {/* Blueprint Viewer with Overlay */}
                            <div className="glass-card p-6 flex flex-col min-h-[600px]">
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    {selectedClass ? `${selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)} View` : 'Full Blueprint View'}
                                </h2>
                                <div className="flex-1 relative">
                                    <BlueprintViewer
                                        imageUrl={`http://localhost:8000/blueprints/${id}`}
                                        detections={filteredDetections}
                                        onCanvasReady={handleCanvasReady}
                                    />
                                    <DetectionOverlay imageData={imageData} detections={filteredDetections} />
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <StatsPanel
                                    detections={detections}
                                    selectedClass={selectedClass}
                                    onSelectClass={setSelectedClass}
                                />
                                <ExportPanel detections={detections} blueprintId={id} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
