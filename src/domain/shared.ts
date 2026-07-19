export type EntityId<T extends string> = string & { readonly __entity: T };
export type Timestamp = string;
export interface Auditable { createdAt: Timestamp; updatedAt: Timestamp }
export interface SocialLinks { website?: string; linkedin?: string; googleBusiness?: string; instagram?: string; facebook?: string; youtube?: string }
export interface Address { line1: string; line2?: string; postalCode: string; city: string; country: string }
export interface DateRange { startsAt: Timestamp; endsAt?: Timestamp }
