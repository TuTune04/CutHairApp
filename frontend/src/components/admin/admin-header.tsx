"use client"

import { RefreshCcw } from "lucide-react"

interface AdminHeaderProps {
  apiUrl: string
  adminApiKey: string
  adminUsername: string
  adminPassword: string
  isAdminLoggedIn: boolean
  isLoading: boolean
  message: string
  error: string
  onApiUrlChange: (value: string) => void
  onAdminApiKeyChange: (value: string) => void
  onAdminUsernameChange: (value: string) => void
  onAdminPasswordChange: (value: string) => void
  onAdminLogin: () => void
  onAdminLogout: () => void
  onRefresh: () => void
}

export function AdminHeader({
  apiUrl,
  adminApiKey,
  adminUsername,
  adminPassword,
  isAdminLoggedIn,
  isLoading,
  message,
  error,
  onApiUrlChange,
  onAdminApiKeyChange,
  onAdminUsernameChange,
  onAdminPasswordChange,
  onAdminLogin,
  onAdminLogout,
  onRefresh
}: AdminHeaderProps) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bang dieu khien lich hen</h1>
          <p className="text-sm text-neutral-500">Quan ly lich hen, doanh thu ngay va doanh thu thang.</p>
        </div>
        <div className="grid w-full gap-2 lg:grid-cols-[minmax(0,20rem)_minmax(0,20rem)_auto]">
          <input
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            value={apiUrl}
            onChange={(event) => onApiUrlChange(event.target.value)}
            placeholder="http://localhost:4000"
          />
          <input
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            value={adminApiKey}
            onChange={(event) => onAdminApiKeyChange(event.target.value)}
            placeholder="x-admin-api-key (neu backend bat bao mat)"
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
        <div className="grid w-full gap-2 lg:grid-cols-[minmax(0,15rem)_minmax(0,15rem)_auto_auto]">
          <input
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            value={adminUsername}
            onChange={(event) => onAdminUsernameChange(event.target.value)}
            placeholder="Tai khoan admin"
          />
          <input
            type="password"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            value={adminPassword}
            onChange={(event) => onAdminPasswordChange(event.target.value)}
            placeholder="Mat khau admin"
          />
          <button
            type="button"
            onClick={onAdminLogin}
            disabled={isLoading || adminUsername.trim().length === 0 || adminPassword.length === 0}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            Dang nhap
          </button>
          <button
            type="button"
            onClick={onAdminLogout}
            disabled={isLoading || !isAdminLoggedIn}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            Dang xuat
          </button>
        </div>
        <p className="text-xs text-neutral-500">
          Trang thai admin: {isAdminLoggedIn ? "Da dang nhap bang tai khoan admin" : "Chua dang nhap"}
        </p>
      </div>
      {message ? <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </section>
  )
}
