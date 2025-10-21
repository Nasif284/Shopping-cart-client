import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminSessionCheck = ({children}) => {
  const { admin, isLoading } = useSelector((state) => state.adminAuth);
  console.log(admin);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!admin) {
    return children;
  } else {
    return <Navigate to="/admin/" replace />;
  }
};

export default AdminSessionCheck;
