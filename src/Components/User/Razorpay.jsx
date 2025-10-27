import { Button, CircularProgress } from "@mui/material";
import { IoBagCheckOutline } from "react-icons/io5";
import {
  useRazorPayCreateOrderMutation,
  useRazorpayVerifyMutation,
  useRetryFiledOrderWithRazorpayMutation,
} from "../../Store/Api/user/order";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SiRazorpay } from "react-icons/si";

const Razorpay = ({ amount, payload, failed = false }) => {
  const [create, { isLoading }] = useRazorPayCreateOrderMutation();
  const navigate = useNavigate();
  const [verify] = useRazorpayVerifyMutation();
  const [retry] = useRetryFiledOrderWithRazorpayMutation();
  let verificationInProgress = false;
  const handleRazorpayPayment = async () => {
    try {
      const { data } = await create({ amount, ...payload });
      const order = data?.order;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_TEST_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Shopping cart",
        description: `Order #${order.receipt}`,
        order_id: order.id,
        handler: async function (response) {
          if (verificationInProgress) return;
          verificationInProgress = true;
          try {
            if (failed) {
              const verifyPayload = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                ...payload,
              };
              await retry(verifyPayload).unwrap();
            } else {
              const verifyPayload = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                payload,
              };
              await verify(verifyPayload).unwrap();
            }
            navigate("/checkout/success");
            toast.success("Payment successful and verified");
          } catch (err) {
            toast.error("Payment verification failed", err.message);
          }
        },
        theme: {
          color: "#F37254",
        },
        retry: {
          enabled: false,
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", async function (response) {
        if (failed) {
          toast.error("Payment verification failed");
        } else {
          if (verificationInProgress) return;
          verificationInProgress = true;
          const verifyPayload = {
            razorpay_order_id: response.error.metadata.order_id,
            razorpay_payment_id: response.error.metadata.payment_id,
            razorpay_signature: null,
            payload,
          };
          try {
            await verify(verifyPayload).unwrap();
            toast.error("Payment failed");
          } catch (err) {
            toast.error(err.data || "Payment verification failed");
          }
        }
        navigate("/checkout/failed");
      });
    } catch (error) {
      console.log(error.data);
      toast.error(error.data || "Some Error Occurred");
    }
  };
  return (
    <Button
      onClick={handleRazorpayPayment}
      type="submit"
      className="!bg-primary w-full !mt-2 !text-white !text-[14px] !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[500]"
    >
      {isLoading ? (
        <CircularProgress color="inherit" size={30} />
      ) : (
        <>
          <SiRazorpay className="text-[16px] text-blue-400" />
          Razorpay
        </>
      )}
    </Button>
  );
};

export default Razorpay;
