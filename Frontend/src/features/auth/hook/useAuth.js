/* eslint-disable no-unused-vars */
import { setUser, setLoading, setError } from "../state/auth.slice"
import { register,login } from "../service/auth.api"
import { useDispatch } from "react-redux"

export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister({email, contact, password, fullname,isSeller = false}) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await register({email, contact, password, fullname,isSeller}) 
            dispatch(setUser(data.user))
            dispatch(setLoading(false))
            return data
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Registration failed"
            dispatch(setError(errorMsg))
            dispatch(setLoading(false))
            throw error
        }
    }
    async function handleLogin({email, password}) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await login({email, password}) 
            dispatch(setUser(data.user))
            dispatch(setLoading(false))
            return data
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Login failed"
            dispatch(setError(errorMsg))
            dispatch(setLoading(false))
            throw error
        }
    }
    return { handleRegister, handleLogin }
}



