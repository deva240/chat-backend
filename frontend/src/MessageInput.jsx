import { useState } from "react";

function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  return (
    <div>
      <input
        placeholder="Type message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />

      <button onClick={send} style={{ width: "100%", padding: "10px", marginTop: "8px" }}>
        Send
      </button>
    </div>
  );
}

export default MessageInput;
