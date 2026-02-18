import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react"
import type { AppNotice } from "@/src/lib/notice"

interface InlineNoticeProps {
  notice: AppNotice
}

function getNoticeClass(variant: AppNotice["variant"]): string {
  if (variant === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800"
  }
  if (variant === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-800"
  }
  if (variant === "info") {
    return "border-sky-200 bg-sky-50 text-sky-800"
  }
  return "border-rose-200 bg-rose-50 text-rose-800"
}

function NoticeIcon({ variant }: { variant: AppNotice["variant"] }) {
  if (variant === "success") {
    return <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
  }
  if (variant === "warning") {
    return <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
  }
  if (variant === "info") {
    return <Info className="mt-0.5 h-4 w-4 shrink-0" />
  }
  return <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
}

export function InlineNotice({ notice }: InlineNoticeProps) {
  return (
    <div className={`rounded-lg border px-3 py-2 ${getNoticeClass(notice.variant)}`}>
      <div className="flex items-start gap-2">
        <NoticeIcon variant={notice.variant} />
        <div>
          <p className="text-xs font-semibold">{notice.title}</p>
          <p className="mt-0.5 text-xs">{notice.message}</p>
        </div>
      </div>
    </div>
  )
}
