import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600&display=swap",
  },
];

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "What Would Balen Say?",
                url: "https://whatwouldbalensay.com",
                description:
                  "Parody AI that responds in the style of Balen Shah, Prime Minister of Nepal.",
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What would Balen Shah say about traffic in Kathmandu?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Roads do not fix themselves. Systems do. Where is the system? Fix it.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What would Balen Shah say about corruption?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Corruption is a choice. Choose differently.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What would Balen Shah say about his vision for Nepal?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Accountability. Transparency. Work. In that order.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What would Balen Shah say about young Nepalis going abroad?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Go. Learn. Come back. Build. Or stay. But build.",
                    },
                  },
                ],
              },
            ]),
          }}
        />
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="bg-[#111213] antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
  }

  return (
    <main className="min-h-screen bg-[#111213] text-white flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#dc143c] mb-2">{message}</h1>
        <p className="text-[#b0b3b8]">{details}</p>
      </div>
    </main>
  );
}
