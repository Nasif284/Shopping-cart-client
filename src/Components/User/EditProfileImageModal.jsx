import {
  Button,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useSelector } from "react-redux";
import NormalUploadBox from "../Admin/NormalUploadBox";
import { useChangeImageMutation } from "../../Store/Api/user/profile";

const EditProfileImageModal = ({ open, handleClose }) => {
    const { user } = useSelector((state) => state.userAuth)
   const [upload,{isLoading}] = useChangeImageMutation()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
    const [image, setImage] = useState(user.image);
    const [file,setFile] = useState(null)
  const handleImageUpload = (file) => {
      setImage(URL.createObjectURL(file[0]));
      setFile(file[0])
  };
  const handleRemoveImage = () => {
    setImage(null);
    setFile(null)
  };
  const onSubmit = async () => {
    if (!image) {
     return toast.error("Please upload an Image");
    }
    const formData = new FormData();
      formData.append("image", file);
    try {
      const res = await upload( formData ).unwrap();
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
          <h2 className="text-[18px] font-[600]">Edit Image</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5" action="">
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

export default EditProfileImageModal;
