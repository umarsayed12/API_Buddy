import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

//History ke liye

export const truncateIfTooLarge = (value, limit = 5000, previewCount = 10) => {
  if (typeof value === "string") {
    return value.length > limit
      ? value.substring(0, limit) + ` ...[truncated]`
      : value;
  }

  if (Array.isArray(value) && value.every((item) => typeof item === "object")) {
    if (value.length > previewCount) {
      const preview = value.slice(0, previewCount);
      return [...preview, `...[+${value.length - previewCount}]`];
    }
    return value;
  }

  if (typeof value === "object") {
    const str = JSON.stringify(value);
    return str.length > limit
      ? str.substring(0, limit) + " ...[truncated]"
      : value;
  }

  return value;
};

export const extractErrorSummary = (errorData) => {
  if (!errorData) return "Unknown error";
  if (typeof errorData === "string") {
    const trimmed = errorData.trim();
    if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) {
      return "An HTML error page was received. The server might be returning an error page instead of JSON.";
    }
    return trimmed.length > 150 ? trimmed.slice(0, 150) + "..." : trimmed;
  }
  if (typeof errorData === "object") {
    return (
      errorData.message ||
      errorData.error ||
      errorData.title ||
      JSON.stringify(errorData).slice(0, 150) + "..."
    );
  }

  return "Unrecognized error format";
};
