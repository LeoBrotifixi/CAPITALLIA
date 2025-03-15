import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency, formatPercent } from '../../utils/financialCalculations';

// Cores padronizadas para todos os gráficos
export const CHART_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6', '#06B6D4'];

interface PieChartItem {
  name: string;
  value: number;
}

interface PieChartComponentProps {
  data: PieChartItem[];
  height?: number;
  formatter?: (value: number) => [string, string];
  showPercentage?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  legendPosition?: 'right' | 'bottom';
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  height = 300,
  formatter = (value: number) => [formatCurrency(value), ''],
  showPercentage = true,
  innerRadius = 60,
  outerRadius = 80,
  legendPosition = 'right'
}) => {
  // Renderizador personalizado de labels
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    // Posicionamento mais conservador para evitar problemas
    const radius = innerRadius + (outerRadius - innerRadius) * 1.7;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return showPercentage ? (
      <text 
        x={x} 
        y={y} 
        fill="#FFFFFF" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="medium"
        stroke="#121218"
        strokeWidth={1}
        paintOrder="stroke"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    ) : null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <defs>
            {CHART_COLORS.map((color, index) => (
              <linearGradient 
                key={`gradient-${index}`} 
                id={`pieGradient-${index}`} 
                x1="0" 
                y1="0" 
                x2="0" 
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.7} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={5}
            dataKey="value"
            animationDuration={500}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#pieGradient-${index % CHART_COLORS.length})`} 
                stroke="#121218"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={formatter}
            contentStyle={{
              backgroundColor: '#2a2a38',
              border: '1px solid #444',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
            }}
            itemStyle={{ color: '#A0A0A0', padding: '4px 0' }}
            labelStyle={{ color: '#FFF', fontWeight: 'bold', marginBottom: '5px' }}
          />
          <Legend
            layout={legendPosition === 'right' ? 'vertical' : 'horizontal'}
            verticalAlign={legendPosition === 'right' ? 'middle' : 'bottom'}
            align={legendPosition === 'right' ? 'right' : 'center'}
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span className="text-sm font-medium text-gray-300">{value}</span>
            )}
            wrapperStyle={{
              paddingLeft: legendPosition === 'right' ? '20px' : '0px',
              fontSize: '12px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent; 