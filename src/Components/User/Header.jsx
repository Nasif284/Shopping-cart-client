import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { FaRegHeart } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import Navigation from "./Navigation";
import CartPanel from "./CartPanel";
import { FaRegCircleUser } from "react-icons/fa6";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { IoBagCheckOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import toast from "react-hot-toast";
import { useLogoutMutation } from "../../Store/Api/user/auth";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../Store/StoreSlices/userAuthSlice";
import { useGetCartItemsQuery } from "../../Store/Api/user/cart";
import { useGetWishlistQuery } from "../../Store/Api/user/wishlist";
import { logo } from "../../Assets";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const { data: wishlist } = useGetWishlistQuery();
  const { data } = useGetCartItemsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { user, isAuthenticated: isLogin } = useSelector(
    (state) => state.userAuth
  );
  const cart = useSelector((state) => state.cart);

  const [logoutUser] = useLogoutMutation();
  const dispatch = useDispatch();
  const [openCartPanel, setOpenCartPanel] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const res = await logoutUser().unwrap();
      dispatch(clearUser());
      navigate("/");
      toast.success(res.message || "User logged out successfully");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };
  return (
    <>
      <header className="bg-white">
        <div className="top-stripe border-t-[1px] border-gray-300 border-b-[1px]">
          <div className="container flex items-center justify-between">
            <div className="col1 w-[50%]">
              <p className="text-[13px] font-[500]">
                Get up to 50% off new season styles, limited time only 
              </p>
            </div>
            <div className="col2 flex items-center justify-end">
              <ul className="flex gap-3">
                <li className="list-none">
                  <Link
                    to={"/help-center"}
                    className="link text-[13px] font-[500] transition"
                  >
                    Help Center
                  </Link>
                  &nbsp; |
                </li>
                <li className="list-none">
                  <Link
                    to={"/order-tracking"}
                    className="link text-[13px] font-[500] transition"
                  >
                    Order Tracking
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="header  border-gray-300 border-b-[1px] py-4  ">
          <div className="container flex items-center justify-between">
            <div className="col1 w-[25%]">
              {/* <h1 className="text-[25px] font-[600] text-primary">
                Shopping cart
              </h1> */}
              <img src={logo} className="w-[225px]" alt="" />
            </div>
            <div className="col2 w-[45%] ">
              <Search />
            </div>
            <div className="col3 w-[30%]">
              <ul className="flex items-center list-none gap-3 pl-7 justify-end">
                {isLogin ? (
                  <>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={handleClick}
                    >
                      <FaRegCircleUser className="!text-[25px]" />
                      <div>
                        <Link>
                          <h3 className="leading-2 text-[14px] mt-2 link">
                            {user.name}
                          </h3>
                        </Link>
                        <p className="!text-[11px] !m-0">{user.email}</p>
                      </div>
                    </div>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      slotProps={{
                        paper: {
                          elevation: 0,
                          sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            "&::before": {
                              content: '""',
                              display: "block",
                              position: "absolute",
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: "background.paper",
                              transform: "translateY(-50%) rotate(45deg)",
                              zIndex: 0,
                            },
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <Link to={"/myAccount"}>
                        <MenuItem
                          onClick={handleClose}
                          className="flex gap-2 !text-[14px] !py-2 link"
                        >
                          <FaRegCircleUser className="!text-[18px]" />
                          My account
                        </MenuItem>
                      </Link>
                      <Link to={"/myList"}>
                        <MenuItem
                          onClick={handleClose}
                          className="flex gap-2 !text-[14px] !py-2 link"
                        >
                          <FaRegHeart className="!text-[18px]" /> My list
                        </MenuItem>
                      </Link>
                      <Link to={"/orders"}>
                        <MenuItem
                          onClick={handleClose}
                          className="flex gap-2 !text-[14px] !py-2 link"
                        >
                          <IoBagCheckOutline className="!text-[18px]" /> Orders
                        </MenuItem>
                      </Link>
                      <Divider />
                      <Link onClick={logout}>
                        <MenuItem
                          onClick={handleClose}
                          className="flex gap-2 !text-[14px] !py-2 link"
                        >
                          <BiLogOut /> Logout
                        </MenuItem>
                      </Link>
                    </Menu>
                  </>
                ) : (
                  <li>
                    <Link
                      to={"/login"}
                      className="link transition text-[17px] font-[600]"
                    >
                      Login
                    </Link>
                    | &nbsp;
                    <Link
                      to={"/signUp"}
                      className="link transition text-[17px] font-[600]"
                    >
                      Sign Up
                    </Link>
                  </li>
                )}
                <li onClick={() => setOpenCartPanel(true)}>
                  <Tooltip title="Cart">
                    <IconButton aria-label="cart">
                      <StyledBadge
                        badgeContent={user ? data?.items?.length : cart.length}
                        color="secondary"
                      >
                        <ShoppingCartIcon />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </li>
                <li>
                  <Link to={"/myList"}>
                    <Tooltip title="Wish List">
                      <IconButton aria-label="wish-list">
                        <StyledBadge
                          badgeContent={wishlist?.wishlist.length}
                          color="secondary"
                        >
                          <FaRegHeart />
                        </StyledBadge>
                      </IconButton>
                    </Tooltip>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Navigation />
      </header>
      {openCartPanel && (
        <CartPanel open={openCartPanel} setOpen={setOpenCartPanel} />
      )}
    </>
  );
};

export default Header;
