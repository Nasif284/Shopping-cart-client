import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { useAddGlobalOffersMutation } from "../../Store/Api/admin/offer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { globalOfferSchema } from "../../Utils/YupSchemas";
import DateField from "./DateFiled";

const AddGlobalOfferModal = ({ open, handleClose }) => {
  const [add, { isLoading }] = useAddGlobalOffersMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(globalOfferSchema),
  });
  const onSubmit = async (data) => {
    try {
      const res = await add(data).unwrap();
      toast.success(res.message || "Offer added Successfully");
      handleClose();
    } catch (error) {
      toast.error(error.data || "Offer adding failed");
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div className="w-full">
          <h2 className="text-[18px] font-[600]">Add Offer</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5" action="">
            <div className="flex flex-col gap-3">
              <TextField
                {...register("title")}
                error={!!errors.title}
                helperText={errors?.title?.message}
                id="outlined-basic"
                label="Title"
                variant="outlined"
                className="w-full"
              />
            </div>
            <div className="flex mt-3 flex-col gap-3">
              <TextField
                {...register("discountValue")}
                error={!!errors.discountValue}
                helperText={errors?.discountValue?.message}
                id="outlined-basic"
                label="Offer Percentage Value"
                variant="outlined"
                className="w-full"
              />
            </div>
            <div className="w-full mt-3 gap-4 flex justify-between">
              <DateField
                name={"startDate"}
                label={"Starts From"}
                control={control}
                errorMessage={errors.startDate?.message}
              />
              <DateField
                name={"expiryDate"}
                label={"Expires At"}
                control={control}
                errorMessage={errors.expiryDate?.message}
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

export default AddGlobalOfferModal;
