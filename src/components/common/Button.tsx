interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  clickHandler?: () => void;
  className?: string; // className prop 추가
  children: React.ReactNode; // children prop 추가
}

export default function Button({
  clickHandler,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={clickHandler}
      className={`px-2 py-1 text-sm rounded ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
