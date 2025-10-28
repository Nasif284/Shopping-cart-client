import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  AddCategory,
  AddHomeSlides,
  AddProducts,
  AddSubCategory,
  AdminLogin,
  CategoryList,
  Dashboard,
  HomeSlides,
  Products,
  Users,
  AdminOrders,
  SubCategoryList,
  AddSize,
  BannersList1,
  BannersList2,
  AddBanner,
  ProductDetails,
  OrderDetails,
  ReturnRequests,
} from "../Pages/Admin";
import { AdminLayout } from "../Components/Admin";
import { Toaster } from "react-hot-toast";
import { NotFound } from "../Pages/User";
import AdminProtected from "../Components/Protected/AdminProtected";
import { adminSessionCheck } from "../Utils/ProtectedRoute";
import OrderItemDetails from "../Pages/Admin/OrderItemDetails";
import CategoryOffer from "../Pages/Admin/CategoryOffer";
import GlobalOffer from "../Pages/Admin/GlobalOffer";
import Coupons from "../Pages/Admin/Coupens";
const AdminRouter = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <>
      <Routes>
        <Route path="/login" element={adminSessionCheck(<AdminLogin />)} />
        <Route element={<AdminProtected />}>
          <Route
            path="/"
            element={
              <AdminLayout
                setShowSidebar={setShowSidebar}
                showSidebar={showSidebar}
              />
            }
          >
            <Route
              index
              element={
                <Dashboard setShow={setShowSidebar} show={showSidebar} />
              }
            />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProducts />} />
            <Route path="products/size" element={<AddSize />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="homeSlides" element={<HomeSlides />} />
            <Route path="homeSlides/add" element={<AddHomeSlides />} />
            <Route path="category/main/list" element={<CategoryList />} />
            <Route path="category/sub/list" element={<SubCategoryList />} />
            <Route path="category/main/add" element={<AddCategory />} />
            <Route path="category/sub/add" element={<AddSubCategory />} />
            <Route path="offers" element={<GlobalOffer />} />
            <Route path="offers/category/" element={<CategoryOffer />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="orders/items/:id" element={<OrderItemDetails />} />
            <Route path="orders/return/requests" element={<ReturnRequests />} />
            <Route path="banner1" element={<BannersList1 />} />
            <Route path="banner1/add" element={<AddBanner />} />
            <Route path="banner2" element={<BannersList2 />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
};

export default AdminRouter;
