"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [input, setInput] = useState(""); // Added input state for sending messages
  const socketRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      socketRef.current = new WebSocket("ws://localhost:8000/ws");

      socketRef.current.onopen = () => {
        console.log("WebSocket connection established");
        setIsConnected(true);
      };

      socketRef.current.onmessage = (event) => {
        console.log("Message from server:", event.data);
        setMessages((prev) => [...prev, event.data]);
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socketRef.current.onclose = () => {
        console.log("WebSocketサーバとのコネクションをクローズしました");
        setIsConnected(false);
      };
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(input);
      console.log(
        "WebSocketサーバにメッセージを送信しました。 message -> ",
        input
      );
      setInput("");
    } else {
      console.error("WebSocketサーバとの通信を確立できません");
    }
  };

  const closeConnection = () => {
    if (socketRef.current) {
      socketRef.current.close();
      console.log("WebSocketサーバとのコネクションをクローズします");
      setIsConnected(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold p-4">WebSocket Messages</h1>
      <div className="p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a message"
          className="border rounded p-2 mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
        <button
          onClick={closeConnection}
          className="bg-red-500 text-white p-2 rounded ml-2"
        >
          Close Connection
        </button>
      </div>
      <p className="ml-4">
        Status: {isConnected ? "Connected" : "Disconnected, reconnecting..."}
      </p>
      <ul className="ml-4">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
