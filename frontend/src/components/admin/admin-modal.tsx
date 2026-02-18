"use client"

import type { ReactNode } from "react"

interface AdminModalProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}

export function AdminModal({ open, title, subtitle, onClose, children }: AdminModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl">
        <div className="border-b border-neutral-200 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">{title}</h3>
              {subtitle ? <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-100"
            >
              Dong
            </button>
          </div>
        </div>
        <div className="max-h-[75vh] overflow-auto p-4">{children}</div>
      </div>
    </div>
  )
}
