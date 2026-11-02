import type { Line } from "@/lib/avatars";
import { fill, type Locale } from "@/lib/geo";
import { P, Strong } from "./Text";

/** Renders avatar copy lines as <P> / <Strong>, with the visitor's prices filled in. Use inside <Stack>. */
export function lines(items: Line[], loc: Locale) {
  return items.map((l, i) => {
    if (typeof l === "string") return <P key={i}>{fill(l, loc)}</P>;
    if ("s" in l) return <Strong key={i}>{fill(l.s, loc)}</Strong>;
    return (
      <P key={i} className="text-ink-muted">
        {fill(l.g, loc)}
      </P>
    );
  });
}
