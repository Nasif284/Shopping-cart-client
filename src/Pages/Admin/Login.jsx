import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PasswordFiled from "../User/PasswordFiled";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "../../Utils/YupSchemas";
import { useAdminLoginMutation } from "../../Store/Api/admin/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdmin } from "../../Store/StoreSlices/adminAuthSlice";
import CircularProgress from "@mui/material/CircularProgress";
const AdminLogin = () => {
  const [login, { isLoading }] = useAdminLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(loginValidationSchema),
  });
  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      toast.success(res.message || "admin logged in Successfully");
      dispatch(setAdmin(res.admin));
      navigate("/admin");
    } catch (error) {
      toast.error(error.data || "Login failed");
    }
  };
  return (
    <section className="section h-[100vh] py-10 ">
      <div className="container h-full flex items-center justify-center">
        <div className="card h-full flex items-center justify-center flex-col shadow-md w-full min-h-full m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center font-[700] mb-10 text-[30px] text-black">
            Welcome Back! <br /> Sign in with your credentials
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            action=""
            className="w-full  mt-5  flex flex-col items-center justify-center"
          >
            <div className="form-group w-full flex flex-col items-center mb-3">
              <TextField
                {...register("email")}
                name="email"
                id="outlined-basic"
                label="Email Id "
                variant="outlined"
                className="w-[400px] !mb-5 "
              />
              <div className="w-[400px]">
                <PasswordFiled
                  isSubmitting={isLoading}
                  register={register("password")}
                  errors={errors?.password?.message}
                  label={"Password"}
                />
              </div>
            </div>
            <div className="my-3">
              <Button
                type="submit"
                className="!bg-primary w-[400px]  !text-white !text-[14px] !px-3 !py-3 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
              >
                {isLoading ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  <> Login </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
