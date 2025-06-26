import React, { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((msgs) => [...msgs, { from: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      setMessages((msgs) => [...msgs, { from: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Error: failed to get response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #00b33c, #ff6f00, #e60000)",
          color: "#fff",
          border: "none",
          fontSize: 28,
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
        aria-label="Toggle chatbot"
      >
        {open ? "×" : "💬"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: "90%",
            maxWidth: 360,
            height: 450,
            backgroundColor: "#fff",
            borderRadius: 10,
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #00b33c, #ff6f00, #e60000)",
              color: "#fff",
              padding: "10px 15px",
              fontWeight: "bold",
            }}
          >
            IAHF Assistant
          </div>

          <div
            style={{
              flex: 1,
              padding: 10,
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    borderRadius: 16,
                    backgroundColor:
                      msg.from === "user" ? "#00b33c" : "#e6e6e6",
                    color: msg.from === "user" ? "#fff" : "#000",
                    maxWidth: "75%",
                    wordWrap: "break-word",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && (
              <div style={{ fontStyle: "italic", color: "#666" }}>
                Bot is typing...
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ddd",
              padding: 8,
              backgroundColor: "#fff",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "8px 10px",
                border: "1px solid #ccc",
                borderRadius: 20,
                outline: "none",
                marginRight: 6,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "8px 14px",
                background: "linear-gradient(135deg, #00b33c, #ff6f00, #e60000)",
                border: "none",
                borderRadius: 20,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
