import React from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function LinksTable({ links, loading, onDeleted }) {
    const [copied, setCopied] = React.useState(null);

    const handleDelete = async (code) => {
        if (!confirm("Delete this link?")) return;
        await api.delete(`/api/links/${code}`);
        onDeleted(code);
    };

    const copy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 1500);
    };

    if (loading)
        return <div className="text-center p-6 text-white">Loading...</div>;

    if (!links.length)
        return (
            <div className="text-gray-400 p-6 text-center">
                No links yet — create one above.
            </div>
        );

    const BASE = import.meta.env.VITE_BASE_URL || "http://localhost:5173";

    return (
        <div className="grid gap-4">
            {links.map((link) => (
                <div
                    key={link.code}
                    className="bg-gray-800 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 
                           border border-gray-700 hover:border-gray-600"
                >
                    {/* MOBILE: Short Link on Top */}
                    <div className="block sm:hidden mb-2 text-sm text-sky-400 break-all">
                        {`${BASE}/${link.code}`}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        {/* LEFT SECTION */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">

                                {/* Code badge */}
                                <div className="font-mono text-sm px-3 py-1 rounded-lg 
                                            bg-gray-700 text-white border border-gray-600">
                                    {link.code}
                                </div>

                                {/* DESKTOP LINK */}
                                <div className="hidden sm:block text-sm text-gray-300 break-all max-w-[400px]">
                                    {`${BASE}/${link.code}`}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-2 flex gap-6 text-sm text-gray-400">
                                <div>
                                    Clicks:{" "}
                                    <span className="font-semibold text-white">
                                        {link.totalClicks}
                                    </span>
                                </div>

                                <div>
                                    Last:{" "}
                                    {link.lastClicked
                                        ? new Date(link.lastClicked).toLocaleString()
                                        : "-"}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT BUTTONS */}
                        <div className="flex items-center gap-3">
                            <a href={`${BASE}/${link.code}`} target="_blank">
                                <button
                                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 transition"
                                    title="Open"
                                >
                                    🔗
                                </button>
                            </a>

                            <Link to={`/code/${link.code}`}>
                                <button
                                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 transition"
                                    title="Stats"
                                >
                                    📊
                                </button>
                            </Link>

                            <button
                                onClick={() => copy(`${BASE}/${link.code}`)}
                                className="relative"
                                title="Copy"
                            >
                                <div className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 transition">
                                    📋
                                </div>

                                {copied === `${BASE}/${link.code}` && (
                                    <span className="absolute -top-8 right-0 bg-black text-white text-xs px-2 py-1 rounded shadow">
                                        Copied!
                                    </span>
                                )}
                            </button>

                            <button onClick={() => handleDelete(link.code)}>
                                <div className="p-2 rounded-lg bg-red-700 hover:bg-red-600 active:scale-95 transition">
                                    🗑️
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

}
