import { useMemo, useState } from 'react'
import { useSkills } from '../hooks/useApi.js'
import { FALLBACK_SKILLS } from '../lib/fallback.js'
import { skillLogo, initials } from '../lib/skillIcons.js'
import { useI18n } from '../lib/i18n.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import Reveal from '../components/ui/Reveal.jsx'

const CAT_ORDER = [
  'Languages',
  'Frontend & Mobile',
  'Backend',
  'Databases',
  'DevOps & Cloud',
  'Security & Tools',
  'Frontend',
  'DevOps',
  'Security',
  'Cloud',
  'Other',
]

function Badge({ skill }) {
  const logo = skillLogo(skill)
  const [failed, setFailed] = useState(false)
  const showLogo = logo && !failed
  return (
    <div className="group flex flex-col items-center gap-2" title={skill.name}>
      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-line/60 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-glow">
        {showLogo ? (
          <img
            src={logo}
            alt={skill.name}
            loading="lazy"
            className="h-9 w-9 object-contain"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="font-display text-lg font-bold text-slate-700">{initials(skill.name)}</span>
        )}
      </div>
      <span className="w-16 truncate text-center text-[11px] text-muted">{skill.name}</span>
    </div>
  )
}

export default function Skills() {
  const { t } = useI18n()
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
        eyebrow={t('skills.eyebrow')}
        title={
          <>
            {t('skills.title1')}
            <GradientText>{t('skills.titleHl')}</GradientText>
            {t('skills.title2')}
          </>
        }
        subtitle={t('skills.subtitle')}
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {grouped.map(([cat, list], gi) => (
          <Reveal key={cat} delay={gi * 0.05}>
            <GlassCard className="h-full p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">{cat}</h3>
                <span className="chip !py-0.5 !text-[11px]">{list.length}</span>
              </div>
              <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4">
                {list.map((s) => (
                  <Badge key={s.name} skill={s} />
                ))}
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
