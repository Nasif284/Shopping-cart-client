import {
  Cell,
  Pie,
  PieChart,
  Tooltip,
  Legend,
} from "recharts";
import { useGetStatusChartQuery } from "../../Store/Api/admin/orders";

const COLORS = ["#FFA500", "#00C49F", "#4CAF50", "#FF4C4C", "#8A2BE2"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: "12px", fontFamily: "inter" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function OrderStatusChart({ show, filter }) {
  const { data } = useGetStatusChartQuery(filter);
  const chartData = data?.data || [];

  const hasData = chartData.some((item) => item.total > 0);

  if (!hasData) {
    return (
      <div
        style={{
          width: show ? 530 : 700,
          height: 270,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "inter",
          fontSize: "14px",
          color: "#888",
          border: "1px dashed #ccc",
          borderRadius: "10px",
        }}
      >
        No Orders Available
      </div>
    );
  }

  return (
    <PieChart width={show ? 530 : 700} height={270}>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={100}
        dataKey="total"
      >
        {chartData.map((entry, index) => (
          <Cell
            key={`cell-${entry.name}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Tooltip
        formatter={(value, name) => [`${value} Orders`, name]}
        contentStyle={{ fontFamily: "inter", fontSize: "13px" }}
      />
      <Legend
        verticalAlign="bottom"
        align="center"
        iconSize={10}
        wrapperStyle={{ fontFamily: "inter", fontSize: "13px" }}
      />
    </PieChart>
  );
}

