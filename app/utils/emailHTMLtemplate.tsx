"use server";

import { ReactNode } from "react";

interface EmailTemplateProps {
  from: string;
  subject: string;
  message: string;
  dir: string;
}

const getData = async (component: ReactNode): Promise<string> => {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const staticMarkup = renderToStaticMarkup(component);
  return staticMarkup;
};

function EmailTemplate({ from, subject, message, dir }: EmailTemplateProps) {
  return (
    <div
      dir={dir}
      style={{ fontFamily: "sans-serif", padding: "20px", color: "#333" }}
    >
      <h2 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
        {subject}
      </h2>
      <p style={{ fontSize: "14px", color: "#666" }}>
        <strong>From:</strong> {from}
      </p>
      <div
        style={{ marginTop: "20px", whiteSpace: "pre-wrap", lineHeight: "1.6" }}
      >
        {message}
      </div>
    </div>
  );
}

export async function convertComponentToHtml(
  props: EmailTemplateProps,
): Promise<string> {
  const htmlString = await getData(<EmailTemplate {...props} />);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        ${htmlString}
      </body>
    </html>
  `.trim();
}
