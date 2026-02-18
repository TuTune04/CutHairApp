"use client"

import { RefreshCcw } from "lucide-react"

interface AdminHeaderProps {
  apiUrl: string
  isLoading: boolean
  message: string
  error: string
  onApiUrlChange: (value: string) => void
  onRefresh: () => void
}

export function AdminHeader({ apiUrl, isLoading, message, error, onApiUrlChange, onRefresh }: AdminHeaderProps) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bang dieu khien lich hen</h1>
          <p className="text-sm text-neutral-500">Quan ly lich hen, doanh thu ngay va doanh thu thang.</p>
        </div>
        <div className="flex w-full gap-2 lg:w-auto">
          <input
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm lg:w-80"
            value={apiUrl}
            onChange={(event) => onApiUrlChange(event.target.value)}
            placeholder="http://localhost:4000"
          />
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            <RefreshCcw className="h-4 w-4" />
            {isLoading ? "Dang tai..." : "Dong bo"}
          </button>
        </div>
      </div>
      {message ? <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </section>
  )
}
