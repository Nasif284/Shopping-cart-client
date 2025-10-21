import { Button, Dialog, DialogContent, CircularProgress } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { verify } from "../../Assets";
import { OtpBox } from "../../Components/User";
import { Link } from "react-router-dom";
import { useEmailChangeOtpResendMutation, useEmailChangeVerifyMutation } from "../../Store/Api/user/profile";

const EmailVerifyModal = ({ open, handleClose, email, setVerified }) => {
  const [verifyEmail, { isLoading: isPending }] = useEmailChangeVerifyMutation()
  const [resend, { isLoading: isResending }] = useEmailChangeOtpResendMutation()
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const updateTimer = () => {
    const expiry = Number(localStorage.getItem("otpExpiry"));
    if (!expiry) return setTimer(0);

    const remaining = Math.floor((expiry - Date.now()) / 1000);
    setTimer(remaining > 0 ? remaining : 0);
  };

  useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);
  const onChangeOtp = (value) => {
    setOtp(value);
  };
  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyEmail({ otp, email }).unwrap();
      setVerified(true);
      toast.success(res.message || "User verified successfully");
      handleClose();
    } catch (error) {
      toast.error(error.data || "Verification failed");
    }
  };
  const resendOtp = async () => {
    try {
      const res = await resend({ email });
      localStorage.setItem("otpExpiry", Date.now() + 60000);
      updateTimer();
      toast.success(res.message || "OTP resend to you mail");
    } catch (error) {
      toast.error(error.data || "Could not resend OTP");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="relative">
        <div
          onClick={handleClose}
          className="absolute cursor-pointer top-[20px] right-[20px]"
        >
          <IoMdClose className="text-[20px]" />
        </div>

        <div className="card w-[400px] m-auto  p-5 px-10">
          <div className="flex items-center justify-center">
            <img src={verify} alt="" width={80} />
          </div>
          <h3 className="text-center text-[18px] text-black mt-4 mb-1">
            Verify OTP
          </h3>
          <p className="text-center !mt-0 ">
            OTP send to <span className="text-primary font-bold">{email}</span>
          </p>
          <form onSubmit={verifyOtp} action="">
            <OtpBox length={6} onChange={onChangeOtp} />
            <div className="flex w-full mt-1 items-center py-2 text-[12px] px-3 justify-between">
              {timer == 0 ? (
                <Link onClick={resendOtp} className="link">
                  {isResending ? (
                    <CircularProgress size={10} color="inherit" />
                  ) : (
                    "Resend OTP"
                  )}
                </Link>
              ) : (
                <div></div>
              )}

              {timer > 0 ? <span>00:{timer}</span> : <span>OTP Expired</span>}
            </div>
            <div className="px-3">
              <Button
                disabled={isPending}
                type="submit"
                className={` ${isPending ? "!bg-gray-400" : "!bg-primary"} w-full  !text-white !text-[14px] !px-3 !py-3 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]`}
              >
                {isPending ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerifyModal;
