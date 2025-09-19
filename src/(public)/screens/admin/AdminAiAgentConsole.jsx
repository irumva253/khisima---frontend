/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
// src/(public)/screens/admin/AdminAiAgentConsole.jsx
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { BASE_URL } from "@/constants";
import {
  useGetPresenceQuery,
  useSetPresenceMutation,
  useGetRoomsQuery,
} from "@/slices/agentApiSlice";
import {
  Loader2,
  Send,
  Search,
  Power,
  Users,
  RefreshCw,
  FileDown,
  Mail,
  AtSign,
  Trash2,
  Inbox,
  ArrowLeft,
  Info,
} from "lucide-react";
import { IconCircleDottedLetterK, IconUserCircle } from "@tabler/icons-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
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

/* ---------------- Timestamp helper ---------------- */
function formatStamp(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();

  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  const yest = new Date(now);
  yest.setDate(now.getDate() - 1);
  const isYest =
    d.getFullYear() === yest.getFullYear() &&
    d.getMonth() === yest.getMonth() &&
    d.getDate() === yest.getDate();

  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Now";
  if (sameDay && diffMin < 60) return `${diffMin} min ago`;

  const hhmm = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return `Today ${hhmm}`;
  if (isYest) return `Yesterday ${hhmm}`;

  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 7) {
    const weekday = d.toLocaleDateString([], { weekday: "short" });
    return `${weekday} ${hhmm}`;
  }
  return d.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* Convert imported logo url → dataURL for jsPDF (same-origin asset) */
async function getImageDataURL(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
    img.src = url;
  });
}

