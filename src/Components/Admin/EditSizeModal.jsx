import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { useEditSizeMutation } from "../../Store/Api/admin/size";
import { useState } from "react";

const EditSizeModal = ({ open, handleClose, size }) => {
  const [edit, { isLoading }] = useEditSizeMutation();
  const [label, setLabel] = useState(size.label);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!label) {
      toast.error("Size field is required");
    }
    try {
      const res = await edit({ id: size._id, label: label }).unwrap();
      toast.success(res.message || "Size updated Successfully");
      handleClose();
    } catch (error) {
      toast.error(error.data || "Size updating failed");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div className="w-full">
          <h2 className="text-[18px] font-[600]">Edit Size</h2>
          <form onSubmit={handleSubmit} className="mt-5" action="">
            <div className="flex flex-col gap-3">
              <TextField
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                id="outlined-basic"
                label="Size Label"
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

export default EditSizeModal;
