// Maps skill names to Simple Icons slugs so we can render real brand logos
// from the Simple Icons CDN. Unmapped skills fall back to a monogram tile.

const SLUGS = {
  // languages
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  bash: 'gnubash',
  shell: 'gnubash',
  go: 'go',
  golang: 'go',
  java: 'openjdk',
  php: 'php',
  c: 'c',
  'c++': 'cplusplus',
  rust: 'rust',
  ruby: 'ruby',
  // frontend
  react: 'react',
  'react.js': 'react',
  vue: 'vuedotjs',
  angular: 'angular',
  svelte: 'svelte',
  'next.js': 'nextdotjs',
  nextjs: 'nextdotjs',
  'tailwind css': 'tailwindcss',
  tailwindcss: 'tailwindcss',
  'framer motion': 'framer',
  framer: 'framer',
  redux: 'redux',
  vite: 'vite',
  sass: 'sass',
  html: 'html5',
  css: 'css3',
  // backend
  'node.js': 'nodedotjs',
  nodejs: 'nodedotjs',
  node: 'nodedotjs',
  express: 'express',
  'express.js': 'express',
  nestjs: 'nestjs',
  mongodb: 'mongodb',
  mongoose: 'mongoose',
  postgresql: 'postgresql',
  mysql: 'mysql',
  redis: 'redis',
  graphql: 'graphql',
  'rest & websockets': 'fastapi',
  socketio: 'socketdotio',
  django: 'django',
  flask: 'flask',
  // devops / cloud
  docker: 'docker',
  kubernetes: 'kubernetes',
  'github actions': 'githubactions',
  'gitlab ci': 'gitlab',
  gitlab: 'gitlab',
  terraform: 'terraform',
  ansible: 'ansible',
  nginx: 'nginx',
  jenkins: 'jenkins',
  aws: 'amazonwebservices',
  'amazon web services': 'amazonwebservices',
  azure: 'microsoftazure',
  gcp: 'googlecloud',
  'google cloud': 'googlecloud',
  linux: 'linux',
  vercel: 'vercel',
  netlify: 'netlify',
  git: 'git',
  github: 'github',
  prometheus: 'prometheus',
  grafana: 'grafana',
  // security
  'owasp / appsec': 'owasp',
  owasp: 'owasp',
  'trivy & snyk': 'snyk',
  snyk: 'snyk',
  trivy: 'trivy',
  'burp suite': 'burpsuite',
  'jwt / oauth2': 'jsonwebtokens',
  jwt: 'jsonwebtokens',
  auth0: 'auth0',
  wireshark: 'wireshark',
  kalilinux: 'kalilinux',
  'kali linux': 'kalilinux',
  postman: 'postman',
  sonarqube: 'sonarqube',
}

// Returns a logo URL (Simple Icons CDN or a custom icon URL), or null.
export function skillLogo(skill) {
  const icon = skill?.icon
  if (icon && /^https?:\/\//.test(icon)) return icon // custom image URL
  const slug = icon || SLUGS[(skill?.name || '').toLowerCase().trim()]
  return slug ? `https://cdn.simpleicons.org/${slug}` : null
}

// First letters of up to two words, for the fallback monogram.
export function initials(name = '') {
  return name
    .split(/[\s/&._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}
