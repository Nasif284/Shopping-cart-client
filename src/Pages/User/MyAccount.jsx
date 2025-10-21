import { useSelector } from "react-redux";
import { CircularProgress, } from "@mui/material";
const MyAccount = () => {
  const { user, isLoading } = useSelector((state) => state.userAuth);
  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <CircularProgress color="inherit" />
      </div>
    );
  }
  return (
    <div className="col2 w-[50%]">
      <div className="card bg-white p-5 shadow-md rounded-md ">
        <div className="w-full flex p-3 justify-between border-b border-[rgba(0,0,0,0.1)]">
          <h2>My Profile</h2>
        </div>
        <div className="p-6">
          <ul className="divide-y divide-gray-100">
            <li className="py-4 flex justify-between">
              <span className="font-medium text-gray-600">Full Name</span>
              <span className="text-gray-900">{user.name}</span>
            </li>
            <li className="py-4 flex justify-between">
              <span className="font-medium text-gray-600">Email</span>
              <span className="text-gray-900">{user.email}</span>
            </li>
            <li className="py-4 flex justify-between">
              <span className="font-medium text-gray-600">Mobile</span>
              <span className="text-gray-900">{user.mobile || "—"}</span>
            </li>
              <li className="py-4 flex justify-between">
                <span className="font-medium text-gray-600">Referral Code</span>
                <span className="text-gray-900">{user?.referralCode || "—"}</span>
              </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
