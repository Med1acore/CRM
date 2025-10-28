// @ts-ignore
import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';

type PieDatum = { id: string; label?: string; value: number; color?: string };
type LineSerie = { id: string; data: { x: string | number | Date; y: number }[] };

/**
 * Pie chart showing engagement distribution.
 */
export function EngagementPie({ data }: { data: PieDatum[] }) {
  return (
    <div style={{ height: 320 }}>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.6}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        colors={['#2563eb', '#10b981', '#f59e0b']}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#cbd5e1"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            symbolShape: 'circle',
          },
        ]}
        theme={{
          text: { fill: 'var(--foreground, #e5e7eb)' },
          grid: { line: { stroke: 'rgba(255,255,255,0.1)', strokeDasharray: '3 3' } },
        }}
      />
    </div>
  );
}

/**
 * Line chart visualising engagement funnel over time.
 */
export function EngagementFunnelLine({ data }: { data: LineSerie[] }) {
  return (
    <div style={{ height: 360 }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 32, right: 24, bottom: 40, left: 48 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        curve="monotoneX"
        colors={['#2563eb', '#10b981', '#f59e0b']}
        enableArea={false}
        axisBottom={{ tickSize: 0, tickPadding: 8 }}
        axisLeft={{ tickSize: 0, tickPadding: 8 }}
        gridYValues={5}
        enableGridX={false}
        enablePoints
        pointSize={8}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enableSlices="x"
        useMesh
        theme={{
          text: { fill: 'var(--foreground, #e5e7eb)' },
          grid: { line: { stroke: 'rgba(255, 255, 255, 0.1)', strokeDasharray: '3 3' } },
          crosshair: { line: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 } },
          tooltip: { container: { background: 'rgba(0,0,0,0.8)', color: '#fff', borderRadius: 8 } },
        }}
      />
    </div>
  );
}
