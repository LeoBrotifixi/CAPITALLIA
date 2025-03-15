import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { formatCurrency } from '../../utils/financialCalculations';
import { CHART_COLORS } from './PieChartComponent';

interface AreaSeriesConfig {
  dataKey: string;
  name: string;
  color?: string;
  strokeWidth?: number;
  type?: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter' | 'basis' | 'basisOpen' | 'basisClosed' | 'natural';
  stackId?: string;
  fillOpacity?: number;
  activeDotSize?: number;
  connectNulls?: boolean;
}

interface AreaChartComponentProps {
  data: any[];
  series: AreaSeriesConfig[];
  height?: number;
  xAxisDataKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  yAxisTickFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => [string, string];
  tooltipLabelFormatter?: (label: any) => string;
  grid?: boolean;
  syncId?: string;
}

const AreaChartComponent: React.FC<AreaChartComponentProps> = ({
  data,
  series,
  height = 300,
  xAxisDataKey,
  xAxisLabel,
  yAxisLabel,
  yAxisTickFormatter = (value) => `${new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(value)}`,
  tooltipFormatter = (value: number) => [formatCurrency(value), ''],
  tooltipLabelFormatter,
  grid = true,
  syncId
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 15 }}
          syncId={syncId}
        >
          <defs>
            {series.map((s, index) => {
              const color = s.color || CHART_COLORS[index % CHART_COLORS.length];
              return (
                <linearGradient 
                  key={`gradient-${s.dataKey}`} 
                  id={`colorArea${s.dataKey}`} 
                  x1="0" 
                  y1="0" 
                  x2="0" 
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
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
          />
          
          <YAxis 
            tickFormatter={yAxisTickFormatter}
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
          
          {series.map((s, index) => {
            const color = s.color || CHART_COLORS[index % CHART_COLORS.length];
            return (
              <Area
                key={s.dataKey}
                type={s.type || 'monotone'}
                dataKey={s.dataKey}
                name={s.name}
                stroke={color}
                strokeWidth={s.strokeWidth || 2}
                fill={`url(#colorArea${s.dataKey})`}
                fillOpacity={s.fillOpacity || 1}
                stackId={s.stackId}
                activeDot={{ r: s.activeDotSize || 5, strokeWidth: 0 }}
                connectNulls={s.connectNulls || false}
                animationDuration={1000}
                animationBegin={index * 150}
                animationEasing="ease-out"
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent; 