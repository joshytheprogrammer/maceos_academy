// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  // Route rules: SSR only for landing page, SPA for everything else
  routeRules: {
    '/': { ssr: true },              // Landing page - SSR for SEO
    '/login': { ssr: false },        // Login - client only
    '/apply/**': { ssr: false },     // Application flow - client only
    '/dashboard/**': { ssr: false }, // Dashboard - client only
    '/admin/**': { ssr: false },     // Admin panel - client only
  },

  runtimeConfig: {
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || '',
    appwriteApiKey: process.env.APPWRITE_API_KEY || '',
    // SMTP Configuration
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpFromName: process.env.SMTP_FROM_NAME || 'MACEOS Academy',
    smtpFromEmail: process.env.SMTP_FROM_EMAIL || '',
    public: {
      paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
      appwriteEndpoint: process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
      appwriteProject: process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID || '',
    },
  },
  
  app: {
    head: {
      title: 'MACEOS Academy',
      htmlAttrs: {
        lang: 'en',
        class: 'dark',
      },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap' 
        },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' 
        },
      ],
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
