// Fixed, full-screen animated aurora.
// Uses layered radial-gradients moved by a single transform (cheap to
// composite — no per-pixel blur passes), so it stays smooth on low-end
// devices and headless renderers while still looking lush.
export default function AuroraBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-bg">
      {/* faint grid, masked to fade at the edges */}
      <div
        className="absolute inset-0 grid-bg"
        style={{ maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 78%)' }}
      />

      {/* oversized so the slow rotate/scale never reveals empty corners */}
      <div
        className="absolute -inset-[25%] animate-aurora opacity-80"
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundImage: `
            radial-gradient(38rem 38rem at 18% 12%, rgb(var(--primary) / 0.40), transparent 60%),
            radial-gradient(34rem 34rem at 82% 22%, rgb(var(--secondary) / 0.34), transparent 60%),
            radial-gradient(36rem 36rem at 50% 92%, rgb(var(--accent) / 0.34), transparent 62%)
          `,
        }}
      />
      {/* second, counter-moving layer for depth */}
      <div
        className="absolute -inset-[25%] animate-float-slow opacity-60"
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundImage: `
            radial-gradient(30rem 30rem at 70% 60%, rgb(var(--secondary) / 0.22), transparent 60%),
            radial-gradient(28rem 28rem at 25% 75%, rgb(var(--primary) / 0.20), transparent 60%)
          `,
        }}
      />

      {/* clean fade into the page background at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  )
}
