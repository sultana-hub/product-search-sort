import React from "react";
import {Navigate,Outlet} from 'react-router-dom'

const ProtectedRoute=()=>{
    const isAuthentication= window.sessionStorage.getItem("token")
    return isAuthentication?<Outlet/>:<Navigate to ='/error'/>
};
export default ProtectedRoute