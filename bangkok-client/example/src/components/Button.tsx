import { mergeClasses } from "../utils/mergeClasses";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function PrimaryButton({ children, className, ...rest }: Props) {
  return (
    <button
      className={mergeClasses(
        "text-white bg-[#4F05E5] h-[48px] rounded-md text-[14px]",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className, ...rest }: Props) {
  return (
    <button
      className={mergeClasses(
        "text-white border-[#4F05E5] border-2 bg-transparent h-[48px] rounded-md text-[14px]",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
