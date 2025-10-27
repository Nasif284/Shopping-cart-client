import "./App.css";
import UserRouter from "./Routes/User.route";
import AdminRouter from "./Routes/Admin.route";
import { useAuthMeQuery, useLogoutMutation } from "./Store/Api/user/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  clearUser,
  setUser,
  setUserLoading,
} from "./Store/StoreSlices/userAuthSlice";
import { Route, Routes } from "react-router-dom";
import { useAdminAuthMeQuery } from "./Store/Api/admin/auth";
import {
  clearAdmin,
  setAdmin,
  setAdminLoading,
} from "./Store/StoreSlices/adminAuthSlice";
import { NotFound } from "./Pages/User";
import socket from "./WebSocket/socket";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { useAddToCartMutation } from "./Store/Api/user/cart";

function App() {
  const [add, { isLoading: cartLoading }] = useAddToCartMutation();
  const userAuth = useAuthMeQuery();
  const adminAuth = useAdminAuthMeQuery();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userAuth.isLoading) {
      dispatch(setUserLoading(true));
    } else {
      dispatch(setUserLoading(false));
    }
    if (userAuth.isSuccess && userAuth.data?.user) {
      dispatch(setUser(userAuth.data.user));
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const uploadToCart = async (storedCart) => {
        await add(storedCart).unwrap();
      };
      if (storedCart?.length) {
        uploadToCart(storedCart);
        localStorage.removeItem("cart");
      }
      console.log("Registering user with socket:", userAuth.data.user._id);
      socket.emit("registerUser", userAuth.data.user._id);
    } else if (userAuth.isError) {
      dispatch(clearUser());
    }
  }, [userAuth.isSuccess, userAuth.isError, userAuth.data, dispatch]);
  useEffect(() => {
    if (adminAuth.isLoading) {
      dispatch(setAdminLoading(true));
    } else {
      dispatch(setAdminLoading(false));
    }
    if (adminAuth.data?.user) {
      dispatch(setAdmin(adminAuth.data.user));
    } else if (adminAuth.error) {
      dispatch(clearAdmin());
    }
  }, [adminAuth.data, adminAuth.error, dispatch]);

  useEffect(() => {
    const handleForceLogout = async () => {
      dispatch(clearUser());
      await logout().unwrap();
      toast.error("You have been blocked by admin.");
    };
    socket.on("forceLogout", handleForceLogout);
    return () => {
      socket.off("forceLogout", handleForceLogout);
    };
  }, [dispatch, logout]);

  const isLoading = userAuth.isLoading || adminAuth.isLoading || cartLoading;
  if (isLoading)
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <CircularProgress color="inherit" />
      </div>
    );

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/*" element={<UserRouter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
