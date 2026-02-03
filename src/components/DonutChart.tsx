import { PieChart } from "@mui/x-charts/PieChart"
import { useMemo, type JSX } from "react"

type ExpensesChartProps = {
  expenses?: {
    name?: string
    category: string
    amountEUR?: number
    city?: string
  }[]
  categories?: {
    name: string
    color: string
  }[]
}

export default function DonutChart(props: ExpensesChartProps): JSX.Element {
  const { categories, expenses } = props

  const data = useMemo(() => {
    return (categories ?? [])
      .map((category) => {
        const valueRaw = (expenses ?? []).reduce((acc, item) => {
          if (item.category === category.name) {
            return acc + (item.amountEUR ?? 0)
          }
          return acc
        }, 0)
        const value = Math.round(valueRaw * 100) / 100
        const color = value !== 0 ? category.color : "#cbd5f5"
        return {
          label: category.name,
          value,
          color,
        }
      })
      .filter((item) => item.value !== 0)
  }, [categories, expenses])

  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const opacity = 0.6

  const dataByCity = useMemo(() => {
    return (expenses ?? []).map((expense) => {
      const label = expense.city ?? expense.name ?? "Sin datos"
      const idx = categories.findIndex((cat) => cat.name === expense.category)
      const color = hexToRgba(categories[idx]?.color ?? "#cbd5f5", opacity)
      return {
        label,
        value: expense.amountEUR ?? 0,
        color,
      }
    })
  }, [categories, expenses])

  const settings = {
    margin: { right: 5 },
    width: 300,
    height: 300,
    hideLegend: true,
    series: [
      {
        innerRadius: 0,
        outerRadius: 80,
        data: data,
        highlightScope: { fade: "global", highlight: "item" },
      },
      {
        id: "outer",
        innerRadius: 100,
        outerRadius: 120,
        data: dataByCity,
        highlightScope: { fade: "global", highlight: "item" },
      },
    ],
  }

  return <PieChart series={[{ data, arcLabel: "value" }]} {...settings} />
}
