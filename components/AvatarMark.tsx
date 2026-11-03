"use client";

import { useEffect } from "react";
import { markAvatar } from "@/lib/attribution";

/** Records this landing page as the one the visitor applies from (sheet column "Avatar"). */
export function AvatarMark({ path }: { path: string }) {
  useEffect(() => {
    try {
      markAvatar(path);
    } catch {}
  }, [path]);
  return null;
}
