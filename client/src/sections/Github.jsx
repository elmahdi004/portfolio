import {
  Star,
  GitFork,
  Users,
  BookMarked,
  ExternalLink,
  MapPin,
  Building2,
} from 'lucide-react'
import { useGithub } from '../hooks/useApi.js'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Spinner from '../components/ui/Spinner.jsx'

function StatTile({ icon: Icon, label, value }) {
  return (
    <GlassCard className="p-4 text-center" spotlight={false}>
      <Icon className="mx-auto text-primary" size={20} />
      <div className="mt-2 text-2xl font-bold">{value ?? 0}</div>
      <div className="text-xs text-muted">{label}</div>
    </GlassCard>
  )
}

function heatColor(count) {
  if (!count) return 'rgb(var(--line) / 0.6)'
  if (count < 3) return 'rgb(var(--primary) / 0.35)'
  if (count < 6) return 'rgb(var(--primary) / 0.6)'
  if (count < 10) return 'rgb(var(--primary) / 0.8)'
  return 'rgb(var(--accent))'
}

function ContributionHeatmap({ calendar }) {
  const weeks = calendar?.weeks || []
  if (!weeks.length) return null
  return (
    <Reveal className="mt-6">
      <GlassCard className="overflow-x-auto p-5" spotlight={false}>
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium">
            {calendar.totalContributions?.toLocaleString()} contributions this year
          </span>
        </div>
        <div className="flex gap-[3px]">
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {w.contributionDays.map((d, di) => (
                <span
                  key={di}
                  title={`${d.date}: ${d.contributionCount}`}
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{ background: d.color || heatColor(d.contributionCount) }}
                />
              ))}
            </div>
          ))}
        </div>
      </GlassCard>
    </Reveal>
  )
}

function GithubContent({ data }) {
  const { user, totals, languages, topRepos, contributions } = data
  return (
    <>
      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        {/* profile card */}
        <Reveal>
          <GlassCard className="flex h-full flex-col p-6">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="h-16 w-16 rounded-2xl border border-line/60"
              />
              <div className="min-w-0">
                <div className="font-display text-lg font-semibold">{user.name || user.login}</div>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  @{user.login}
                </a>
              </div>
            </div>
            {user.bio && <p className="mt-4 text-sm text-muted">{user.bio}</p>}
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
              {user.company && (
                <span className="inline-flex items-center gap-1">
                  <Building2 size={13} /> {user.company}
                </span>
              )}
              {user.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} /> {user.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Users size={13} /> {user.followers} followers · {user.following} following
              </span>
            </div>
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-auto !py-2.5 self-start"
            >
              View profile <ExternalLink size={15} />
            </a>
          </GlassCard>
        </Reveal>

        {/* stats + languages */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile icon={BookMarked} label="Repos" value={totals.repos} />
            <StatTile icon={Star} label="Stars" value={totals.stars} />
            <StatTile icon={GitFork} label="Forks" value={totals.forks} />
            <StatTile icon={Users} label="Followers" value={user.followers} />
          </div>

          {languages?.length > 0 ? (
            <GlassCard className="mt-4 p-5" spotlight={false}>
              <h3 className="text-sm font-semibold">Top languages</h3>
              <div className="mt-4 space-y-3">
                {languages.slice(0, 6).map((l) => (
                  <div key={l.name}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-medium">{l.name}</span>
                      <span className="text-muted">{l.percent}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${l.percent}%`,
                          background: 'linear-gradient(90deg, rgb(var(--primary)), rgb(var(--accent)))',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="mt-4 grid flex-1 place-items-center p-6 text-center" spotlight={false}>
              <p className="text-sm text-muted">
                Fresh public repositories are on the way — building in private for now. ⭐
              </p>
            </GlassCard>
          )}
        </Reveal>
      </div>

      {contributions && <ContributionHeatmap calendar={contributions} />}

      {topRepos?.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topRepos.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.04}>
              <a href={r.url} target="_blank" rel="noreferrer" className="block h-full">
                <GlassCard className="h-full p-5">
                  <div className="flex items-center gap-2">
                    <BookMarked size={16} className="text-primary" />
                    <span className="truncate font-semibold">{r.name}</span>
                  </div>
                  {r.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{r.description}</p>
                  )}
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                    {r.language && (
                      <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary" /> {r.language}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Star size={12} /> {r.stars}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork size={12} /> {r.forks}
                    </span>
                  </div>
                </GlassCard>
              </a>
            </Reveal>
          ))}
        </div>
      )}
    </>
  )
}

export default function Github() {
  const { data, isLoading, isError } = useGithub()
  return (
    <section id="github" className="section">
      <SectionHeading
        eyebrow="Open source"
        title={
          <>
            Live from <GradientText>GitHub</GradientText>
          </>
        }
        subtitle="A real-time snapshot of my public activity, pulled straight from the GitHub API."
      />
      {isLoading && (
        <div className="mt-16 grid place-items-center">
          <Spinner className="h-7 w-7" />
        </div>
      )}
      {isError && (
        <Reveal className="mt-10">
          <GlassCard className="p-8 text-center text-muted" spotlight={false}>
            Couldn't load live GitHub stats right now.{' '}
            <a
              className="text-primary hover:underline"
              href="https://github.com/elmahdi004"
              target="_blank"
              rel="noreferrer"
            >
              Visit my profile →
            </a>
          </GlassCard>
        </Reveal>
      )}
      {data && <GithubContent data={data} />}
    </section>
  )
}
