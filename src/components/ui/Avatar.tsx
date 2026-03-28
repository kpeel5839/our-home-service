import { cn } from "@/lib/utils/cn";
import { FamilyMember } from "@/lib/types";

interface AvatarProps {
  member: FamilyMember;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

export function Avatar({ member, size = "md", className }: AvatarProps) {
  const initials = member.name.charAt(0);
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0",
        sizeMap[size],
        className
      )}
      style={{ backgroundColor: member.avatarColor }}
    >
      {initials}
    </div>
  );
}
