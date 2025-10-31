import { Button, CircularProgress } from "@mui/material";
import AdminTable from "./AdminTable";
import { useState } from "react";
import BlockConfirmModal from "./BlockConfirmModel";
import { FaPlus } from "react-icons/fa";
import AddCouponModal from "./AddCoupenModal";
import {
  useGetCouponsQuery,
  useToggleCouponStatusMutation,
} from "../../Store/Api/admin/coupon";
import EditCouponModal from "./EditCouponModal";
const CategoryColumns = [
  { id: "code", label: "Code", minWidth: 100 },
  { id: "description", label: "Description", minWidth: 100, align: "center" },
  {
    id: "discountValue",
    label: "Discount Value",
    minWidth: 100,
    align: "center",
  },
  {
    id: "startDate",
    label: "Start Date",
    minWidth: 100,
    align: "center",
  },
  {
    id: "expiryDate",
    label: "Expiry Date",
    minWidth: 100,
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "center",
  },
];

function CategoryCreateData(
  code,
  description,
  discountValue,
  startDate,
  expiryDate,
  action
) {
  return { code, description, discountValue, startDate, expiryDate, action };
}

const CouponsTable = ({ params, setParams }) => {
  const { data, isLoading } = useGetCouponsQuery(params);
  const [block, { isLoading: isBlockLoading }] =
    useToggleCouponStatusMutation();
  const [open, setOpen] = useState(false);
  const [confOpen, setConfOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState();
  const [coupon, setCoupon] = useState();
  const handleClose = () => {
    setOpen(false);
  };
  const handleEdit = (coupon) => {
    setCoupon(coupon);
    setOpen(true);
  };
  const handleAddOffer = () => {
    setAddOpen(true);
  };
  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <CircularProgress color="inherit" />
      </div>
    );
  }
  const toggleBlock = (id, isBlocked) => {
    setCoupon(id);
    setConfOpen(true);
    setIsBlocked(isBlocked);
  };
  const CategoryRows = data.coupons.map((coupon) =>
    CategoryCreateData(
      coupon.code,
      coupon.description,
      coupon.discountType == "Flat" ? (
        <span>Rs.{coupon.discountValue}</span>
      ) : (
        <span>{coupon.discountValue}%</span>
      ),
      new Date(coupon.startDate).toLocaleDateString("en-GB"),
      coupon.expiryDate
        ? new Date(coupon.expiryDate).toLocaleDateString("en-GB")
        : "No expiry set",
      <div className="flex gap-2 !text-[18px] justify-center items-center ">
        {!coupon.isActive ? (
          <Button
            onClick={() => toggleBlock(coupon._id, !coupon.isActive)}
            className="!bg-green-500 !text-white !capitalize !text-[12px]"
          >
            list
          </Button>
        ) : (
          <Button
            onClick={() => toggleBlock(coupon._id, !coupon.isActive)}
            className="!bg-red-500 !text-white !capitalize !text-[12px]"
          >
            Unlist
          </Button>
        )}
        <Button
          onClick={() => handleEdit(coupon)}
          className="!bg-blue-500 !text-white !capitalize !text-[12px]"
        >
          Edit
        </Button>
      </div>
    )
  );

  return (
    <>
      <div className="  flex justify-between my-4 ">
        <h2 className="text-[18px] font-[600]">Coupons</h2>
        <Button
          onClick={handleAddOffer}
          className="!flex !bg-blue-500 !text-white !font-[600] !h-[40px] !capitalize !px-5 !gap-3"
        >
          <FaPlus />
          Add New Coupon
        </Button>
      </div>

      <div className="relative w-full overflow-x-scroll shadow-md sm:rounded-lg">
        <AdminTable
          columns={CategoryColumns}
          rows={CategoryRows}
          setParams={setParams}
          totalPosts={data.totalPosts}
          page={data.page}
        />
      </div>

      {open && (
        <EditCouponModal
          open={open}
          coupon={coupon}
          handleClose={handleClose}
        />
      )}
      {confOpen && (
        <BlockConfirmModal
          open={confOpen}
          id={coupon}
          unlist={true}
          block={block}
          isBlocked={isBlocked}
          isLoading={isBlockLoading}
          handleClose={() => setConfOpen(false)}
        />
      )}
      {addOpen && (
        <AddCouponModal open={addOpen} handleClose={() => setAddOpen(false)} />
      )}
    </>
  );
};

export default CouponsTable;
