import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { reasonSchema } from "../../Utils/YupSchemas";
import {
  useCancelOrderMutation,
  useReturnOrderMutation,
} from "../../Store/Api/user/order";

const ReasonModal = ({ open, item, handleClose, type }) => {
  const [cancel, { isLoading }] = useCancelOrderMutation();
  const [returnOrder, { isLoading: returnLoading }] = useReturnOrderMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(reasonSchema),
  });
  const onSubmit = async (data) => {
    try {
      let res;
      if (type == "Cancel") {
        res = await cancel({ id: item._id, data }).unwrap();
      } else if (type == "Return") {
        res = await returnOrder({ id: item._id, data }).unwrap();
      }
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
          <h2 className="text-[18px] font-[600]">Submit {type} Reason</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5" action="">
            <div className="flex flex-col gap-3">
              <TextField
                {...register("reason")}
                error={!!errors.reason?.message}
                helperText={errors.reason?.message}
                label="Reason"
                variant="outlined"
                multiline
                rows={4}
              />
            </div>
            <div className="w-full flex gap-3">
              <Button
                type="submit"
                className="!flex w-[50%]  !bg-green-500 !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
              >
                {isLoading || returnLoading ? (
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

export default ReasonModal;
