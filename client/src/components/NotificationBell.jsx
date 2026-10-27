import { useEffect, useRef, useState } from "react";
import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";

export default function NotificationBell() {
  const { state } = useNotifications();
  const unreadCount = state.unreadCount;
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.3rem",
          color: "#fff",
        }}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
      >
        🔔

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-8px",
              minWidth: "18px",
              height: "18px",
              padding: "0 4px",
              borderRadius: "999px",
              backgroundColor: "#ef4444",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
