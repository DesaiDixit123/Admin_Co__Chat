import React from 'react'
import AllRoutes from './routes/AllRoutes'
import { Toaster } from 'react-hot-toast'
const App = () => {
  return (
    <>
      <AllRoutes />
      <Toaster />
    </>
  )
}

export default App