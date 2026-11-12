import { StaticImageData } from 'next/image';
import { SectionName } from '@constants/interfaces';
import aboutSm from '@/assets/images/about-sm.webp';
import aboutMd from '@/assets/images/about-md.webp';
import aboutLg from '@/assets/images/about-lg.webp';
import aboutXl from '@/assets/images/about-xl.webp';
import about2Xl from '@/assets/images/about-2xl.webp';
import contactSm from '@/assets/images/contact-sm.webp';
import contactMd from '@/assets/images/contact-md.webp';
import contactLg from '@/assets/images/contact-lg.webp';
import contactXl from '@/assets/images/contact-xl.webp';
import contact2Xl from '@/assets/images/contact-2xl.webp';
import experienceSm from '@/assets/images/experience-sm.webp';
import experienceMd from '@/assets/images/experience-md.webp';
import experienceLg from '@/assets/images/experience-lg.webp';
import experienceXl from '@/assets/images/experience-xl.webp';
import experience2Xl from '@/assets/images/experience-2xl.webp';
import projectsSm from '@/assets/images/projects-sm.webp';
import projectsMd from '@/assets/images/projects-md.webp';
import projectsLg from '@/assets/images/projects-lg.webp';
import projectsXl from '@/assets/images/projects-xl.webp';
import projects2Xl from '@/assets/images/projects-2xl.webp';
import skillsSm from '@/assets/images/skills-sm.webp';
import skillsMd from '@/assets/images/skills-md.webp';
import skillsLg from '@/assets/images/skills-lg.webp';
import skillsXl from '@/assets/images/skills-xl.webp';
import skills2Xl from '@/assets/images/skills-2xl.webp';

export const TAILWIND_SIZES = [
  { twClassName: 'sm', pxResolution: 640 },
  { twClassName: 'md', pxResolution: 768 },
  { twClassName: 'lg', pxResolution: 1024 },
  { twClassName: 'xl', pxResolution: 1280 },
  { twClassName: '2xl', pxResolution: 1536 },
] as const;

type Breakpoint = (typeof TAILWIND_SIZES)[number]['twClassName'];

/** Statically imported, so each file gets a content-hashed /_next/static/media URL that is cached immutably.
 * The smaller variants are crops of the 2xl one (same resolution), picked per breakpoint by SectionBackground. */
export const SECTION_BACKGROUNDS: Record<SectionName, Record<Breakpoint, StaticImageData>> = {
  about: { sm: aboutSm, md: aboutMd, lg: aboutLg, xl: aboutXl, '2xl': about2Xl },
  contact: { sm: contactSm, md: contactMd, lg: contactLg, xl: contactXl, '2xl': contact2Xl },
  experience: { sm: experienceSm, md: experienceMd, lg: experienceLg, xl: experienceXl, '2xl': experience2Xl },
  projects: { sm: projectsSm, md: projectsMd, lg: projectsLg, xl: projectsXl, '2xl': projects2Xl },
  skills: { sm: skillsSm, md: skillsMd, lg: skillsLg, xl: skillsXl, '2xl': skills2Xl },
};
