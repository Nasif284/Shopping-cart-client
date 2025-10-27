import { Dialog, DialogContent } from "@mui/material";
import { useGetAddressesQuery } from "../../Store/Api/user/address";
const SelectAddressModal = ({ open, handleClose, setSelected }) => {
  const { data } = useGetAddressesQuery();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div className=" w-full">
          <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)] mb-3">
            <div className="head flex items-center justify-between">
              <h2>Addresses</h2>
            </div>
          </div>
          {data?.addresses.map((address) => (
            <div
              onClick={() => {
                setSelected(address);
                handleClose();
              }}
              key={address?._id}
              className="card py-3 relative  shadow-md rounded-md flex"
            >
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
      </DialogContent>
    </Dialog>
  );
};

export default SelectAddressModal;
