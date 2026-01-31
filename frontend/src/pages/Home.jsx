import { Link } from 'react-router-dom'
import UploadZone from '../components/UploadZone'

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="p-6 glass-card mx-6 mt-6 rounded-2xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold gradient-text">Blueprint AI</h1>
                    </div>
                    <nav className="flex gap-4">
                        <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-6xl w-full">
                    <div className="text-center mb-12 animate-in">
                        <h2 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="gradient-text">AI-Powered</span>
                            <br />
                            Blueprint Analysis
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
                            Automatically detect and analyze architectural elements in your blueprints
                            using advanced machine learning
                        </p>
                        <p className="text-gray-500">
                            Identify walls, doors, windows, and rooms with high confidence
                        </p>
                    </div>

                    {/* Upload Zone */}
                    <div className="mb-16 animate-in" style={{ animationDelay: '0.2s' }}>
                        <UploadZone />
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12 animate-in" style={{ animationDelay: '0.4s' }}>
                        {/* Feature 1 */}
                        <div className="glass-card-hover p-6 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Fast Detection</h3>
                            <p className="text-gray-400">
                                Get results in seconds with our optimized YOLOv8 model
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-card-hover p-6 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Detailed Analytics</h3>
                            <p className="text-gray-400">
                                View comprehensive statistics and element breakdowns
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-card-hover p-6 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Easy Export</h3>
                            <p className="text-gray-400">
                                Download results as JSON or annotated images
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-gray-500 text-sm">
                <p>Blueprint Detection & Analysis System • Built with React + YOLOv8</p>
            </footer>
        </div>
    )
}
