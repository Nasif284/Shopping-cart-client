import React from "react";
import { Outlet } from "react-router-dom";
import { UserSidebar } from "../Components/User";

const MyAccountLayout = () => {
  return (
    <section className="py-10 w-full">
      <div className="container flex gap-5">
        <UserSidebar />
        <Outlet />
      </div>
    </section>
  );
};

export default MyAccountLayout;
