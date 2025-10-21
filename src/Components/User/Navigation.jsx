import React, { useState } from "react";
import Button from "@mui/material/Button";
import { RiMenu2Fill } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { GoRocket } from "react-icons/go";
import CategoryPanel from "./CategoryPanel";
import { useGetAllCategoriesQuery } from "../../Store/Api/admin/category";
const Navigation = () => {
  const [toggle, setToggle] = useState(false);
  const { data, isLoading } = useGetAllCategoriesQuery({user:true});
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <nav>
        <div className="container flex items-center justify-end gap-5">
          <div className="col_1 w-[20%]">
            <Button
              className="!text-black gap-2 w-full   "
              onClick={() => setToggle(!toggle)}
            >
              <RiMenu2Fill className="text-[18px]" />
              Shop by Categories
              <FaAngleDown className="text-[18px] ml-auto" />
            </Button>
          </div>
          <div className="col_2 w-[60%] flex justify-center">
            <ul className="flex items-center gap-7">
              <li>
                <Link to={"/"} className="link transition text-[14px] font-[500] ">
                  Home
                </Link>
              </li>
              {data.rootCategories.map((cat) => (
                <li key={cat?._id} className="relative">
                  <Link
                    to={`/${cat.name.toLowerCase()}`}
                    className="link transition text-[14px] font-[500]"
                  >
                    {cat.name}
                  </Link>
                  <div className="submenu absolute top-[120%] left-[-100%] bg-white shadow-md min-w-[150px] opacity-0  transition-all z-1000">
                    <ul className="w-full">
                      {cat?.children.map((subCat) => (
                        <li key={subCat?._id} className="relative">
                          <Link
                            to={`/${cat.name.toLowerCase()}/${subCat.name.toLowerCase()}`}
                            className="w-full"
                          >
                            <Button className="!text-black w-full">
                              {subCat.name}
                            </Button>
                            <div className="submenu absolute top-[0%] left-[100%] bg-white shadow-md min-w-[150px] opacity-0  transition-all">
                              <ul className="w-full">
                                {subCat.children.map((thirdCat) => (
                                  <li key={thirdCat._id}>
                                    <Link
                                      to={`/${cat.name.toLowerCase()}/${subCat.name.toLowerCase()}/${thirdCat.name.toLowerCase()}`}
                                      className="w-full"
                                    >
                                      <Button className="!text-black w-full">
                                        {thirdCat.name}
                                      </Button>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col_3 w-[20%] flex justify-end items-center gap-2 font-[500]">
            <GoRocket />
            <p className="text-[13px] ">Free International Delivery</p>
          </div>
        </div>
      </nav>
      {toggle && <CategoryPanel toggleFunc={setToggle} toggle={toggle} />}
    </>
  );
};

export default Navigation;
