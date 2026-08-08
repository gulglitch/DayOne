"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getResult, wsUrl } from "@/lib/api";
import type { AgentMessage, SessionResult, WSEvent } from "@/lib/types";

export type ConnectionState = "connecting" | "open" | "reconnecting" | "polling";

const MAX_RETRIES = 6;
const RETRY_DELAY_MS = 1200;
const POLL_INTERVAL_MS = 3000;

export function useCompanyRun(sessionId: string) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [apiReachable, setApiReachable] = useState(true);

  const socketRef = useRef<WebSocket | null>(null);
  const resultRef = useRef<SessionResult | null>(null);
  const retriesRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

    function startPolling() {
      if (pollIntervalRef.current || cancelled) return;
      setConnection("polling");
      pollIntervalRef.current = setInterval(async () => {
        const r = await refreshResult();
        if (r && r.status !== "running" && pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }, POLL_INTERVAL_MS);
    }

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
        if (!stillRunning) return;

        if (retriesRef.current < MAX_RETRIES) {
          retriesRef.current += 1;
          setConnection("reconnecting");
          retryTimeoutRef.current = setTimeout(connect, RETRY_DELAY_MS);
        } else {
          // WebSocket genuinely unreachable after repeated retries — fall
          // back to polling so the run can still reach completion even
          // without a live message stream.
          startPolling();
        }
      };

      // onerror is always followed by onclose for WebSocket — let onclose
      // own the actual state transition/retry so we don't double-handle it.
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
          // No dedicated "run_complete" event exists — a "system" message
          // (connect / complete / error) is our cue to re-check
          // /api/result for the latest status and dossier.
          if (data.agent === "system") {
            refreshResult();
          }
        }
        // {"type": "ping"} heartbeat events just keep the socket alive.
      };
    }

    connect();
    // Covers the case where the run already finished before we connected.
    refreshResult();

    return () => {
      cancelled = true;
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      socketRef.current?.close();
    };
  }, [sessionId, refreshResult]);

  return { messages, result, connection, apiReachable };
}