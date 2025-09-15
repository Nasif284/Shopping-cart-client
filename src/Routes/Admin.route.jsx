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
} from "../Pages/Admin";
import { AdminLayout } from "../Components/Admin";
import { Toaster } from "react-hot-toast";
import { NotFound } from "../Pages/User";
import AdminProtected from "../Components/Protected/AdminProtected";

const AdminRouter = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route element={<AdminProtected />}>
          <Route
            path="/*"
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
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<AdminOrders />} />
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
