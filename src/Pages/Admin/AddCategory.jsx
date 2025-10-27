import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { UploadBox } from "../../Components/Admin";
import { IoIosClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { catSchema } from "../../Utils/YupSchemas";
import { useCategoryAddMutation } from "../../Store/Api/admin/category";
import toast from "react-hot-toast";
import NormalUploadBox from "../../Components/Admin/NormalUploadBox";
const AddCategory = () => {
  const [addCat, { isLoading }] = useCategoryAddMutation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(catSchema),
  });
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const handleImageUpload = (file) => {
    setImage(URL.createObjectURL(file[0]));
    setFile(file[0]);
  };
  const handleRemoveImage = () => {
    setImage(null);
    reset({ image: null });
    setFile(null);
  };
  const onSubmit = async (data) => {
    if (!file) {
      toast.error("Image is required");
      return;
    }
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append(`image`, file);
    formData.append("level", "first");

    try {
      const res = await addCat(formData).unwrap();
      toast.success(res.message || "Category added successfully");
      reset();
      setImage(null);
    } catch (error) {
      toast.error(error.data || "Category adding filed");
    }
  };
  return (
    <div className="my-4 w-full shadow-md sm:rounded-lg bg-white p-5">
      <h2 className="text-[18px] font-[600]">Add Category</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5" action="">
        <div className="flex gap-3">
          <TextField
            error={!!errors?.name}
            helperText={errors?.name?.message}
            {...register("name")}
            id="outlined-basic"
            label="Category Name"
            variant="outlined"
            className="w-[50%]"
          />
        </div>
        {image && (
          <div className=" mt-5  flex flex-col gap-3 justify-center relative items-center bg-gray-100 hover:bg-gray-200  w-[15%] rounded-md  border-dashed border-1 border-[rgba(0,0,0,0.2)] h-[120px]">
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
          register={register("image")}
          errors={errors?.image}
          handleImageUpload={handleImageUpload}
        />
        <Button
          type="submit"
          className="!flex w-full !bg-primary !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
        >
          {isLoading ? (
            <CircularProgress size={30} color="inherit" />
          ) : (
            <>Add Category</>
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddCategory;
