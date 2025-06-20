import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// import Home from '../pages/Home'
const Home = lazy(() => import('../pages/Home'))
import CreateProduct from '../pages/CreateProduct'
import UpdateProduct from '../pages/UpdateProduct'
import ProductsDetails from '../pages/ProductsDetails'
import Header from '../layout/Header'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from './isAuth'
import { Box, CircularProgress,Typography  } from '@mui/material';
const Error = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import('../pages/Error')))
  }, 2000)
})

// import Footer from '../layout/Footer'
const Routing = () => {
  return (
    <div>
      <Router>
        <Header />
        <Suspense fallback={
          <Box textAlign="center" mt={5}>
            <Typography variant="h3" gutterBottom>
              Loading...
            </Typography>

            <Box display="flex" justifyContent="center" gap={2}>
              <CircularProgress color="primary" />
              <CircularProgress color="secondary" />
              <CircularProgress color="success" />
            </Box>
          </Box>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details/:id" element={<ProductsDetails />} />
             <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute/>}>
            <Route path="/create" element={<CreateProduct />} />
            <Route path="/update/:id" element={<UpdateProduct />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="/error" element={<Error />} />
          </Routes>
        </Suspense>
        {/* <Footer/> */}
      </Router>
    </div>
  )
}

export default Routing