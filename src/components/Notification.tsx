import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

export type NotificationType = 'alert' | 'success' | 'info'

export interface NotificationData {
  id: string
  type: NotificationType
  title: string
  message: string
}

interface NotificationProps {
  notification: NotificationData
  onDismiss: (id: string) => void
}

const typeConfig = {
  alert: {
    color: 'var(--status-critical)',
    bg: 'var(--status-critical-soft)',
    icon: <AlertCircle size={18} />,
  },
  success: {
    color: 'var(--status-resolved)',
    bg: 'var(--status-resolved-soft)',
    icon: <CheckCircle2 size={18} />,
  },
  info: {
    color: 'var(--primary)',
    bg: 'var(--sky)',
    icon: <Info size={18} />,
  },
}

export function Notification({ notification, onDismiss }: NotificationProps) {
  const [visible, setVisible] = useState(false)
  const config = typeConfig[notification.type]

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 50)
    const hideTimer = setTimeout(() => setVisible(false), 4600)
    const dismissTimer = setTimeout(() => onDismiss(notification.id), 5000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
      clearTimeout(dismissTimer)
    }
  }, [notification.id, onDismiss])

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        width: 'var(--notification-width)',
        padding: '16px 18px',
        borderRadius: 22,
        background: 'var(--notification-background)',
        border: '1px solid var(--surface-border)',
        borderLeft: `3px solid ${config.color}`,
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 300ms var(--ease-out-expo)',
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: config.color,
          background: config.bg,
          flexShrink: 0,
        }}
      >
        {config.icon}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{notification.title}</div>
        <div style={{ marginTop: 4, color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', lineHeight: 1.55 }}>
          {notification.message}
        </div>
        <div style={{ marginTop: 10, height: 2, background: 'var(--progress-track)', borderRadius: 999, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              background: config.color,
              width: visible ? '0%' : '100%',
              transition: visible ? 'width 4600ms linear' : 'none',
            }}
          />
        </div>
      </div>

      <button onClick={() => onDismiss(notification.id)} aria-label="Dismiss notification" style={{ color: 'var(--text-muted)' }}>
        <X size={15} />
      </button>
    </div>
  )
}

interface NotificationContainerProps {
  notifications: NotificationData[]
  onDismiss: (id: string) => void
}

export function NotificationContainer({ notifications, onDismiss }: NotificationContainerProps) {
  return (
    <div
      style={{
        position: 'fixed',
        right: 18,
        bottom: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 999,
        pointerEvents: 'none',
      }}
    >
      {notifications.map((notification) => (
        <div key={notification.id} style={{ pointerEvents: 'auto' }}>
          <Notification notification={notification} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}
