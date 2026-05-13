import type { SimpleIcon } from "simple-icons";

type Props = {
  icon: SimpleIcon;
  className?: string;
  /** When false, icon is decorative (parent link should have aria-label). */
  titled?: boolean;
};

export function SimpleBrandIcon({ icon, className, titled = false }: Props) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={!titled}
    >
      {titled ? <title>{icon.title}</title> : null}
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}
