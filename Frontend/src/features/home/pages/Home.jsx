/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { setUser } from '../../auth/state/auth.slice'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const Home = () => {
    const { user } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Try to fetch current user if not already in redux
        if (!user) {
            fetchCurrentUser()
        } else {
            setLoading(false)
        }
    }, [user])

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
                withCredentials: true
            })
            
            if (response.data.success) {
                dispatch(setUser(response.data.user))
            }
        } catch (error) {
            console.log('No user logged in, showing guest view')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white">
            {/* Navigation Bar */}
            <nav className="bg-[#131313] border-b border-[#1c1b1b] px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#FFD700] tracking-widest">SNITCH.</h2>
                <div className="flex gap-6">
                    {user ? (
                        <>
                            <span className="text-[#d0c6ab]">Welcome, {user.fullname}!</span>
                            <button className="text-[#999077] hover:text-[#FFD700] transition-colors">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => navigate('/login')}
                                className="text-[#999077] hover:text-[#FFD700] transition-colors"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => navigate('/register')}
                                className="bg-gradient-to-r from-[#e9c400] to-[#ffd700] text-[#131313] px-6 py-2 rounded font-bold hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
                <div className="text-center max-w-3xl">
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 text-white">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e9c400] to-[#ffd700]">Snitch</span>
                    </h1>
                    <p className="text-xl text-[#d0c6ab] mb-8 leading-relaxed">
                        {user 
                            ? `You're authenticated! Welcome back, ${user.fullname}.` 
                            : 'Join the exclusive movement redefining modern fashion. Sign in or create an account to get started.'}
                    </p>
                    
                    {!user && (
                        <div className="flex gap-4 justify-center">
                            <button 
                                onClick={() => navigate('/login')}
                                className="bg-gradient-to-r from-[#e9c400] to-[#ffd700] text-[#131313] px-8 py-4 rounded font-bold hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => navigate('/register')}
                                className="border-2 border-[#FFD700] text-[#FFD700] px-8 py-4 rounded font-bold hover:bg-[#FFD700] hover:text-[#131313] transition-all"
                            >
                                Create Account
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home
