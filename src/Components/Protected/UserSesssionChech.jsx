import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserSessionCheck = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.userAuth);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default UserSessionCheck;
