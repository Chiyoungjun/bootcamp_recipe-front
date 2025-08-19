// src/routes/pages/common/Main/ChatDock.jsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function ChatDock({
  open,
  onClose,
  onStart,
  imageSrc,
  imageAlt = "SnapCook Chat Illustration",
  imageScale = 0.78, // 0~1, 이미지 가로 비율 (기본 78%)
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="chat-dock-layer" onClick={onClose}>
      <div
        className="chat-dock"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="SNAPCOOK Chat 소개"
      >
        <h2 className="chat-intro-title">SNAPCOOK Chat</h2>
        <p className="chat-intro-desc">
          안녕하세요!<br />
          스냅쿡 챗을 사용하면 인공지능 어시스턴트를 이용하여
          질문을 하고 답을 받을 수 있습니다.
        </p>

        <div className="chat-intro-illustration">
          <img
            src={imageSrc}
            alt={imageAlt}
            style={{ width: `${imageScale * 100}%`, height: "auto", display: "block" }}
          />
        </div>

        <button className="chat-intro-start" onClick={onStart}>
          시작하기 <span aria-hidden>→</span>
        </button>
      </div>
    </div>,
    document.body
  );
}
