import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
  Rating,
} from "@mui/material";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { reviewSchema } from "../../Utils/YupSchemas";
import { useState } from "react";
import { useAddReviewMutation } from "../../Store/Api/user/order";

const AddReviewModal = ({ open, item, handleClose }) => {
  const [value, setValue] = useState(0);
  const [add, { isLoading }] = useAddReviewMutation();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(reviewSchema),
  });
  const onSubmit = async (data) => {
      try {
      const res = await add({ id: item._id, data:{...data, rating:value} }).unwrap();
      toast.success(res.message || "Review added Successfully");
      handleClose();
    } catch (error) {
      toast.error(error.data || "error occurred");
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div className="w-full">
          <h2 className="text-[18px] font-[600]">Add Review</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5" action="">
            <div className="flex flex-col gap-3">
              <TextField
                {...register("review")}
                error={!!errors.review?.message}
                helperText={errors.review?.message}
                label="Review"
                variant="outlined"
                multiline
                rows={4}
              />
              <div className="flex w-full items-center justify-center">
                <Rating
                  name="simple-controlled"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </div>
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

export default AddReviewModal;
