import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import SelectField from "./SelectField";
import { useForm } from "react-hook-form";
import { useUpdateStatusMutation } from "../../Store/Api/admin/orders";

const OrderStatusModal = ({ open,item, handleClose }) => {
    const [update,{isLoading}] = useUpdateStatusMutation()
    const { control, handleSubmit, } = useForm({
        defaultValues: {
          status: item.status
      }
    });

 const validNextStatus = {
   Confirmed: ["Processing", "Cancelled"],
   Processing: ["Shipped", "Cancelled"],
   Shipped: ["Out for Delivery", "Cancelled"],
   "Out for Delivery": ["Delivered", "Cancelled"],
   Delivered: [],
   Cancelled: [],
 };

 const allowedStatuses = validNextStatus[item.status] || [];
 
  const onSubmit = async (data) => {
    try {
        const res = await update({ id: item._id, data: { status: data.status } }).unwrap();
      toast.success(res.message || "Status updated Successfully");
      handleClose();
    } catch (error) {
      toast.error(error.data || "Status updating failed");
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div className="w-full">
          <h2 className="text-[18px] font-[600]">Update Status</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5" action="">
            <div className="flex flex-col gap-3">
              <SelectField
                name="status"
                control={control}
                label="Order Status"
                options={allowedStatuses}
              />
            </div>
            <div className="w-full flex gap-3">
              <Button
                type="submit"
                className="!flex w-[50%]  !bg-green-500 !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
              >
                {isLoading ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  <>Save </>
                )}
              </Button>
              <Button
                onClick={handleClose}
                className="!flex w-[50%]  !bg-primary !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
              >
                Close
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderStatusModal;
