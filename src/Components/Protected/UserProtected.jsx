import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const UserProtected = () => {
  const { user, isLoading } = useSelector((state) => state.userAuth);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (user) {
    return <Outlet />;
  } else {
    toast.error("Please Login");
    return <Navigate to="/login" replace />;
  }
};

export default UserProtected;
