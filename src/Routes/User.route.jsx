import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Addresses,
  Cart,
  Checkout,
  CheckoutRetry,
  ForgotPassEmail,
  ForgotPassVerify,
  ForgotPassword,
  Home,
  Login,
  MyAccount,
  MyList,
  NotFound,
  OrderDetails,
  OrderFiled,
  Orders,
  ProductDetails,
  ProductListing,
  Register,
  Verify,
} from "../Pages/User";
import {
  Header,
  Footer,
  ProductDialogBox,
  ChatBot,
  EditProfile,
} from "../Components/User";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import RouteValidation from "../Components/Protected/RouteValidation";
import { userSessionCheck } from "../Utils/ProtectedRoute";
import MyAccountLayout from "../Layout/MyAccountLayout";
import UserProtected from "../Components/Protected/UserProtected";
import OrderSuccess from "../Pages/User/OrderSuccess";
import Wallet from "../Pages/User/Wallet";

const UserRouter = () => {
  const open = useSelector((state) => state.ui.modalOpen);
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/:category?/:subCategory?/:thirdCategory?"
          element={
            <RouteValidation>
              <ProductListing />
            </RouteValidation>
          }
        />
        <Route path="/search" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={userSessionCheck(<Login />)} />
        <Route path="/signUp" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route
          path="/password/forgot"
          element={userSessionCheck(<ForgotPassEmail />)}
        />
        <Route
          path="/password/forgot/verify"
          element={userSessionCheck(<ForgotPassVerify />)}
        />
        <Route
          path="/password/forgot/reset"
          element={userSessionCheck(<ForgotPassword />)}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/retry/:id" element={<CheckoutRetry />} />
        <Route path="/checkout/success" element={<OrderSuccess />} />
        <Route path="/checkout/failed" element={<OrderFiled />} />
        <Route element={<UserProtected />}>
          <Route element={<MyAccountLayout />}>
            <Route path="/myAccount" element={<MyAccount />} />
            <Route path="/address" element={<Addresses />} />
            <Route path="/myList" element={<MyList />} />
            <Route path="/myWallet" element={<Wallet />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/edit" element={<EditProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <ChatBot />
      <Footer />
      {open && <ProductDialogBox />}
    </>
  );
};

export default UserRouter;
