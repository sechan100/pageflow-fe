

export type RoleType = "ROLE_ANONYMOUS" | "ROLE_USER" | "ROLE_MANAGER" | "ROLE_ADMIN";

export type User = {
  uid: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  role: RoleType;
  penname: string;
  profileImageUrl: string;
}