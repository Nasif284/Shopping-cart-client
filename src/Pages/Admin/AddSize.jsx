import { Button, CircularProgress, TextField } from "@mui/material";
import { EditSizeModal, SizeTable } from "../../Components/Admin";
import { useAddSizeMutation } from "../../Store/Api/admin/size";
import { useRef } from "react";
import toast from "react-hot-toast";

const AddSize = () => {
  const sizeRef = useRef();
  const [addSize, { isLoading }] = useAddSizeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let size = sizeRef.current.value.trim();
    if (!size) {
      toast.error("Please enter size value");
    }
    try {
      const res = await addSize({ label: size }).unwrap();
      toast.success(res.message || "Size added successfully");
      sizeRef.current.value = "";
    } catch (error) {
      toast.error(error.data || "Size adding filed");
    }
  };
  return (
    <div className="my-4 w-full shadow-md sm:rounded-lg bg-white p-5">
      <h2 className="text-[18px] font-[600]">Add Size</h2>
      <form onSubmit={handleSubmit} className="mt-5" action="">
        <div className="flex gap-3">
          <TextField
            name="label"
            inputRef={sizeRef}
            id="outlined-basic"
            label="Add Product Size"
            variant="outlined"
            className="w-[50%]"
          />
        </div>
        <Button
          type="submit"
          className="!flex w-[50%]  !bg-primary !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
        >
          {isLoading ? (
            <CircularProgress size={30} color="inherit" />
          ) : (
            <>Add Size </>
          )}
        </Button>
      </form>
      <div className="mt-5">
        <SizeTable />
      </div>
    </div>
  );
};

export default AddSize;
