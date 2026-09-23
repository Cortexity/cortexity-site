import { Wordmark } from "./Wordmark";

/** Site footer: wordmark + copyright. Shared by the landing page and /apply. */
export function Footer() {
  return (
    <footer className="tone-white relative px-5 sm:px-8">
      <div className="mx-auto flex max-w-wide flex-col items-center gap-8 py-14 text-center sm:py-16">
        <Wordmark size="lg" tagline />
        <p className="text-small text-ink-muted">&copy; {new Date().getFullYear()} Cortexity</p>
      </div>
    </footer>
  );
}
