import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

const routes = [
  'about', 'player-development', 'camps-and-clinics', 'player-pathway',
  'assessments', 'coaches', 'international-experiences', 'college-pathway',
  'events', 'contact', 'register', 'programs', 'mentorship',
  'gallery', 'faq', 'eligibility', 'get-involved',
  'donate', 'donate/checkout', 'donate/return', 'thank-you', 'about-us',
  'book-online', 'event-list', 'donate-page', 'thank-you-page', 'thank-you-page-2',
  'admin/login', 'admin', 'admin/enquiries', 'admin/players', 'admin/parents',
  'admin/programmes', 'admin/training', 'admin/timetable', 'admin/events',
  'admin/coaches', 'admin/donations', 'admin/messages', 'admin/staff', 'admin/settings',
  'login', 'signup', 'forgot-password', 'dashboard', 'dashboard/my-programmes',
  'dashboard/schedule', 'dashboard/events', 'dashboard/attendance',
  'dashboard/profile', 'dashboard/notifications',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: { ignored: ['**/.edge-preview/**', '**/.chrome-*/**'] },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        ...Object.fromEntries(routes.map(route => [route.replaceAll('/', '-'), resolve(import.meta.dirname, route, 'index.html')])),
      },
    },
  },
})
