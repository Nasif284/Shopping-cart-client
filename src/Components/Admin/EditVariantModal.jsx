import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import UploadBox from "./UploadBox";
import { yupResolver } from "@hookform/resolvers/yup";
import { editVariantSchema } from "../../Utils/YupSchemas";
import { useEditVariantMutation } from "../../Store/Api/admin/product";
import SelectField from "./SelectField";
import { useGetSizesQuery } from "../../Store/Api/admin/size";

const EditVariantModal = ({ open, handleClose, variant, category }) => {
  const [edit, { isLoading }] = useEditVariantMutation();
  const [files, setFiles] = useState([]);
  const [preview, setPreviews] = useState(variant.images);
  const { data: sizes, isLoading: sizesLoading } = useGetSizesQuery();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(editVariantSchema),
    defaultValues: {
      name: variant.name,
      stock: variant.stock,
      price: variant.price,
      oldPrice: variant.oldPrice,
      size: variant.size,
      color: variant.color,
    },
  });
  const [images, setImages] = useState(variant.images);
  console.log(images)
  const handleImageUpload = (files) => {
    const fileArr = Array.from(files);
    setFiles((prev) => [...prev, ...fileArr]);
    const urlArr = fileArr.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...urlArr]);
  };
  const handleRemoveImage = (img) => {
    if (img.includes("cloudinary")) {
      setImages(images.filter((image) => image != img));
    } else {
      setFiles(files.filter((image) => image != img));
    }
    setPreviews(preview.filter((prev) => prev != img));
  };
  const onSubmit = async (data) => {
    if (!images) {
      toast.error("Please upload an Image");
    }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("size", data.size);
    formData.append("stock", data.stock);
    formData.append("color", data.color);
    formData.append("price", data.price);
    formData.append("oldPrice", data.oldPrice);
    images.forEach((img) => formData.append("images[]", img));
    if (files.length > 0) {
          files.forEach((file) => formData.append("files", file));
    }
    try {
      console.log(variant);
      const res = await edit({ id: variant._id, data: formData }).unwrap();
      toast.success(res.message || "category updated Successfully");
      handleClose();
    } catch (error) {
      toast.error(error.data || "category updating failed");
    }
  };
  if (sizesLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div className="variants-section pt-2 w-full">
          <h2 className="text-[18px] font-[600] py-3 flex justify-between items-center">
            Edit Variant
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} action="">
            <div className="flex gap-3 flex-wrap w-full">
              <div className="w-full flex justify-between">
                {category == "Fashion" ? (
                  <SelectField
                    name={`size`}
                    control={control}
                    errors={errors}
                    label="Size"
                    options={sizes.sizes}
                    width="24%"
                  />
                ) : category == "Beauty" ? (
                  <TextField
                    {...register(`size`)}
                    error={!!errors.size}
                    helperText={errors?.size?.message}
                    type="string"
                    label="Weight"
                    variant="outlined"
                    className="w-[24%]"
                  />
                ) : (
                  <TextField
                    {...register(`size`)}
                    error={!!errors.size}
                    helperText={errors?.size?.message}
                    label="Size"
                    variant="outlined"
                    className="w-[24%]"
                  />
                )}
                <TextField
                  {...register(`price`)}
                  error={!!errors?.price}
                  helperText={errors?.price?.message}
                  label="Price"
                  variant="outlined"
                  className="w-[24%]"
                />
                <TextField
                  {...register(`oldPrice`)}
                  error={!!errors?.oldPrice}
                  helperText={errors?.oldPrice?.message}
                  label="Old Price"
                  variant="outlined"
                  className="w-[24%]"
                />
                <TextField
                  {...register(`stock`)}
                  error={!!errors?.stock}
                  helperText={errors?.stock?.message}
                  label="Stock"
                  variant="outlined"
                  className="w-[24%]"
                />
              </div>

              <div className="w-[24%] flex items-center justify-between border border-[rgba(0,0,0,0.1)] rounded-sm px-3">
                <label className="text-sm text-gray-500">Color</label>
                <TextField
                  {...register(`color`)}
                  type="color"
                  error={!!errors?.color}
                  helperText={errors?.color?.message}
                  variant="outlined"
                  className="w-[60px] h-[50px] rounded-lg overflow-hidden"
                  InputProps={{
                    sx: {
                      padding: 0,
                      "& input": {
                        padding: 0,
                        height: "50px",
                        width: "60px",
                        cursor: "pointer",
                        border: "none",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              {preview &&
                preview.map((img) => (
                  <div className=" mt-5  flex flex-col gap-3 justify-center relative items-center bg-gray-100 hover:bg-gray-200  w-[100%] rounded-md  border-dashed border-1 border-[rgba(0,0,0,0.2)] h-[120px]">
                    <span
                      onClick={() => handleRemoveImage(img)}
                      className="w-[20px] h-[20px] bg-red-500 absolute !text-[19px] text-white rounded-full -top-[8px] -right-[8px] flex items-center justify-center cursor-pointer"
                    >
                      <IoIosClose />
                    </span>
                    <img
                      src={img}
                      className="w-full h-full object-cover rounded-md"
                      alt=""
                    />
                  </div>
                ))}
            </div>
            <UploadBox
              error={errors?.images}
              register={register(`images`)}
              handleImageUpload={(files) => handleImageUpload(files)}
              multiple
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

export default EditVariantModal;
