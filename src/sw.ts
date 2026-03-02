import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';

declare let self: ServiceWorkerGlobalScope;

// Auto-update: skip waiting and claim clients immediately
self.skipWaiting();
clientsClaim();

// Clean up old caches from previous versions
cleanupOutdatedCaches();

// Precache static assets (injected by vite-plugin-pwa at build time)
precacheAndRoute(self.__WB_MANIFEST);

// --- Caching Strategies ---

// 1. Supabase API calls: Network-First (always fresh data)
registerRoute(
  ({ url }) => url.hostname.includes('supabase.co') && !url.pathname.includes('/storage/'),
  new NetworkFirst({
    cacheName: 'supabase-api',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes fallback
      }),
    ],
  })
);

// 2. Supabase Storage (avatars, logos, match photos): Cache-First
registerRoute(
  ({ url }) => url.hostname.includes('supabase.co') && url.pathname.includes('/storage/'),
  new CacheFirst({
    cacheName: 'supabase-storage',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// 3. Google Fonts: Cache-First
registerRoute(
  ({ url }) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
    ],
  })
);

// 4. Razorpay SDK: StaleWhileRevalidate
registerRoute(
  ({ url }) => url.hostname === 'checkout.razorpay.com',
  new StaleWhileRevalidate({ cacheName: 'razorpay-sdk' })
);

// 5. Offline fallback for navigation requests
const OFFLINE_FALLBACK = '/offline.html';

const navigationHandler = async (params: { request: Request; url: URL; event: ExtendableEvent }) => {
  try {
    return await new NetworkFirst({
      cacheName: 'navigations',
      networkTimeoutSeconds: 5,
    }).handle(params);
  } catch {
    const cache = await caches.open('offline-fallback');
    const fallback = await cache.match(OFFLINE_FALLBACK);
    if (fallback) return fallback;
    return new Response('Offline', { status: 503 });
  }
};

registerRoute(new NavigationRoute(navigationHandler));

// Cache the offline fallback page on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-fallback').then((cache) => cache.add(OFFLINE_FALLBACK))
  );
});
