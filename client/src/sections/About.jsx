import { ShieldCheck, Workflow, Layers, MapPin, Briefcase, Sparkles } from 'lucide-react'
import { useProfile } from '../hooks/useApi.js'
import { FALLBACK_PROFILE } from '../lib/fallback.js'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import Reveal from '../components/ui/Reveal.jsx'

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Secure by Design',
    desc: 'Threat-model early, shift security left, and bake controls into every stage of the SDLC.',
  },
  {
    icon: Workflow,
    title: 'Automated by Default',
    desc: 'CI/CD pipelines that build, scan, test and ship — repeatable, auditable, fast.',
  },
  {
    icon: Layers,
    title: 'Full-Stack Delivery',
    desc: 'From MongoDB schemas to pixel-perfect React UIs, I own the whole product surface.',
  },
]

function InfoRow({ icon: Icon, label, accent }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid h-8 w-8 place-items-center rounded-lg border border-line/60 bg-surface/60 ${
          accent ? 'text-emerald-400' : 'text-primary'
        }`}
      >
        <Icon size={15} />
      </span>
      <span className="text-muted">{label}</span>
    </div>
  )
}

export default function About() {
  const { data } = useProfile()
  const profile = data && data.name ? data : FALLBACK_PROFILE
  const paragraphs = (profile.bio || FALLBACK_PROFILE.bio).split('\n\n')

  return (
    <section id="about" className="section">
      <SectionHeading
        eyebrow="About me"
        title={
          <>
            Engineering at the intersection of <GradientText>speed &amp; security</GradientText>
          </>
        }
        subtitle="A bit about who I am and how I work."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {PILLARS.map((p) => {
              const Icon = p.icon
              return (
                <GlassCard key={p.title} className="p-5">
                  <div
                    className="grid h-11 w-11 place-items-center rounded-xl text-white"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{p.desc}</p>
                </GlassCard>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div
                className="grid h-16 w-16 place-items-center rounded-2xl text-xl font-bold text-white"
                style={{
                  backgroundImage: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--secondary)))',
                }}
              >
                EB
              </div>
              <div>
                <div className="font-display text-lg font-semibold">{profile.name}</div>
                <div className="text-sm text-muted">{profile.title}</div>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              {profile.location && <InfoRow icon={MapPin} label={profile.location} />}
              <InfoRow icon={Briefcase} label={`${profile.yearsExperience || 3}+ years experience`} />
              <InfoRow
                icon={Sparkles}
                accent
                label={profile.availableForWork ? 'Available for new opportunities' : 'Currently engaged'}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {(profile.stats || FALLBACK_PROFILE.stats).slice(0, 4).map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-line/60 bg-surface/40 p-3 text-center"
                >
                  <div className="text-xl font-bold">
                    <GradientText>{s.value}</GradientText>
                  </div>
                  <div className="text-[11px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  )
}
