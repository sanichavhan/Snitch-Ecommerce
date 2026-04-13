import React from 'react'
import { RouterProvider } from 'react-router'
import {routes} from './app.routes'
import './app.css'
const App = () => {
  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  )
}

export default App
