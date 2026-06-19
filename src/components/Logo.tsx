import Link from "next/link";

type LogoProps = {
  href?: string;
};

export function Logo({ href = "/" }: LogoProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-3 text-brg-text">
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#0B7A46]/60">
        <span className="h-3 w-3 rounded-full bg-[#0B7A46]" />
        <span className="absolute -right-1 top-2 h-2 w-2 rounded-full bg-brg-bg" />
      </span>
      <span className="text-lg font-semibold tracking-normal">BASIC22</span>
    </Link>
  );
}
