import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaWallet } from "react-icons/fa6";
import { MdCurrencyRupee } from "react-icons/md";
import { useState } from "react";
import { addMoneySchema } from "../../Utils/YupSchemas";
import {
  useWalletAddVerifyMutation,
  useWalletCreateOrderMutation,
} from "../../Store/Api/user/wallet";
import toast from "react-hot-toast";

const AddMoneyToWalletModal = ({ open, handleClose }) => {
  const [create, { isLoading }] = useWalletCreateOrderMutation();
  const [verify] = useWalletAddVerifyMutation();
  const [selectedAmount, setSelectedAmount] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(addMoneySchema),
  });

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleQuickAmount = (amount) => {
    setSelectedAmount(amount);
    setValue("amount", amount, { shouldValidate: true });
  };
  const onSubmit = async (formData) => {
    try {
      const { data } = await create({ amount: formData.amount });
      const order = data?.order;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_TEST_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Shopping cart",
        description: `Order #${order.receipt}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: formData.amount,
            };
            await verify(verifyPayload).unwrap();
            handleClose();
            toast.success("Money added to wallet successfully");
          } catch (err) {
            toast.error("Payment failed", err.message);
          }
        },
        theme: {
          color: "#F37254",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", async function (response) {
        toast.error("Payment failed", response);
      });
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };

  const handleModalClose = () => {
    setSelectedAmount(null);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleModalClose} maxWidth="sm" fullWidth>
      <DialogContent className="!p-0">
        <div className="w-full">
          <div className="bg-gradient-to-r from-primary to-[rgba(0,0,0,0.8)] text-white p-6 rounded-t-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaWallet className="text-[24px] !text-black" />
              </div>
              <div>
                <h2 className="text-[22px] font-[700]">Add Money to Wallet</h2>
                <p className="text-[13px] opacity-90">
                  Quick and secure way to top up
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="mb-5">
              <label className="text-[14px] font-[600] text-gray-700 mb-3 block">
                Quick Select Amount
              </label>
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((amount) => (
                  <Chip
                    key={amount}
                    label={`₹${amount.toLocaleString()}`}
                    onClick={() => handleQuickAmount(amount)}
                    className={`!cursor-pointer !text-[14px] !font-[600] !px-2 !py-5 ${
                      selectedAmount === amount
                        ? "!bg-primary !text-white"
                        : "!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-[14px] font-[600] text-gray-700 mb-2 block">
                Or Enter Custom Amount
              </label>
              <TextField
                {...register("amount")}
                error={!!errors.amount}
                helperText={errors?.amount?.message}
                type="number"
                placeholder="Enter amount (₹100 - ₹50,000)"
                variant="outlined"
                className="w-full"
                InputProps={{
                  startAdornment: (
                    <MdCurrencyRupee className="mr-2 text-[23px] text-gray-400" />
                  ),
                }}
                onChange={(e) => {
                  setSelectedAmount(null);
                  register("amount").onChange(e);
                }}
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-5">
              <p className="text-[12px] text-blue-800 flex items-start gap-2">
                <span className="text-[16px]">ℹ️</span>
                <span>
                  Your wallet balance can be used for purchases across the
                  platform. Money once added cannot be withdrawn and will remain
                  in your wallet.
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="!flex-1 !bg-green-500 !text-white !font-[600] !capitalize !px-5 !py-3 hover:!bg-green-600 !text-[15px]"
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <FaWallet className="mr-2" />
                    Add Money
                  </>
                )}
              </Button>
              <Button
                onClick={handleModalClose}
                disabled={isLoading}
                className="!flex-1 !bg-gray-200 !text-gray-700 !font-[600] !capitalize !px-5 !py-3 hover:!bg-gray-300 !text-[15px]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoneyToWalletModal;
