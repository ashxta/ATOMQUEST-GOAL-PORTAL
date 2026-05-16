import { useEffect } from 'react'
import { X } from 'lucide-react'
import { classNames } from '../lib/utils.js'

// --- Badge ----------------------------------------------------------------
const TONES = {
  muted: 'bg-paper text-muted border-line',
  ok: 'bg-ok/10 text-ok border-ok/20',
  warn: 'bg-warn/10 text-warn border-warn/25',
  bad: 'bg-bad/10 text-bad border-bad/20',
  brand: 'bg-brand-light text-brand border-brand/20',
}
export function Badge({ tone = 'muted', children, className }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        TONES[tone] || TONES.muted,
        className
      )}
    >
      {children}
    </span>
  )
}

// --- Avatar ---------------------------------------------------------------
const AVATAR_HUES = ['bg-brand', 'bg-accent', 'bg-[#3F6E8C]', 'bg-[#7A5C3E]', 'bg-[#5B6E4A]']
export function Avatar({ user, size = 36 }) {
  if (!user) return null
  const hue = AVATAR_HUES[(user.name?.charCodeAt(0) || 0) % AVATAR_HUES.length]
  return (
    <span
      className={classNames(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        hue
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      title={user.name}
    >
      {user.avatar || user.name?.slice(0, 2).toUpperCase()}
    </span>
  )
}

// --- Card -----------------------------------------------------------------
export function Card({ children, className, as: Tag = 'div' }) {
  return <Tag className={classNames('card', className)}>{children}</Tag>
}

// --- StatCard -------------------------------------------------------------
export function StatCard({ label, value, sub, icon: Icon, tone = 'brand' }) {
  return (
    <div className="card flex items-start gap-3 p-4">
      {Icon && (
        <span
          className={classNames(
            'mt-0.5 grid h-9 w-9 place-items-center rounded-lg',
            tone === 'brand' && 'bg-brand-light text-brand',
            tone === 'accent' && 'bg-accent-light text-accent',
            tone === 'ok' && 'bg-ok/10 text-ok',
            tone === 'warn' && 'bg-warn/10 text-warn',
            tone === 'bad' && 'bg-bad/10 text-bad'
          )}
        >
          <Icon size={18} strokeWidth={2.2} />
        </span>
      )}
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
        <div className="font-display text-2xl font-semibold leading-tight text-ink">{value}</div>
        {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
      </div>
    </div>
  )
}

// --- ProgressBar ----------------------------------------------------------
export function ProgressBar({ value, tone = 'brand', className }) {
  const pct = Math.max(0, Math.min(100, value || 0))
  const color =
    tone === 'ok' ? 'bg-ok' : tone === 'warn' ? 'bg-warn' : tone === 'bad' ? 'bg-bad' : 'bg-brand'
  return (
    <div className={classNames('h-2 w-full overflow-hidden rounded-full bg-paper', className)}>
      <div
        className={classNames('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// --- ScoreChip — circular-ish score indicator -----------------------------
export function ScoreChip({ score, size = 'md' }) {
  const tone =
    score === null || score === undefined
      ? 'muted'
      : score >= 90
        ? 'ok'
        : score >= 60
          ? 'warn'
          : 'bad'
  const text = score === null || score === undefined ? '—' : `${score}%`
  return (
    <Badge tone={tone} className={size === 'lg' ? 'px-3 py-1 text-sm' : ''}>
      {text}
    </Badge>
  )
}

// --- Modal ----------------------------------------------------------------
export function Modal({ open, onClose, title, children, footer, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 py-10 backdrop-blur-[2px]">
      <div
        className={classNames(
          'card w-full animate-fadeUp p-0 shadow-lift',
          width
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted transition hover:bg-paper hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-line bg-paper/60 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// --- EmptyState -----------------------------------------------------------
export function EmptyState({ icon: Icon, title, hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-line bg-surface/50 px-6 py-12 text-center">
      {Icon && (
        <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-paper text-muted">
          <Icon size={22} />
        </span>
      )}
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-muted">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// --- PageHeader -----------------------------------------------------------
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem]">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}

// --- SectionTitle ---------------------------------------------------------
export function SectionTitle({ children, right }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{children}</h2>
      {right}
    </div>
  )
}
