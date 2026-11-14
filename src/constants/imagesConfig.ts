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
import experienceSm from '@/assets/images/experience/sm-640w.webp';
import experienceMd from '@/assets/images/experience/md-768w.webp';
import experienceLg from '@/assets/images/experience/lg-1024w.webp';
import experienceXl from '@/assets/images/experience/xl-1280w.webp';
import experience2Xl from '@/assets/images/experience/2xl-1728w.webp';
import experienceSm640 from '@/assets/images/experience/sm-640w.avif';
import experienceSm960 from '@/assets/images/experience/sm-960w.avif';
import experienceSm1280 from '@/assets/images/experience/sm-1280w.avif';
import experienceSm1920 from '@/assets/images/experience/sm-1920w.avif';
import experienceSm2560 from '@/assets/images/experience/sm-2560w.avif';
import experienceMd768 from '@/assets/images/experience/md-768w.avif';
import experienceMd1152 from '@/assets/images/experience/md-1152w.avif';
import experienceMd1536 from '@/assets/images/experience/md-1536w.avif';
import experienceMd2304 from '@/assets/images/experience/md-2304w.avif';
import experienceMd3072 from '@/assets/images/experience/md-3072w.avif';
import experienceLg1024 from '@/assets/images/experience/lg-1024w.avif';
import experienceLg1536 from '@/assets/images/experience/lg-1536w.avif';
import experienceLg2048 from '@/assets/images/experience/lg-2048w.avif';
import experienceLg3072 from '@/assets/images/experience/lg-3072w.avif';
import experienceLg4096 from '@/assets/images/experience/lg-4096w.avif';
import experienceXl1280 from '@/assets/images/experience/xl-1280w.avif';
import experienceXl1920 from '@/assets/images/experience/xl-1920w.avif';
import experienceXl2560 from '@/assets/images/experience/xl-2560w.avif';
import experienceXl3840 from '@/assets/images/experience/xl-3840w.avif';
import experienceXl5120 from '@/assets/images/experience/xl-5120w.avif';
import experience2Xl1728 from '@/assets/images/experience/2xl-1728w.avif';
import experience2Xl2592 from '@/assets/images/experience/2xl-2592w.avif';
import experience2Xl3456 from '@/assets/images/experience/2xl-3456w.avif';
import experience2Xl5184 from '@/assets/images/experience/2xl-5184w.avif';
import experience2Xl6912 from '@/assets/images/experience/2xl-6912w.avif';
import projectsSm from '@/assets/images/projects/sm-640w.webp';
import projectsMd from '@/assets/images/projects/md-768w.webp';
import projectsLg from '@/assets/images/projects/lg-1024w.webp';
import projectsXl from '@/assets/images/projects/xl-1280w.webp';
import projects2Xl from '@/assets/images/projects/2xl-1728w.webp';
import projectsSm640 from '@/assets/images/projects/sm-640w.avif';
import projectsSm960 from '@/assets/images/projects/sm-960w.avif';
import projectsSm1280 from '@/assets/images/projects/sm-1280w.avif';
import projectsSm1920 from '@/assets/images/projects/sm-1920w.avif';
import projectsSm2560 from '@/assets/images/projects/sm-2560w.avif';
import projectsMd768 from '@/assets/images/projects/md-768w.avif';
import projectsMd1152 from '@/assets/images/projects/md-1152w.avif';
import projectsMd1536 from '@/assets/images/projects/md-1536w.avif';
import projectsMd2304 from '@/assets/images/projects/md-2304w.avif';
import projectsMd3072 from '@/assets/images/projects/md-3072w.avif';
import projectsLg1024 from '@/assets/images/projects/lg-1024w.avif';
import projectsLg1536 from '@/assets/images/projects/lg-1536w.avif';
import projectsLg2048 from '@/assets/images/projects/lg-2048w.avif';
import projectsLg3072 from '@/assets/images/projects/lg-3072w.avif';
import projectsLg4096 from '@/assets/images/projects/lg-4096w.avif';
import projectsXl1280 from '@/assets/images/projects/xl-1280w.avif';
import projectsXl1920 from '@/assets/images/projects/xl-1920w.avif';
import projectsXl2560 from '@/assets/images/projects/xl-2560w.avif';
import projectsXl3840 from '@/assets/images/projects/xl-3840w.avif';
import projectsXl5120 from '@/assets/images/projects/xl-5120w.avif';
import projects2Xl1728 from '@/assets/images/projects/2xl-1728w.avif';
import projects2Xl2592 from '@/assets/images/projects/2xl-2592w.avif';
import projects2Xl3456 from '@/assets/images/projects/2xl-3456w.avif';
import projects2Xl5184 from '@/assets/images/projects/2xl-5184w.avif';
import projects2Xl6912 from '@/assets/images/projects/2xl-6912w.avif';
import skillsSm from '@/assets/images/skills/sm-640w.webp';
import skillsMd from '@/assets/images/skills/md-768w.webp';
import skillsLg from '@/assets/images/skills/lg-1024w.webp';
import skillsXl from '@/assets/images/skills/xl-1280w.webp';
import skills2Xl from '@/assets/images/skills/2xl-1728w.webp';
import skillsSm640 from '@/assets/images/skills/sm-640w.avif';
import skillsSm960 from '@/assets/images/skills/sm-960w.avif';
import skillsSm1280 from '@/assets/images/skills/sm-1280w.avif';
import skillsSm1920 from '@/assets/images/skills/sm-1920w.avif';
import skillsSm2560 from '@/assets/images/skills/sm-2560w.avif';
import skillsMd768 from '@/assets/images/skills/md-768w.avif';
import skillsMd1152 from '@/assets/images/skills/md-1152w.avif';
import skillsMd1536 from '@/assets/images/skills/md-1536w.avif';
import skillsMd2304 from '@/assets/images/skills/md-2304w.avif';
import skillsMd3072 from '@/assets/images/skills/md-3072w.avif';
import skillsLg1024 from '@/assets/images/skills/lg-1024w.avif';
import skillsLg1536 from '@/assets/images/skills/lg-1536w.avif';
import skillsLg2048 from '@/assets/images/skills/lg-2048w.avif';
import skillsLg3072 from '@/assets/images/skills/lg-3072w.avif';
import skillsLg4096 from '@/assets/images/skills/lg-4096w.avif';
import skillsXl1280 from '@/assets/images/skills/xl-1280w.avif';
import skillsXl1920 from '@/assets/images/skills/xl-1920w.avif';
import skillsXl2560 from '@/assets/images/skills/xl-2560w.avif';
import skillsXl3840 from '@/assets/images/skills/xl-3840w.avif';
import skillsXl5120 from '@/assets/images/skills/xl-5120w.avif';
import skills2Xl1728 from '@/assets/images/skills/2xl-1728w.avif';
import skills2Xl2592 from '@/assets/images/skills/2xl-2592w.avif';
import skills2Xl3456 from '@/assets/images/skills/2xl-3456w.avif';
import skills2Xl5184 from '@/assets/images/skills/2xl-5184w.avif';
import skills2Xl6912 from '@/assets/images/skills/2xl-6912w.avif';

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
 * SectionBackground). Each is cropped at its scene's bottom edge, where a transparent part would show
 * as black: About's are from Group 31.png (the scene with its layer of stars; 1048px tall at 1x, where
 * its WebP ones keep the strip), Skills' from Group 30.png (1042px tall at 1x, as are its WebP ones),
 * Projects' from Group 32.png (1062px tall at 1x, as are its WebP ones; its crops are centered),
 * Experience's from Group 33.png (1050px tall at 1x, as are its WebP ones).
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
  skills: {
    sm: [avif(skillsSm640, 640, 1042), avif(skillsSm960, 960, 1563), avif(skillsSm1280, 1280, 2084), avif(skillsSm1920, 1920, 3126), avif(skillsSm2560, 2560, 4168)],
    md: [avif(skillsMd768, 768, 1042), avif(skillsMd1152, 1152, 1563), avif(skillsMd1536, 1536, 2084), avif(skillsMd2304, 2304, 3126), avif(skillsMd3072, 3072, 4168)],
    lg: [avif(skillsLg1024, 1024, 1042), avif(skillsLg1536, 1536, 1563), avif(skillsLg2048, 2048, 2084), avif(skillsLg3072, 3072, 3126), avif(skillsLg4096, 4096, 4168)],
    xl: [avif(skillsXl1280, 1280, 1042), avif(skillsXl1920, 1920, 1563), avif(skillsXl2560, 2560, 2084), avif(skillsXl3840, 3840, 3126), avif(skillsXl5120, 5120, 4168)],
    '2xl': [avif(skills2Xl1728, 1728, 1042), avif(skills2Xl2592, 2592, 1563), avif(skills2Xl3456, 3456, 2084), avif(skills2Xl5184, 5184, 3126), avif(skills2Xl6912, 6912, 4168)],
  },
  projects: {
    sm: [avif(projectsSm640, 640, 1062), avif(projectsSm960, 960, 1593), avif(projectsSm1280, 1280, 2124), avif(projectsSm1920, 1920, 3186), avif(projectsSm2560, 2560, 4248)],
    md: [avif(projectsMd768, 768, 1062), avif(projectsMd1152, 1152, 1593), avif(projectsMd1536, 1536, 2124), avif(projectsMd2304, 2304, 3186), avif(projectsMd3072, 3072, 4248)],
    lg: [avif(projectsLg1024, 1024, 1062), avif(projectsLg1536, 1536, 1593), avif(projectsLg2048, 2048, 2124), avif(projectsLg3072, 3072, 3186), avif(projectsLg4096, 4096, 4248)],
    xl: [avif(projectsXl1280, 1280, 1062), avif(projectsXl1920, 1920, 1593), avif(projectsXl2560, 2560, 2124), avif(projectsXl3840, 3840, 3186), avif(projectsXl5120, 5120, 4248)],
    '2xl': [avif(projects2Xl1728, 1728, 1062), avif(projects2Xl2592, 2592, 1593), avif(projects2Xl3456, 3456, 2124), avif(projects2Xl5184, 5184, 3186), avif(projects2Xl6912, 6912, 4248)],
  },
  experience: {
    sm: [avif(experienceSm640, 640, 1050), avif(experienceSm960, 960, 1575), avif(experienceSm1280, 1280, 2100), avif(experienceSm1920, 1920, 3150), avif(experienceSm2560, 2560, 4200)],
    md: [avif(experienceMd768, 768, 1050), avif(experienceMd1152, 1152, 1575), avif(experienceMd1536, 1536, 2100), avif(experienceMd2304, 2304, 3150), avif(experienceMd3072, 3072, 4200)],
    lg: [avif(experienceLg1024, 1024, 1050), avif(experienceLg1536, 1536, 1575), avif(experienceLg2048, 2048, 2100), avif(experienceLg3072, 3072, 3150), avif(experienceLg4096, 4096, 4200)],
    xl: [avif(experienceXl1280, 1280, 1050), avif(experienceXl1920, 1920, 1575), avif(experienceXl2560, 2560, 2100), avif(experienceXl3840, 3840, 3150), avif(experienceXl5120, 5120, 4200)],
    '2xl': [avif(experience2Xl1728, 1728, 1050), avif(experience2Xl2592, 2592, 1575), avif(experience2Xl3456, 3456, 2100), avif(experience2Xl5184, 5184, 3150), avif(experience2Xl6912, 6912, 4200)],
  },
};
