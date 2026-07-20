import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, X, Star, FolderGit2 } from 'lucide-react'
import { useProjects } from '../hooks/useApi.js'
import { FALLBACK_PROJECTS } from '../lib/fallback.js'
import { cn } from '../lib/cn.js'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import { useI18n } from '../lib/i18n.jsx'

const COVERS = [
  'linear-gradient(135deg, #059669, #0891b2)',
  'linear-gradient(135deg, #0891b2, #4f46e5)',
  'linear-gradient(135deg, #0d9488, #2563eb)',
  'linear-gradient(135deg, #2563eb, #06b6d4)',
  'linear-gradient(135deg, #4f46e5, #0891b2)',
  'linear-gradient(135deg, #10b981, #0ea5e9)',
]

function Cover({ project, index, className }) {
  return (
    <div
      className={cn('relative flex h-40 items-end overflow-hidden', className)}
      style={{ backgroundImage: COVERS[index % COVERS.length] }}
    >
      {project.coverImage ? (
        <img src={project.coverImage} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <FolderGit2 className="absolute -right-3 -top-3 text-white/15" size={120} />
      )}
      <div className="relative z-10 flex w-full items-center justify-between p-4">
        <span className="rounded-full bg-black/25 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {project.category || 'Project'}
        </span>
        {project.period && <span className="text-xs font-medium text-white/80">{project.period}</span>}
      </div>
    </div>
  )
}

function ProjectModal({ project, onClose }) {
  const { t } = useI18n()
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl glass-strong shadow-soft"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <Cover project={project} index={0} className="!h-44" />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50"
        >
          <X size={18} />
        </button>
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-2xl font-bold">{project.title}</h3>
            {project.featured && <Star size={18} className="text-yellow-400" fill="currentColor" />}
          </div>
          {project.role && <p className="mt-1 text-sm text-primary">{project.role}</p>}
          <p className="mt-4 text-muted">{project.description || project.summary}</p>

          {project.highlights?.length > 0 && (
            <ul className="mt-5 space-y-2">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-muted">{h}</span>
                </li>
              ))}
            </ul>
          )}

          {project.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {project.links?.github && (
              <a href={project.links.github} target="_blank" rel="noreferrer" className="btn-ghost !py-2.5">
                <Github size={16} /> {t('projects.code')}
              </a>
            )}
            {project.links?.live && (
              <a href={project.links.live} target="_blank" rel="noreferrer" className="btn-primary !py-2.5">
                <ExternalLink size={16} /> {t('projects.liveDemo')}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const { t } = useI18n()
  const { data } = useProjects()
  const projects = data?.length ? data : FALLBACK_PROJECTS
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))],
    [projects]
  )
  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" className="section">
      <SectionHeading
        eyebrow={t('projects.eyebrow')}
        title={
          <>
            {t('projects.title1')}
            <GradientText>{t('projects.titleHl')}</GradientText>
          </>
        }
        subtitle={t('projects.subtitle')}
      />

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              'rounded-full px-4 py-2 text-sm transition-colors',
              filter === c ? 'btn-primary !px-4 !py-2' : 'glass text-muted hover:text-ink'
            )}
          >
            {c === 'All' ? t('projects.all') : c}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.div
              key={p.title}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard
                className="group h-full cursor-pointer overflow-hidden p-0"
                onClick={() => setActive(p)}
              >
                <Cover project={p} index={i} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-primary">
                      {p.title}
                    </h3>
                    {p.featured && (
                      <Star size={16} className="mt-1 shrink-0 text-yellow-400" fill="currentColor" />
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{p.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(p.tags || []).slice(0, 4).map((t) => (
                      <span key={t} className="chip !py-0.5 !text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  )
}
