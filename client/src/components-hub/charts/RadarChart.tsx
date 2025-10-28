import React from 'react';

interface RadarChartProps {
  data: { label: string; value: number }[];
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 200 }) => {
  const center = size / 2;
  const numLevels = 5;
  const angleSlice = (Math.PI * 2) / data.length;
  const radius = center * 0.8;

  const points = data.map((d, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * (d.value / 10) * Math.cos(angle);
    const y = center + radius * (d.value / 10) * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const axes = data.map((_, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x1: center, y1: center, x2: x, y2: y };
  });

  const labels = data.map((d, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * 1.15 * Math.cos(angle);
    const y = center + radius * 1.15 * Math.sin(angle);
    return { x, y, label: d.label };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g>
        {/* Concentric circles */}
        {[...Array(numLevels)].map((_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(radius / numLevels) * (i + 1)}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        {axes.map((axis, i) => (
          <line key={i} {...axis} stroke="#cbd5e1" strokeWidth="1" />
        ))}

        {/* Data shape */}
        <polygon
          points={points}
          fill="rgba(79, 70, 229, 0.4)"
          stroke="#4f46e5"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const x = center + radius * (d.value / 10) * Math.cos(angle);
            const y = center + radius * (d.value / 10) * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r="3" fill="#4f46e5" />
        })}

        {/* Labels */}
        {labels.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={l.y}
            fontSize="10"
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="#475569"
            fontWeight="600"
          >
            {l.label}
          </text>
        ))}
      </g>
    </svg>
  );
};

export default RadarChart;
