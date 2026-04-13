import {createBrowserRouter} from "react-router";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1> Hello World</h1>
    },
    {
        path : "/register",
        element : <Register></Register>
    },
    {
        path : "/login",
        element : <Login></Login>
    }
])