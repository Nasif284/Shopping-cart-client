import { Button } from "@mui/material";
import React, { useState } from "react";
import { RiMenu2Line } from "react-icons/ri";
import Badge from "@mui/material/Badge";
import { IoMdNotifications } from "react-icons/io";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { FaRegUser } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import { useSelector } from "react-redux";
import { useAdminLogoutMutation } from "../../Store/Api/admin/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = ({ setShow, show }) => {
  const { admin } = useSelector((state) => state.adminAuth);
  const [logout] = useAdminLogoutMutation()
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate()
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    try {
      setAnchorEl(null);
      const res = await logout().unwrap()
      navigate("/admin/login")
      toast.success(res.message || "Admin Logged Out Successfully")
    } catch (error) {
      toast.error(error.data|| "Some Error Occurred")
    }
  }
  return (
    <header
      className={`w-full z-50 fixed transition-all pr-7 h-[auto] py-2 ${show ? "pl-70" : "pl-5"} bg-[#fff] shadow-md flex items-center justify-between`}
    >
      <div className="part1">
        <Button
          onClick={() => setShow(!show)}
          className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[rgba(0,0,0,0.8)]"
        >
          <RiMenu2Line className="!text-[18px] !text-[rgba(0,0,0,0.8)]" />
        </Button>
      </div>
      <div className="part2 flex w-[40%] items-center justify-end gap-5">
        <IconButton aria-label="cart">
          <StyledBadge badgeContent={4} color="secondary">
            <IoMdNotifications className="!text-[24px]" />
          </StyledBadge>
        </IconButton>
        <div
          className="imgWrapper w-[35px] h-[35x] rounded-full overflow-hidden cursor-pointer"
          onClick={handleClick}
        >
          <img
            src="https://grandamanta.com/wp-content/uploads/2022/06/4.jpg"
            className="w-full h-full object-cover"
            alt=""
          />
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
          <MenuItem onClick={handleClose} className="!bg-white">
            <div className="flex items-center gap-3">
              <div className="imgWrapper w-[35px] h-[35x] rounded-full overflow-hidden cursor-pointer">
                <img
                  src="https://grandamanta.com/wp-content/uploads/2022/06/4.jpg"
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              <div className="info">
                <h3 className="text-[15px] font-[500] leading-5">
                  {admin.name}
                </h3>
                <p className="text-[12px] font-[400] opacity-70 !m-0">
                  {admin.email}
                </p>
              </div>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={handleClose}
            className="!bg-white flex items-center gap-3"
          >
            <FaRegUser /> <span className="text-[14px]">Profile</span>
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            className="!bg-white flex items-center gap-3"
          >
              <IoMdLogOut className="text-[18px]" /> <span className="text-[14px]">Logout out</span>
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
