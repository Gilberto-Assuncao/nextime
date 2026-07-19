import type { Client, Project } from "@/lib/types/project";

export const clients: Client[] = [
  { id: "atlas", companyName: "Atlas Construction", contactName: "Elena Rossi", email: "elena@atlas.example", phone: "+32 2 555 01 10", country: "Belgium", vat: "BE 0788.456.123", address: "Avenue Louise 210, Brussels" },
  { id: "northstar", companyName: "Northstar Logistics", contactName: "James Miller", email: "james@northstar.example", phone: "+31 20 555 0180", country: "Netherlands", vat: "NL 8612.45.678.B01", address: "Wibautstraat 131, Amsterdam" },
  { id: "verdant", companyName: "Verdant Living", contactName: "Claire Dubois", email: "claire@verdant.example", phone: "+33 1 84 80 20 10", country: "France", vat: "FR 40 123456789", address: "18 Rue de Rivoli, Paris" },
];
const members = [{ id: "maya", name: "Maya Laurent", role: "Project lead", initials: "ML" }, { id: "lucas", name: "Lucas Martin", role: "Engineer", initials: "LM" }, { id: "sofia", name: "Sofia Dubois", role: "Designer", initials: "SD" }];
export const projects: Project[] = [
  { id: "harbor-residence", name: "Harbor Residence", clientId: "atlas", status: "active", priority: "high", estimatedHours: 720, workedHours: 438, startDate: "2026-03-02", endDate: "2026-11-30", budget: { amount: 98000, spent: 58400, currency: "EUR" }, description: "Construction coordination and workforce planning for a premium residential development.", members, statistics: { trackedHours: 438, billableHours: 412, entries: 186, members: 3 } },
  { id: "route-optimization", name: "Route Optimization", clientId: "northstar", status: "planning", priority: "critical", estimatedHours: 360, workedHours: 42, startDate: "2026-07-06", endDate: "2026-10-16", budget: { amount: 52000, spent: 6100, currency: "EUR" }, description: "Operational analysis and implementation planning for regional delivery routes.", members: members.slice(0, 2), statistics: { trackedHours: 42, billableHours: 36, entries: 21, members: 2 } },
  { id: "eco-interiors", name: "Eco Interiors", clientId: "verdant", status: "paused", priority: "medium", estimatedHours: 280, workedHours: 196, startDate: "2026-01-12", endDate: "2026-08-28", budget: { amount: 41000, spent: 28700, currency: "EUR" }, description: "Sustainable interior concept, sourcing, and delivery oversight.", members: [members[2]], statistics: { trackedHours: 196, billableHours: 184, entries: 93, members: 1 } },
  { id: "warehouse-audit", name: "Warehouse Audit", clientId: "northstar", status: "completed", priority: "low", estimatedHours: 120, workedHours: 116, startDate: "2026-02-02", endDate: "2026-04-17", budget: { amount: 16500, spent: 15900, currency: "EUR" }, description: "Completed time and process audit across three warehouse locations.", members: members.slice(0, 2), statistics: { trackedHours: 116, billableHours: 108, entries: 54, members: 2 } },
];
export const getClient = (id: string) => clients.find((client) => client.id === id);
