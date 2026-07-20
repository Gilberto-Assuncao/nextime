import type { AuthenticatedSession } from "./types";

export type SessionContext = AuthenticatedSession;

export interface SessionContextProvider {
  getCurrent(): Promise<SessionContext | null>;
  switchCompany(companyId: string): Promise<SessionContext>;
}
