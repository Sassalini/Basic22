/* eslint-disable @next/next/no-img-element */
import { classNames, initials } from "@/lib/utils";

type AvatarProps = {
  className?: string;
  imageUrl?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-11 w-11 text-sm",
  xl: "h-20 w-20 text-xl"
};

export function Avatar({ className, imageUrl, name, size = "md" }: AvatarProps) {
  return (
    <div
      className={classNames(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0B7A46]/20 font-semibold text-brg-text",
        sizeClasses[size],
        className
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </div>
  );
}
