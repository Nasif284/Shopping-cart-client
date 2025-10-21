import TextField from "@mui/material/TextField";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "../../Utils/YupSchemas";
import PasswordFiled from "./PasswordFiled";
import { CircularProgress } from "@mui/material";
import { useUserLoginMutation } from "../../Store/Api/user/auth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../Store/StoreSlices/userAuthSlice";
import { FaFacebook } from "react-icons/fa";
import { useEffect } from "react";
import { useAddToCartMutation } from "../../Store/Api/user/cart";
import { clearCart } from "../../Store/StoreSlices/cartSlice";

const apiUrl = import.meta.env.VITE_API_URL;
const Login = () => {
  const [login, { isLoading: isPending }] = useUserLoginMutation();
  const [searchParams] = useSearchParams();
  const cart = useSelector((state) => state.cart);
  const [add] = useAddToCartMutation();
  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    if (error && message) {
      const decodedMessage = decodeURIComponent(message);
      toast.error(decodedMessage);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onBlur", resolver: yupResolver(loginValidationSchema) });
  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setUser(res.user));
      if (cart.length) {
        await add(cart).unwrap();
      }
      dispatch(clearCart());
      navigate("/");
      toast.success(res.message || "User Logged In Successfully");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };
  const isLoading = false;
  const handleGoogleLogin = async () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    dispatch(clearCart());
    window.location.href = `${apiUrl}/api/user/google`;
  };
  const handleFacebookLogin = async () => {
    window.location.href = `${apiUrl}/api/user/facebook`;
  };
  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black">
            Login to your account
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            action=""
            className="w-full mt-5"
          >
            <div className="form-group w-full ">
              <TextField
                disabled={isPending}
                error={!!errors.email}
                helperText={errors?.email?.message}
                {...register("email")}
                name="email"
                id="outlined-basic"
                label="Email Id "
                variant="outlined"
                className="w-full !mb-5 "
              />
              <PasswordFiled
                isSubmitting={isPending}
                register={register("password")}
                errors={errors?.password?.message}
                label={"Password"}
              />
            </div>
            <Link
              to={"/password/forgot"}
              className="text-[14px] cursor-pointer link font-[600]"
            >
              Forgot Password?
            </Link>
            <div className="my-3">
              <Button
                disabled={isPending}
                type="submit"
                className={` ${isPending ? "!bg-gray-400" : "!bg-primary"} w-full  !text-white !text-[14px] !px-3 !py-3 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]`}
              >
                {isPending ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </div>
            <p className="text-center">
              Not Registered?
              <Link
                to={"/signUp"}
                className="text-primary text-[14px] font-[600]"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-center font-[500]">
              Or continue with social account
            </p>
            <Button
              onClick={handleGoogleLogin}
              className="!flex !gap-3 !w-full !font-[600] !text-black  !bg-gray-100"
            >
              {isLoading ? (
                <CircularProgress size={30} color="inherit" />
              ) : (
                <>
                  <FcGoogle className="text-[20px]" /> Continue with Google
                </>
              )}
            </Button>
            <Button
              onClick={handleFacebookLogin}
              className="!flex !gap-3 !mt-3 !w-full !font-[600] !text-black !bg-gray-100"
            >
              <FaFacebook className="text-[20px] text-blue-700" />
              Continue with Facebook
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
