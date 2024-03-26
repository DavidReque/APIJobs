'use client'
import axios from 'axios'
import { useState, FormEvent } from 'react'

export default function Register () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const res = await axios.post('http://localhost:1234/register', {
        username, password
      })
      console.log(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
      <form action='/register' className="shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit} >
        <label className="block text-gray-100 text-sm font-bold mb-2">
        Nombre de usuario:
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label className="block text-gray-100 text-sm font-bold mb-2">
        Contraseña:
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <input className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer" type="submit" value="Registrarse" />
      </form>
  )
}
