import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Cart,
  Checkout,
  ForgotPassEmail,
  ForgotPassVerify,
  ForgotPassword,
  Home,
  Login,
  MyAccount,
  MyList,
  NotFound,
  Orders,
  ProductDetails,
  ProductListing,
  Register,
  Verify,
} from "../Pages/User";
import { Header, Footer, ProductDialogBox, ChatBot } from "../Components/User";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const UserRouter = () => {
  const open = useSelector((state) => state.ui.modalOpen);
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/:category?/:subCategory?/:thirdCategory?"
          element={<ProductListing />}
        />
        <Route path="/search" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/password/forgot" element={<ForgotPassEmail />} />
        <Route path="/password/forgot/verify" element={<ForgotPassVerify />} />
        <Route path="/password/forgot/reset" element={<ForgotPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/myAccount" element={<MyAccount />} />
        <Route path="/myList" element={<MyList />} />
        <Route path="/orders" element={<Orders />} />
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
