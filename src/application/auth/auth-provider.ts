export type AuthProvider = "email" | "google" | "microsoft" | "apple" | "magic_link";
export interface SignInRequest { provider: AuthProvider; email?: string; password?: string; redirectTo?: string }
export interface AuthIdentity { id: string; email: string; provider: AuthProvider }
export interface AuthenticationService { signIn(request: SignInRequest): Promise<void>; signOut(): Promise<void>; getIdentity(): Promise<AuthIdentity | null> }
