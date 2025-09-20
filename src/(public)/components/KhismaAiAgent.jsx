/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
// src/components/KhismaAiAgent.jsx
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { Mail, Send, X, Loader2, Power, Trash2 } from "lucide-react";
import { IconCircleDottedLetterK, IconUserCircle } from "@tabler/icons-react";
import { BASE_URL } from "@/constants";
import logo from "@/assets/images/agent-logo.png";

/* ---------------- Theme hook ---------------- */
function useIsDark() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark") ||
        window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
      : false
  );
  useEffect(() => {
    const html = document.documentElement;
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const update = () => {
      const classDark = html.classList.contains("dark");
      const systemDark = !!mql?.matches;
      setIsDark(classDark || (!html.classList.contains("light") && systemDark));
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    mql?.addEventListener?.("change", update);
    return () => {
      obs.disconnect();
      mql?.removeEventListener?.("change", update);
    };
  }, []);
  return isDark;
}

/* ---------------- Utils ---------------- */
const nowISO = () => new Date().toISOString();
const norm = (s = "") => s.toLowerCase().replace(/\s+/g, " ").trim();
const hasAny = (txt, arr) => arr.some((p) => norm(txt).includes(norm(p)));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasWordExact = (txt, phrase) => new RegExp(`\\b${esc(phrase)}\\b`, "i").test(txt);
const hasAnyWord = (txt, arr) => arr.some((p) => hasWordExact(txt, p));
const hasWord = (txt, w) => hasWordExact(txt, w);

const roomKey = "khisima_chat_room_id";
const storageKeyFor = (room) => `khisima_chat_messages_${room}`;
const emailKeyFor = (room) => `khisima_chat_email_${room}`;

function newRoomId() {
  return (
    (crypto?.randomUUID?.() || Math.random().toString(36).slice(2)) +
    "-" +
    Date.now()
  );
}
function getOrCreateRoom() {
  let r = localStorage.getItem(roomKey);
  if (!r) {
    r = newRoomId();
    localStorage.setItem(roomKey, r);
  }
  return r;
}

/* Smart time formatter */
function formatStamp(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();

  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterday =
    d.getFullYear() === yesterdayDate.getFullYear() &&
    d.getMonth() === yesterdayDate.getMonth() &&
    d.getDate() === yesterdayDate.getDate();

  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Now";
  if (diffMin < 60 && sameDay) return `${diffMin} min ago`;

  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (sameDay) return `Today ${time}`;
  if (yesterday) return `Yesterday ${time}`;

  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 7) {
    const weekday = d.toLocaleDateString([], { weekday: "short" });
    return `${weekday} ${time}`;
  }

  return d.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ---------------- Local brain ---------------- */
function detectIntent(text) {
  const t = norm(text);

  const isShort = t.split(" ").length <= 5 && !/[?]/.test(t);
  if (
    isShort &&
    hasAnyWord(t, [
      "hi","hello","hey","good morning","morning","good afternoon","afternoon",
      "good evening","evening","muraho","bonjour","salut","habari","mambo",
      "hey there","yo","sup","i was just sending my greetings","just greetings"
    ])
  ) {
    return { intent: "greeting", confidence: 0.98 };
  }

  if (hasAny(t, ["thanks","thank you","murakoze","merci","asante","thx"]))
    return { intent: "thanks", confidence: 0.98 };

  if (hasAny(t, ["bye","goodbye","see you","cheers","ciao"]))
    return { intent: "goodbye", confidence: 0.98 };

  if (hasAny(t, ["how are you","how’s it going","how are u","how r u"]))
    return { intent: "howareyou", confidence: 0.95 };

  if (hasAny(t, ["ok","okay","alright","cool","great","nice"]))
    return { intent: "ack", confidence: 0.9 };

  if (hasAny(t, ["lol","haha","lmao","😂","😅","😆"]))
    return { intent: "humor", confidence: 0.9 };

  if (hasAny(t, ["what is khisima","about khisima","about your company","who are you"]))
    return { intent: "about", confidence: 0.95 };

  if (hasAny(t, ["service","offer","solutions","what do you offer"]))
    return { intent: "services", confidence: 0.9 };

  if (hasAny(t, ["language","languages","support languages","which languages"]))
    return { intent: "languages", confidence: 0.9 };

  if (hasAny(t, ["price","pricing","cost","rate","how much"]))
    return { intent: "pricing", confidence: 0.9 };

  if (hasAny(t, ["turnaround","how fast","timeline","delivery time","deadline"]))
    return { intent: "turnaround", confidence: 0.9 };

  if (hasAny(t, ["nda","confidential","confidentiality","privacy","security"]))
    return { intent: "nda", confidence: 0.9 };

  if (hasAny(t, ["contact","email","phone","reach you"]))
    return { intent: "contact", confidence: 0.95 };

  if (hasAny(t, ["where are you","location","address","based","kigali"]))
    return { intent: "location", confidence: 0.95 };

  if (hasAny(t, ["data","dataset","annotation","collection","llm","nlp","benchmark","evaluation"]))
    return { intent: "data_services", confidence: 0.9 };

  if (hasAny(t, ["voice","voice-over","dubbing","audio"]))
    return { intent: "voiceover", confidence: 0.9 };

  if (hasAny(t, ["seo","multilingual seo","search engine"]))
    return { intent: "seo", confidence: 0.9 };

  if (hasAny(t, ["career","job","hiring","internship"]))
    return { intent: "careers", confidence: 0.9 };

  if (hasAny(t, ["quote","estimate","get quote","proposal","rfp"]))
    return { intent: "quote", confidence: 0.95 };

  if (hasAny(t, ["workplace","country","countries of operation"]))
    return { intent: "workplace", confidence: 0.85 };

  return { intent: "unknown", confidence: 0.2 };
}

