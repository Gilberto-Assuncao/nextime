"use client";
import { createContext, useContext, type ReactNode } from "react"; import type { SessionContext } from "./session-context";
const CurrentSessionContext = createContext<SessionContext | null>(null);
export function SessionProvider({ value, children }: { value: SessionContext | null; children: ReactNode }) { return <CurrentSessionContext value={value}>{children}</CurrentSessionContext>; }
export function useSessionContext() { return useContext(CurrentSessionContext); }
