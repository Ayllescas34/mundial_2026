import { clsx } from 'clsx'
import type { StickerWithOwnership } from '@/types/database'

interface Props {
  sticker: StickerWithOwnership
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function StickerChip({ sticker, onClick, size = 'md' }: Props) {
  const status = sticker.quantity === 0 ? 'missing' : sticker.quantity === 1 ? 'owned' : 'repeated'

  return (
    <button
      onClick={onClick}
      title={`${sticker.number} — ${sticker.name}`}
      className={clsx(
        'rounded-lg border font-mono font-medium transition-all duration-150 cursor-pointer select-none',
        size === 'md' ? 'w-10 h-10 text-xs' : 'w-8 h-8 text-[10px]',
        status === 'missing' && 'bg-pitch-900/60 border-white/5 text-white/20 hover:border-white/20',
        status === 'owned' && 'bg-green-900/50 border-green-500/30 text-green-300 sticker-shine hover:border-green-400/60 hover:scale-105',
        status === 'repeated' && 'bg-yellow-900/40 border-yellow-500/40 text-yellow-300 hover:border-yellow-400 hover:scale-105',
        'relative flex items-center justify-center',
      )}
    >
      {sticker.number.replace(/[A-Z]+/, '')}
      {status === 'repeated' && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
          {sticker.quantity}
        </span>
      )}
    </button>
  )
}
