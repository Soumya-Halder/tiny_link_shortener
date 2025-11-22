import React, { useState } from 'react'
import api from '../api'

export default function LinkForm({ onCreated }) {
    const [targetUrl, setTargetUrl] = useState('')
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const submit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const res = await api.post('/api/links', { targetUrl, code: code || undefined })
            onCreated(res.data)
            setTargetUrl('')
            setCode('')
        } catch (err) {
            setError(err.response?.data?.error || 'Unknown error')
        } finally { setLoading(false) }
    }

    return (
        <form onSubmit={submit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Create a Short Link</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="md:col-span-2 input-wrapper relative">
                    <input
                        type="url"
                        placeholder=" "
                        value={targetUrl}
                        onChange={e => setTargetUrl(e.target.value)}
                        className="input-field w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="input-label text-gray-500 dark:text-gray-300">Long URL (include https://)</label>
                </div>

                <div className="input-wrapper relative">
                    <input
                        placeholder=" "
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        className="input-field w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <label className="input-label text-gray-500 dark:text-gray-300">Custom code (optional)</label>
                </div>

                <div className="md:col-span-3 flex justify-end">
                    <button
                        disabled={loading}
                        className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-3 rounded-xl shadow"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>

            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
            <div className="mt-3 text-xs text-gray-500">Codes must be 6–8 alphanumeric characters.</div>
        </form>
    )
}
