import { serverApi } from "../config";
import { SyntheticEvent } from "react";

const ABSOLUTE_MEDIA_PATTERN = /^(?:https?:|data:|blob:)/i;

export const resolveMediaUrl = (path?: string, fallback = ""): string => {
  const normalized = String(path || "").trim().replace(/\\/g, "/");
  if (!normalized) return fallback;
  if (ABSOLUTE_MEDIA_PATTERN.test(normalized)) return normalized;

  const isBackendUpload = normalized === "uploads" || normalized.startsWith("uploads/") || normalized.startsWith("/uploads/");
  if (!isBackendUpload || !serverApi) return normalized.startsWith("/") ? normalized : `/${normalized}`;

  return `${serverApi.replace(/\/$/, "")}/${normalized.replace(/^\//, "")}`;
};

export const replaceBrokenImage = (
  event: SyntheticEvent<HTMLImageElement>,
  fallback = "/img/noimage-list.svg",
) => {
  const image = event.currentTarget;
  image.onerror = null;
  image.src = fallback;
};
