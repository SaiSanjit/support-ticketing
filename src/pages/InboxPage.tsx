import { Inbox } from 'lucide-react'
import { useNotificationStore } from '@/store/notification-store'

export function InboxPage() {
  const { notifications, markRead, unreadCount } = useNotificationStore()

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-border flex items-center gap-3">
        <Inbox size={18} className="text-text-secondary" />
        <h1 className="text-text-primary font-semibold text-lg">Inbox</h1>
        {unreadCount > 0 && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent-mint/10 text-accent-mint">
            {unreadCount} new
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
        {notifications.length === 0 && (
          <p className="text-text-tertiary text-sm text-center mt-16">All caught up 🎉</p>
        )}
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-colors ${
              n.isRead
                ? 'border-border bg-transparent'
                : 'border-accent-mint/30 bg-accent-mint/5'
            }`}
          >
            {n.actorAvatarUrl && (
              <img src={n.actorAvatarUrl} alt={n.actorName ?? ''} className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-text-primary text-[13px] font-medium">{n.title}</p>
              <p className="text-text-secondary text-[12px] mt-0.5">{n.body}</p>
              <p className="text-text-tertiary text-[11px] mt-1">
                {new Date(n.createdAt).toLocaleDateString()}
              </p>
            </div>
            {!n.isRead && (
              <div className="w-2 h-2 rounded-full bg-accent-mint flex-shrink-0 mt-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
