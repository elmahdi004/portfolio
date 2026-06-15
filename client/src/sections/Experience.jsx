import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Briefcase, GraduationCap, Award } from 'lucide-react'
import { useExperiences } from '../hooks/useApi.js'
import { FALLBACK_EXPERIENCES } from '../lib/fallback.js'
import { cn } from '../lib/cn.js'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'

const ICONS = { work: Briefcase, education: GraduationCap, certification: Award }

function periodLabel(e) {
  if (e.period) return e.period
  const f = (d) => (d ? new Date(d).toLocaleString('en', { month: 'short', year: 'numeric' }) : '')
  return `${f(e.startDate)} — ${e.current ? 'Present' : f(e.endDate)}`.trim()
}

function TimelineItem({ e, i }) {
  const Icon = ICONS[e.type] || Briefcase
  const left = i % 2 === 0
  return (
    <div className={cn('relative flex lg:items-start', left ? 'lg:justify-start' : 'lg:justify-end')}>
      {/* node */}
      <div className="absolute left-5 top-1.5 z-10 -translate-x-1/2 lg:left-1/2">
        <span
          className="grid h-9 w-9 place-items-center rounded-full text-white shadow-glow"
          style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))' }}
        >
          <Icon size={16} />
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="ml-14 w-full lg:ml-0 lg:w-[44%]"
      >
        <GlassCard className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip !py-0.5 !text-[11px]">{periodLabel(e)}</span>
            {e.current && (
              <span className="chip !py-0.5 !text-[11px] border-emerald-400/40 text-emerald-400">Now</span>
            )}
            <span className="chip !py-0.5 !text-[11px] capitalize">{e.type || 'work'}</span>
          </div>
          <h3 className="mt-3 font-display text-lg font-semibold">{e.role}</h3>
          <div className="text-sm text-primary">
            {e.company}
            {e.location ? ` · ${e.location}` : ''}
          </div>
          {e.description && <p className="mt-2 text-sm text-muted">{e.description}</p>}
          {e.highlights?.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {e.highlights.map((h, hi) => (
                <li key={hi} className="flex gap-2 text-sm text-muted">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {h}
                </li>
              ))}
            </ul>
          )}
          {e.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {e.tags.map((t) => (
                <span key={t} className="chip !py-0.5 !text-[11px]">
                  {t}
                </span>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  )
}

export default function Experience() {
  const { data } = useExperiences()
  const items = data?.length ? data : FALLBACK_EXPERIENCES
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <section id="experience" className="section">
      <SectionHeading
        eyebrow="My journey"
        title={
          <>
            Experience &amp; <GradientText>milestones</GradientText>
          </>
        }
        subtitle="The path that shaped a security-first, full-stack engineer."
      />

      <div ref={ref} className="relative mx-auto mt-16 max-w-3xl lg:max-w-5xl">
        {/* track + animated fill */}
        <div className="absolute left-5 top-0 h-full w-px bg-line/70 lg:left-1/2 lg:-translate-x-1/2" />
        <motion.div
          className="absolute left-5 top-0 h-full w-px origin-top lg:left-1/2 lg:-translate-x-1/2"
          style={{
            scaleY: fill,
            background: 'linear-gradient(rgb(var(--primary)), rgb(var(--accent)))',
          }}
        />
        <div className="space-y-10">
          {items.map((e, i) => (
            <TimelineItem key={i} e={e} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
