import React, { useEffect, useState } from "react";
import {
  ProductCard,
  ProductListView,
  ProductSidebar,
} from "../../Components/User";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { IoGridSharp } from "react-icons/io5";
import { MdOutlineMenu } from "react-icons/md";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoIosArrowDown } from "react-icons/io";
import Pagination from "@mui/material/Pagination";
import { useGetProductsQuery } from "../../Store/Api/admin/product";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setParams } from "../../Store/StoreSlices/uiSlice";
import { CircularProgress } from "@mui/material";
const ProductListing = () => {
  const [sort, setSort] = useState("Sort By");
  const catParams = useParams();
  const { params } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetProductsQuery(params, {
    refetchOnMountOrArgChange: true,
  });
  console.log(data);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toUppercase = (value) => {
    return value
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  };
  const handlePagination = (event, value) => {
    setPage(value);
    dispatch(setParams({ page: value }));
  };
  const handleSort = ({ param, label }) => {
    setSort(label);
    dispatch(setParams({ sortBy: param }));
    handleClose();
  };
  useEffect(() => {
    if (catParams.category) {
      dispatch(
        setParams({
          category: catParams.category,
          subCategory: undefined,
          thirdCategory: undefined,
        })
      );
    }
    if (catParams.category && catParams.subCategory) {
      dispatch(
        setParams({
          category: catParams.category,
          subCategory: catParams.subCategory,
          thirdCategory: undefined,
        })
      );
    }
    if (
      catParams.category &&
      catParams.subCategory &&
      catParams.thirdCategory
    ) {
      dispatch(
        setParams({
          category: catParams.category,
          subCategory: catParams.subCategory,
          thirdCategory: catParams.thirdCategory,
        })
      );
    }
  }, [catParams, dispatch]);
  const [itemView, setItemView] = useState("grid");
  if (isLoading)
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <CircularProgress color="inherit" />
      </div>
    );
  return (
    <section className="pt-5 ">
      <div className="breadCrumbs container">
        {catParams.category &&
        catParams.subCategory &&
        catParams.thirdCategory ? (
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              to="/"
              className="link transition !text-[14px]"
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              to={`/${catParams.category}`}
              className="link transition !text-[14px]"
            >
              {toUppercase(catParams.category)}
            </Link>
            <Link
              underline="hover"
              color="inherit"
              to={`/${catParams.category}/${catParams.subCategory}`}
              className="link transition !text-[14px]"
            >
              {toUppercase(catParams.subCategory)}
            </Link>
            <Typography className="!text-[14px]" sx={{ color: "text.primary" }}>
              {toUppercase(catParams.thirdCategory)}
            </Typography>
          </Breadcrumbs>
        ) : catParams.category && catParams.subCategory ? (
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              to="/"
              className="link transition !text-[14px]"
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              to={`/${catParams.category}`}
              className="link transition !text-[14px]"
            >
              {toUppercase(catParams.category)}
            </Link>
            <Typography className="!text-[14px]" sx={{ color: "text.primary" }}>
              {toUppercase(catParams.subCategory)}
            </Typography>
          </Breadcrumbs>
        ) : (
          catParams.subCategory && (
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                to="/"
                className="link transition !text-[14px]"
              >
                Home
              </Link>
              <Typography
                className="!text-[14px]"
                sx={{ color: "text.primary" }}
              >
                {toUppercase(catParams.category)}
              </Typography>
            </Breadcrumbs>
          )
        )}
      </div>
      <div className="bg-white py-2 mt-4">
        <div className="container flex gap-3">
          <div className="sidebarWrapper w-[20%] h-full bg-white">
            <ProductSidebar catParams={catParams} />
          </div>
          <div className="rightContent w-[80%] flex flex-col justify-between">
            <div>
              <div className="bg-[#f1f1f1] py-3 w-full rounded-md mb-4 flex items-center justify-between p-2">
                <div className="col1 items-center ">
                  <Button
                    onClick={() => setItemView("list")}
                    className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-black ${itemView === "list" && "!bg-primary !text-white"}`}
                  >
                    <MdOutlineMenu />
                  </Button>
                  <Button
                    onClick={() => setItemView("grid")}
                    className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-black ${itemView === "grid" && "!bg-primary !text-white"}`}
                  >
                    <IoGridSharp />
                  </Button>
                  <span className="text-[14px] font-[500] pl-3 text-[rgba(0,0,0,0.7)]">
                    There are {data.totalPosts} products
                  </span>
                </div>
                <div className="col2 flex items-center justify-end gap-3 pr-4">
                  <span className="text-[14px] font-[500] pl-3 text-[rgba(0,0,0,0.7)]">
                    Sort By:
                  </span>
                  <div>
                    <Button
                      className="!bg-white !text-[12px] !text-black !capitalize"
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      {sort} <IoIosArrowDown className="ml-2" />
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      slotProps={{
                        list: {
                          "aria-labelledby": "basic-button",
                        },
                      }}
                    >
                      <MenuItem
                        className="!text-[13px] !text-black"
                        onClick={() =>
                          handleSort({ param: "aToZ", label: "Name ,A-Z" })
                        }
                      >
                        Name, A-Z
                      </MenuItem>
                      <MenuItem
                        className="!text-[13px] !text-black"
                        onClick={() =>
                          handleSort({ param: "zToA", label: "Name, Z-A" })
                        }
                      >
                        Name, Z-A
                      </MenuItem>
                      <MenuItem
                        className="!text-[13px] !text-black"
                        onClick={() =>
                          handleSort({
                            param: "lowToHigh",
                            label: "Price, low to high",
                          })
                        }
                      >
                        Price, low to high
                      </MenuItem>
                      <MenuItem
                        className="!text-[13px] !text-black"
                        onClick={() =>
                          handleSort({
                            param: "highToLow",
                            label: "Price, high to low",
                          })
                        }
                      >
                        Price, high to low
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              </div>
              <div
                className={`${itemView === "grid" ? "grid grid-cols-4 md:grid-cols-4 gap-4" : "grid grid-cols-1 md:grid-cols-1 gap-4"}`}
              >
                {data.products.map((product) =>
                  itemView === "grid" ? (
                    <ProductCard key={product._id} product={product} />
                  ) : (
                    <ProductListView key={product._id} product={product} />
                  )
                )}
              </div>
            </div>

            <div className="flex items-center justify-center mt-5">
              <Pagination
                page={page}
                onChange={handlePagination}
                count={data.totalPages}
                color="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
