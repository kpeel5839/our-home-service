export type MemberRole = "FATHER" | "MOTHER" | "SON" | "DAUGHTER" | "OTHER";

export interface FamilyMember {
  id: string;
  name: string;
  role: MemberRole;
  avatarColor: string;
  avatarUrl?: string;
}
