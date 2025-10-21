import { Button } from "@mui/material";
import React, { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { FaRegImages } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";
import { RiProductHuntLine, RiCouponLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { IoBagCheckOutline, IoLogOutOutline } from "react-icons/io5";
import { IoMdImages } from "react-icons/io";
import { SiBloglovin } from "react-icons/si";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { Collapse } from "react-collapse";
import { Link } from "react-router-dom";
import DropdownButton from "./DropdownButton";
import { MdOutlineLocalOffer } from "react-icons/md";
const Sidebar = ({ show }) => {
  const [collIndex, setCollIndex] = useState(null);
  const openCollapse = (index) => {
    if (index === collIndex) {
      setCollIndex(null);
    } else {
      setCollIndex(index);
    }
  };
  return (
    <div
      className={`sidebar transition-all duration-400 fixed z-[100] top-0 ${show ? "left-0 " : "-left-100"} w-[18%] h-full bg-white border-r border-[rgba(0,0,0,0.1)] py-2 px-2`}
    >
      <div className="  w-full flex items-center justify-center py-2">
        <h1 className="text-[25px] text-center font-[600] text-[#ff5252]">
          Shopping Cart
        </h1>
      </div>
      <ul className="pl-4 mt-4">
        <li>
          <Link to={"/admin"}>
            <Button className="!w-full !items-center !py-2 !capitalize !justify-start !flex !gap-3 !text-[15px] !text-[rgba(0,0,0,0.8)] !font-[500]">
              <RxDashboard className="!text-[18px]" />
              <span>Dashboard</span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to={"/admin/homeSlides"}>
            <Button
              onClick={() => openCollapse(1)}
              className="!w-full !items-center !py-2 !capitalize !justify-start !flex !gap-3 !text-[15px] !text-[rgba(0,0,0,0.8)] !font-[500]"
            >
              <FaRegImages className="!text-[18px]" />
              <span>Home Slides</span>
              {collIndex == 1 ? (
                <FaAngleUp className="ml-auto" />
              ) : (
                <FaAngleDown className="ml-auto" />
              )}
            </Button>
          </Link>
          <Collapse isOpened={collIndex === 1}>
            <ul className="w-full ">
              <DropdownButton
                title={"Home Slides List"}
                link="/admin/homeSlides"
              />
              <DropdownButton
                title={"Add Home Banner Slides"}
                link="/admin/homeSlides/add"
              />
            </ul>
          </Collapse>
        </li>

        <li>
          <Link link="/admin/category/list">
            <Button
              onClick={() => openCollapse(2)}
              className="!w-full !items-center !py-2 !capitalize !justify-start !flex !gap-3 !text-[15px] !text-[rgba(0,0,0,0.8)] !font-[500]"
            >
              <MdOutlineCategory className="!text-[18px]" />
              <span>Category</span>
              {collIndex == 2 ? (
                <FaAngleUp className="ml-auto" />
              ) : (
                <FaAngleDown className="ml-auto" />
              )}
            </Button>
          </Link>
          <Collapse isOpened={collIndex === 2}>
            <ul className="w-full ">
              <DropdownButton
                title={"Category List"}
                link={"/admin/category/main/list"}
              />
              <DropdownButton
                title={"Add a Category"}
                link={"/admin/category/main/add"}
              />
              <DropdownButton
                title={"Sub Category List"}
                link={"/admin/category/sub/list"}
              />
              <DropdownButton
                title={"Add a Sub Category"}
                link={"/admin/category/sub/add"}
              />
              <DropdownButton
                title={"Category Offer"}
                link={"/admin/offers/category"}
              />
            </ul>
          </Collapse>
        </li>
        <li>
          <Link to={"/admin/products"}>
            <Button
              onClick={() => openCollapse(3)}
              className="!w-full !items-center !py-2 !capitalize !justify-start !flex !gap-3 !text-[15px] !text-[rgba(0,0,0,0.8)] !font-[500]"
            >
              <RiProductHuntLine className="!text-[18px]" />
              <span>Products</span>
              {collIndex == 3 ? (
                <FaAngleUp className="ml-auto" />
              ) : (
                <FaAngleDown className="ml-auto" />
              )}
            </Button>
          </Link>
          <Collapse isOpened={collIndex === 3}>
            <ul className="w-full ">
              <DropdownButton title={"Product List"} link={"/admin/products"} />
              <DropdownButton
                title={"Product Upload"}
                link={"/admin/products/add"}
              />
              <DropdownButton
                title={"Add Product SIZE"}
                link={"/admin/products/size"}
              />
            </ul>
          </Collapse>
        </li>
        <li>
          <Link to={"/admin/offers"}>
            <Button className="!w-full !items-center !py-2 !capitalize !justify-start !flex !gap-3 !text-[15px] !text-[rgba(0,0,0,0.8)] !font-[500]">
              <MdOutlineLocalOffer className="!text-[18px]" />
              <span>Offer</span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to={"/admin/users"}>
            <Button className="!w-full !items-center !py-2 !capitalize !justify-start !flex !gap-3 !text-[15px] !text-[rgba(0,0,0,0.8)] !font-[500]">
              <FiUsers className="!text-[18px]" />
              <span>Users</span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to={"/admin/orders"}>
            <Button
              onClick={() => openCollapse(5)}
              className="!w-full !items-center !py-2 !capitalize !justify-start !flex !gap-3 !text-[15px] !text-[rgba(0,0,0,0.8)] !font-[500]"
            >
              <IoBagCheckOutline className="!text-[18px]" />
              <span>Orders</span>
              {collIndex == 5 ? (
                <FaAngleUp className="ml-auto" />
              ) : (
                <FaAngleDown className="ml-auto" />
              )}
            </Button>
          </Link>
          <Collapse isOpened={collIndex === 5}>
            <ul className="w-full ">
              <DropdownButton title={"Orders List"} link={"/admin/orders"} />
              <DropdownButton
                title={"Return Requests"}
                link={"/admin/orders/return/requests"}
              />
            </ul>
          </Collapse>
        </li>
        <li>
          <Link to={"/admin/banner1"}>
            <Button
              onClick={() => openCollapse(4)}
              className="!w-full !items-center !py-2 !capitalize !justify-start !flex !gap-3 !text-[15px] !text-[rgba(0,0,0,0.8)] !font-[500]"
            >
              <IoMdImages className="!text-[18px]" />
              <span>Banners</span>
              {collIndex == 4 ? (
                <FaAngleUp className="ml-auto" />
              ) : (
                <FaAngleDown className="ml-auto" />
              )}
            </Button>
          </Link>
          <Collapse isOpened={collIndex === 4}>
            <ul className="w-full ">
              <DropdownButton
                title={"Home Banner List 1"}
                link={"/admin/banner1"}
              />
              <DropdownButton
                title={"Add Home Banner 1"}
                link={"/admin/banner1/add"}
              />
              <DropdownButton
                title={"Home Banner List 2"}
                link={"/admin/banner2"}
              />
            </ul>
          </Collapse>
        </li>
        <li>
          <Link to={"/admin/coupons"}>
            <Button className="!w-full !items-center !py-2 !capitalize !justify-start !flex !gap-3 !text-[15px] !text-[rgba(0,0,0,0.8)] !font-[500]">
              <RiCouponLine className="!text-[18px]" />
              <span>Coupon</span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to={"/admin/blogs"}>
            <Button className="!w-full !items-center !py-2 !capitalize !justify-start !flex !gap-3 !text-[15px] !text-[rgba(0,0,0,0.8)] !font-[500]">
              <SiBloglovin className="!text-[18px]" />
              <span>Blogs</span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to={"/admin/logout"}>
            <Button className="!w-full !items-center !py-2 !capitalize !justify-start !flex !gap-3 !text-[15px] !text-[rgba(0,0,0,0.8)] !font-[500]">
              <IoLogOutOutline className="!text-[18px]" />
              <span>Logout</span>
            </Button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
