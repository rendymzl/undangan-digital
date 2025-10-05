import { useState } from 'react';

export interface PieChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
      borderWidth?: number;
    }>;
  };
  title?: string;
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export default function PieChart({
  data,
  title,
  height = 300,
  showLegend = true,
  className = ''
}: PieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const generateColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137.5) % 360;
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  };

  // Cek apakah dataset ada dan valid
  const dataset = data.datasets && data.datasets.length > 0 ? data.datasets[0] : undefined;
  const total = dataset?.data?.reduce((sum, value) => sum + value, 0) ?? 0;
  const colors = dataset?.backgroundColor || generateColors(data.labels.length);

  let cumulativePercentage = 0;
  const segments = dataset?.data?.map((value, index) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
    
    cumulativePercentage += percentage;
    
    return {
      value,
      percentage,
      startAngle,
      endAngle,
      color: colors[index] || `hsl(${index * 137.5}, 70%, 50%)`,
      label: data.labels[index]
    };
  }) || [];

  const createPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const radius = Math.min(height, 300) / 2 - 20;
  const centerX = radius + 20;
  const centerY = radius + 20;

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <div className="flex items-center justify-center gap-8">
        <div style={{ height: `${height}px`, width: `${height}px` }}>
          <svg width={height} height={height} className="overflow-visible">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={createPath(centerX, centerY, radius, segment.startAngle, segment.endAngle)}
                fill={segment.color}
                stroke="#ffffff"
                strokeWidth="2"
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredIndex === index ? 'opacity-80 scale-105' : 'opacity-100'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transformOrigin: `${centerX}px ${centerY}px`
                }}
              />
            ))}
          </svg>
        </div>
        
        {showLegend && (
          <div className="flex flex-col gap-2">
            {segments.map((segment, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                  hoveredIndex === null || hoveredIndex === index ? 'opacity-100' : 'opacity-50'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm">
                  {segment.label}: {segment.value} ({segment.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}