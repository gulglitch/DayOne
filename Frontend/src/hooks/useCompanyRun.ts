"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getResult, wsUrl } from "@/lib/api";
import type { AgentMessage, SessionResult, WSEvent } from "@/lib/types";

type ConnectionState = "connecting" | "open" | "closed" | "error";

export function useCompanyRun(sessionId: string) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [apiReachable, setApiReachable] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);

  const refreshResult = useCallback(async () => {
    try {
      const r = await getResult(sessionId);
      setResult(r);
      setApiReachable(true);
      return r;
    } catch {
      setApiReachable(false);
      return null;
    }
  }, [sessionId]);

  useEffect(() => {
    let cancelled = false;
    const socket = new WebSocket(wsUrl(sessionId));
    socketRef.current = socket;

    socket.onopen = () => {
      if (!cancelled) setConnection("open");
    };
    socket.onerror = () => {
      if (!cancelled) setConnection("error");
    };
    socket.onclose = () => {
      if (!cancelled) setConnection((c) => (c === "error" ? c : "closed"));
    };
    socket.onmessage = (event) => {
      if (cancelled) return;
      let data: WSEvent;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      if ("agent" in data) {
        setMessages((prev) => [...prev, data]);
        // The backend has no dedicated "run_complete" event — a "system"
        // message (connect / complete / error) is our cue to re-check
        // /api/result for the latest status and dossier.
        if (data.agent === "system") {
          refreshResult();
        }
      }
      // {"type": "ping"} events just keep the socket alive — ignored.
    };

    // Cover the case where the run already finished before we connected.
    refreshResult();

    return () => {
      cancelled = true;
      socket.close();
    };
  }, [sessionId, refreshResult]);

  return { messages, result, connection, apiReachable };
}
