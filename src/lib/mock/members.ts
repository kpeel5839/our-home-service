import { FamilyMember } from "@/lib/types";

export const MOCK_MEMBERS: FamilyMember[] = [
  { id: "m1", name: "아빠", role: "FATHER", avatarColor: "#FF8C69" },
  { id: "m2", name: "엄마", role: "MOTHER", avatarColor: "#A8D8EA" },
  { id: "m3", name: "민준", role: "SON", avatarColor: "#90D5A8" },
  { id: "m4", name: "수아", role: "DAUGHTER", avatarColor: "#FFD580" },
];

export function getMemberById(id: string): FamilyMember | undefined {
  return MOCK_MEMBERS.find((m) => m.id === id);
}
