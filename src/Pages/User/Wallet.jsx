import { Button, CircularProgress, Pagination } from "@mui/material";
import React, { useState } from "react";
import { FaPlus, FaWallet } from "react-icons/fa6";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import AddMoneyToWalletModal from "../../Components/User/AddMoneyToWalletModal";
import {
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
} from "../../Store/Api/user/wallet";

const Wallet = () => {
  const [open, setOpen] = useState(false);
  const { data } = useGetWalletQuery();
  const [page, setPage] = useState(1);
  const [params, setParams] = useState({ page:1, perPage: 5 });
  const { data: wallet } = useGetWalletTransactionsQuery(params);
  const handlePagination = (event, value) => {
    setPage(value);
    setParams((prev)=> ({...prev,page: value}))
  };
  console.log(wallet);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="col2 w-[50%]">
        <div className="w-full shadow-md rounded-md p-3 px-5 bg-white">
          <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)] mb-3">
            <div className="head flex items-center justify-between">
              <h2>My Wallet</h2>
              <Button
                onClick={() => setOpen(true)}
                className="!bg-primary !px-3 !mt-2 !text-white !text-[14px] !py-2 flex gap-2 hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
              >
                <FaPlus />
                Add Money
              </Button>
            </div>
          </div>

          <div className="card py-4 px-5 mb-5 shadow-md rounded-md bg-gradient-to-r from-primary to-[rgba(219,108,108,0.8)]">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-[14px] opacity-90">Available Balance</p>
                <h1 className="text-[32px] font-[700] mt-1">
                  ₹{data?.wallet?.balance.toFixed(2) || 0}
                </h1>
              </div>
              <FaWallet className="text-[48px] opacity-30" />
            </div>
          </div>

          <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)] mb-3">
            <h3 className="font-[600]">Transaction History</h3>
          </div>
          <div className="transactions-list space-y-3">
            {wallet?.transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaWallet className="text-[48px] mx-auto mb-3 opacity-30" />
                <p>No transactions yet</p>
              </div>
            ) : (
              wallet?.transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="card py-3 px-4 shadow-md rounded-md flex items-center justify-between hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "CREDIT"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "CREDIT" ? (
                        <MdArrowDownward className="text-green-600 text-[20px]" />
                      ) : (
                        <MdArrowUpward className="text-red-600 text-[20px]" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-[600] text-[15px]">
                        {transaction.description}
                      </h4>
                      <p className="text-[12px] text-gray-500 mt-1">
                        {formatDate(transaction.createdAt)}
                      </p>
                      {transaction.orderId && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Order ID: {transaction.orderId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-[700] text-[16px] ${
                        transaction.type === "CREDIT"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "CREDIT" ? "+" : "-"}₹
                      {transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center justify-center mt-5">
            <Pagination
              page={page}
              onChange={handlePagination}
              count={wallet?.totalPages}
              color="primary"
            />
          </div>
        </div>
      </div>
      {open && (
        <AddMoneyToWalletModal open={open} handleClose={() => setOpen(false)} />
      )}
    </>
  );
};

export default Wallet;
