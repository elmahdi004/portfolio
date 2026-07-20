import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export const LANGS = {
  en: { name: 'English', short: 'EN', dir: 'ltr', flag: '🇬🇧' },
  fr: { name: 'Français', short: 'FR', dir: 'ltr', flag: '🇫🇷' },
  ar: { name: 'العربية', short: 'ع', dir: 'rtl', flag: '🇲🇦' },
}

const STORAGE = 'bellaziz-lang'

const T = {
  en: {
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.journey': 'Journey',
    'nav.github': 'GitHub',
    'nav.contact': 'Contact',
    'nav.hireMe': 'Hire me',
    'nav.search': 'Search',
    'nav.menu': 'Menu',

    'hero.badgeAvailable': 'Available for new opportunities',
    'hero.badgeBusy': 'Currently focused on a project',
    'hero.greeting': "Hi, I'm",
    'hero.engineer': 'I engineer',
    'hero.viewWork': 'View my work',
    'hero.getInTouch': 'Get in touch',
    'hero.resume': 'Resume',

    'about.eyebrow': 'About me',
    'about.title1': 'Engineering at the intersection of ',
    'about.titleHl': 'speed & security',
    'about.subtitle': 'A bit about who I am and how I work.',
    'about.pillar1Title': 'Secure by Design',
    'about.pillar1Desc': 'Threat-model early, shift security left, and bake controls into every stage of the SDLC.',
    'about.pillar2Title': 'Automated by Default',
    'about.pillar2Desc': 'CI/CD pipelines that build, scan, test and ship — repeatable, auditable, fast.',
    'about.pillar3Title': 'Full-Stack Delivery',
    'about.pillar3Desc': 'From MongoDB schemas to pixel-perfect React UIs, I own the whole product surface.',
    'about.years': '+ years experience',
    'about.available': 'Available for new opportunities',
    'about.engaged': 'Currently engaged',

    'skills.eyebrow': 'Tech stack',
    'skills.title1': 'Tools I ',
    'skills.titleHl': 'build & secure',
    'skills.title2': ' with',
    'skills.subtitle': 'A pragmatic toolbox spanning development, operations and security.',

    'projects.eyebrow': 'Selected work',
    'projects.title1': "Projects I'm ",
    'projects.titleHl': 'proud of',
    'projects.subtitle': 'A mix of security engineering, DevOps tooling and full-stack apps. Click any card for details.',
    'projects.all': 'All',
    'projects.code': 'Code',
    'projects.liveDemo': 'Live demo',

    'experience.eyebrow': 'My journey',
    'experience.title1': 'Experience & ',
    'experience.titleHl': 'milestones',
    'experience.subtitle': 'The path that shaped a security-first, full-stack engineer.',
    'experience.now': 'Now',

    'github.eyebrow': 'Open source',
    'github.title1': 'Live from ',
    'github.titleHl': 'GitHub',
    'github.subtitle': 'A real-time snapshot of my public activity, pulled straight from the GitHub API.',
    'github.repos': 'Repos',
    'github.stars': 'Stars',
    'github.forks': 'Forks',
    'github.followers': 'Followers',
    'github.topLanguages': 'Top languages',
    'github.viewProfile': 'View profile',
    'github.comingSoon': 'Fresh public repositories are on the way — building in private for now. ⭐',
    'github.error': "Couldn't load live GitHub stats right now.",
    'github.visitProfile': 'Visit my profile →',

    'contact.eyebrow': 'Get in touch',
    'contact.title1': "Let's build something ",
    'contact.titleHl': 'secure',
    'contact.subtitle': 'Have a role, a project, or a question? Drop me a message — I read every one.',
    'contact.introA': "I'm currently ",
    'contact.open': 'open to new opportunities',
    'contact.focused': 'focused on a project',
    'contact.introB': " — whether it's DevSecOps, full-stack work, or a security review, let's talk.",
    'contact.email': 'Email',
    'contact.location': 'Location',
    'contact.namePh': 'Your name',
    'contact.emailPh': 'Your email',
    'contact.subjectPh': 'Subject (optional)',
    'contact.messagePh': 'Tell me about your project or role…',
    'contact.send': 'Send message',
    'contact.sending': 'Sending…',
    'contact.aiHint': 'Prefer the AI assistant? Tap the chat bubble bottom-right.',
    'contact.toastFill': 'Please fill in your name, email and message.',
    'contact.toastSuccess': "Message sent! I'll get back to you soon.",
    'contact.toastError': 'Could not send — please try again.',

    'footer.tagline': ' — secure by design, automated by default.',
    'footer.rights': 'All rights reserved.',

    'palette.placeholder': 'Type a command or search…',
    'palette.empty': 'No results found.',
    'palette.navigate': 'Navigate',
    'palette.actions': 'Actions',
    'palette.links': 'Links',
    'palette.admin': 'Admin',
    'palette.home': 'Home',
    'palette.switchLight': 'Switch to light mode',
    'palette.switchDark': 'Switch to dark mode',
    'palette.askAI': 'Ask the AI assistant',
    'palette.copyEmail': 'Copy email address',
    'palette.copied': 'Email copied to clipboard!',
    'palette.githubProfile': 'GitHub profile',
    'palette.linkedin': 'LinkedIn',
    'palette.sendEmail': 'Send an email',
    'palette.adminDash': 'Admin dashboard',

    'ai.title': 'AI Assistant',
    'ai.subtitle': 'Ask about El Mahdi',
    'ai.greeting': "Hi! I'm El Mahdi's AI assistant 🤖 — ask me anything about his skills, projects, or experience.",
    'ai.placeholder': 'Ask me anything…',
    'ai.s1': "What are El Mahdi's top skills?",
    'ai.s2': 'Tell me about his DevSecOps work',
    'ai.s3': 'Is he available to hire?',
    'ai.s4': 'What projects has he built?',
    'ai.error': "Sorry, I'm having trouble responding right now. Try the contact form below!",

    'lang.label': 'Language',
  },

  fr: {
    'nav.about': 'À propos',
    'nav.skills': 'Compétences',
    'nav.projects': 'Projets',
    'nav.journey': 'Parcours',
    'nav.github': 'GitHub',
    'nav.contact': 'Contact',
    'nav.hireMe': 'Recrutez-moi',
    'nav.search': 'Rechercher',
    'nav.menu': 'Menu',

    'hero.badgeAvailable': 'Disponible pour de nouvelles opportunités',
    'hero.badgeBusy': 'Actuellement concentré sur un projet',
    'hero.greeting': 'Bonjour, je suis',
    'hero.engineer': 'Je conçois',
    'hero.viewWork': 'Voir mes projets',
    'hero.getInTouch': 'Me contacter',
    'hero.resume': 'CV',

    'about.eyebrow': 'À propos',
    'about.title1': "L'ingénierie à la croisée de ",
    'about.titleHl': 'vitesse & sécurité',
    'about.subtitle': 'Un aperçu de qui je suis et de ma façon de travailler.',
    'about.pillar1Title': 'Sécurisé par conception',
    'about.pillar1Desc': "Modéliser les menaces tôt, intégrer la sécurité en amont et ancrer les contrôles à chaque étape du cycle de vie.",
    'about.pillar2Title': 'Automatisé par défaut',
    'about.pillar2Desc': 'Des pipelines CI/CD qui compilent, analysent, testent et déploient — reproductibles, auditables, rapides.',
    'about.pillar3Title': 'Développement Full-Stack',
    'about.pillar3Desc': "Des schémas MongoDB aux interfaces React soignées au pixel près, je maîtrise tout le produit.",
    'about.years': " ans d'expérience",
    'about.available': 'Disponible pour de nouvelles opportunités',
    'about.engaged': 'Actuellement engagé',

    'skills.eyebrow': 'Stack technique',
    'skills.title1': "Les outils pour ",
    'skills.titleHl': 'créer & sécuriser',
    'skills.title2': '',
    'skills.subtitle': 'Une boîte à outils pragmatique couvrant le développement, les opérations et la sécurité.',

    'projects.eyebrow': 'Travaux sélectionnés',
    'projects.title1': 'Des projets dont je suis ',
    'projects.titleHl': 'fier',
    'projects.subtitle': "Un mélange d'ingénierie de la sécurité, d'outils DevOps et d'applications full-stack. Cliquez sur une carte pour les détails.",
    'projects.all': 'Tous',
    'projects.code': 'Code',
    'projects.liveDemo': 'Démo en ligne',

    'experience.eyebrow': 'Mon parcours',
    'experience.title1': 'Expérience & ',
    'experience.titleHl': 'jalons',
    'experience.subtitle': "Le parcours qui a façonné un ingénieur full-stack, axé sur la sécurité.",
    'experience.now': 'Actuel',

    'github.eyebrow': 'Open source',
    'github.title1': 'En direct de ',
    'github.titleHl': 'GitHub',
    'github.subtitle': "Un aperçu en temps réel de mon activité publique, directement via l'API GitHub.",
    'github.repos': 'Dépôts',
    'github.stars': 'Étoiles',
    'github.forks': 'Forks',
    'github.followers': 'Abonnés',
    'github.topLanguages': 'Langages principaux',
    'github.viewProfile': 'Voir le profil',
    'github.comingSoon': 'De nouveaux dépôts publics arrivent — en privé pour l’instant. ⭐',
    'github.error': 'Impossible de charger les statistiques GitHub pour le moment.',
    'github.visitProfile': 'Voir mon profil →',

    'contact.eyebrow': 'Me contacter',
    'contact.title1': 'Construisons quelque chose de ',
    'contact.titleHl': 'sécurisé',
    'contact.subtitle': 'Un poste, un projet ou une question ? Écrivez-moi — je lis chaque message.',
    'contact.introA': 'Je suis actuellement ',
    'contact.open': 'ouvert à de nouvelles opportunités',
    'contact.focused': 'concentré sur un projet',
    'contact.introB': ' — DevSecOps, full-stack ou audit de sécurité, parlons-en.',
    'contact.email': 'E-mail',
    'contact.location': 'Localisation',
    'contact.namePh': 'Votre nom',
    'contact.emailPh': 'Votre e-mail',
    'contact.subjectPh': 'Sujet (optionnel)',
    'contact.messagePh': 'Parlez-moi de votre projet ou poste…',
    'contact.send': 'Envoyer',
    'contact.sending': 'Envoi…',
    'contact.aiHint': "Vous préférez l'assistant IA ? Touchez la bulle en bas à droite.",
    'contact.toastFill': 'Veuillez renseigner nom, e-mail et message.',
    'contact.toastSuccess': 'Message envoyé ! Je vous réponds bientôt.',
    'contact.toastError': "Échec de l'envoi — réessayez.",

    'footer.tagline': ' — sécurisé par conception, automatisé par défaut.',
    'footer.rights': 'Tous droits réservés.',

    'palette.placeholder': 'Tapez une commande ou recherchez…',
    'palette.empty': 'Aucun résultat.',
    'palette.navigate': 'Naviguer',
    'palette.actions': 'Actions',
    'palette.links': 'Liens',
    'palette.admin': 'Admin',
    'palette.home': 'Accueil',
    'palette.switchLight': 'Passer en mode clair',
    'palette.switchDark': 'Passer en mode sombre',
    'palette.askAI': "Demander à l'assistant IA",
    'palette.copyEmail': "Copier l'e-mail",
    'palette.copied': 'E-mail copié !',
    'palette.githubProfile': 'Profil GitHub',
    'palette.linkedin': 'LinkedIn',
    'palette.sendEmail': 'Envoyer un e-mail',
    'palette.adminDash': "Tableau d'administration",

    'ai.title': 'Assistant IA',
    'ai.subtitle': "À propos d'El Mahdi",
    'ai.greeting': "Bonjour ! Je suis l'assistant IA d'El Mahdi 🤖 — posez-moi vos questions sur ses compétences, projets ou expérience.",
    'ai.placeholder': 'Posez votre question…',
    'ai.s1': "Quelles sont les principales compétences d'El Mahdi ?",
    'ai.s2': 'Parlez-moi de son travail DevSecOps',
    'ai.s3': 'Est-il disponible pour un poste ?',
    'ai.s4': 'Quels projets a-t-il réalisés ?',
    'ai.error': "Désolé, je rencontre un problème. Essayez le formulaire de contact ci-dessous !",

    'lang.label': 'Langue',
  },

  ar: {
    'nav.about': 'نبذة',
    'nav.skills': 'المهارات',
    'nav.projects': 'المشاريع',
    'nav.journey': 'المسيرة',
    'nav.github': 'GitHub',
    'nav.contact': 'تواصل',
    'nav.hireMe': 'وظّفني',
    'nav.search': 'بحث',
    'nav.menu': 'القائمة',

    'hero.badgeAvailable': 'متاح لفرص جديدة',
    'hero.badgeBusy': 'منشغل حاليًا بمشروع',
    'hero.greeting': 'مرحبًا، أنا',
    'hero.engineer': 'أُهندس',
    'hero.viewWork': 'اطّلع على أعمالي',
    'hero.getInTouch': 'تواصل معي',
    'hero.resume': 'السيرة الذاتية',

    'about.eyebrow': 'نبذة عني',
    'about.title1': 'هندسة عند تقاطع ',
    'about.titleHl': 'السرعة والأمان',
    'about.subtitle': 'نبذة عمّن أكون وكيف أعمل.',
    'about.pillar1Title': 'آمن بالتصميم',
    'about.pillar1Desc': 'نمذجة التهديدات مبكرًا، ودمج الأمان منذ البداية في كل مراحل دورة التطوير.',
    'about.pillar2Title': 'مؤتمت افتراضيًا',
    'about.pillar2Desc': 'خطوط CI/CD تبني وتفحص وتختبر وتنشر — قابلة للتكرار والتدقيق وسريعة.',
    'about.pillar3Title': 'تطوير متكامل',
    'about.pillar3Desc': 'من مخططات MongoDB إلى واجهات React المتقنة، أتولّى المنتج بالكامل.',
    'about.years': '+ سنوات خبرة',
    'about.available': 'متاح لفرص جديدة',
    'about.engaged': 'منشغل حاليًا',

    'skills.eyebrow': 'التقنيات',
    'skills.title1': 'أدوات ',
    'skills.titleHl': 'أبنيها وأؤمّنها',
    'skills.title2': '',
    'skills.subtitle': 'صندوق أدوات عملي يغطي التطوير والعمليات والأمان.',

    'projects.eyebrow': 'أعمال مختارة',
    'projects.title1': 'مشاريع أنا ',
    'projects.titleHl': 'فخور بها',
    'projects.subtitle': 'مزيج من هندسة الأمان وأدوات DevOps وتطبيقات متكاملة. اضغط على أي بطاقة للتفاصيل.',
    'projects.all': 'الكل',
    'projects.code': 'الكود',
    'projects.liveDemo': 'عرض مباشر',

    'experience.eyebrow': 'مسيرتي',
    'experience.title1': 'الخبرة و',
    'experience.titleHl': 'المحطات',
    'experience.subtitle': 'المسار الذي صنع مهندسًا متكاملًا يضع الأمان أولًا.',
    'experience.now': 'حاليًا',

    'github.eyebrow': 'مفتوح المصدر',
    'github.title1': 'مباشرة من ',
    'github.titleHl': 'GitHub',
    'github.subtitle': 'لمحة لحظية عن نشاطي العام، مباشرة من واجهة GitHub.',
    'github.repos': 'المستودعات',
    'github.stars': 'النجوم',
    'github.forks': 'النسخ',
    'github.followers': 'المتابعون',
    'github.topLanguages': 'أبرز اللغات',
    'github.viewProfile': 'عرض الملف',
    'github.comingSoon': 'مستودعات عامة جديدة قادمة — العمل خاص حاليًا. ⭐',
    'github.error': 'تعذّر تحميل إحصاءات GitHub الآن.',
    'github.visitProfile': 'زيارة ملفي →',

    'contact.eyebrow': 'تواصل معي',
    'contact.title1': 'لنبنِ شيئًا ',
    'contact.titleHl': 'آمنًا',
    'contact.subtitle': 'لديك وظيفة أو مشروع أو سؤال؟ راسلني — أقرأ كل رسالة.',
    'contact.introA': 'أنا حاليًا ',
    'contact.open': 'منفتح على فرص جديدة',
    'contact.focused': 'منشغل بمشروع',
    'contact.introB': ' — سواء DevSecOps أو تطوير متكامل أو مراجعة أمنية، لنتحدّث.',
    'contact.email': 'البريد',
    'contact.location': 'الموقع',
    'contact.namePh': 'اسمك',
    'contact.emailPh': 'بريدك الإلكتروني',
    'contact.subjectPh': 'الموضوع (اختياري)',
    'contact.messagePh': 'حدّثني عن مشروعك أو الوظيفة…',
    'contact.send': 'إرسال الرسالة',
    'contact.sending': 'جارٍ الإرسال…',
    'contact.aiHint': 'تفضّل المساعد الذكي؟ اضغط فقاعة الدردشة أسفل اليمين.',
    'contact.toastFill': 'يرجى إدخال الاسم والبريد والرسالة.',
    'contact.toastSuccess': 'تم الإرسال! سأردّ قريبًا.',
    'contact.toastError': 'تعذّر الإرسال — حاول مجددًا.',

    'footer.tagline': ' — آمن بالتصميم، مؤتمت افتراضيًا.',
    'footer.rights': 'جميع الحقوق محفوظة.',

    'palette.placeholder': 'اكتب أمرًا أو ابحث…',
    'palette.empty': 'لا نتائج.',
    'palette.navigate': 'التنقل',
    'palette.actions': 'إجراءات',
    'palette.links': 'روابط',
    'palette.admin': 'الإدارة',
    'palette.home': 'الرئيسية',
    'palette.switchLight': 'الوضع الفاتح',
    'palette.switchDark': 'الوضع الداكن',
    'palette.askAI': 'اسأل المساعد الذكي',
    'palette.copyEmail': 'نسخ البريد',
    'palette.copied': 'تم نسخ البريد!',
    'palette.githubProfile': 'ملف GitHub',
    'palette.linkedin': 'LinkedIn',
    'palette.sendEmail': 'إرسال بريد',
    'palette.adminDash': 'لوحة الإدارة',

    'ai.title': 'مساعد ذكي',
    'ai.subtitle': 'اسأل عن المهدي',
    'ai.greeting': 'مرحبًا! أنا المساعد الذكي للمهدي 🤖 — اسألني عن مهاراته أو مشاريعه أو خبرته.',
    'ai.placeholder': 'اسألني أي شيء…',
    'ai.s1': 'ما أبرز مهارات المهدي؟',
    'ai.s2': 'حدّثني عن عمله في DevSecOps',
    'ai.s3': 'هل هو متاح للتوظيف؟',
    'ai.s4': 'ما المشاريع التي أنجزها؟',
    'ai.error': 'عذرًا، أواجه مشكلة الآن. جرّب نموذج التواصل بالأسفل!',

    'lang.label': 'اللغة',
  },
}

function getInitial() {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem(STORAGE)
  if (saved && LANGS[saved]) return saved
  const nav = (navigator.language || 'en').slice(0, 2)
  return LANGS[nav] ? nav : 'en'
}

const I18nCtx = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(getInitial)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = LANGS[lang].dir
    localStorage.setItem(STORAGE, lang)
  }, [lang])

  const t = useCallback(
    (key) => (T[lang] && T[lang][key]) ?? T.en[key] ?? key,
    [lang]
  )

  return (
    <I18nCtx.Provider value={{ lang, setLang, t, dir: LANGS[lang].dir, langs: LANGS }}>
      {children}
    </I18nCtx.Provider>
  )
}

export function useI18n() {
  const c = useContext(I18nCtx)
  if (!c) throw new Error('useI18n must be used within I18nProvider')
  return c
}
