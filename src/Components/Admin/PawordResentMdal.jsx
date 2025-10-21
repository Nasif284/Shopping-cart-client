import { Button, Dialog, DialogContent, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPassResetSchema } from "../../Utils/YupSchemas";
import { useSelector } from "react-redux";
import PasswordFiled from "../../Pages/User/PasswordFiled";
import { useResetPasswordMutation } from "../../Store/Api/user/auth";

const PasswordResetModal = ({ open, handleClose }) => {
  const { user } = useSelector((state) => state.userAuth);
  const [resetPass, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(forgotPassResetSchema),
  });
  const onSubmit = async (data) => {
    try {
      const res = await resetPass({ ...data, email: user.email }).unwrap();
      toast.success(res.message || "Password reset successfully");
      handleClose()
    } catch (error) {
      toast.error(error.data || "Password reset failed");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div className=" w-full">
          <h2 className="text-[18px] font-[600]">
            {!user.password ? "Set Password" : "Reset Password"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5" action="">
            {user.password &&
              <PasswordFiled
                isSubmitting={isLoading}
                register={register("currentPassword")}
                errors={errors?.currentPassword?.message}
                label={"Current Password"}
              />
            }

            <div className="flex gap-3">
              <PasswordFiled
                isSubmitting={isLoading}
                register={register("newPassword")}
                errors={errors?.newPassword?.message}
                label={"New Password"}
              />
              <PasswordFiled
                isSubmitting={isLoading}
                register={register("confirmPassword")}
                errors={errors?.confirmPassword?.message}
                label={"Confirm New Password"}
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

export default PasswordResetModal;
