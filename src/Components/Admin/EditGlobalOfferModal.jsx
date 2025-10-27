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
import { offerSchema } from "../../Utils/YupSchemas";
import { useEditGlobalOfferMutation } from "../../Store/Api/admin/offer";
import DateField from "./DateFiled";
import dayjs from "dayjs";

const EditGlobalOfferModal = ({ open, handleClose, offer }) => {
  const [edit, { isLoading }] = useEditGlobalOfferMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(offerSchema),
    defaultValues: {
      discountValue: offer.discountValue,
      title: offer.title,
      startDate: offer?.startDate ? dayjs(offer.startDate) : null,
      expiryDate: offer?.expiryDate ? dayjs(offer.expiryDate) : null,
    },
  });
  const onSubmit = async (data) => {
    try {
      const res = await edit({ id: offer._id, data }).unwrap();
      toast.success(res.message || "Offer Edited Successfully");
      handleClose();
    } catch (error) {
      toast.error(error.data || "Offer Editing failed");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div className="w-full">
          <h2 className="text-[18px] font-[600]">Add Offer</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5" action="">
            <TextField
              {...register("title")}
              error={!!errors.title}
              helperText={errors?.title?.message}
              id="outlined-basic"
              label="Title"
              variant="outlined"
              className="w-full"
            />
            <div className="flex mt-3 flex-col gap-3">
              <TextField
                {...register("discountValue")}
                error={!!errors.offerValue}
                helperText={errors?.offerValue?.message}
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

export default EditGlobalOfferModal;
