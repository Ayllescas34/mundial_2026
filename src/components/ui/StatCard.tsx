import { clsx } from 'clsx'
import type { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: number | string
  icon: LucideIcon
  color?: 'green' | 'gold' | 'red' | 'blue' | 'purple'
  suffix?: string
  delay?: number
}

const colorMap = {
  green: 'text-green-400 bg-green-400/10 border-green-400/20',
  gold: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  red: 'text-red-400 bg-red-400/10 border-red-400/20',
  blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
}

export function StatCard({ label, value, icon: Icon, color = 'green', suffix, delay = 0 }: Props) {
  return (
    <div className="glass rounded-2xl p-5 anim-slide-up" style={{ animationDelay: `${delay}ms` }}>
      <div className={clsx('w-10 h-10 rounded-xl border flex items-center justify-center mb-3', colorMap[color])}>
        <Icon size={18} />
      </div>
      <div className="flex items-end gap-1">
        <span className="font-display text-3xl text-white leading-none">{value}</span>
        {suffix && <span className="text-sm text-green-500 mb-0.5 font-body">{suffix}</span>}
      </div>
      <p className="text-xs text-green-700 mt-1 font-body">{label}</p>
    </div>
  )
}
