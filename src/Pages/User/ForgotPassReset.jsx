import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import PasswordFiled from "./PasswordFiled";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPassResetSchema } from "../../Utils/YupSchemas";
import { useResetPasswordMutation } from "../../Store/Api/user/auth";
import toast from "react-hot-toast";
const ForgotPassword = () => {
  const [resetPass, { isLoading: isPending }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur", resolver: yupResolver(forgotPassResetSchema) });

  const email = localStorage.getItem("userEmail");
  const onSubmit = async (data) => {
    try {
      const res = await resetPass({ ...data, email }).unwrap();
      toast.success(res.message || "Password reset successfully");
      localStorage.setItem("userEmail", data.email);
      navigate("/login");
    } catch (error) {
      toast.error(error.data || "Password reset failed");
    }
  };
  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black">
            Forgot Password
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            action=""
            className="w-full mt-5"
          >
            <div className="form-group w-full mb-3">
              <PasswordFiled
                isSubmitting={isPending}
                register={register("newPassword")}
                errors={errors?.newPassword?.message}
                label={"Password"}
              />
              <PasswordFiled
                isSubmitting={isPending}
                register={register("confirmPassword")}
                errors={errors?.confirmPassword?.message}
                label={"Confirm Password"}
              />
            </div>
            <div className="my-3">
              <Button
                type="submit"
                className="!bg-primary w-full  !text-white !text-[14px] !px-3 !py-3 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
              >
                Change Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
