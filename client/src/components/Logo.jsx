import { useId } from 'react'

/**
 * Brand mark for El Mahdi Bellaziz — the <BM/> code monogram on the
 * site's violet -> cyan -> fuchsia gradient. Pure vector (JetBrains Mono
 * outline), so it stays crisp at any size and in both themes.
 *
 * Size it with a className, e.g. <Logo className="h-9 w-9" />.
 */
export default function Logo({ className = 'h-9 w-9', title = 'El Mahdi Bellaziz', ...props }) {
  const uid = useId()
  const g = `bm-grad-${uid}`
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label={title}
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="0.5" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="88" height="88" rx="22" fill={`url(#${g})`} />
      <rect x="7" y="7" width="86" height="86" rx="21" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.4" />
      <path d="M22 38 L13 50 L22 62" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M70 66 L77 34" fill="none" stroke="#ffffff" strokeWidth="5.2" strokeLinecap="round" />
      <path d="M78 38 L87 50 L78 62" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(22.582 63.370) scale(0.03663 -0.03663)">
        <path
          d="M66 0V730H301Q374 730 428.5 706.5Q483 683 513.5 641.0Q544 599 544 542Q544 480 510.0 438.5Q476 397 422 389V387Q463 383 494.5 358.5Q526 334 543.5 296.0Q561 258 561 211Q561 148 529.5 100.5Q498 53 441.5 26.5Q385 0 310 0ZM211 436H299Q343 436 368.0 459.5Q393 483 393 523Q393 564 368.0 586.5Q343 609 299 609H211ZM211 121H305Q354 121 382.0 147.0Q410 173 410 219Q410 265 382.0 291.5Q354 318 305 318H211ZM642 0V730H825L899 418L973 730H1158V0H1021V280Q1021 390 1030.5 491.5Q1040 593 1050 670L958 310H838L748 661Q758 596 768.5 495.5Q779 395 779 280V0Z"
          fill="#ffffff"
        />
      </g>
    </svg>
  )
}
