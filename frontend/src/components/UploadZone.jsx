import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { blueprintAPI } from '../services/api'

export default function UploadZone() {
    const [isDragging, setIsDragging] = useState(false)
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleDragEnter = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if (!validTypes.includes(file.type)) {
            setError('Please upload a JPG or PNG image')
            return false
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError('File size must be less than 10MB')
            return false
        }
        setError(null)
        return true
    }

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && validateFile(droppedFile)) {
            setFile(droppedFile)
        }
    }, [])

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile && validateFile(selectedFile)) {
            setFile(selectedFile)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        setError(null)

        try {
            const response = await blueprintAPI.uploadBlueprint(file)
            // Navigate to dashboard with the blueprint ID
            navigate(`/dashboard/${response.id}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
          relative glass-card p-12 text-center transition-all duration-300
          ${isDragging ? 'border-primary-500 bg-primary-500/10 scale-[1.02]' : 'border-white/10'}
          ${file ? 'border-green-500/50 bg-green-500/5' : ''}
        `}
            >
                {/* Upload Icon */}
                <div className="mb-6">
                    <svg
                        className={`w-20 h-20 mx-auto transition-all duration-300 ${isDragging ? 'text-primary-400 scale-110' : 'text-gray-400'
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                </div>

                {/* Upload Text */}
                <div className="mb-6">
                    {file ? (
                        <div className="animate-in">
                            <p className="text-2xl font-bold gradient-text mb-2">
                                {file.name}
                            </p>
                            <p className="text-gray-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-2xl font-bold text-white mb-2">
                                {isDragging ? 'Drop your blueprint here' : 'Upload Blueprint'}
                            </p>
                            <p className="text-gray-400">
                                Drag and drop or click to select
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Supports JPG, PNG (max 10MB)
                            </p>
                        </>
                    )}
                </div>

                {/* Hidden file input */}
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                />

                {/* Upload Button */}
                <div className="flex gap-4 justify-center">
                    {!file ? (
                        <label htmlFor="file-upload" className="btn-primary cursor-pointer">
                            Select File
                        </label>
                    ) : (
                        <>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                                        Uploading...
                                    </span>
                                ) : (
                                    'Analyze Blueprint'
                                )}
                            </button>
                            <label htmlFor="file-upload" className="btn-secondary cursor-pointer">
                                Change File
                            </label>
                        </>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-6 p-4 glass-card border-red-500/50 bg-red-500/10 animate-in">
                        <p className="text-red-400 font-medium">{error}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
