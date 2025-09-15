import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { CircularProgress, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForgotPassEmailMutation } from "../../Store/Api/user/auth";
import toast from "react-hot-toast";
import { forgotPassEmailSchema } from "../../Utils/YupSchemas";

const ForgotPassEmail = () => {
  const [sendOtp, { isLoading }] = useForgotPassEmailMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPassEmailSchema),
    mode: "onBlur",
  });
  const onSubmit = async (data) => {
    try {
      const res = await sendOtp(data).unwrap();
      toast.success(res.message || "OTP Send Successfully");
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("otpExpiry", Date.now() + 60000);
      navigate("/password/forgot/verify");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
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
            <div className="form-group w-full">
              <TextField
                error={!!errors.email}
                helperText={errors?.email?.message}
                {...register("email")}
                name="email"
                id="outlined-basic"
                label="Email Id "
                variant="outlined"
                className="w-full !mb-5 "
              />
            </div>
            <div className="my-1">
              <Button
                disabled={isLoading}
                type="submit"
                className={` ${isLoading ? "!bg-gray-400" : "!bg-primary"} w-full  !text-white !text-[14px] !px-3 !py-3 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]`}
              >
                {isLoading ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  "Send Code"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassEmail;
