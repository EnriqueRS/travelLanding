import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"

export default function ExpensesToggle(): JSX.Element {
  const [visible, setVisible] = useState<boolean>(true)

  useEffect(() => {
    const el = document.getElementById("expenses")
    if (!el) return
    setVisible(!el.classList.contains("hidden"))
  }, [])

  function toggle(): void {
    const el = document.getElementById("expenses")
    if (!el) return
    const willShow = el.classList.contains("hidden")
    el.classList.toggle("hidden")
    setVisible(willShow)
    if (willShow) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-sm bg-obsidian-800/60 hover:bg-obsidian-800/80 backdrop-blur-md transition-colors"
      aria-controls="expenses"
      aria-expanded={visible}
    >
      <Icon icon={visible ? "mdi:eye" : "mdi:eye-off"} className="h-5 w-5" />
      <span>Gastos</span>
    </button>
  )
}
