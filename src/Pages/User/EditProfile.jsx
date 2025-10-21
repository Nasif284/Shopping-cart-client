import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CircularProgress, InputAdornment } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { userProfileSchema } from "../../Utils/YupSchemas";
import { PasswordResetModal } from "../../Components/Admin";
import {
  useEditProfileMutation,
  useEmailChangeOtpMutation,
} from "../../Store/Api/user/profile";
import toast from "react-hot-toast";
import { EmailVerifyModal } from "../../Components/User";
const EditProfile = () => {
  const { user, isLoading } = useSelector((state) => state.userAuth);
  const [verified, setVerified] = useState(true);
  const [open, setOpen] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [update, { isLoading: editLoading }] = useEditProfileMutation();
  const [send, { isLoading: isSending }] = useEmailChangeOtpMutation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(userProfileSchema),
  });
  const emailValue = watch("email");
  useEffect(() => {
    if (emailValue != user?.email) {
      setVerified(false);
    } else {
      setVerified(true);
    }
  }, [emailValue, user?.email]);

  const onSubmit = async (data) => {
    if (!verified) {
      return toast.error("Pleas Verify Email Address");
    }
    try {
      const res = await update(data).unwrap();
      toast.success(res.message || "Profile Updated Successfully");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };
  const handleOtpSending = async () => {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regex.test(emailValue)) {
      return toast.error("Enter Valid Email");
    }
    try {
      const res = await send({ email: emailValue }).unwrap();
      localStorage.setItem("otpExpiry", Date.now() + 60000);
      setOpenVerify(true);
      toast.success(res.message || "Otp Send Successfully");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };
  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <CircularProgress color="inherit" />
      </div>
    );
  }
  return (
    <>
      <div className="col2 w-[50%]">
        <div className="card bg-white p-5 shadow-md rounded-md ">
          <div className="w-full flex justify-between border-b border-[rgba(0,0,0,0.1)]">
            <h2>Edit Profile</h2>
            <Button
              type="button"
              onClick={() => setOpen(true)}
              className="!font-[600]"
            >
              {user.password ? "Change Password" : "Set Password" }
          
            </Button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} action="">
            <div className="flex  gap-5 py-5">
              <div className="w-[50%]">
                <TextField
                  {...register("name")}
                  className="w-full"
                  id="outlined-basic"
                  label="Full Name"
                  variant="outlined"
                  error={!!errors.name}
                  defaultValue={user.name}
                  helperText={errors?.name?.message}
                />
              </div>
              <div className="w-[50%]">
                <TextField
                  {...register("email")}
                  className="w-full"
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  error={!!errors.email}
                  defaultValue={user.email}
                  helperText={errors?.email?.message}
                />
                {!verified && (
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-sm text-red-600 font-medium">
                      Unverified
                    </span>
                    <Button
                      disabled={isSending}
                      variant="outlined"
                      size="small"
                      className="!border-indigo-500 !text-indigo-600 hover:!bg-indigo-50 !text-xs"
                      onClick={handleOtpSending}
                    >
                      {isSending ? (
                        <CircularProgress size={10} color="inherit" />
                      ) : (
                        <> Verify Now</>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-[48%]">
              <TextField
                {...register("mobile")}
                label="Mobile"
                id="outlined-start-adornment"
                sx={{ m: 1, width: "25ch" }}
                error={!!errors.mobile}
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <span className="!text-[15px]">+91</span>
                      </InputAdornment>
                    ),
                  },
                }}
                defaultValue={user.mobile}
                helperText={errors?.mobile?.message}
              />
            </div>

            <Button
              type="submit"
              className="!bg-primary  w-[48%] !mt-5 !text-white !text-[14px] !px-3 !py-3 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
            >
              {editLoading ? (
                <CircularProgress size={30} color="inherit" />
              ) : (
                <> Edit Profile</>
              )}
            </Button>
          </form>
        </div>
      </div>
      {open && (
        <PasswordResetModal open={open} handleClose={() => setOpen(false)} />
      )}
      {openVerify && (
        <EmailVerifyModal
          email={emailValue}
          open={openVerify}
          handleClose={() => setOpenVerify(false)}
          setVerified={setVerified}
        />
      )}
    </>
  );
};

export default EditProfile;
