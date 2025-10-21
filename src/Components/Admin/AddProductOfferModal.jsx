import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import {  useAddProductOfferMutation } from "../../Store/Api/admin/offer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { offerSchema } from "../../Utils/YupSchemas";

const AddProductOfferModal = ({ open, handleClose, product }) => {
  const [add, { isLoading }] = useAddProductOfferMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
      resolver: yupResolver(offerSchema),
      defaultValues:{
          discountValue: product.discount
      }
  });
  const onSubmit = async (data) => {
      try {
      const res = await add({...data, product:product._id }).unwrap();
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
                {...register("discountValue")}
                error={!!errors.offerValue}
                helperText={errors?.offerValue?.message}
                id="outlined-basic"
                label="Offer Percentage Value"
                variant="outlined"
                className="w-full"
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

export default AddProductOfferModal;
