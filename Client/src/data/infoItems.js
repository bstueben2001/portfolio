import resume from '../assets/brendonStuebenResume.pdf'

export const INFO_ITEMS = [
  { id: 'email',    section: 'contact',  label: 'bstueben2001@gmail.com' },
  { id: 'phone',    section: 'contact',  label: '(435) 225-5681' },
  { id: 'bio',      section: 'about',    label: 'With a balanced understanding of fundamental coding and familiarity utilizing AI, my established skillset creates an environment of both progression and creative style.' },
  { id: 'stalwart', section: 'projects', label: 'Stalwart [BETA]', href: 'https://stalwart-v1-0.onrender.com/' },
  { id: 'merge',    section: 'projects', label: 'Merge',           href: '' },
  { id: 'alterego', section: 'projects', label: 'AlterEgo',        href: '' },
  { id: 'github',   section: 'links',    label: 'GitHub',   href: 'https://github.com/bstueben2001' },
  { id: 'linkedin', section: 'links',    label: 'LinkedIn', href: 'https://www.linkedin.com/in/brendon-stueben-01406a2ba' },
  { id: 'resume',   section: 'links',    label: 'Resume',   href: resume },
]

export const INFO_ITEM_MAP = Object.fromEntries(INFO_ITEMS.map(item => [item.id, item]))
