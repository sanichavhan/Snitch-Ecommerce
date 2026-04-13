import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const authApiInstance = axios.create({
    baseURL : `${API_BASE_URL}/api/auth`,
    withCredentials : true
})

export async function register({email, contact, password, fullname,isSeller}) {
    const response = await authApiInstance.post('/register', {
        email,
        contact,
        password,
        fullname,
        isSeller
    })
    return response.data
}
export async function login({email, password}) {
    const response = await authApiInstance.post('/login', {
        email,
        password
    })
    return response.data
}

export async function googleLogin() {
    try{
        window.location.href = `${API_BASE_URL}/api/auth/google`
    }
    catch (error) {
        console.error("Google login failed:", error)
        throw error
    }   
}

export async function getCurrentUser() {
    try {
        const response = await authApiInstance.get('/me')
        return response.data
    } catch (error) {
        console.error("Error fetching current user:", error)
        throw error
    }
}