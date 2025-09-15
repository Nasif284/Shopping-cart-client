import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";

const BlockConfirmModal = ({
  unlist = false,
  isBlocked,
  open,
  handleClose,
  id,
  block,
  isLoading,
}) => {
  const onSubmit = async () => {
    try {
      const res = await block(id).unwrap();
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
          {unlist ? (
            <h2 className="text-[18px] font-[600]">
              Do you really want to {isBlocked ? "list?" : "unlist?"}
            </h2>
          ) : (
            <h2 className="text-[18px] font-[600]">
              Do you really want to {isBlocked ? "unblock?" : "block?"}
            </h2>
          )}

          <div className="w-full flex gap-3">
            <Button
              onClick={onSubmit}
              type="submit"
              className="!flex w-[50%]  !bg-green-500 !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
            >
              {isLoading ? (
                <CircularProgress size={30} color="inherit" />
              ) : (
                <>
                  Yes,{" "}
                  {unlist
                    ? isBlocked
                      ? "list"
                      : "unlist"
                    : isBlocked
                      ? "unblock"
                      : "block"}
                </>
              )}
            </Button>
            <Button
              onClick={handleClose}
              className="!flex w-[50%]  !bg-primary !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockConfirmModal;
