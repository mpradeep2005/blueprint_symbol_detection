import { useMemo } from 'react'
import { getColorForLabel } from '../utils/drawBoxes'

export default function StatsPanel({ detections = [] }) {
    const stats = useMemo(() => {
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
            <div className="glass-card p-4 border-primary-500/30">
                <p className="text-sm text-gray-400 mb-1">Total Detections</p>
                <p className="text-4xl font-bold text-white">{stats.total}</p>
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
                <h3 className="text-lg font-semibold text-white mb-4">By Element Type</h3>
                <div className="space-y-3">
                    {Object.entries(stats.byType).map(([label, count]) => {
                        const color = getColorForLabel(label)
                        const percentage = (count / stats.total) * 100

                        return (
                            <div key={label} className="space-y-2">
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

            {/* Legend */}
            <div className="pt-4 border-t border-white/10">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Color Legend</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    {['wall', 'door', 'window', 'room'].map(label => (
                        <div key={label} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getColorForLabel(label) }}
                            />
                            <span className="text-gray-300 capitalize">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
