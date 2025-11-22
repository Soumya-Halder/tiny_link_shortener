import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { QRCodeCanvas } from 'qrcode.react'

export default function Stats() {
    const { code } = useParams()
    const [link, setLink] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const f = async () => {
            try {
                const res = await api.get(`/api/links/${code}`)
                setLink(res.data)
            } catch (err) {
                setLink(null)
            } finally { setLoading(false) }
        }
        f()
    }, [code])

    if (loading) return <div className="p-10 text-center dark:text-white">Loading...</div>
    if (!link) return <div className="text-red-600 p-6 ">Not found</div>

    const FRONT = (import.meta.env.VITE_API_BASE || 'http://localhost:4000')

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start gap-6">
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-2 dark:text-white">{link.code}</h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 break-all line-clamp-2 max-w-full" title={link.targetUrl}>{link.targetUrl}</div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-white">Total Clicks</div>
                                <div className="text-lg font-bold dark:text-white">{link.totalClicks}</div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xs text-gray-500 ">Last Clicked</div>
                                <div className="text-lg dark:text-white">{link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '-'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <div className="qr-frame">
                            <QRCodeCanvas value={`${FRONT}/${link.code}`} size={160} />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <a href={`${FRONT}/${link.code}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-sky-600 text-white">Open live</a>
                    {/* <a href={`${FRONT}/${link.code}.png`} className="px-4 py-2 rounded-lg border">Download PNG</a> */}
                </div>
            </div>
        </div>
    )
}
