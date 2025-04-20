import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const BudgetChart = ({ costs }) => {
  const [chartData, setChartData] = useState([]);

  // Colors for the chart
  const COLORS = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B'];

  // Prepare chart data when costs change
  useEffect(() => {
    if (costs) {
      const data = [
        { name: 'Accommodation', value: costs.accommodation },
        { name: 'Activities', value: costs.activities },
        { name: 'Meals', value: costs.meals },
        { name: 'Transport', value: costs.transport }
      ];
      setChartData(data);
    }
  }, [costs]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">₹{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  // Render the budget breakdown
  const renderBudgetBreakdown = () => {
    return (
      <div className="mt-4 space-y-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.name}
              </span>
            </div>
            <div className="text-sm text-gray-800 dark:text-gray-200">
              ₹{item.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {renderBudgetBreakdown()}
    </div>
  );
};

export default BudgetChart;