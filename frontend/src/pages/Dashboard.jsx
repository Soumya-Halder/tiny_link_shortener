import React, { useEffect, useState } from 'react'
import api from '../api'
import LinkForm from '../components/LinkForm'
import LinksTable from '../components/LinksTable'


export default function Dashboard() {
    const [links, setLinks] = useState([])
    const [loading, setLoading] = useState(false)


    const fetchLinks = async () => {
        setLoading(true)
        const res = await api.get('/api/links')
        setLinks(res.data)
        setLoading(false)
    }


    useEffect(() => {
        fetchLinks()
    }, [])


    const handleCreated = (newLink) => setLinks(prev => [newLink, ...prev])
    const handleDeleted = (code) => setLinks(prev => prev.filter(l => l.code !== code))


    return (
        <div>
            <div className="mb-6">
                <LinkForm onCreated={handleCreated} />
            </div>


            <div>
                <LinksTable links={links} loading={loading} onDeleted={handleDeleted} />
            </div>
        </div>
    )
}