/* ---------------- Admin Console ---------------- */
export default function AdminAiAgentConsole() {
  const isDark = useIsDark();

  // Presence via RTK
  const { data: presenceData, isFetching: loadingPresence } = useGetPresenceQuery();
  const [setPresence, { isLoading: settingPresence }] = useSetPresenceMutation();

  // Rooms via RTK
  const [filter, setFilter] = useState("");
  const { data: roomsData, refetch: refetchRooms, isFetching: loadingRooms } =
    useGetRoomsQuery({ page: 1, limit: 50, search: filter });

  const rooms = roomsData?.items || [];

  // Local state
  const [online, setOnline] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomEmail, setSelectedRoomEmail] = useState("");
  const [input, setInput] = useState("");
  const [liveMessages, setLiveMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Forward modal state
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardTo, setForwardTo] = useState("");
  const [forwardSubject, setForwardSubject] = useState("");
  const [forwarding, setForwarding] = useState(false);

  const socketRef = useRef(null);
  const historyTimerRef = useRef(null);
  const messagesRef = useRef(null);

  // Mobile: show the list or the thread pane
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  /* ---------------- Sockets ---------------- */
  useEffect(() => {
    const s = io(BASE_URL, {
      path: "/socket.io",
      withCredentials: true,
      query: { role: "admin" },
      // allow polling fallback (no forced ["websocket"])
    });
    socketRef.current = s;

    s.on("connect", () => {
      s.emit("agent:admin_status:get");
    });

    s.on("agent:admin_status", ({ online: isOn }) => {
      setOnline(!!isOn);
    });

    s.on("agent:user_message", ({ room, text, ts, email }) => {
      if (room === selectedRoom) {
        setLiveMessages((prev) => [...prev, { role: "user", text, ts }]);
        if (email && !selectedRoomEmail) setSelectedRoomEmail(email);
        scrollToBottom();
      }
      refetchRooms();
    });

    s.on("agent:admin_reply", ({ room, text, ts }) => {
      if (room === selectedRoom) {
        setLiveMessages((prev) => [...prev, { role: "admin", text, ts }]);
        scrollToBottom();
      }
    });

    s.on("agent:system", ({ room, text, ts }) => {
      if (room === selectedRoom) {
        setLiveMessages((prev) => [...prev, { role: "system", text: text || "", ts }]);
        scrollToBottom();
      }
    });

    s.on("agent:room_history", ({ room, messages, email }) => {
      if (room === selectedRoom) {
        setLiveMessages(messages || []);
        if (email) setSelectedRoomEmail(email);
        clearTimeout(historyTimerRef.current);
        historyTimerRef.current = null;
        setLoadingHistory(false);
        setTimeout(scrollToBottom, 20);
      }
    });

    return () => {
      if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
      s.disconnect();
      socketRef.current = null;
    };
  }, [selectedRoom, selectedRoomEmail, refetchRooms]);

  // Init presence from REST
  useEffect(() => {
    if (typeof presenceData?.online === "boolean") {
      setOnline(!!presenceData.online);
    }
  }, [presenceData]);

  // When selecting a room, always fetch its full history (socket first, REST fallback)
  useEffect(() => {
    if (!selectedRoom) return;
    setLoadingHistory(true);
    setLiveMessages([]);

    socketRef.current?.emit("agent:get_history", { room: selectedRoom });
    historyTimerRef.current = setTimeout(fetchHistoryREST, 600);

    const meta = rooms.find((r) => r.roomId === selectedRoom);
    setSelectedRoomEmail(meta?.email || "");

    setShowListOnMobile(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom]);

  async function fetchHistoryREST() {
    try {
      const res = await fetch(
        `${BASE_URL}/api/agent/rooms/${encodeURIComponent(selectedRoom)}/messages?page=1&limit=200`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        const items = data?.items || data?.messages || [];
        setLiveMessages(
          items.map((m) => ({
            role:
              m.role ||
              (m.sender === "admin" ? "admin" : m.sender === "system" ? "system" : "user"),
            text: m.text || m.message || "",
            ts: m.ts || m.createdAt || new Date().toISOString(),
          }))
        );
        if (data?.email && !selectedRoomEmail) setSelectedRoomEmail(data.email);
        setTimeout(scrollToBottom, 20);
      }
    } finally {
      if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
      historyTimerRef.current = null;
      setLoadingHistory(false);
    }
  }

  function scrollToBottom() {
    try {
      messagesRef.current?.scrollTo?.({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    } catch {}
  }

  /* ---------------- Actions ---------------- */
  async function toggleOnline() {
    const next = !online;
    setOnline(next);
    try {
      await setPresence({ online: next }).unwrap();
      toast.success(next ? "You’re now Online" : "You’re now Offline");
    } catch {
      setOnline(!next);
      toast.error("Failed to update presence");
    }
  }

  function sendReply(e) {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || !selectedRoom) return;
    socketRef.current?.emit("agent:admin_reply", { room: selectedRoom, text });
    setLiveMessages((m) => [...m, { role: "admin", text, ts: new Date().toISOString() }]);
    setInput("");
    setTimeout(scrollToBottom, 20);
  }

  function requestUserEmail() {
    if (!selectedRoom) return;
    socketRef.current?.emit("agent:request_email", { room: selectedRoom });
    setLiveMessages((m) => [
      ...m,
      { role: "system", text: "Email request sent to the user.", ts: new Date().toISOString() },
    ]);
    toast.success("Email request sent to the user");
  }

  /* ---------------- PDF Export (branded, no html2canvas) ---------------- */
  async function exportPDF() {
    if (!selectedRoom) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const page = { w: doc.internal.pageSize.getWidth(), h: doc.internal.pageSize.getHeight() };

    // Colors & metrics
    const left = 48;
    const right = page.w - 48;
    const usableWidth = page.w - left - 48;
    let y = 48;

    // Header band (brand blue)
    doc.setFillColor(74, 149, 242); // #4a95f2
    doc.rect(0, 0, page.w, 90, "F");

    // Logo (left)
    try {
      const dataURL = await getImageDataURL(logo);
      const logoH = 42;
      const logoW = 42;
      doc.addImage(dataURL, "PNG", left, 24, logoW, logoH);
    } catch {}

    // Title & subtitle
    doc.setTextColor("#ffffff");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Khisima — Live Chat Transcript", left + 50, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const subtitle = `Room: ${selectedRoom}${
      selectedRoomEmail ? ` • Email: ${selectedRoomEmail}` : ""
    } • Generated: ${new Date().toLocaleString()}`;
    doc.text(subtitle, left + 50, 60);

    // Move below header
    y = 110;
    doc.setTextColor("#111111");

    // Section title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Messages", left, y);
    y += 18;

    const lineGap = 14;
    const pushY = (amount = lineGap) => {
      y += amount;
      if (y > page.h - 72) {
        addFooter();
        doc.addPage();
        drawHeaderRule();
        y = 72;
      }
    };

    const drawHeaderRule = () => {
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.6);
      doc.line(left, 50, right, 50);
    };

    const addFooter = () => {
      const pageNum = doc.internal.getNumberOfPages();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor("#666666");
      doc.text(`Page ${pageNum}`, right, page.h - 28, { align: "right" });
    };

    const borderColor = [235, 238, 244];
    const senderPill = (sender) => {
      const txt = ` ${sender} `;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setFillColor(240, 245, 255);
      const w = doc.getTextWidth(txt) + 6;
      doc.rect(left, y - 8, w, 14, "F");
      doc.setTextColor(74, 149, 242);
      doc.text(txt, left + 3, y + 2);
      doc.setTextColor("#111111");
    };

    const drawMsg = (role, text = "", ts) => {
      const sender =
        role === "admin" ? "Admin" : role === "user" ? "User" : role === "agent" ? "Agent" : "System";
      const when = ts ? new Date(ts).toLocaleString() : "";

      senderPill(sender);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor("#666666");
      doc.text(when, right, y + 2, { align: "right" });
      doc.setTextColor("#111111");
      pushY(16);

      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.7);
      const bodyLines = doc.splitTextToSize(text, usableWidth);
      const boxHeight = bodyLines.length * lineGap + 12;

      if (y + boxHeight > page.h - 72) {
        addFooter();
        doc.addPage();
        drawHeaderRule();
        y = 72;
      }

      doc.setFillColor(255, 255, 255);
      doc.rect(left, y - 10, usableWidth, boxHeight, "FD");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      bodyLines.forEach((line) => {
        doc.text(line, left + 8, y);
        pushY();
      });
      pushY(6);
    };

    (liveMessages || []).forEach((m) => drawMsg(m.role, String(m.text || ""), m.ts));

    addFooter();
    doc.save(`khisima-chat-room-${selectedRoom}.pdf`);
  }

  async function forwardTranscript() {
    if (!selectedRoom) return;
    if (!forwardTo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forwardTo)) {
      return toast.error("Enter a valid email to forward to.");
    }
    setForwarding(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/agent/rooms/${encodeURIComponent(selectedRoom)}/forward`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: forwardTo.trim(),
            subject: forwardSubject?.trim() || `Chat transcript — Room ${selectedRoom}`,
          }),
        }
      );
      if (!res.ok) throw new Error("forward failed");
      toast.success("Transcript forwarded");
      setForwardOpen(false);
      setForwardTo("");
      setForwardSubject("");
    } catch {
      toast.error("Could not forward transcript");
    } finally {
      setForwarding(false);
    }
  }

  async function deleteRoom() {
    if (!selectedRoom) return;
    if (!confirm("Delete this room and all its messages? This cannot be undone.")) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/agent/rooms/${encodeURIComponent(selectedRoom)}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error("delete failed");
      toast.success("Room deleted");
      setSelectedRoom(null);
      setLiveMessages([]);
      setSelectedRoomEmail("");
      refetchRooms();
      setShowListOnMobile(true);
    } catch {
      toast.error("Could not delete room");
    }
  }

  /* ---------------- UI helpers ---------------- */
  const pillBase =
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1";
  const chipAdmin = `${pillBase} bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30`;
  const chipUser = `${pillBase} bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30`;
  const chipSystem = `${pillBase} bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-800/30`;

  const bubbleAdmin =
    "bg-emerald-600 text-white rounded-2xl rounded-br-sm shadow-sm dark:bg-emerald-500";
  const bubbleUser =
    "bg-white text-neutral-900 rounded-2xl rounded-bl-sm shadow-sm dark:bg-neutral-800 dark:text-neutral-100";
  const bubbleSystem =
    "bg-amber-50 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-200/60 dark:border-amber-700/50 rounded-2xl";

  /* ---------------- Render ---------------- */
  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Live Console</h2>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${
              online
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30"
                : "bg-neutral-100 text-neutral-700 ring-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-200 dark:ring-neutral-700"
            }`}
            title={online ? "You are online" : "You are offline"}
          >
            <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-neutral-400"}`} />
            {online ? "Online" : "Offline"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleOnline}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-white transition-colors ${
              online ? "bg-emerald-600 hover:bg-emerald-700" : "bg-neutral-600 hover:bg-neutral-700"
            }`}
            disabled={loadingPresence || settingPresence}
          >
            {(loadingPresence || settingPresence) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Power className="h-4 w-4" />
            )}
            {online ? "Go Offline" : "Go Online"}
          </button>
        </div>
      </div>

      {/* Responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Rooms list */}
        <div
          className={`
            ${showListOnMobile ? "block" : "hidden"}
            md:block md:col-span-4 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800
          `}
        >
          <div className="flex items-center gap-2 border-b p-3 dark:border-neutral-800">
            <Search className="h-4 w-4 text-neutral-500" />
            <input
              placeholder="Filter rooms…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full outline-none text-sm bg-transparent"
            />
            <button
              onClick={() => refetchRooms()}
              className="text-xs px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center gap-1"
              title="Refresh"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {loadingRooms && (
              <div className="p-3 text-sm text-neutral-500 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading rooms…
              </div>
            )}
            {rooms.map((r) => (
              <button
                key={r._id || r.roomId}
                onClick={() => setSelectedRoom(r.roomId)}
                className={`flex w-full items-center justify-between px-3 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                  selectedRoom === r.roomId ? "bg-neutral-50 dark:bg-neutral-800" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{r.roomId}</div>
                  <div className="text-xs text-neutral-500">
                    Last: {r.lastMsgAt ? new Date(r.lastMsgAt).toLocaleString() : "—"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {r.unread ? (
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-xs text-white">
                      {r.unread}
                    </span>
                  ) : null}
                </div>
              </button>
            ))}
            {!loadingRooms && rooms.length === 0 && (
              <div className="p-3 text-sm text-neutral-500">No rooms yet.</div>
            )}
          </div>
        </div>

        {/* Message panel */}
        <div
          className={`
            ${showListOnMobile ? "hidden" : "block"}
            md:block md:col-span-8 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800
          `}
        >
          {!selectedRoom ? (
            <div className="flex h-full min-h-[70vh] items-center justify-center text-neutral-500">
              Select a room to start chatting.
            </div>
          ) : (
            <div className="flex h-full min-h-[70vh] flex-col">
              {/* Room header */}
              <div className="flex items-center gap-3 border-b p-3 dark:border-neutral-800">
                {/* Back on mobile */}
                <button
                  className="md:hidden inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  onClick={() => setShowListOnMobile(true)}
                  title="Back to rooms"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Rooms
                </button>

                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{selectedRoom}</div>
                  <div className="text-xs text-neutral-500 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 ${online ? "text-emerald-600" : "text-neutral-500"}`}>
                      <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-neutral-400"}`} />
                      {online ? "Online" : "Offline"}
                    </span>
                    {selectedRoomEmail ? (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30"
                        title="Email captured for this room"
                      >
                        <Mail className="h-3 w-3" /> {selectedRoomEmail}
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 bg-neutral-100 text-neutral-700 ring-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-200 dark:ring-neutral-700"
                        title="No email yet for this room"
                      >
                        <Inbox className="h-3 w-3" /> No email
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-auto flex flex-wrap items-center gap-2 sm:flex-nowrap">
                  <button
                    onClick={requestUserEmail}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                    title="Ask the user for their email"
                  >
                    <AtSign className="h-4 w-4" />
                    <span className="hidden xs:inline">Request email</span>
                  </button>

                  <button
                    onClick={() => setForwardOpen(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                    title="Forward transcript via email"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="hidden xs:inline">Forward</span>
                  </button>

                  <button
                    onClick={exportPDF}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                    title="Export transcript as PDF"
                  >
                    <FileDown className="h-4 w-4" />
                    <span className="hidden xs:inline">Export PDF</span>
                  </button>

                  <button
                    onClick={deleteRoom}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                    title="Delete this room"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden xs:inline">Delete</span>
                  </button>
                </div>
              </div>

              {/* Messages (with avatars & chips) */}
              <div
                ref={messagesRef}
                className="flex-1 space-y-4 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 p-3"
              >
                {loadingHistory ? (
                  <div className="p-2 text-sm text-neutral-500 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading history…
                  </div>
                ) : null}

                {(liveMessages || []).map((m, i) => {
                  const isAdmin = m.role === "admin";
                  const isSystem = m.role === "system";
                  const align = isAdmin ? "justify-end" : "justify-start";
                  const chip =
                    isSystem ? (
                      <span className={chipSystem}>
                        <Info className="h-3 w-3" /> System
                      </span>
                    ) : isAdmin ? (
                      <span className={chipAdmin}>Admin</span>
                    ) : (
                      <span className={chipUser}>User</span>
                    );

                  return (
                    <div key={`${i}-${m.ts}-${m.text?.slice(0, 12)}`} className={`flex ${align} gap-2`}>
                      {/* Avatar */}
                      {!isAdmin && !isSystem ? (
                        <div className="flex-shrink-0">
                          <div
                            className="h-8 w-8 rounded-full grid place-items-center"
                            style={{ backgroundColor: "#4a95f2" }}
                            title="User"
                          >
                            <IconUserCircle size={18} color="#ffffff" />
                          </div>
                        </div>
                      ) : isAdmin ? (
                        <div className="flex-shrink-0 order-2 md:order-none">
                          <div
                            className="h-8 w-8 rounded-full grid place-items-center bg-emerald-600 text-white dark:bg-emerald-500"
                            title="Admin"
                          >
                            <IconCircleDottedLetterK size={18} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full grid place-items-center bg-amber-400 text-white" title="System">
                            <Info className="h-4 w-4" />
                          </div>
                        </div>
                      )}

                      {/* Bubble + meta */}
                      <div className={`max-w-[82%] ${isAdmin ? "order-1 md:order-none" : ""}`}>
                        <div className="mb-1 flex items-center gap-2">
                          {chip}
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                            {formatStamp(m.ts)}
                          </span>
                        </div>
                        <div
                          className={`px-3 py-2 text-sm shadow-sm ${
                            isAdmin ? bubbleAdmin : isSystem ? bubbleSystem : bubbleUser
                          }`}
                          title={m.ts ? new Date(m.ts).toLocaleString() : ""}
                        >
                          {m.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply box */}
              <form onSubmit={sendReply} className="border-t p-2 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your reply…"
                    className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Forward modal */}
      {forwardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border bg-white p-4 shadow-xl dark:bg-neutral-900 dark:border-neutral-800">
            <div className="mb-3">
              <div className="text-sm font-semibold">Forward transcript</div>
              <div className="text-xs text-neutral-500">
                Room: <span className="font-mono">{selectedRoom}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs mb-1 text-neutral-600 dark:text-neutral-300">
                  To (email)
                </label>
                <input
                  value={forwardTo}
                  onChange={(e) => setForwardTo(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-neutral-700 dark:bg-neutral-900/60"
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-neutral-600 dark:text-neutral-300">
                  Subject (optional)
                </label>
                <input
                  value={forwardSubject}
                  onChange={(e) => setForwardSubject(e.target.value)}
                  placeholder={`Chat transcript — Room ${selectedRoom}`}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-neutral-700 dark:bg-neutral-900/60"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setForwardOpen(false)}
                className="rounded-lg px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={forwardTranscript}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                disabled={forwarding}
              >
                {forwarding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Forward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
