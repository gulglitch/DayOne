"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getResult, wsUrl } from "@/lib/api";
import type { AgentMessage, SessionResult, WSEvent } from "@/lib/types";

export type ConnectionState = "connecting" | "open" | "reconnecting" | "failed";

const MAX_RETRIES = 6;
const RETRY_DELAY_MS = 1200;

export function useCompanyRun(sessionId: string) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [apiReachable, setApiReachable] = useState(true);

  const socketRef = useRef<WebSocket | null>(null);
  const resultRef = useRef<SessionResult | null>(null);
  const retriesRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshResult = useCallback(async () => {
    try {
      const r = await getResult(sessionId);
      setResult(r);
      resultRef.current = r;
      setApiReachable(true);
      return r;
    } catch {
      setApiReachable(false);
      return null;
    }
  }, [sessionId]);

  useEffect(() => {
    let cancelled = false;

    function connect() {
      if (cancelled) return;
      setConnection((c) => (c === "open" ? c : "connecting"));

      const socket = new WebSocket(wsUrl(sessionId));
      socketRef.current = socket;

      socket.onopen = () => {
        if (cancelled) return;
        retriesRef.current = 0;
        setConnection("open");
      };

      socket.onclose = () => {
        if (cancelled) return;

        const stillRunning = (resultRef.current?.status ?? "running") === "running";
        if (stillRunning && retriesRef.current < MAX_RETRIES) {
          retriesRef.current += 1;
          setConnection("reconnecting");
          retryTimeoutRef.current = setTimeout(connect, RETRY_DELAY_MS);
        } else if (stillRunning) {
          setConnection("failed");
        }
      };

      socket.onerror = () => {};

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
  
          if (data.agent === "system") {
            refreshResult();
          }
        }
      };
    }

    connect();
    refreshResult();

    return () => {
      cancelled = true;
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      socketRef.current?.close();
    };
  }, [sessionId, refreshResult]);

  return { messages, result, connection, apiReachable };
}