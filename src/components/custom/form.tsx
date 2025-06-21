"use client";
import { useRef, ReactNode } from "react";

interface FormProps {
  children: ReactNode;
  className?: string;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({ children, className, onSubmit }: FormProps) => {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form className={className} onSubmit={onSubmit} ref={ref}>
      {children}
    </form>
  );
};

export default Form;
