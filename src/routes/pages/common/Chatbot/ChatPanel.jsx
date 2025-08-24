// src/routes/pages/common/Chatbot/ChatPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

/** 백엔드 엔드포인트 */
const CHAT_API_JSON = "http://localhost:8000/api/chatbot";         // 일반 JSON
const CHAT_API_STREAM = "http://localhost:8000/api/chatbot/stream"; // 🔥 스트리밍(plain text or SSE)

export default function ChatPanel({
  open,
  onClose,
  logoSrc,
  storageKey = "snapcook_chat_history_v1",
  usedKey = "snapcook_chat_used_v1",
}) {
  const defaultGreeting = "안녕하세요! 무엇을 도와드릴까요? 😊";

  // 대화 복구
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      }
    } catch {}
    return [{ role: "assistant", content: defaultGreeting }];
  });

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const bodyRef = useRef(null);
  const abortRef = useRef(null);   // AbortController
  const idxRef = useRef(-1);       // 현재 스트리밍 중인 assistant 인덱스

  // ✅ 추가: 렌더 폭주 방지용 버퍼/플러시(스로틀)
  const bufferRef = useRef("");
  const flushingRef = useRef(false);
  const flushDelayMs = 50; // 30~100ms 사이 조절

  const scheduleFlush = () => {
    if (flushingRef.current) return;
    flushingRef.current = true;
    setTimeout(() => {
      const chunk = bufferRef.current;
      bufferRef.current = "";
      flushingRef.current = false;
      if (chunk) appendChunk(chunk);
    }, flushDelayMs);
  };

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ✅ onClose 시에도 요청 중단
  const handleClose = () => {
    try { abortRef.current?.abort(); } catch {}
    onClose?.();
  };

  // 컴포넌트 언마운트 시 요청 중단
  useEffect(() => {
    return () => {
      try { abortRef.current?.abort(); } catch {}
    };
  }, []);

  // 스크롤 최신으로
  useEffect(() => {
    if (!open) return;
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages, sending]);

  // 저장
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, storageKey]);

  // 사용 플래그
  useEffect(() => {
    try {
      const meaningful = messages.some(
        (m) =>
          m.role === "user" ||
          (m.role === "assistant" && m.content && m.content !== defaultGreeting)
      );
      if (meaningful) localStorage.setItem(usedKey, "1");
    } catch {}
  }, [messages, usedKey]);

  if (!open) return null;

  /** assistant 마지막 메시지(스트리밍 대상)에 chunk 붙이기 */
  const appendChunk = (chunk) => {
    if (idxRef.current < 0 || !chunk) return;
    setMessages((prev) => {
      const i = idxRef.current;
      const target = prev[i];
      if (!target) return prev;
      const next = { ...target, content: (target.content || "") + chunk };
      return replaceAt(prev, i, next);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const userText = text.trim();
    if (!userText || sending) return;

    // 이전 스트림 취소
    try { abortRef.current?.abort(); } catch {}

    // user + (빈) assistant를 한 번에 push해서 인덱스 확보
    setMessages((prev) => {
      const next = [...prev, { role: "user", content: userText }, { role: "assistant", content: "" }];
      idxRef.current = next.length - 1;
      return next;
    });

    setText("");
    setSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // 1) 🔥 스트리밍 호출
      const res = await fetch(CHAT_API_STREAM, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ✅ SSE도 허용
          "Accept": "text/plain, text/event-stream, application/json",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
        body: JSON.stringify({ message: userText }),
        signal: controller.signal,
      });

      const ct = (res.headers.get("content-type") || "").toLowerCase();

      if (!res.ok) {
        await fallbackToJson(userText);
        return;
      }

      if (!res.body) {
        // 마지막 폴백: 그냥 텍스트
        const txt = await res.text();
        appendChunk(txt || "빈 응답입니다.");
        return;
      }

      // ✅ 공통: UTF-8 디코더 준비
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      try {
        if (ct.includes("text/event-stream")) {
          // ===== SSE 파서 =====
          let buf = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            let sep;
            while ((sep = buf.indexOf("\n\n")) >= 0) {
              const event = buf.slice(0, sep);
              buf = buf.slice(sep + 2);
              // data: ... 라인만 취함
              const lines = event.split("\n");
              for (const line of lines) {
                const s = line.trim();
                if (s.startsWith("data:")) {
                  const payload = s.slice(5).trim();
                  if (payload) {
                    bufferRef.current += payload;
                    scheduleFlush();
                  }
                }
              }
            }
          }
          // flush 남은 바이트
          const rest = decoder.decode();
          if (rest) {
            buf += rest;
          }
          if (buf) {
            // 남은 조각을 data 없이 보낸 서버 대응
            bufferRef.current += buf;
            scheduleFlush();
          }
          // flush 마무리 대기
          await new Promise(r => setTimeout(r, flushDelayMs + 10));
        } else if (ct.includes("text/plain")) {
          // ===== text/plain 청크 =====
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk) {
              bufferRef.current += chunk;
              scheduleFlush();
            }
          }
          const rest = decoder.decode();
          if (rest) {
            bufferRef.current += rest;
            scheduleFlush();
          }
          await new Promise(r => setTimeout(r, flushDelayMs + 10));
        } else if (ct.includes("application/json")) {
          // 혹시 서버가 JSON으로 내려주면 폴백 처리
          const data = await res.json();
          const reply = data.answer ?? data.text ?? data.reply ?? "";
          setMessages((prev) =>
            replaceAt(prev, idxRef.current, {
              role: "assistant",
              content: reply || "빈 응답입니다.",
            })
          );
        } else {
          // 마지막 폴백: 그냥 텍스트로 읽기
          const txt = await res.text();
          appendChunk(txt || "빈 응답입니다.");
        }
      } finally {
        // ✅ 리더 해제 (메모리/락 정리)
        try { reader.releaseLock(); } catch {}
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        setMessages((prev) =>
          replaceAt(prev, idxRef.current, {
            role: "assistant",
            content: "죄송합니다. 응답 중 오류가 발생했습니다.",
          })
        );
      }
    } finally {
      setSending(false);
      abortRef.current = null;
      idxRef.current = -1;
    }
  };

  /** 스트리밍 실패 시 일반 JSON 엔드포인트 폴백 */
  const fallbackToJson = async (userText) => {
    try {
      const r = await fetch(CHAT_API_JSON, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      if (!r.ok) {
        const raw = await r.text();
        setMessages((prev) =>
          replaceAt(prev, idxRef.current, {
            role: "assistant",
            content: formatError(raw) || `서버 오류 (HTTP ${r.status})`,
          })
        );
        return;
      }
      const data = await r.json();
      const reply = data.answer ?? data.text ?? data.reply ?? "빈 응답입니다.";
      setMessages((prev) => replaceAt(prev, idxRef.current, { role: "assistant", content: reply }));
    } catch {
      setMessages((prev) =>
        replaceAt(prev, idxRef.current, {
          role: "assistant",
          content: "죄송합니다. 응답 중 오류가 발생했습니다.",
        })
      );
    }
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(usedKey);
    } catch {}
    setMessages([{ role: "assistant", content: defaultGreeting }]);
  };

  const stopGenerating = () => {
    try { abortRef.current?.abort(); } catch {}
  };

  return createPortal(
    <div className="chat-panel-layer">
      <div className="chat-panel">
        {/* 헤더 */}
        <div className="chat-panel__header">
          <button className="chat-panel__back" onClick={handleClose} aria-label="닫기">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <img className="chat-panel__logo" src={logoSrc} alt="SnapCook Bot" />
          <div className="chat-panel__title">SNAPCOOK Chat</div>

          <div style={{ flex: 1 }} />
          <button
            type="button"
            className="chat-panel__reset"
            onClick={handleReset}
            aria-label="대화 초기화"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-3.3-6.9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="chat-panel__body" ref={bodyRef}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role === "user" ? "chat-msg--user" : "chat-msg--assistant"}`}>
              {m.role === "assistant" ? (
                <div className="md">
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          ))}

          {sending && (
            <div className="chat-typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          )}
        </div>

        {/* 입력바 */}
        <form className="chat-panel__inputbar" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="물어 보고 싶은걸 입력해 주세요."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending}
          />

          {sending ? (
            <button
              type="button"
              className="chat-panel__send"
              aria-label="중지"
              onClick={stopGenerating}
              title="생성 중지"
            >
              ✋
            </button>
          ) : (
            <button type="submit" className="chat-panel__send" aria-label="보내기">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 12l18-8-8 18-2-7-8-3z" fill="currentColor" />
              </svg>
            </button>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
}

/* ===== 유틸 ===== */
function replaceAt(arr, index, value) {
  return arr.map((v, i) => (i === index ? value : v));
}
function formatError(raw) {
  try {
    const obj = JSON.parse(raw);
    if (obj && obj.detail) return typeof obj.detail === "string" ? obj.detail : JSON.stringify(obj.detail);
    return JSON.stringify(obj);
  } catch {
    return raw;
  }
}