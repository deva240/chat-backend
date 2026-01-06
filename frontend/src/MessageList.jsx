import { useEffect, useRef } from "react";
import Message from "./Message";

function MessageList({ messages, onDelete, onEdit, currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      {messages.map((msg) => (
        <Message
          key={msg.id}
          id={msg.id}
          text={msg.text}
          time={msg.created_at}
          user_id={msg.user_id}
          username={msg.username}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
