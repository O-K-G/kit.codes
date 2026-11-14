import { StaticImageData } from 'next/image';
import { SectionName } from '@constants/interfaces';
import aboutSm from '@/assets/images/about/sm-640w.webp';
import aboutMd from '@/assets/images/about/md-768w.webp';
import aboutLg from '@/assets/images/about/lg-1024w.webp';
import aboutXl from '@/assets/images/about/xl-1280w.webp';
import about2Xl from '@/assets/images/about/2xl-1728w.webp';
import aboutSm640 from '@/assets/images/about/sm-640w.avif';
import aboutSm960 from '@/assets/images/about/sm-960w.avif';
import aboutSm1280 from '@/assets/images/about/sm-1280w.avif';
import aboutSm1920 from '@/assets/images/about/sm-1920w.avif';
import aboutSm2560 from '@/assets/images/about/sm-2560w.avif';
import aboutMd768 from '@/assets/images/about/md-768w.avif';
import aboutMd1152 from '@/assets/images/about/md-1152w.avif';
import aboutMd1536 from '@/assets/images/about/md-1536w.avif';
import aboutMd2304 from '@/assets/images/about/md-2304w.avif';
import aboutMd3072 from '@/assets/images/about/md-3072w.avif';
import aboutLg1024 from '@/assets/images/about/lg-1024w.avif';
import aboutLg1536 from '@/assets/images/about/lg-1536w.avif';
import aboutLg2048 from '@/assets/images/about/lg-2048w.avif';
import aboutLg3072 from '@/assets/images/about/lg-3072w.avif';
import aboutLg4096 from '@/assets/images/about/lg-4096w.avif';
import aboutXl1280 from '@/assets/images/about/xl-1280w.avif';
import aboutXl1920 from '@/assets/images/about/xl-1920w.avif';
import aboutXl2560 from '@/assets/images/about/xl-2560w.avif';
import aboutXl3840 from '@/assets/images/about/xl-3840w.avif';
import aboutXl5120 from '@/assets/images/about/xl-5120w.avif';
import about2Xl1728 from '@/assets/images/about/2xl-1728w.avif';
import about2Xl2592 from '@/assets/images/about/2xl-2592w.avif';
import about2Xl3456 from '@/assets/images/about/2xl-3456w.avif';
import about2Xl5184 from '@/assets/images/about/2xl-5184w.avif';
import about2Xl6912 from '@/assets/images/about/2xl-6912w.avif';
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

/** An AVIF version of a crop, and its size in pixels */
export interface AvifVersion {
  src: string;
  width: number;
  height: number;
}

const avif = ({ src }: StaticImageData, width: number, height: number): AvifVersion => ({
  src,
  width,
  height,
});

/**
 * AVIF versions, for the sections that have them: browsers that support AVIF take these (a fraction of
 * the size), the others the WebP ones above. Same crops, each at 1, 1.5, 2, 3 and 4 times the WebP
 * one's size (narrowest first), so every screen gets the smallest that's sharp on it (see
 * SectionBackground). About's are from Group 31.png: the scene with its layer of stars, cropped at
 * the scene's bottom edge (so 1048px tall at 1x, where the WebP ones keep a transparent strip below it).
 * Their sizes are given here, as Next doesn't read AVIF files' sizes (it reports them as 100x100).
 */
export const SECTION_BACKGROUNDS_AVIF: Partial<Record<SectionName, Record<Breakpoint, AvifVersion[]>>> = {
  about: {
    sm: [avif(aboutSm640, 640, 1048), avif(aboutSm960, 960, 1572), avif(aboutSm1280, 1280, 2096), avif(aboutSm1920, 1920, 3144), avif(aboutSm2560, 2560, 4192)],
    md: [avif(aboutMd768, 768, 1048), avif(aboutMd1152, 1152, 1572), avif(aboutMd1536, 1536, 2096), avif(aboutMd2304, 2304, 3144), avif(aboutMd3072, 3072, 4192)],
    lg: [avif(aboutLg1024, 1024, 1048), avif(aboutLg1536, 1536, 1572), avif(aboutLg2048, 2048, 2096), avif(aboutLg3072, 3072, 3144), avif(aboutLg4096, 4096, 4192)],
    xl: [avif(aboutXl1280, 1280, 1048), avif(aboutXl1920, 1920, 1572), avif(aboutXl2560, 2560, 2096), avif(aboutXl3840, 3840, 3144), avif(aboutXl5120, 5120, 4192)],
    '2xl': [avif(about2Xl1728, 1728, 1048), avif(about2Xl2592, 2592, 1572), avif(about2Xl3456, 3456, 2096), avif(about2Xl5184, 5184, 3144), avif(about2Xl6912, 6912, 4192)],
  },
};
