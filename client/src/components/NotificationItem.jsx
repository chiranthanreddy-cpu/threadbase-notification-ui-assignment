import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

export default function NotificationItem({ notification }) {
  const { state, dispatch } = useNotifications();

  const markReadMutation = useMutation({
    mutationFn: async (id) => {
      return apiClient.patch(`/api/notifications/${id}/read`);
    },

    onMutate: async (id) => {
      const previousNotifications = state.notifications;

      // Update the UI immediately, before the server responds.
      dispatch({ type: "MARK_READ", payload: id });

      return { previousNotifications };
    },

    onError: (_error, _id, context) => {
      // Restore the previous state if the request fails.
      if (context?.previousNotifications) {
        dispatch({
          type: "LOAD_NOTIFICATIONS",
          payload: context.previousNotifications,
        });
      }
    },
  });

  function handleClick() {
    if (!notification.isRead && !markReadMutation.isPending) {
      markReadMutation.mutate(notification.id);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${notification.isRead ? "Read" : "Unread"} notification: ${notification.message}`}
      style={{
        display: "block",
        width: "100%",
        padding: "14px 16px",
        textAlign: "left",
        border: "none",
        borderBottom: "1px solid #e5e7eb",
        cursor: notification.isRead ? "default" : "pointer",
        background: notification.isRead ? "#fff" : "#eef2ff",
        color: "#1f2937",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <span
          aria-hidden="true"
          style={{
            width: "8px",
            height: "8px",
            flexShrink: 0,
            marginTop: "6px",
            borderRadius: "50%",
            background: notification.isRead ? "transparent" : "#4f46e5",
            border: notification.isRead ? "1px solid #d1d5db" : "none",
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              lineHeight: 1.5,
              fontWeight: notification.isRead ? 400 : 600,
              overflowWrap: "anywhere",
            }}
          >
            {notification.message}
          </p>

          {notification.createdAt && (
            <time
              dateTime={notification.createdAt}
              style={{
                display: "block",
                marginTop: "5px",
                fontSize: "0.75rem",
                color: "#6b7280",
              }}
            >
              {new Date(notification.createdAt).toLocaleString()}
            </time>
          )}

          {markReadMutation.isError && !notification.isRead && (
            <span
              role="alert"
              style={{ display: "block", marginTop: "4px", color: "#b91c1c", fontSize: "0.8rem" }}
            >
              Couldn't mark as read. Please try again.
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
