import { useState } from 'react';

export interface LineChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      tension?: number;
    }>;
  };
  title?: string;
  height?: number;
  className?: string;
}

export default function LineChart({
  data,
  title,
  height = 300,
  className = ''
}: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ datasetIndex: number; pointIndex: number } | null>(null);

  const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data));
  const minValue = Math.min(...data.datasets.flatMap(dataset => dataset.data));
  const valueRange = maxValue - minValue;

  const generateColor = (index: number) => `hsl(${index * 137.5}, 70%, 50%)`;

  const chartWidth = 500;
  const chartHeight = height;
  const padding = 60;

  const availableWidth = chartWidth - (padding * 2);
  const availableHeight = chartHeight - (padding * 2);

  const getX = (index: number) => padding + (index / (data.labels.length - 1)) * availableWidth;
  const getY = (value: number) => padding + ((maxValue - value) / valueRange) * availableHeight;

  const createSmoothPath = (points: Array<{ x: number; y: number }>, tension = 0.4) => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];

      if (tension === 0) {
        path += ` L ${curr.x} ${curr.y}`;
      } else {
        const cp1x = prev.x + (curr.x - (points[i - 2]?.x || prev.x)) * tension;
        const cp1y = prev.y + (curr.y - (points[i - 2]?.y || prev.y)) * tension;
        const cp2x = curr.x - (next?.x || curr.x - prev.x) * tension;
        const cp2y = curr.y - (next?.y || curr.y - prev.y) * tension;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }

    return path;
  };

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding + (availableHeight * ratio);
            const value = maxValue - (valueRange * ratio);
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
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

          {/* Lines and areas */}
          {data.datasets.map((dataset, datasetIndex) => {
            const color = dataset.borderColor || generateColor(datasetIndex);
            const backgroundColor = dataset.backgroundColor || `${color}20`;
            const tension = dataset.tension ?? 0.4;

            const points = dataset.data.map((value, index) => ({
              x: getX(index),
              y: getY(value)
            }));

            const linePath = createSmoothPath(points, tension);
            
            // Create area path
            const areaPath = linePath + 
              ` L ${points[points.length - 1].x} ${chartHeight - padding}` +
              ` L ${points[0].x} ${chartHeight - padding} Z`;

            return (
              <g key={datasetIndex}>
                {/* Area fill */}
                <path
                  d={areaPath}
                  fill={backgroundColor}
                  opacity="0.3"
                />
                
                {/* Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points */}
                {points.map((point, pointIndex) => (
                  <circle
                    key={pointIndex}
                    cx={point.x}
                    cy={point.y}
                    r={hoveredPoint?.datasetIndex === datasetIndex && hoveredPoint?.pointIndex === pointIndex ? 6 : 4}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint({ datasetIndex, pointIndex })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* Hover tooltip */}
                {hoveredPoint?.datasetIndex === datasetIndex && (
                  <g>
                    {points.map((point, pointIndex) => {
                      if (hoveredPoint.pointIndex !== pointIndex) return null;
                      
                      const value = dataset.data[pointIndex];
                      const label = data.labels[pointIndex];
                      
                      return (
                        <g key={pointIndex}>
                          <rect
                            x={point.x - 30}
                            y={point.y - 35}
                            width="60"
                            height="25"
                            fill="rgba(0, 0, 0, 0.8)"
                            rx="4"
                          />
                          <text
                            x={point.x}
                            y={point.y - 20}
                            textAnchor="middle"
                            className="text-xs fill-white font-medium"
                          >
                            {label}: {value}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.labels.map((label, index) => {
            const x = getX(index);
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
          })}
        </svg>

        {/* Legend */}
        {data.datasets.length > 1 && (
          <div className="flex justify-center gap-4 mt-4">
            {data.datasets.map((dataset, index) => {
              const color = dataset.borderColor || generateColor(index);
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-1 rounded-full"
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