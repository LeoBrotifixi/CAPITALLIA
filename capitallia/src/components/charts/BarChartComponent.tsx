import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { formatCurrency } from '../../utils/financialCalculations';
import { CHART_COLORS } from './PieChartComponent';

interface BarSeriesConfig {
  dataKey: string;
  name: string;
  color?: string;
  stackId?: string;
  barSize?: number;
}

interface BarChartComponentProps {
  data: any[];
  series: BarSeriesConfig[];
  height?: number;
  xAxisDataKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  layout?: 'horizontal' | 'vertical';
  yAxisTickFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => [string, string];
  tooltipLabelFormatter?: (label: any) => string;
  grid?: boolean;
  showBackground?: boolean;
  borderRadius?: number;
  syncId?: string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  series,
  height = 300,
  xAxisDataKey,
  xAxisLabel,
  yAxisLabel,
  layout = 'horizontal',
  yAxisTickFormatter = (value) => `${new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(value)}`,
  tooltipFormatter = (value: number) => [formatCurrency(value), ''],
  tooltipLabelFormatter,
  grid = true,
  showBackground = false,
  borderRadius = 4,
  syncId
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 10, right: 30, left: 20, bottom: 15 }}
          syncId={syncId}
        >
          <defs>
            {series.map((s, index) => {
              const color = s.color || CHART_COLORS[index % CHART_COLORS.length];
              return (
                <linearGradient 
                  key={`gradient-${s.dataKey}`} 
                  id={`colorBar${s.dataKey}`} 
                  x1="0" 
                  y1="0" 
                  x2="0" 
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                </linearGradient>
              );
            })}
          </defs>
          
          {grid && <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} />}
          
          <XAxis 
            dataKey={xAxisDataKey} 
            tick={{ fill: "#A0A0A0" }}
            tickLine={{ stroke: "#A0A0A0" }}
            axisLine={{ stroke: "#444" }}
            label={xAxisLabel ? {
              value: xAxisLabel,
              position: 'insideBottomRight',
              offset: -10,
              fill: "#A0A0A0"
            } : undefined}
            {...(layout === 'vertical' ? { type: 'number' } : {})}
          />
          
          <YAxis 
            tickFormatter={layout === 'horizontal' ? yAxisTickFormatter : undefined}
            tick={{ fill: "#A0A0A0" }}
            tickLine={{ stroke: "#A0A0A0" }}
            axisLine={{ stroke: "#444" }}
            label={yAxisLabel ? {
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              fill: "#A0A0A0",
              dx: -10
            } : undefined}
            {...(layout === 'vertical' ? { dataKey: xAxisDataKey, type: 'category' } : {})}
          />
          
          <Tooltip
            formatter={tooltipFormatter}
            labelFormatter={tooltipLabelFormatter}
            contentStyle={{
              backgroundColor: '#2a2a38',
              border: '1px solid #444',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
            }}
            cursor={{ fill: 'rgba(100, 100, 100, 0.1)' }}
            itemStyle={{ padding: '4px 0' }}
            labelStyle={{ color: '#FFF', fontWeight: 'bold', marginBottom: '5px' }}
          />
          
          <Legend 
            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
            formatter={(value: string) => (
              <span className="text-sm font-medium text-gray-300">{value}</span>
            )}
            iconType="circle"
          />
          
          {showBackground && series.map((s, index) => (
            <Bar
              key={`bg-${s.dataKey}`}
              dataKey={s.dataKey}
              fill="#444"
              fillOpacity={0.2}
              radius={borderRadius}
              barSize={s.barSize || 20}
              stackId={s.stackId}
              isAnimationActive={false}
            />
          ))}
          
          {series.map((s, index) => {
            const color = s.color || CHART_COLORS[index % CHART_COLORS.length];
            return (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name}
                fill={`url(#colorBar${s.dataKey})`}
                stroke={color}
                strokeWidth={1}
                radius={borderRadius}
                barSize={s.barSize || 20}
                stackId={s.stackId}
                animationDuration={1000}
                animationBegin={index * 150}
                animationEasing="ease-out"
              >
                {!s.stackId && data.map((entry, entryIndex) => (
                  <Cell 
                    key={`cell-${entryIndex}`} 
                    fill={`url(#colorBar${s.dataKey})`}
                  />
                ))}
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent; 