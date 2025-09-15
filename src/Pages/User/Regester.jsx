import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { FcGoogle } from "react-icons/fc";
import PasswordFiled from "./PasswordFiled";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { singUpValidationSchema } from "../../Utils/YupSchemas";
import CircularProgress from "@mui/material/CircularProgress";
import { useSignUpMutation } from "../../Store/Api/user/auth";
import toast from "react-hot-toast";
import { FaFacebook } from "react-icons/fa";
const apiUrl = import.meta.env.VITE_API_URL;
const Register = () => {
  const [signUp, { isLoading }] = useSignUpMutation();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(singUpValidationSchema),
    mode: "onBlur",
  });
  const handleGoogleLogin = async () => {
    window.location.href = `${apiUrl}/api/user/google`;
  };
  const handleFacebookLogin = async () => {
    window.location.href = `${apiUrl}/api/user/facebook`;
  };

  const onSubmit = async (data) => {
    try {
      const res = await signUp(data).unwrap();
      toast.success(res.message || "User Registered Successfully");
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("otpExpiry",Date.now()+ 60000);
      navigate("/verify");
      reset();
    } catch (error) {
      toast.error(error.data || "Registration failed");
    }
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black">
            Register with a new account
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            action=""
            className="w-full mt-5"
          >
            <div className="form-group w-full mb-3">
              <TextField
                disabled={isLoading}
                {...register("name")}
                error={!!errors.name}
                helperText={errors?.name?.message}
                id="outlined-basic"
                label="Full Name"
                variant="outlined"
                className="w-full !mb-5 "
              />
              <TextField
                disabled={isLoading}
                {...register("email")}
                error={!!errors.email}
                helperText={errors?.email?.message}
                id="outlined-basic"
                label="Email Id "
                variant="outlined"
                className="w-full !mb-5 "
              />
              <PasswordFiled
                isSubmitting={isLoading}
                register={register("password")}
                errors={errors?.password?.message}
                label={"Password"}
              />
              <PasswordFiled
                isSubmitting={isLoading}
                register={register("confirmPassword")}
                errors={errors?.confirmPassword?.message}
                label={"Confirm Password"}
              />
            </div>
            <div className="my-3">
              <Button
                disabled={isLoading}
                type="submit"
                className={` ${isLoading ? "!bg-gray-400" : "!bg-primary"} w-full  !text-white !text-[14px] !px-3 !py-3 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]`}
              >
                {isLoading ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  "Register"
                )}
              </Button>
            </div>
            <p className="text-center">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-primary text-[14px] font-[600]"
              >
                Login
              </Link>
            </p>
            <p className="text-center font-[500]">
              Or continue with social account
            </p>
            <Button
              onClick={handleGoogleLogin}
              className="!flex !gap-3 !w-full !font-[600] !text-black  !bg-gray-100"
            >
              <FcGoogle className="text-[20px]" /> Login with Google
            </Button>
             <Button
                          onClick={handleFacebookLogin}
                          className="!flex !gap-3 !mt-3 !w-full !font-[600] !text-black !bg-gray-100"
                        >
                          <FaFacebook className="text-[20px] text-blue-700" />
                          Login with Facebook
                        </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
