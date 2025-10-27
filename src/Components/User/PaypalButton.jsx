import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PayPalButton = ({ amount, payload }) => {
  const navigate = useNavigate();
  const usdAmount = (amount / 83).toFixed(2);
  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        color: "gold",
        label: "paypal",
      }}
      fundingSource="paypal"
      createOrder={async (data, actions) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: usdAmount } }],
        });
      }}
      onApprove={async (data, actions) => {
        const details = await actions.order.capture();
        toast.success("Payment successful!");

        await fetch("/api/user/orders/paypal/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ details, payload }),
        });

        navigate("/order-success");
      }}
      onError={(err) => {
        console.error(err);
        toast.error("Payment failed");
      }}
    />
  );
};

export default PayPalButton;
