import type { JwtClaims } from "~/types/auth/JwtClaims";

export type JwtPayload<TPayload> = JwtClaims & TPayload;
