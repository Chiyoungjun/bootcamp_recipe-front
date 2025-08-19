// src/routes/pages/common/Chatbot/GlobalChat.jsx
import React, { useState, useCallback } from "react";
import { createPortal } from "react-dom";

import ChatDock from "./ChatDock";
import ChatPanel from "./ChatPanel";

import "./Chatbot.css";
import botIcon from "./chatbot-logo.png";
import headerIcon from "./chat-intro-v2.png";
import introImage from "./chat-intro-v2.png";

const CHAT_HISTORY_KEY = "snapcook_chat_history_v1";
const CHAT_USED_KEY = "snapcook_chat_used_v1";

export default function GlobalChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

  const hasUsed = useCallback(() => {
    try {
      return localStorage.getItem(CHAT_USED_KEY) === "1";
    } catch {
      return false;
    }
  }, []);

  const handleFabClick = () => {
    if (hasUsed()) {
      setIsChatPanelOpen(true);
      setIsChatOpen(false);
    } else {
      setIsChatOpen(true);
    }
  };

  return (
    <>
      <ChatDock
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onStart={() => {
          setIsChatOpen(false);
          setIsChatPanelOpen(true);
        }}
        imageSrc={introImage}
      />

      <ChatPanel
        open={isChatPanelOpen}
        onClose={() => setIsChatPanelOpen(false)}
        logoSrc={headerIcon}
        storageKey={CHAT_HISTORY_KEY}
        usedKey={CHAT_USED_KEY}
      />

      {createPortal(
        <button
          type="button"
          className="sc-fab fixed-fab"
          aria-label="챗 열기"
          onClick={handleFabClick}
        >
          <img
            src={botIcon}
            alt="SnapCook Bot"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </button>,
        document.body
      )}
    </>
  );
}
