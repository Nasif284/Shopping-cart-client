import React from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader, AdminSidebar } from ".";

const AdminLayout = ({ showSidebar, setShowSidebar }) => {
  return (
    <section className="main">
      <AdminHeader setShow={setShowSidebar} show={showSidebar} />
      <div className="contentMain flex">
        <div
          className={`sidebarWrapper transition-all duration-300 ${showSidebar ? "w-[18%]" : "w-[0px] overflow-hidden"}`}
        >
          <AdminSidebar show={showSidebar} setShow={setShowSidebar} />
        </div>
        <div
          className={`rightContent transition-all duration-300 py-4 mt-[50px] px-5 ${showSidebar ? "w-[78%]" : "w-full"}`}
        >
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default AdminLayout;
