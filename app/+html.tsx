import { ScrollViewStyleReset } from 'expo-router/html'
import React from 'react'

const APP_URL = 'https://s540d.github.io/safe-my-plants/'
const APP_NAME = 'Safe My Plants'
const APP_DESCRIPTION =
  'Safe My Plants is an offline houseplant companion: care tips, watering and fertilizing reminders via a traffic-light indicator, disease reference photos, and per-plant tracking — no account or backend required.'

/**
 * This file provides the document root for Expo Router's static web export.
 * It is only used during the web build and never affects native apps.
 *
 * See: https://docs.expo.dev/router/reference/static-rendering/#root-html
 */
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <title>{APP_NAME} – Houseplant Care Companion</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={APP_URL} />

        {/* Open Graph */}
        <meta property="og:title" content={`${APP_NAME} – Houseplant Care Companion`} />
        <meta property="og:description" content={APP_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={APP_URL} />
        {/* No og:image: only a 48x48 favicon is available, too small for a useful social preview. */}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${APP_NAME} – Houseplant Care Companion`} />
        <meta name="twitter:description" content={APP_DESCRIPTION} />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape hatch to ensure the background color never flickers in dark-mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  )
}

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`
