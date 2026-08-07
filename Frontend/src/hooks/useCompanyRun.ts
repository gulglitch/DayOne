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
    let pollInterval: NodeJS.Timeout | null = null;
    
    // Try WebSocket first
    const socket = new WebSocket(wsUrl(sessionId));
    socketRef.current = socket;

    socket.onopen = () => {
      if (!cancelled) setConnection("open");
    };
    
    socket.onerror = () => {
      if (!cancelled) {
        setConnection("error");
        // WebSocket failed, start polling as fallback
        console.log("WebSocket failed, falling back to polling");
        startPolling();
      }
    };
    
    socket.onclose = () => {
      if (!cancelled) {
        setConnection((c) => (c === "error" ? c : "closed"));
        // If WebSocket closes unexpectedly, start polling
        if (!pollInterval) {
          startPolling();
        }
      }
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

    // Polling fallback function
    const startPolling = () => {
      if (pollInterval) return; // Already polling
      
      pollInterval = setInterval(async () => {
        const result = await refreshResult();
        // Stop polling if analysis is complete or errored
        if (result && (result.status === "completed" || result.status === "error")) {
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }
      }, 3000); // Poll every 3 seconds
    };

    // Cover the case where the run already finished before we connected.
    refreshResult();

    return () => {
      cancelled = true;
      socket.close();
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [sessionId, refreshResult]);

  return { messages, result, connection, apiReachable };
}
