import { useState } from "react";
import { IoMdImages } from "react-icons/io";
import ImageCropper from "./ImageCropper";
import toast from "react-hot-toast";

const UploadBox = ({
  register,
  errors,
  handleImageUpload,
  multiple = false,
  edit = false,
}) => {
  const [filesToCrop, setFilesToCrop] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [cropOpen, setCropOpen] = useState(false);
  const [croppedImages, setCroppedImages] = useState([]);
  const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  const startCroppingSequence = (files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setFilesToCrop(fileArray);
    setCurrentFileIndex(0);
    setCroppedImages([]);
    setCropOpen(true);
  };

  const onChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);

      const invalidFiles = fileArray.filter(
        (file) => !allowedFormats.includes(file.type)
      );

      if (invalidFiles.length > 0) {
        toast.error(
          `Invalid file format: ${invalidFiles
            .map((f) => f.name)
            .join(", ")}. Only JPG, PNG, and WEBP are allowed.`
        );
        e.target.value = "";
        return;
      }
      startCroppingSequence(e.target.files);
      e.target.value = "";
    }
  };

  const handleCropComplete = (croppedFile) => {
    const newCroppedImages = [...croppedImages, croppedFile];
    setCroppedImages(newCroppedImages);

    if (currentFileIndex < filesToCrop.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    } else {
      setCropOpen(false);
      handleImageUpload(newCroppedImages);

      setFilesToCrop([]);
      setCurrentFileIndex(0);
      setCroppedImages([]);
    }
  };

  const handleCropCancel = () => {
    setCropOpen(false);
    setFilesToCrop([]);
    setCurrentFileIndex(0);
    setCroppedImages([]);
  };

  const getCurrentFile = () => {
    return filesToCrop[currentFileIndex];
  };

  return (
    <>
      <div
        className={`p-3 mt-5 flex flex-col gap-3 justify-center relative items-center
        bg-gray-100 hover:bg-gray-200 cursor-pointer
        ${edit ? "w-[100%]" : "w-[15%]"}
        rounded-md overflow-hidden border-dashed border border-[rgba(0,0,0,0.2)]
        h-[120px]`}
      >
        <h4 className={`!font-[400] ${edit && "text-[14px]"} !text-center`}>
          Image Upload
        </h4>
        <IoMdImages className="!text-[40px] text-[rgba(7,7,7,0.4)]" />
        <input
          {...register}
          type="file"
          accept="image/*"
          onChange={onChange}
          className="absolute top-0 right-0 w-full h-full opacity-0 cursor-pointer"
          multiple={multiple}
        />
      </div>
      {errors && <p className="text-red-500 text-sm">{errors.message}</p>}

      {cropOpen && getCurrentFile() && (
        <ImageCropper
          open={cropOpen}
          image={URL.createObjectURL(getCurrentFile())}
          onClose={handleCropCancel}
          onComplete={handleCropComplete}
          currentIndex={currentFileIndex + 1}
          totalFiles={filesToCrop.length}
          fileName={getCurrentFile().name}
        />
      )}
    </>
  );
};

export default UploadBox;
