'use client'
import axios from 'axios'
import { useState, useEffect } from 'react'

interface Job {
    id: number
    title: string
    description: string
    location: string
    salary: string
    date_posted: string
  }

export default function Register () {
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token')
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const res = await axios.get<Job[]>('http://localhost:1234/jobs', config)
        setJobs(res.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchJobs()
  }, [])
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {jobs.map((job) => (
        <div key={job.id} className="shadow rounded p-4 mb-4">
          <h2 className="text-xl font-bold">{job.title}</h2>
          <p>{job.description}</p>
          <p className="text-sm text-gray-500">Ubicación: {job.location}</p>
          <p className="text-sm text-gray-500">Salario: ${job.salary}</p>
          <p className="text-sm text-gray-500">Fecha de publicación: {new Date(job.date_posted).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}
