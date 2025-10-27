import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { UploadBox } from "../../Components/Admin";
import { IoIosClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import { useAddHomeSlidesMutation } from "../../Store/Api/admin/homeSlides";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { homeSlidesSchema } from "../../Utils/YupSchemas";
import NormalUploadBox from "../../Components/Admin/NormalUploadBox";

const AddHomeSlides = () => {
  const [image, setImage] = useState({
    preview: null,
    file: null,
  });
  const [add, { isLoading }] = useAddHomeSlidesMutation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(homeSlidesSchema),
    mode: "onBlur",
  });
  const handleImageUpload = (file) => {
    setImage({ preview: URL.createObjectURL(file[0]), file: file[0] });
  };
  const handleRemoveImage = () => {
    setImage(null);
  };
  const onSubmit = async (data) => {
    if (!image.file) {
      toast.error("Image Filed is Required");
    }
    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("link", data.link);
    formData.append("image", image.file);
    try {
      const res = await add(formData).unwrap();
      toast.success(res.message || "Home slide added successfully");
      setImage(null);
      reset();
      setImage(null);
    } catch (error) {
      toast.error(error.data || "Home slide adding filed");
    }
  };
  return (
    <div className="my-4 w-full shadow-md sm:rounded-lg bg-white p-5">
      <h2 className="text-[18px] font-[600]">Add Home Slides</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5" action="">
        <div className="flex gap-3">
          <TextField
            {...register("description")}
            error={!!errors?.description}
            helperText={errors?.description?.message}
            id="outlined-basic"
            label="Description"
            variant="outlined"
            className="w-full"
          />
          <TextField
            {...register("link")}
            error={!!errors?.link}
            helperText={errors?.link?.message}
            id="outlined-basic"
            label="Link To"
            variant="outlined"
            className="w-full"
          />
        </div>
        {image?.preview && (
          <div className=" mt-5  flex flex-col gap-3 justify-center relative items-center bg-gray-100 hover:bg-gray-200  w-[15%] rounded-md  border-dashed border-1 border-[rgba(0,0,0,0.2)] h-[120px]">
            <span
              onClick={handleRemoveImage}
              className="w-[20px] h-[20px] bg-red-500 absolute !text-[19px] text-white rounded-full -top-[8px] -right-[8px] flex items-center justify-center cursor-pointer"
            >
              <IoIosClose />
            </span>
            <img
              src={image?.preview}
              className="w-full h-full object-cover rounded-md"
              alt=""
            />
          </div>
        )}

        <NormalUploadBox handleImageUpload={handleImageUpload} />
        <Button
          type="submit"
          className="!flex w-full !bg-primary !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
        >
          {isLoading ? (
            <CircularProgress size={30} color="inherit" />
          ) : (
            <>Add Home Slide</>
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddHomeSlides;
