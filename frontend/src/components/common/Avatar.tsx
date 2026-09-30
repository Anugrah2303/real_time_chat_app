import { getInitials } from "../../utils/format";
import { getFileUrl } from "../../utils/server";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  isOnline?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-24 w-24 text-2xl",
};

const dotClasses = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
  lg: "h-3.5 w-3.5",
  xl: "h-4 w-4",
};

const Avatar = ({ name, src, size = "md", isOnline = false }: AvatarProps) => {
  return (
    <div className="relative shrink-0">
      {src ? (
        <img src={getFileUrl(src)} alt={name} className={`${sizeClasses[size]} rounded-full object-cover`} />
      ) : (
        <div
          className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-700`}
        >
          {getInitials(name)}
        </div>
      )}
      {isOnline && (
        <span
          className={`${dotClasses[size]} absolute bottom-0 right-0 rounded-full border-2 border-white bg-green-500`}
        />
      )}
    </div>
  );
};

export default Avatar;
