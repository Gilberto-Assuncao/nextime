import type { EntityId, SocialLinks, Timestamp } from "./shared"; import type { UserId } from "./user";
export type ProfessionalProfileId = EntityId<"ProfessionalProfile">;
export interface ProfessionalExperience { company: string; title: string; startsAt: Timestamp; endsAt?: Timestamp; description?: string }
export interface PortfolioItem { id: string; title: string; description?: string; url?: string; imageUrl?: string }
export interface ProfessionalProfile { id: ProfessionalProfileId; userId: UserId; photo?: string; specialties: string[]; certificateIds: CertificateId[]; languages: string[]; experience: ProfessionalExperience[]; bio?: string; social: SocialLinks; portfolio: PortfolioItem[]; resumeUrl?: string; availability?: string }
import type { CertificateId } from "./certificate";
