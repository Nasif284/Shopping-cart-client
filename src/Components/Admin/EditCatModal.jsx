import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useEditCategoryMutation } from "../../Store/Api/admin/category";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { yupResolver } from "@hookform/resolvers/yup";
import { editCatSchema } from "../../Utils/YupSchemas";
import NormalUploadBox from "./NormalUploadBox";

const EditCatModal = ({ open, handleClose, category }) => {
  const [edit, { isLoading }] = useEditCategoryMutation();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(editCatSchema),
    defaultValues: {
      name: category.name,
      image: "",
    },
  });
  const [image, setImage] = useState(category.image);
  const [file, setFile] = useState(null);
  const handleImageUpload = (file) => {
    setImage(URL.createObjectURL(file[0]));
    setFile(file[0]);
  };
  const handleRemoveImage = () => {
    setImage(null);
    setFile(null);
  };
  const onSubmit = async (data) => {
    if (!image) {
      toast.error("Please upload an Image");
      return;
    }
    const formData = new FormData();
    formData.append("name", data.name);
    if (file) {
      formData.append(`image`, file);
    }
    try {
      const res = await edit({ id: category._id, data: formData }).unwrap();
      toast.success(res.message || "category updated Successfully");
      handleClose();
    } catch (error) {
      toast.error(error.data || "category updating failed");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div className=" w-full">
          <h2 className="text-[18px] font-[600]">Edit Category</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5" action="">
            <div className="flex gap-3">
              <TextField
                error={!!errors?.name}
                helperText={errors?.name?.message}
                {...register("name")}
                id="outlined-basic"
                label="Category Name"
                variant="outlined"
                className="w-full"
              />
            </div>
            {image && (
              <div className=" mt-5  flex flex-col gap-3 justify-center relative items-center bg-gray-100 hover:bg-gray-200  w-[100%] rounded-md  border-dashed border-1 border-[rgba(0,0,0,0.2)] h-[120px]">
                <span
                  onClick={handleRemoveImage}
                  className="w-[20px] h-[20px] bg-red-500 absolute !text-[19px] text-white rounded-full -top-[8px] -right-[8px] flex items-center justify-center cursor-pointer"
                >
                  <IoIosClose />
                </span>
                <img
                  src={image}
                  className="w-full h-full object-cover rounded-md"
                  alt=""
                />
              </div>
            )}

            <NormalUploadBox
              edit={true}
              register={register("image")}
              errors={errors?.image}
              handleImageUpload={handleImageUpload}
            />
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

export default EditCatModal;
