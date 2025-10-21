import { Button, CircularProgress, Radio } from "@mui/material";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { CiMenuKebab } from "react-icons/ci";
import { AddNewAddressModal, EditAddressModal } from "../../Components/User";
import { useDeleteAddressMutation, useGetAddressesQuery } from "../../Store/Api/user/address";

const Addresses = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
    const { data, isLoading } = useGetAddressesQuery();
    const [deleteAddress, {isLoading: deleteLoading}] = useDeleteAddressMutation()
  if (isLoading) {
    <div className="w-full h-[100vh] flex items-center justify-center">
      <CircularProgress color="inherit" />
    </div>;
  }
  return (
    <>
      <div className="col2 w-[50%]">
        <div className=" w-full shadow-md rounded-md p-3 px-5 bg-white">
          <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)] mb-3">
            <div className="head flex items-center justify-between">
              <h2>Addresses</h2>
              <Button
                onClick={() => setOpen(true)}
                className="!bg-primary !px-3 !mt-2 !text-white !text-[14px] !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
              >
                <FaPlus />
                Add new address
              </Button>
            </div>
          </div>
          {data?.addresses.map((address) => (
            <div
              key={address?._id}
              className="card py-3 relative  shadow-md rounded-md flex"
            >
              <div className="absolute group  top[20px] right-[20px]">
                <CiMenuKebab />
                <div className="rounded-md opacity-0 group-hover:opacity-100 top-0 left-[-40px] absolute py-1 px-2 shadow-md bg-white ">
                  <ul className="">
                    <li
                      onClick={() => {
                        setEditAddress(address);
                        setEditOpen(true);
                      }}
                      className="py-1 link cursor-pointer font-[500]"
                    >
                      Edit
                    </li>
                    <li
                      onClick={() => deleteAddress(address._id)}
                      className="py-1 link cursor-pointer font-[500]"
                    >
                      {deleteLoading ? (
                        <CircularProgress size={10} />
                      ) : (
                        <> Delete</>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="address pl-3">
                <span className=" bg-[#f1f1f1] text-[13px] rounded-md py-1 px-2 font-[600] cursor-pointer ">
                  {address.type}
                </span>
                <div className="mt-2">
                  <h1>{address.name}</h1>
                  <p className="!mt-1">
                    {address.address_line +
                      ", " +
                      address.locality +
                      ", " +
                      address.city +
                      ", " +
                      address.state}
                    <span className="font-[500]"> - {address.pin_code}</span>
                  </p>
                  <p>
                    <span className="font-[500]">Phone:</span> {address.mobile},{" "}
                    {address?.alternative_mobile}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {open && (
        <AddNewAddressModal open={open} handleClose={() => setOpen(false)} />
      )}
      {editOpen && (
        <EditAddressModal
          address={editAddress}
          open={editOpen}
          handleClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
};

export default Addresses;
