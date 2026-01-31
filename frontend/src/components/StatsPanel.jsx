import { useMemo } from 'react'
import { getColorForLabel } from '../utils/drawBoxes'

export default function StatsPanel({ detections = [], selectedClass, onSelectClass }) {
    const stats = useMemo(() => {
        // ... (existing memo logic)
        if (!detections || detections.length === 0) {
            return {
                total: 0,
                byType: {},
                avgConfidence: 0
            }
        }

        const byType = {}
        let totalConfidence = 0

        detections.forEach(det => {
            const label = det.label.toLowerCase()
            byType[label] = (byType[label] || 0) + 1
            totalConfidence += det.confidence
        })

        return {
            total: detections.length,
            byType,
            avgConfidence: detections.length > 0 ? totalConfidence / detections.length : 0
        }
    }, [detections])

    return (
        <div className="glass-card p-6 space-y-6">
            <h2 className="text-2xl font-bold gradient-text">Detection Statistics</h2>

            {/* Total Detections */}
            <div
                className={`glass-card p-4 border-primary-500/30 cursor-pointer transition-colors ${!selectedClass ? 'bg-primary-500/20 ring-1 ring-primary-500' : 'hover:bg-white/5'}`}
                onClick={() => onSelectClass && onSelectClass(null)}
            >
                <p className="text-sm text-gray-400 mb-1">Total Detections</p>
                <div className="flex justify-between items-end">
                    <p className="text-4xl font-bold text-white">{stats.total}</p>
                    {!selectedClass && <span className="text-xs text-primary-400">Showing All</span>}
                </div>
            </div>

            {/* Average Confidence */}
            <div className="glass-card p-4 border-purple-500/30">
                <p className="text-sm text-gray-400 mb-1">Avg. Confidence</p>
                <p className="text-4xl font-bold gradient-text">
                    {(stats.avgConfidence * 100).toFixed(1)}%
                </p>
            </div>

            {/* Detections by Type */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">By Element Type</h3>
                    <span className="text-xs text-gray-400">Click to filter</span>
                </div>
                <div className="space-y-3">
                    {Object.entries(stats.byType).map(([label, count]) => {
                        const color = getColorForLabel(label)
                        const percentage = (count / stats.total) * 100
                        const isSelected = selectedClass && selectedClass.toLowerCase() === label.toLowerCase()

                        return (
                            <div
                                key={label}
                                className={`space-y-2 p-3 -mx-3 rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'}`}
                                onClick={() => onSelectClass && onSelectClass(isSelected ? null : label)}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                        <span className="text-white capitalize font-medium">{label}</span>
                                    </div>
                                    <span className="text-gray-400 font-semibold">{count}</span>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            backgroundColor: color,
                                            width: `${percentage}%`
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Detailed Detections List */}
            <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">All Detections</h3>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {detections.map((det, index) => (
                        <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: getColorForLabel(det.label) }}
                                />
                                <span className="text-gray-300 capitalize text-sm">
                                    {det.label}
                                </span>
                            </div>
                            <span className="text-sm font-mono text-primary-400">
                                {(det.confidence * 100).toFixed(0)}%
                            </span>
                        </div>
                    ))}
                    {detections.length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-4">
                            No detections found
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
