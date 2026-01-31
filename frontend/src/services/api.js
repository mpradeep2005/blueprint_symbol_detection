import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
})

// API methods for blueprint detection
export const blueprintAPI = {
    /**
     * Upload a blueprint image
     * @param {File} file - The blueprint image file
     * @returns {Promise} Response with upload ID
     */
    uploadBlueprint: async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },

    /**
     * Run detection on uploaded blueprint
     * @param {string} id - The blueprint ID from upload
     * @returns {Promise} Response with detection status
     */
    detectElements: async (id) => {
        const response = await api.post(`/detect/${id}`)
        return response.data
    },

    /**
     * Get detection results
     * @param {string} id - The blueprint ID
     * @returns {Promise} Response with detection results
     */
    getResults: async (id) => {
        const response = await api.get(`/results/${id}`)
        return response.data
    },
}

// Error handling interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)

export default api
