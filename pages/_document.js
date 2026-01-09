import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="gyD7jaYOr7U2eULOJqBKx2tvoMXk9Rp8Z5vHCeckmII"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}