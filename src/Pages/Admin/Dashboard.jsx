import {
  Graph,
  LineGraph,
  OrderStatusChart,
  TopCategory,
  TopProducts,
} from "../../Components/Admin";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import { FaPlus, FaFilePdf, FaFileExcel, FaFilter } from "react-icons/fa6";
import { dashbordImg } from "../../Assets";
import { useState } from "react";
import { useGetSalesReportQuery } from "../../Store/Api/admin/orders";
import TopBrands from "../../Components/Admin/TopBrands";
import SalesLineGraph from "../../Components/Admin/SalesLineGraph";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_API_URL;
const Dashboard = ({ show }) => {
  const [filterType, setFilterType] = useState("daily");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString().padStart(2, "0")
  );
  const [appliedFilter, setAppliedFilter] = useState({
    type: "daily",
    startDate: "",
    endDate: "",
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
  });

  const { data, isLoading } = useGetSalesReportQuery(appliedFilter);
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear; i++) {
      years.push(i);
    }
    return years;
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    if (event.target.value !== "custom") {
      setCustomStartDate("");
      setCustomEndDate("");
    }
  };

  const handleApplyFilter = () => {
    if (filterType == "custom") {
      if (!customStartDate || !customEndDate) {
        return toast.error("Please select both start and end dates");
      }

      const start = new Date(customStartDate);
      const end = new Date(customEndDate);

      if (start > end) {
        return toast.error("Start date cannot be after end date");
      }
      if (end > new Date() || end > new Date()) {
        return toast.error("Enter valid date");
      }
    }

    const newFilter = {
      type: filterType,
      startDate: customStartDate,
      endDate: customEndDate,
      year: selectedYear,
      month: selectedMonth,
    };

    setAppliedFilter(newFilter);
  };
  const handleDownloadPDF = () => {
    const { type, startDate, endDate, year, month } = appliedFilter;
    const query = new URLSearchParams({
      type,
      startDate,
      endDate,
      year,
      month,
    }).toString();
    const url = `${BASE_URL}/api/admin/orders/report/pdf?${query}`;
    window.open(url, "_blank");
  };

  const handleDownloadExcel = () => {
    const { type, startDate, endDate, year, month } = appliedFilter;
    const query = new URLSearchParams({
      type,
      startDate,
      endDate,
      year,
      month,
    }).toString();
    const url = `${BASE_URL}/api/admin/orders/report/excel?${query}`;
    window.open(url, "_blank");
  };

  const getDateRangeLabel = () => {
    const monthName = months.find(
      (m) => m.value === appliedFilter.month
    )?.label;
    switch (appliedFilter.type) {
      case "daily":
        return "Today";
      case "weekly":
        return "This Week";
      case "monthly":
        return `${monthName} ${appliedFilter.year}`;
      case "yearly":
        return appliedFilter.year;
      case "custom":
        if (appliedFilter.startDate && appliedFilter.endDate) {
          return `${appliedFilter.startDate} to ${appliedFilter.endDate}`;
        }
        return "Custom Range";
      default:
        return "All Time";
    }
  };

  if (isLoading) {
    return <div className="p-5">Loading dashboard data...</div>;
  }

  return (
    <>
      <div className="w-full p-5 border-1 rounded-md border-[rgba(0,0,0,0.1)] flex items-center gap-5 mb-5 bg-sky-100 justify-between">
        <div className="col1 w-60%">
          <h2 className="text-[30px] font-[700] leading-10 mb-3">
            Welcome, <br />
            <span className="text-[33px] font-[700] text-blue-500">
              Muhammad Nasif
            </span>
          </h2>
          <p>
            Here's What happening on your store today. See the statistics at
            once.
          </p>
          <Button className="!flex !bg-blue-500 !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4">
            <FaPlus />
            Add Products
          </Button>
        </div>
        <div className="col2 ">
          <img src={dashbordImg} className="w-[220px]" alt="" />
        </div>
      </div>

      <div className="my-4 w-full items-center shadow-md rounded-md bg-white">
        <div className="p-5 items-center flex justify-between">
          <div className="flex items-center flex-col justify-between">
            <h2 className="text-[18px] font-[600] flex items-center gap-2">
              <FaFilter />
              Dashboard Filter
            </h2>
            <p className="text-[12px] mt-1 !m-0">
              Showing data for: {getDateRangeLabel()}
            </p>
          </div>

          <div className="flex items-end gap-4 flex-wrap">
            <FormControl className="!min-w-[200px] !bg-white !rounded-md">
              <InputLabel>Filter By</InputLabel>
              <Select
                value={filterType}
                onChange={handleFilterChange}
                label="Filter By"
                className="!h-[45px]"
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="custom">Custom Date Range</MenuItem>
              </Select>
            </FormControl>

            {filterType === "monthly" && (
              <>
                <FormControl className="!min-w-[150px] !bg-white !rounded-md">
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    label="Month"
                    className="!h-[45px]"
                  >
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className="!min-w-[120px] !bg-white !rounded-md">
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    label="Year"
                    className="!h-[45px]"
                  >
                    {generateYearOptions().map((year) => (
                      <MenuItem key={year} value={year.toString()}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {filterType === "yearly" && (
              <FormControl className="!min-w-[150px] !bg-white !rounded-md">
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  label="Year"
                  className="!h-[45px]"
                >
                  {generateYearOptions().map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {filterType === "custom" && (
              <>
                <TextField
                  type="date"
                  label="Start Date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    max: new Date().toISOString().split("T")[0],
                  }}
                  className="!min-w-[180px] !bg-white !rounded-md"
                />

                <TextField
                  type="date"
                  label="End Date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    max: new Date().toISOString().split("T")[0],
                    min: customStartDate || "",
                  }}
                  className="!min-w-[180px] !bg-white !rounded-md"
                />
              </>
            )}

            <Button
              onClick={handleApplyFilter}
              className="!flex !bg-blue-500 !text-white !font-[600] !capitalize !px-5 !h-[45px]"
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </div>

      <div className="my-4 w-full shadow-md sm:rounded-lg bg-white">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-[600] flex items-center gap-2">
              Sales Report
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={handleDownloadPDF}
                className="!flex !bg-red-500 !text-white !font-[600] !capitalize !px-4 !gap-2 !text-[13px]"
              >
                <FaFilePdf />
                PDF
              </Button>
              <Button
                onClick={handleDownloadExcel}
                className="!flex !bg-green-600 !text-white !font-[600] !capitalize !px-4 !gap-2 !text-[13px]"
              >
                <FaFileExcel />
                Excel
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <p className="text-[13px] text-gray-600 font-[500]">
                Total Sales Count
              </p>
              <h3 className="text-[24px] font-[700] text-blue-600 mt-1">
                {data?.salesCount}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">In this Period</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <p className="text-[13px] text-gray-600 font-[500]">
                Total Order Amount
              </p>
              <h3 className="text-[24px] font-[700] text-green-600 mt-1">
                ₹
                {data.totalAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">Before discounts</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <p className="text-[13px] text-gray-600 font-[500]">
                Total Discounts
              </p>
              <h3 className="text-[24px] font-[700] text-orange-600 mt-1">
                ₹
                {data.totalDiscount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">
                Without coupon deductions
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <p className="text-[13px] text-gray-600 font-[500]">
                Total Coupon Deductions
              </p>
              <h3 className="text-[24px] font-[700] text-orange-600 mt-1">
                ₹
                {data.couponDeduction.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">
                Sum of the coupon deductions of all orders
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <p className="text-[13px] text-gray-600 font-[500]">Net Sales</p>
              <h3 className="text-[24px] font-[700] text-orange-600 mt-1">
                ₹
                {data.totalPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">
                After deducting discounts
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
              <p className="text-[13px] text-gray-600 font-[500]">
                Returned Orders
              </p>
              <h3 className="text-[24px] font-[700] text-red-600 mt-1">
                ₹
                {data.returnSum.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">
                Count: {data.returnCount.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200">
              <p className="text-[13px] text-gray-600 font-[500]">
                Cancelled Orders
              </p>
              <h3 className="text-[24px] font-[700] text-rose-600 mt-1">
                ₹
                {data.cancelSum.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">
                Count: {data.cancelCount.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <p className="text-[13px] text-gray-600 font-[500]">
                Total Revenue
              </p>
              <h3 className="text-[24px] font-[700] text-purple-600 mt-1">
                ₹
                {data.totalRevenue.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">
                Final amount after all deductions
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Metric</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-6 py-3 font-[500]">Gross Sales</td>
                  <td className="px-6 py-3 text-right">
                    ₹
                    {data.totalAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-[500] text-orange-600">
                    Product Discounts
                  </td>
                  <td className="px-6 py-3 text-right text-orange-600">
                    - ₹
                    {data.totalDiscount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-[500] text-orange-600">
                    Coupon Deductions
                  </td>
                  <td className="px-6 py-3 text-right text-orange-600">
                    - ₹
                    {data.couponDeduction.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b bg-green-50">
                  <td className="px-6 py-4 font-[600] text-green-600">
                    Net Sales
                  </td>
                  <td className="px-6 py-4 text-right font-[600] text-green-600">
                    ₹
                    {data.totalPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-[500] text-red-600">
                    Returned Orders ({data.returnCount})
                  </td>
                  <td className="px-6 py-3 text-right text-red-600">
                    - ₹
                    {data.returnSum.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-[500] text-red-600">
                    Cancelled Orders ({data.cancelCount})
                  </td>
                  <td className="px-6 py-3 text-right text-red-600">
                    - ₹
                    {data.cancelSum.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b bg-purple-50">
                  <td className="px-6 py-4 font-[700] text-purple-600 text-[15px]">
                    Total Revenue
                  </td>
                  <td className="px-6 py-4 text-right font-[700] text-purple-600 text-[15px]">
                    ₹
                    {data.totalRevenue.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="my-4 w-full shadow-md sm:rounded-lg bg-white">
        <div className="flex items-center justify-between p-5">
          <h2 className="text-[18px] font-[600]">Top Selling Products</h2>
        </div>
        <TopProducts filter={appliedFilter} />
      </div>

      <div className="my-4 w-full shadow-md sm:rounded-lg bg-white">
        <div className="flex items-center justify-between p-5">
          <h2 className="text-[18px] font-[600]">Top Selling Categories</h2>
        </div>
        <TopCategory filter={appliedFilter} />
      </div>
      <div className="my-4 w-full shadow-md sm:rounded-lg bg-white">
        <div className="flex items-center justify-between p-5">
          <h2 className="text-[18px] font-[600]">Top Selling Brands</h2>
        </div>
        <TopBrands filter={appliedFilter} />
      </div>
      <div className="my-4 w-full flex gap-5 shadow-md sm:rounded-lg bg-white">
        <div className="px-4 w-full">
          <div className="flex items-center justify-between p-5">
            <h2 className="text-[18px] font-[600]">Revenue</h2>
          </div>
          <LineGraph show={show} filter={appliedFilter} />
        </div>
        <div className="px-4 w-full">
          <div className="flex items-center justify-between p-5">
            <h2 className="text-[18px] font-[600]">Sales</h2>
          </div>
          <SalesLineGraph show={show} filter={appliedFilter} />
        </div>
      </div>
      <div className="my-4 w-full flex gap-5 shadow-md sm:rounded-lg bg-white">
        <div className="px-4">
          <div className="flex items-center justify-between p-5">
            <h2 className="text-[18px] font-[600]">Users</h2>
          </div>
          <Graph show={show} filter={appliedFilter} />
        </div>
        <div className="px-4">
          <div className="flex items-center justify-between p-5">
            <h2 className="text-[18px] font-[600]">Orders Status</h2>
          </div>
          <div className={`${show ? "" : "pl-[50px]"}`}>
            <OrderStatusChart show={show} filter={appliedFilter} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
