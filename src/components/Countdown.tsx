import { useEffect, useState } from "react"

function getTimeLeft(target: Date) {
  const now = new Date().getTime()
  const diff = Math.max(0, target.getTime() - now)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

export default function Countdown(props: {
  targetISO: string
  label?: string
}): JSX.Element {
  const { targetISO, label = "Cuenta atrás" } = props
  const target = new Date(targetISO)
  const [left, setLeft] = useState(getTimeLeft(target))

  useEffect(() => {
    const id = setInterval(() => setLeft(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [targetISO])

  return (
    <div className="flex flex-wrap auto-cols-max gap-4 items-center text-center">
      <span className="text-sm opacity-80">{label}</span>
      <div className="flex flex-wrap gap-2">
        <TimeBox value={left.days} unit="días" />
        <TimeBox value={left.hours} unit="horas" />
        <TimeBox value={left.minutes} unit="min" />
        <TimeBox value={left.seconds} unit="seg" />
      </div>
    </div>
  )
}

function TimeBox({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800">
      <div className="text-2xl font-semibold tabular-nums">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-xs opacity-70">{unit}</div>
    </div>
  )
}
