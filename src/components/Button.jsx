import React from "react";
import Spinner from "./Spinner";

export default function Button({
  text = "",
  className,
  type,
  onClick,
  disabled,
  loading,
  loadingText,
  ...props
}) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
}
