interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className = "" }: IconProps) {
  // Use Remix Icon classes - the CSS is already loaded in index.html
  return <i className={`ri-${name}-line ${className}`}></i>;
}