function localAnswer(intent, userText) {
  const morning = hasWord(userText, "morning");
  const afternoon = hasWord(userText, "afternoon");
  const evening = hasWord(userText, "evening");

  const KB = {
    greeting:
      morning ? "🌅 Good morning! How can I help today?"
      : afternoon ? "🌤️ Good afternoon! What can I do for you?"
      : evening ? "🌆 Good evening! How can I assist?"
      : "👋 Hello! How can I help today?",
    thanks: "You’re welcome! Anything else I can help with? 🙌",
    goodbye: "Thanks for visiting Khisima! Have a great day. 👋",
    howareyou: "I’m doing great, thanks! How can I help with your project?",
    ack: "Got it. What else would you like to know?",
    humor: "😄 Haha! Now, how can I help you today?",
    about:
      "Khisima is a language services & data company focused on African languages. We deliver translation/localization, language data (collection, annotation, evaluation), AI language consulting, cultural adaptation, voice-over & dubbing, and multilingual SEO.",
    services:
      "We offer: Translation & Localization; Language Data (collection, annotation, evaluation for NLP/LLM); AI Language Consulting; Cultural Adaptation; Voice-over & Dubbing; Multilingual SEO. Ask for details on any.",
    languages:
      "We support Kinyarwanda, Swahili, English, French, Amharic, Luganda, Chewa, Wolof, Oromo — and more. Tell me which you need and I’ll confirm coverage.",
    pricing:
      "Pricing depends on scope, languages, and turnaround. Translation is usually per word; data services are per task or hour. Share your brief and we’ll send a tailored quote.",
    turnaround:
      "Turnaround depends on volume, language pair, and complexity. Standard docs can be 24–72 hours; bigger/technical projects get a clear milestone plan. Share your deadline and we’ll advise.",
    nda:
      "We take confidentiality seriously. Happy to sign an NDA and follow secure data handling (least-privilege access). Isolated workflows available on request.",
    contact:
      "You can reach us at info@khisima.com or +250 789 619 370. You can also share details here.",
    location:
      "We’re based in Kigali, Rwanda, with a distributed team across Africa.",
    data_services:
      "We handle language data: collection (speech/text), annotation (NER, sentiment, QA, MT QE, etc.), and evaluation/benchmarking for NLP/LLMs. We can build custom datasets and evaluators for African languages.",
    voiceover:
      "We provide voice-over & dubbing in African languages: script adaptation, casting, studio-grade recording, and QC for broadcast/online.",
    seo:
      "We offer multilingual SEO: market-specific keyword research, culturally adapted content, and on-page optimization aligned with your brand.",
    careers:
      "We’re always happy to meet talented linguists, data annotators, and engineers. Check the Careers page or send a short intro + CV.",
    quote:
      "Great—share source/target languages, word count or dataset size, domain (e.g., legal/medical), and your deadline. We’ll prepare a tailored quote.",
    workplace:
      "We operate across Africa and collaborate with partners in multiple countries. Which market are you targeting?",
  };
  return KB[intent] || null;
}
function decideLocalAnswer(text) {
  const { intent, confidence } = detectIntent(text);
  const answer = localAnswer(intent, text);
  if (answer && confidence >= 0.75) return { ok: true, answer, intent };
  return { ok: false, answer: null, intent };
}

