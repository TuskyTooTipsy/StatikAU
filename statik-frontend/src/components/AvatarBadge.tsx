export default function AvatarBadge({ name, src, size = 'md' }: { name: string; src?: string; size?: 'sm' | 'md' | 'lg' }) {
  const classes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-base',
    lg: 'h-20 w-20 text-xl',
  }[size];

  if (src) {
    return <img src={src} alt={name} className={`${classes} object-cover ring-1 ring-white/10`} />;
  }

  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return <div className={`${classes} grid place-items-center bg-white/5 font-semibold text-bone ring-1 ring-white/10`}>{initials}</div>;
}
