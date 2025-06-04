"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

// Re-export Recharts components
const BarChart = RechartsPrimitive.BarChart
const LineChart = RechartsPrimitive.LineChart
const AreaChart = RechartsPrimitive.AreaChart
const PieChart = RechartsPrimitive.PieChart
const RadialBarChart = RechartsPrimitive.RadialBarChart
const ScatterChart = RechartsPrimitive.ScatterChart
const ComposedChart = RechartsPrimitive.ComposedChart
const ResponsiveContainer = RechartsPrimitive.ResponsiveContainer

const Bar = RechartsPrimitive.Bar
const Line = RechartsPrimitive.Line
const Area = RechartsPrimitive.Area
const XAxis = RechartsPrimitive.XAxis
const YAxis = RechartsPrimitive.YAxis
const CartesianGrid = RechartsPrimitive.CartesianGrid
const Tooltip = RechartsPrimitive.Tooltip
const Legend = RechartsPrimitive.Legend
const Cell = RechartsPrimitive.Cell
const Pie = RechartsPrimitive.Pie
const RadialBar = RechartsPrimitive.RadialBar
const Scatter = RechartsPrimitive.Scatter
const ReferenceLine = RechartsPrimitive.ReferenceLine
const ReferenceArea = RechartsPrimitive.ReferenceArea
const ReferenceDot = RechartsPrimitive.ReferenceDot

// Define types for ChartContainer config
interface ChartConfig {
  [key: string]: {
    color?: string
    theme?: {
      light?: string
      dark?: string
    }
  }
}

// Chart Container
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: ChartConfig
    children: React.ComponentProps<typeof ResponsiveContainer>["children"]
  }
>(({ className, config: _config, children, ...props }, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Reserved for future styling/theming
  const _config_unused = _config
  return (
    <div ref={ref} className={cn("flex aspect-video justify-center text-xs", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

interface ChartTooltipPayload {
  color?: string
  dataKey?: string
  name?: string
  value?: number | string
  payload?: Record<string, unknown>
  formatter?: (value: number | string, name: string, props: ChartTooltipPayload, index: number, payload: ChartTooltipPayload[]) => React.ReactNode
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: ChartTooltipPayload[]
  label?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nameKey?: string
  labelKey?: string
  labelFormatter?: (label: string, payload: ChartTooltipPayload[]) => React.ReactNode
  formatter?: (value: number | string, name: string, props: ChartTooltipPayload, index: number, payload: ChartTooltipPayload[]) => React.ReactNode
  className?: string
  labelClassName?: string
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      formatter,
      nameKey,
      labelKey: _labelKey,
      labelClassName,
      ...props
    },
    ref,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Reserved for future use
    const _labelKey_unused = _labelKey
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      if (labelFormatter && typeof label !== "undefined") {
        return labelFormatter(label, payload)
      }

      if (!labelFormatter && typeof label !== "undefined") {
        return label
      }

      return ""
    }, [label, labelFormatter, payload, hideLabel])

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
        {...props}
      >
        {tooltipLabel ? <div className={cn("font-medium", labelClassName)}>{tooltipLabel}</div> : null}
        {payload.map((item, index) => {
          const key = nameKey || item.name || item.dataKey || "value"
          const itemFormatter = formatter || item.formatter

          return (
            <div
              key={item.dataKey || index}
              className={cn(
                "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                indicator === "dot" && "items-center",
              )}
            >
              {!hideIndicator && (
                <div
                  className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                    "h-2.5 w-2.5": indicator === "dot",
                    "w-1": indicator === "line",
                    "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                    "my-0.5": indicator === "dashed" || indicator === "line",
                  })}
                  style={
                    {
                      "--color-bg": item.color,
                      "--color-border": item.color,
                    } as React.CSSProperties
                  }
                />
              )}
              <div className={cn("flex flex-1 justify-between leading-none")}>
                <div className="grid gap-1.5">
                  <span className="text-muted-foreground">{key}</span>
                </div>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {itemFormatter && item.value !== undefined
                    ? itemFormatter(item.value, item.name || "", item, index, payload)
                    : item.value}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartTooltip = ({ content, ...props }: RechartsPrimitive.TooltipProps<number | string, string>) => {
  return <Tooltip {...props} content={content} />
}

interface ChartLegendPayload {
  color?: string
  value?: string
  dataKey?: string
}

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: ChartLegendPayload[]
    verticalAlign?: "top" | "bottom"
    nameKey?: string
  }
>(({ className, payload, verticalAlign = "bottom", nameKey, ...props }, ref) => {
  if (!payload?.length) {
    return null
  }

  const containerStyle = verticalAlign === "top" ? "mb-4" : "mt-4"

  return (
    <div ref={ref} className={cn("flex items-center justify-center gap-4", containerStyle, className)} {...props}>
      {payload.map((item, index) => {
        const key = nameKey || item.value || item.dataKey || "value"

        return (
          <div
            key={`item-${index}`}
            className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}
          >
            <div
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{
                backgroundColor: item.color,
              }}
            />
            <span className="text-muted-foreground">{key}</span>
          </div>
        )
      })}
    </div>
  )
})
ChartLegend.displayName = "ChartLegend"

const THEMES = { light: "", dark: ".dark" } as const

export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Key is intentionally unused
  const colorConfig = Object.entries(config).filter(([_, value]) => value.theme || value.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) =>
              `${prefix} [data-chart=${id}] {${colorConfig
                .map(([key, itemConfig]) => {
                  const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color
                  return color ? `  --color-${key}: ${color};` : null
                })
                .filter(Boolean)
                .join("\n")}}`,
          )
          .join("\n"),
      }}
    />
  )
}

export {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
  ReferenceArea,
  ReferenceDot,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
}