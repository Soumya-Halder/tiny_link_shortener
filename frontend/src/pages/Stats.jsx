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
        <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">

                {/* MAIN FLEX → STACK ON MOBILE */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">

                    {/* LEFT SIDE */}
                    <div className="flex-1 w-full">
                        <h2 className="text-2xl font-semibold mb-2 dark:text-white">{link.code}</h2>

                        <div
                            className="text-sm text-gray-600 dark:text-gray-300 break-all max-w-full"
                            title={link.targetUrl}
                        >
                            {link.targetUrl}
                        </div>

                        {/* STATS BOXES */}
                        <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-white">Total Clicks</div>
                                <div className="text-lg font-bold dark:text-white">{link.totalClicks}</div>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-white">Last Clicked</div>
                                <div className="text-lg dark:text-white">
                                    {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "-"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR CODE — MOVES BELOW ON MOBILE */}
                    <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:block">
                        <div className="qr-frame bg-white p-2 rounded-lg shadow">
                            <QRCodeCanvas value={`${FRONT}/${link.code}`} size={160} />
                        </div>
                    </div>

                </div>

                <div className="mt-6 flex gap-3">
                    <a
                        href={`${FRONT}/${link.code}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg bg-sky-600 text-white"
                    >
                        Open live
                    </a>
                </div>

            </div>
        </div>
    );

}
