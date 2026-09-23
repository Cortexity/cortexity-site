import { Eyebrow } from "./Text";

const PHASES = [
  {
    label: "First days",
    body: "We talk, define the first version, and design it. You have the first screens on your phone within the first week.",
  },
  {
    label: "Middle",
    body: "The core of the app works. You're using it, we're using it, and it changes because of what we both notice.",
  },
  {
    label: "Final stretch",
    body: "Refinement, polish, and App Store submission.",
  },
];

export function PhaseStrip({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto text-center ${className}`}>
      <p className="text-small font-medium text-ink-muted">Roughly, it goes like this.</p>
      <ol className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
        {PHASES.map((phase) => (
          <li key={phase.label} className="card p-6">
            <Eyebrow>{phase.label}</Eyebrow>
            <p className="mt-3 text-small">{phase.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
