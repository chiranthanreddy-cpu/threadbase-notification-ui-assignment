import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationItem from "./NotificationItem.jsx";

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useNotifications();
  const { notifications, unreadCount } = state;

  function handleMarkAllRead() {
    dispatch({ type: "MARK_ALL_READ" });
  }

  return (
    <div
      role="dialog"
      aria-label="Notifications"
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        right: 0,
        width: "min(360px, calc(100vw - 32px))",
        maxHeight: "420px",
        overflowY: "auto",
        background: "#fff",
        color: "#1f2937",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          padding: "14px 16px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1rem" }}>Notifications</h2>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          style={{
            background: "none",
            border: "none",
            color: unreadCount === 0 ? "#9ca3af" : "#4f46e5",
            cursor: unreadCount === 0 ? "default" : "pointer",
            fontSize: "0.8rem",
          }}
        >
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p style={{ padding: "20px 16px", margin: 0, color: "#6b7280" }}>
          No notifications yet.
        </p>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={onClose}
          />
        ))
      )}
    </div>
  );
}
