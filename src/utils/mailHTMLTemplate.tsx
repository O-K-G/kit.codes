import { ContactMessage } from '@constants/interfaces';
import mailHTMLText from '@i18nEn/mailHTMLText.json';

const STYLE = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start',
    width: '100%',
    padding: '1rem',
    color: 'black',
    backgroundColor: 'white',
    fontSize: '1rem',
  },
  h1: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  span: {
    width: '100%',
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'start',
  },
  a: {
    textDecoration: 'none',
    textTransform: 'lowercase',
  },
  p: {
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'start',
    width: '100%',
    textAlign: 'left',
    margin: '0',
  },
} as const;

/**
 * Server-only: the contact message as an HTML email. Rendered by React, so everything the visitor
 * typed is escaped.
 */
export default async function mailHTMLTemplate({ dir, email, subject, content }: ContactMessage) {
  const {
    subject: subjectText,
    sendersEmailAddressText,
    subjectSecondaryTitle,
    messageContent,
    website,
  } = mailHTMLText;
  const title = `${subjectText}:\xa0${website}`;

  // Imported here: Next doesn't allow react-dom/server in modules that could reach the app's code
  const { renderToStaticMarkup } = await import('react-dom/server');

  const html = renderToStaticMarkup(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </head>
      <body dir={dir}>
        <main style={STYLE.main}>
          <h1 style={STYLE.h1}>{title}</h1>
          <span style={STYLE.span}>
            <b>{sendersEmailAddressText}:</b>&nbsp;
            <a
              style={STYLE.a}
              href={`mailto:${email}`}
              rel="noreferrer"
              target="_blank"
            >
              {email}
            </a>
          </span>
          <h2 style={STYLE.h1}>
            <b>{subjectSecondaryTitle}:</b>&nbsp;{subject}
          </h2>
          <p style={STYLE.p}>
            <b>{messageContent}:</b>&nbsp;{content}
          </p>
        </main>
      </body>
    </html>
  );

  return `<!DOCTYPE html>${html}`;
}
