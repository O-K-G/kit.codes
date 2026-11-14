import cv from '@root/public/cv.json';

/** The CV never changes between deploys: built once per locale and cached */
export const dynamic = 'force-static';

export function GET() {
  return Response.json(cv);
}
