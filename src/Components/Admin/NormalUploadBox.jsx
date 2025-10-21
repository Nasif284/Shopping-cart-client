import { IoMdImages } from "react-icons/io";

const NormalUploadBox = ({
  register,
  errors,
  handleImageUpload,
  multiple = false,
  edit = false,
}) => {
  const onChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
         handleImageUpload(e.target.files);
    }
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

    </>
  );
};

export default NormalUploadBox;
