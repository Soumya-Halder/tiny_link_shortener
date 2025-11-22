import React from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

export default function LinksTable({ links, loading, onDeleted }) {
    const [copied, setCopied] = React.useState(null);

    const handleDelete = async (code) => {
        if (!confirm('Delete this link?')) return
        await api.delete(`/api/links/${code}`)
        onDeleted(code)
    }

    const copy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000); // hide after 1 sec
    };


    if (loading) return <div className="text-center p-6 dark:text-white">Loading...</div>
    if (!links.length) return <div className="text-gray-500 p-6">No links yet — create one above.</div>

    const BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:4000')

    return (
        <div className="grid gap-4">
            {links.map(link => (
                <div key={link.code} className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center justify-between card-hover">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                            <div className="font-mono text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white">{link.code}</div>
                            <div className="text-sm text-gray-700 dark:text-gray-200 truncate break-words max-w-[250px]">{`${BASE}/${link.code}`}</div>
                        </div>

                        <div className="mt-2 flex gap-4 items-center text-sm text-gray-500 dark:text-white-400">
                            <div>Clicks: <span className="font-medium text-gray-800 dark:text-white">{link.totalClicks}</span></div>
                            <div>Last: {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '-'}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        <a href={`${BASE}/${link.code}`} target="_blank" rel="noreferrer" title="Open (redirect)">
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg className="w-5 h-5 text-sky-600" viewBox="0 0 24 24" fill="none"><path d="M14 3h7v7M10 14l11-11M21 21H3V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                            </button>
                        </a>

                        <Link to={`/code/${link.code}`} title="Stats">
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M7 13v5M12 9v9M17 5v13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                            </button>
                        </Link>

                        <button
                            onClick={() => copy(`${BASE}/${link.code}`)}
                            title="Copy"
                            className="relative"
                        >
                            <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 12h6M9 16h6M9 8h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                            </div>

                            {copied === `${BASE}/${link.code}` && (
                                <span className="absolute -top-7 right-0 bg-black text-white text-xs px-2 py-1 rounded shadow">
                                    Copied!
                                </span>
                            )}
                        </button>


                        <button onClick={() => handleDelete(link.code)} title="Delete">
                            <div className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-700">
                                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M9 6v12a2 2 0 002 2h2a2 2 0 002-2V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                            </div>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
