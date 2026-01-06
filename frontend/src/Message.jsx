import { useState, useEffect } from "react";
import useTheme from "./useTheme";

function Message({
  id,
  text,
  time,
  user_id,
  username,
  currentUserId,
  updated_at,
  onDelete,
  onEdit
}) {
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState(text);
  const { dark } = useTheme();

  // Is this my message?
  const isYou = user_id === currentUserId;

  // Sync UI when parent updates message text
  useEffect(() => {
    setNewText(text);
  }, [text]);

  function saveEdit() {
    if (!newText.trim()) return;
    onEdit(id, newText);
    setEditing(false);
  }

  return (
    <div
      style={{
        marginBottom: "5px",
        display: "flex",
        justifyContent: isYou ? "flex-end" : "flex-start",
        margin: "6px 0",
        backgroundColor: dark ? "#333" : "#fff",
        
      }}
      
    >
      <div
     style={{
     backgroundColor: isYou ? "#DCF8C6" : "#FFFFFF",
     padding: "10px 15px",
     borderRadius: "12px",
     borderTopRightRadius: isYou ? "0" : "12px",
     borderTopLeftRadius: isYou ? "12px" : "0",
     maxWidth: "60%",
     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  }}
>

        {/* DELETE BUTTON */}
        {isYou && !editing && (
        <button
          onClick={() => onDelete(id)}
          style={{
            background: "transparent",
            border: "none",
            color: "#888",
            cursor: "pointer",
            float: "right",
            fontSize: "12px",
            marginLeft: "8px",
          }}
      
        >
          ✖
        </button>
          )}

        {/* EDIT BUTTON (only for your own messages) */}
        {!editing && isYou && (
          <button
            onClick={() => setEditing(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "#888",
              cursor: "pointer",
              float: "right",
              fontSize: "12px",
              marginLeft: "6px",
              opacity: 0.7,
             

            }}
          >
            ✏️
          </button>
        )}

        {/* NORMAL VIEW */}
        {!editing ? (
          <>
          <strong style={{ fontSize: "12px", color: "#555" }}>
         {isYou ? "You" : username}</strong>

            <p style={{ marginBottom: "5px" }}>{text}</p>

            {updated_at &&(

            <small style={{ fontSize: "10px", color: "#666" }}>
              {new Date(time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
            )}
          </>
        ) : (
          <>
            {/* EDIT INPUT */}
            <input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              style={{
                width: "100%",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginBottom: "5px",
              }}
            />

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={saveEdit}
                style={{
                  background: "#4caf50",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Save
              </button>

              <button
                onClick={() => {
                  setEditing(false);
                  setNewText(text);
                }}
                style={{
                  background: "#bbb",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}

              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Message;
