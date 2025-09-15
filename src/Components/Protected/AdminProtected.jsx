import React from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtected = () => {
  const { admin, isLoading } = useSelector((state) => state.adminAuth);
  console.log(admin);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (admin && admin._id) {
    return <Outlet />;
  } else {
    toast.error("Please Login");
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminProtected;
