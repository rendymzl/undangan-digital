import { useState } from 'react';

export interface BarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }>;
  };
  title?: string;
  height?: number;
  horizontal?: boolean;
  className?: string;
}

export default function BarChart({
  data,
  title,
  height = 300,
  horizontal = false,
  className = ''
}: BarChartProps) {
  const [hoveredBar, setHoveredBar] = useState<{ datasetIndex: number; barIndex: number } | null>(null);

  const maxValue = Math.max(
    ...data.datasets.flatMap(dataset => dataset.data)
  );

  const generateColor = (index: number) => `hsl(${index * 137.5}, 70%, 50%)`;

  const chartWidth = horizontal ? height * 1.5 : 400;
  const chartHeight = horizontal ? 400 : height;
  const padding = 60;
  const barSpacing = 4;
  const groupSpacing = 20;

  const availableWidth = chartWidth - (padding * 2);
  const availableHeight = chartHeight - (padding * 2);

  const barWidth = horizontal 
    ? (availableHeight - (data.labels.length - 1) * groupSpacing) / data.labels.length / data.datasets.length - barSpacing
    : (availableWidth - (data.labels.length - 1) * groupSpacing) / data.labels.length / data.datasets.length - barSpacing;

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {!horizontal && (
            <>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = padding + (availableHeight * (1 - ratio));
                return (
                  <g key={ratio}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={chartWidth - padding}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                    <text
                      x={padding - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="text-xs fill-gray-600"
                    >
                      {Math.round(maxValue * ratio)}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {horizontal && (
            <>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const x = padding + (availableWidth * ratio);
                return (
                  <g key={ratio}>
                    <line
                      x1={x}
                      y1={padding}
                      x2={x}
                      y2={chartHeight - padding}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={chartHeight - padding + 20}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {Math.round(maxValue * ratio)}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* Bars */}
          {data.labels.map((label, labelIndex) => {
            return data.datasets.map((dataset, datasetIndex) => {
              const value = dataset.data[labelIndex];
              const color = Array.isArray(dataset.backgroundColor) 
                ? dataset.backgroundColor[labelIndex] || generateColor(datasetIndex)
                : dataset.backgroundColor || generateColor(datasetIndex);

              if (horizontal) {
                const barHeight = barWidth;
                const barLength = (value / maxValue) * availableWidth;
                const y = padding + labelIndex * (barHeight * data.datasets.length + groupSpacing) + datasetIndex * (barHeight + barSpacing);
                const x = padding;

                return (
                  <g key={`${labelIndex}-${datasetIndex}`}>
                    <rect
                      x={x}
                      y={y}
                      width={barLength}
                      height={barHeight}
                      fill={color}
                      rx="4"
                      className={`transition-all duration-200 cursor-pointer ${
                        hoveredBar?.datasetIndex === datasetIndex && hoveredBar?.barIndex === labelIndex
                          ? 'opacity-80'
                          : 'opacity-100'
                      }`}
                      onMouseEnter={() => setHoveredBar({ datasetIndex, barIndex: labelIndex })}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    {hoveredBar?.datasetIndex === datasetIndex && hoveredBar?.barIndex === labelIndex && (
                      <text
                        x={x + barLength + 5}
                        y={y + barHeight / 2 + 4}
                        className="text-xs fill-gray-700 font-medium"
                      >
                        {value}
                      </text>
                    )}
                  </g>
                );
              } else {
                const barHeight = (value / maxValue) * availableHeight;
                const x = padding + labelIndex * (barWidth * data.datasets.length + groupSpacing) + datasetIndex * (barWidth + barSpacing);
                const y = chartHeight - padding - barHeight;

                return (
                  <g key={`${labelIndex}-${datasetIndex}`}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={color}
                      rx="4"
                      className={`transition-all duration-200 cursor-pointer ${
                        hoveredBar?.datasetIndex === datasetIndex && hoveredBar?.barIndex === labelIndex
                          ? 'opacity-80'
                          : 'opacity-100'
                      }`}
                      onMouseEnter={() => setHoveredBar({ datasetIndex, barIndex: labelIndex })}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    {hoveredBar?.datasetIndex === datasetIndex && hoveredBar?.barIndex === labelIndex && (
                      <text
                        x={x + barWidth / 2}
                        y={y - 5}
                        textAnchor="middle"
                        className="text-xs fill-gray-700 font-medium"
                      >
                        {value}
                      </text>
                    )}
                  </g>
                );
              }
            });
          })}

          {/* Labels */}
          {data.labels.map((label, index) => {
            if (horizontal) {
              const y = padding + index * (barWidth * data.datasets.length + groupSpacing) + (barWidth * data.datasets.length) / 2;
              return (
                <text
                  key={index}
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-sm fill-gray-700"
                >
                  {label}
                </text>
              );
            } else {
              const x = padding + index * (barWidth * data.datasets.length + groupSpacing) + (barWidth * data.datasets.length) / 2;
              return (
                <text
                  key={index}
                  x={x}
                  y={chartHeight - padding + 20}
                  textAnchor="middle"
                  className="text-sm fill-gray-700"
                >
                  {label}
                </text>
              );
            }
          })}
        </svg>

        {/* Legend */}
        {data.datasets.length > 1 && (
          <div className="flex justify-center gap-4 mt-4">
            {data.datasets.map((dataset, index) => {
              const color = Array.isArray(dataset.backgroundColor) 
                ? dataset.backgroundColor[0] || generateColor(index)
                : dataset.backgroundColor || generateColor(index);
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-700">{dataset.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}