/* Avatars */
const BlueAvatar = ({ children, title }) => (
  <div
    className="flex-none inline-flex items-center justify-center rounded-full"
    style={{ width: 28, height: 28, backgroundColor: "#4a95f2" }}
    title={title}
  >
    {children}
  </div>
);
const AdminAvatar = () => (
  <BlueAvatar title="Khisima Specialist">
    <IconCircleDottedLetterK size={18} color="#fff" />
  </BlueAvatar>
);
const UserAvatar = () => (
  <BlueAvatar title="You">
    <IconUserCircle size={18} color="#fff" />
  </BlueAvatar>
);

/* ---------------- Component ---------------- */
export default function KhismaAiAgent() {
  const isDark = useIsDark();
  const [open, setOpen] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [sending, setSending] = useState(false);
  const [searching, setSearching] = useState(false);
  const [emailNeeded, setEmailNeeded] = useState(false);
  const [email, setEmail] = useState("");
  const [input, setInput] = useState("");

  const [room, setRoom] = useState(getOrCreateRoom);
  const socketRef = useRef(null);
  const statusTimerRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKeyFor(room));
      return raw
        ? JSON.parse(raw)
        : [
            {
              id: "welcome",
              role: "agent",
              text:
                "👋 Hi! I’m Khisima’s AI assistant. Ask me about services, languages, pricing, timelines, or data for LLMs.",
              ts: nowISO(),
            },
          ];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(storageKeyFor(room), JSON.stringify(messages));
  }, [room, messages]);
  useEffect(() => {
    const saved = localStorage.getItem(emailKeyFor(room));
    if (saved) setEmail(saved);
  }, [room]);

  // Socket
  useEffect(() => {
    const s = io(BASE_URL, {
      path: "/socket.io",
      withCredentials: true,
      query: { role: "user", room },
    });
    socketRef.current = s;

    const clearTimer = () => {
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
        statusTimerRef.current = null;
      }
    };

    s.on("connect", () => {
      s.emit("agent:join_room", { room });
      clearTimer();
      statusTimerRef.current = setTimeout(
        () => s.emit("agent:admin_status:get"),
        400
      );
    });

    s.on("agent:admin_status", ({ online }) => {
      setAdminOnline(!!online);
      clearTimer();
    });

    s.on("agent:admin_reply", ({ text, ts }) =>
      appendMessage({ role: "admin", text: text || "", ts: ts || nowISO() })
    );
    s.on("agent:agent_reply", ({ text, ts }) =>
      appendMessage({ role: "agent", text: text || "", ts: ts || nowISO() })
    );

    s.on("agent:user_ended", () => {
      appendMessage({
        role: "agent",
        text: "🔒 Chat ended by user. You can start a new conversation anytime.",
        ts: nowISO(),
      });
    });

    s.on("agent:request_email", () => {
      appendMessage({
        role: "agent",
        text:
          "Could you share your email so our specialist can follow up if needed?",
        ts: nowISO(),
      });
      setEmailNeeded(true);
    });

    return () => {
      clearTimer();
      s.disconnect();
      socketRef.current = null;
    };
  }, [room]);

  // Presence fetch when open
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/agent/status`, {
          credentials: "include",
        });
        const data = await res.json();
        if (typeof data?.online === "boolean") setAdminOnline(!!data.online);
      } catch {}
    })();
  }, [open]);

  function appendMessage(msg) {
    setMessages((m) => [
      ...m,
      { id: Math.random().toString(36).slice(2), ts: nowISO(), ...msg },
    ]);
  }

  async function handleSend(e) {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text) return;

    if (emailNeeded) setEmailNeeded(false);
    appendMessage({ role: "user", text, ts: nowISO() });
    setInput("");

    const local = decideLocalAnswer(text);
    if (local.ok) {
      appendMessage({ role: "agent", text: local.answer, ts: nowISO() });
      return;
    }

    if (adminOnline && socketRef.current?.connected) {
      try {
        socketRef.current.emit("agent:user_message", { room, text });
      } catch {}
      return;
    }

    const meaningful = text.split(/\s+/).filter(Boolean).length >= 2;
    if (!meaningful) {
      appendMessage({
        role: "agent",
        text:
          "Could you share a bit more detail so I can help? For example: “Translate 2 pages EN→FR, 24h deadline.”",
        ts: nowISO(),
      });
      return;
    }

    setSending(true);
    setSearching(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/agent/search?q=${encodeURIComponent(text)}&room=${encodeURIComponent(room)}`,
        { method: "GET", credentials: "include", headers: { Accept: "application/json" } }
      );
      const data = res?.ok ? await res.json() : null;
      if (data?.answer) {
        appendMessage({ role: "agent", text: data.answer, ts: nowISO() });
        setSearching(false);
        setSending(false);
        return;
      }
    } catch {}
    setSearching(false);
    setSending(false);

    appendMessage({
      role: "agent",
      text:
        "I couldn’t find a confident answer and our team is offline. Leave your email and we’ll follow up shortly.",
      ts: nowISO(),
    });
    setEmailNeeded(true);
  }

  async function submitEmailAndQuestion() {
    const q = [...messages].reverse().find((m) => m.role === "user")?.text;
    if (!q) return toast.error("Please ask your question first.");
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) return toast.error("Please enter a valid email.");

    setSending(true);
    try {
      const res = await fetch(`${BASE_URL}/api/agent/inbox`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room,
          email: email.trim().toLowerCase(),
          question: q,
        }),
      });
      if (res.status === 409) {
        appendMessage({
          role: "agent",
          text: "Great news — a specialist is online now. Please continue here in the chat.",
          ts: nowISO(),
        });
        setEmailNeeded(false);
        setSending(false);
        return;
      }
      if (!res.ok) throw new Error("failed");
      localStorage.setItem(emailKeyFor(room), email.trim().toLowerCase());
      appendMessage({
        role: "agent",
        text: "Thanks! We’ve logged your question and will email you shortly.",
        ts: nowISO(),
      });
      setEmailNeeded(false);
    } catch {
      toast.error("Couldn’t submit right now. Please try again in a bit.");
    } finally {
      setSending(false);
    }
  }

  function endChat() {
    try {
      socketRef.current?.emit?.("agent:user_end", { room });
    } catch {}
    appendMessage({
      role: "agent",
      text: "🔒 Chat ended. You can start a new conversation anytime using the launcher.",
      ts: nowISO(),
    });
    const next = newRoomId();
    localStorage.setItem(roomKey, next);
    setRoom(next);
    setEmailNeeded(false);
    setMessages([
      {
        id: "welcome",
        role: "agent",
        text:
          "👋 New chat started. Ask me about services, languages, pricing, timelines, or data for LLMs.",
        ts: nowISO(),
      },
    ]);
  }

  function clearChat() {
    setMessages([
      {
        id: "welcome",
        role: "agent",
        text: "👋 Chat cleared. How can I help now?",
        ts: nowISO(),
      },
    ]);
    localStorage.setItem(storageKeyFor(room), JSON.stringify([]));
    setEmailNeeded(false);
  }

  /* Styles */
  const surface =
    "bg-white text-neutral-900 border border-black/10 shadow-2xl dark:bg-neutral-900 dark:text-neutral-100 dark:border-white/10";
  const headerGrad =
    "bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-indigo-500";
  const bubbleUser =
    "bg-blue-600 text-white rounded-br-sm shadow-sm dark:bg-blue-500";
  const bubbleAdmin =
    "bg-emerald-600 text-white rounded-br-sm shadow-sm dark:bg-emerald-500";
  const bubbleAgent =
    "bg-white text-neutral-900 rounded-bl-sm shadow-sm dark:bg-neutral-800 dark:text-neutral-100";
  const field =
    "rounded-xl border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-100 dark:focus:ring-blue-500";
  const card =
    "rounded-xl border border-neutral-200 p-3 dark:border-neutral-800 dark:bg-neutral-900/60";

  /* Message row */
  const MessageRow = ({ m }) => {
    const isUser = m.role === "user";
    const isAdmin = m.role === "admin";

    const bubble = isUser ? bubbleUser : isAdmin ? bubbleAdmin : bubbleAgent;
    const avatar = isUser ? <UserAvatar /> : isAdmin ? <AdminAvatar /> : null;
    const time = formatStamp(m.ts);

    return (
      <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
        {!isUser && avatar}
        <div className="max-w-[80%] sm:max-w-[85%]">
          <div
            className={`rounded-2xl px-3 py-2 text-sm ${bubble}`}
            title={m.ts ? new Date(m.ts).toLocaleString() : ""}
          >
            {m.text}
          </div>
          <div className="mt-1 text-[10px] text-neutral-500 dark:text-neutral-400">
            {time}
          </div>
        </div>
        {isUser && avatar}
      </div>
    );
  };

  /* Responsive, compact floating card (not fullscreen on mobile) */
  const panelClasses = `
    fixed z-50
    left-1/2 -translate-x-1/2 bottom-24
    w-[min(94vw,520px)]
    sm:translate-x-0 sm:left-auto sm:right-6
    sm:w-[min(420px,92vw)]
    rounded-2xl
    ${surface}
  `;

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 rounded-full transition-all
        ${isDark ? "bg-neutral-900 hover:shadow-[0_10px_30px_rgba(0,0,0,.45)]"
                 : "bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,.15)]"}
        border ${isDark ? "border-white/10" : "border-black/5"} shadow-lg`}
        aria-label="Open Khisima Chat"
      >
        <span className="relative block">
          <img
            src={logo}
            alt="Khisma Agent"
            className="h-12 w-12 sm:h-14 sm:w-14 p-2 rounded-full object-contain"
          />
          <span
            className={`absolute -right-1 -bottom-1 h-4 w-4 rounded-full ring-2 ${
              isDark ? "ring-neutral-900" : "ring-white"
            } ${adminOnline ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-600"}`}
            title={adminOnline ? "Admin online" : "Admin offline"}
          />
        </span>
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className={panelClasses}
          role="dialog"
          aria-modal="true"
          style={{
            paddingBottom: "max(0px, env(safe-area-inset-bottom))",
          }}
        >
          {/* Column layout; capped height even on mobile; rounded bottom edge */}
          <div className="flex max-h-[72vh] flex-col sm:max-h-[70vh] rounded-2xl overflow-hidden">
            {/* Header */}
            <div className={`relative text-white p-3 ${headerGrad} rounded-t-2xl`}>
              {/* Top row: logo + name + slogan */}
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Khisma Agent"
                  className="h-8 w-8 rounded-md bg-white/10 p-1 ring-1 ring-white/10"
                />
                <div className="leading-tight">
                  <div className="font-semibold tracking-wide">Khisima AI Assistant</div>
                  <div className="text-[11px] opacity-95">
                    Let your words travel. Let your data speak.
                  </div>
                </div>
              </div>

              {/* Divider line */}
              <div className="my-2 h-px bg-white/20" />

              {/* Bottom row: status + actions */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ring-1 ${
                    adminOnline ? "bg-white/10 ring-white/30" : "bg-black/10 ring-black/20"
                  }`}
                  title={adminOnline ? "Specialist online" : "Auto-assist"}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      adminOnline ? "bg-green-400" : "bg-neutral-300"
                    }`}
                  />
                  {adminOnline ? "Specialist online" : "Auto-assist"}
                </span>

                <div className="flex items-center gap-2">
                  {/* Clear chat */}
                  <button
                    onClick={clearChat}
                    className="rounded-md bg-white/10 hover:bg-white/20 px-2 py-1 text-[11px] font-medium"
                    title="Clear chat"
                  >
                    <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                    Clear
                  </button>

                  {/* End chat */}
                  <button
                    onClick={endChat}
                    className="rounded-md bg-white/10 hover:bg-white/20 px-2 py-1 text-[11px] font-medium"
                    title="End chat"
                  >
                    <Power className="h-3.5 w-3.5 inline mr-1" />
                    End
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-md hover:bg-white/10 p-1"
                    aria-label="Close chat"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              className={`flex-1 overflow-y-auto p-3 space-y-3 ${
                isDark ? "bg-neutral-950/40" : "bg-neutral-50"
              }`}
            >
              {messages.map((m) => (
                <MessageRow key={m.id} m={m} />
              ))}

              {searching && (
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Searching for a relevant answer…
                </div>
              )}

              {emailNeeded && !adminOnline && (
                <div className={`${card} mt-2`}>
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Mail className="h-4 w-4" /> Leave your email
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={`w-full pl-10 pr-3 ${field}`}
                      />
                    </div>
                    <button
                      onClick={submitEmailAndQuestion}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-60"
                      disabled={sending}
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      <span className="sm:inline">Send</span>
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    We’ll only use your email to reply to this question.
                  </p>
                </div>
              )}
            </div>

            {/* Input (rounded bottom) */}
            <form
              onSubmit={handleSend}
              className={`border-t ${isDark ? "border-white/10" : "border-black/10"} p-2 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-neutral-900/80 rounded-b-2xl`}
              style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about services, languages, timelines…"
                  className={`flex-1 ${field}`}
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
                  disabled={!input.trim() || sending}
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
              <div className="px-1 pt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                {adminOnline
                  ? "A human specialist is available now."
                  : "I’ll answer directly or ask to email you if the team is offline."}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
