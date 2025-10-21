import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {  useGetSalesChartQuery } from "../../Store/Api/admin/orders";

const SalesLineGraph = ({ show, filter }) => {

  const { data, isLoading, isError } = useGetSalesChartQuery(filter);

  if (isLoading)
    return (
      <div className="completed">
        <div className="chart-container text-sm text-gray-500">
          Loading chart...
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="completed">
        <div className="chart-container text-red-500">
          Failed to load chart data
        </div>
      </div>
    );
  return (
    <div className="completed">
      <div className="chart-container">
        <LineChart
          width={show ? 530 : 700}
          height={280}
          data={data?.data || []}
          margin={{
            top: 20,
            right: 5,
            bottom: 5,
            left: -20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="name"
            strokeWidth={0}
            style={{ fontSize: "11px", fontFamily: "inter" }}
            padding={{ left: 30, right: 0 }}
          />

          <YAxis
            strokeDasharray="3 3"
            type="number"
            strokeWidth={0}
            style={{ fontSize: "11px", fontFamily: "inter" }}
           allowDecimals={false}
          />

          <Tooltip cursor={{ stroke: "#00b879" }} />

          <Line
            activeDot={{ r: 5 }}
            type="monotone"
            strokeLinecap="round"
            strokeWidth={3}
            dot={true}
            dataKey="total"
            stroke="#00b879"
          />
        </LineChart>
      </div>
    </div>
  );
};

export default SalesLineGraph;
