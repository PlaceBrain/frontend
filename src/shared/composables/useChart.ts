import { ref, onUnmounted, type Ref } from "vue";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";

function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function buildThemeColors() {
  return {
    text: getCSSVar("--color-text-secondary"),
    grid: getCSSVar("--color-chart-grid"),
    border: getCSSVar("--color-border"),
    accent: getCSSVar("--color-chart-1"),
    band: getCSSVar("--color-chart-band"),
  };
}

export interface ChartOptions {
  title?: string;
  unit?: string;
  precision?: number;
  showBand?: boolean;
}

export function useChart(containerRef: Ref<HTMLElement | null>, opts: ChartOptions = {}) {
  const chart = ref<uPlot | null>(null);
  let resizeObserver: ResizeObserver | null = null;

  function createChart(data: uPlot.AlignedData, mode: "raw" | "aggregated") {
    destroy();
    const el = containerRef.value;
    if (!el) return;

    // Skip creating chart with no data points
    if (!data[0] || data[0].length === 0) return;

    const colors = buildThemeColors();
    const width = el.clientWidth;
    const height = 220;

    const axes: uPlot.Axis[] = [
      {
        stroke: colors.text,
        grid: { stroke: colors.grid, width: 1 },
        ticks: { stroke: colors.grid, width: 1 },
      },
      {
        stroke: colors.text,
        grid: { stroke: colors.grid, width: 1 },
        ticks: { stroke: colors.grid, width: 1 },
        values: (_: uPlot, vals: number[]) =>
          vals.map((v) => (v == null ? "" : v.toFixed(opts.precision ?? 1))),
      },
    ];

    const series: uPlot.Series[] = [{}]; // x-axis timestamps
    let alignedData: uPlot.AlignedData;

    if (mode === "raw") {
      series.push({
        label: opts.title ?? "Value",
        stroke: colors.accent,
        width: 2,
        points: { show: false },
      });
      // Ensure data has exactly 2 arrays: [timestamps, values]
      alignedData = [data[0], data[1] ?? []];
    } else {
      // avg line
      series.push({
        label: "avg",
        stroke: colors.accent,
        width: 2,
        points: { show: false },
      });
      if (opts.showBand !== false) {
        series.push({
          label: "min",
          stroke: "transparent",
          width: 0,
          points: { show: false },
        });
        series.push({
          label: "max",
          stroke: "transparent",
          width: 0,
          points: { show: false },
          fill: colors.band,
        });
      }
      // Ensure data has exactly 4 arrays: [timestamps, avg, min, max]
      const empty = new Array(data[0].length).fill(null);
      alignedData = [data[0], data[1] ?? empty, data[2] ?? empty, data[3] ?? empty];
    }

    const uOpts: uPlot.Options = {
      width,
      height,
      series,
      axes,
      cursor: { drag: { x: false, y: false } },
      legend: { show: false },
      padding: [8, 8, 0, 0],
    };

    chart.value = new uPlot(uOpts, alignedData, el);

    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        if (chart.value && el) {
          chart.value.setSize({ width: el.clientWidth, height });
        }
      });
      resizeObserver.observe(el);
    }
  }

  function setData(data: uPlot.AlignedData) {
    if (chart.value) {
      chart.value.setData(data);
    }
  }

  function appendPoint(ts: number, value: number, windowSeconds = 3600) {
    if (!chart.value) return;
    const d = chart.value.data;
    const timestamps = [...d[0], ts];
    const values = [...(d[1] as (number | null)[]), value];

    // Trim to window
    const cutoff = ts - windowSeconds;
    let start = 0;
    while (start < timestamps.length && timestamps[start] < cutoff) start++;

    const newData: uPlot.AlignedData = [timestamps.slice(start), values.slice(start)];
    chart.value.setData(newData);
  }

  function destroy() {
    chart.value?.destroy();
    chart.value = null;
  }

  // Re-theme on dark mode toggle
  const themeObserver = new MutationObserver(() => {
    if (chart.value && containerRef.value) {
      const data = chart.value.data;
      const mode = chart.value.series.length > 2 ? "aggregated" : "raw";
      createChart(data, mode as "raw" | "aggregated");
    }
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  onUnmounted(() => {
    destroy();
    resizeObserver?.disconnect();
    themeObserver.disconnect();
  });

  return { chart, createChart, setData, appendPoint, destroy };
}
