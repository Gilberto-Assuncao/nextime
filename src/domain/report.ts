import type { CompanyId } from "./company"; import type { EntityId, Timestamp } from "./shared"; import type { UserId } from "./user";
export type ReportId = EntityId<"Report">;
export enum ReportStatus { Queued = "queued", Processing = "processing", Ready = "ready", Failed = "failed" }
export enum ReportFormat { Pdf = "pdf", Csv = "csv", Xlsx = "xlsx" }
export interface Report { id: ReportId; companyId: CompanyId; requestedBy: UserId; type: string; format: ReportFormat; status: ReportStatus; parameters: Record<string, unknown>; fileUrl?: string; requestedAt: Timestamp; completedAt?: Timestamp }
