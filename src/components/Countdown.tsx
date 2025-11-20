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
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-linear-to-r from-rose-500 to-violet-600 rounded-lg blur-xs opacity-30 group-hover:opacity-70 transition duration-500"></div>
      <div className="relative px-4 py-3 rounded-lg bg-obsidian-800/90 backdrop-blur-xl border border-white/10">
        <div className="text-3xl font-thin tabular-nums bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">
          {value.toString().padStart(2, "0")}
        </div>
        <div className="text-xs font-light tracking-widest uppercase text-slate-400">{unit}</div>
      </div>
    </div>
  )
}
