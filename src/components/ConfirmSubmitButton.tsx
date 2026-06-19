"use client";

import type { ButtonHTMLAttributes } from "react";

type ConfirmSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  confirmMessage: string;
};

export function ConfirmSubmitButton({
  confirmMessage,
  onClick,
  ...props
}: ConfirmSubmitButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? "submit"}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    />
  );
}
