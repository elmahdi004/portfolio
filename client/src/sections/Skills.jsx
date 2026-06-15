import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSkills } from '../hooks/useApi.js'
import { FALLBACK_SKILLS } from '../lib/fallback.js'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import Reveal from '../components/ui/Reveal.jsx'

const CAT_ORDER = ['Languages', 'Frontend', 'Backend', 'DevOps', 'Security', 'Cloud', 'Other']

export default function Skills() {
  const { data } = useSkills()
  const skills = data?.length ? data : FALLBACK_SKILLS

  const grouped = useMemo(() => {
    const g = {}
    for (const s of skills) (g[s.category] || (g[s.category] = [])).push(s)
    return Object.entries(g).sort((a, b) => {
      const ia = CAT_ORDER.indexOf(a[0])
      const ib = CAT_ORDER.indexOf(b[0])
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
    })
  }, [skills])

  return (
    <section id="skills" className="section">
      <SectionHeading
        eyebrow="Tech stack"
        title={
          <>
            Tools I <GradientText>build &amp; secure</GradientText> with
          </>
        }
        subtitle="A pragmatic toolbox spanning development, operations and security."
      />

      {/* scrolling marquee of every skill */}
      <Reveal
        className="mt-10 overflow-hidden"
        // fade the marquee edges
      >
        <div
          style={{
            maskImage: 'linear-gradient(90deg, transparent, black 7%, black 93%, transparent)',
          }}
        >
          <div className="flex w-max gap-3 animate-marquee">
            {[...skills, ...skills].map((s, i) => (
              <span
                key={i}
                className="chip whitespace-nowrap !text-sm"
                style={{ borderColor: s.color ? `${s.color}55` : undefined }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: s.color || 'rgb(var(--primary))' }}
                />
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {grouped.map(([cat, list], gi) => (
          <Reveal key={cat} delay={gi * 0.05}>
            <GlassCard className="h-full p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">{cat}</h3>
                <span className="chip !py-0.5 !text-[11px]">{list.length}</span>
              </div>
              <div className="mt-5 space-y-4">
                {list.map((s) => (
                  <div key={s.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-xs text-muted">{s.level}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${s.color || 'rgb(var(--primary))'}, rgb(var(--accent)))`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
