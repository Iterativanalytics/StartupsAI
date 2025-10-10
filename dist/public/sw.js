const CACHE_VERSION = 'v2.0';
const CACHE_NAME = `dashboard-cache-${CACHE_VERSION}`;
const API_CACHE_NAME = `api-cache-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `image-cache-${CACHE_VERSION}`;
const FONT_CACHE_NAME = `font-cache-${CACHE_VERSION}`;

// Cache duration in milliseconds
const CACHE_MAX_AGE = {
  static: 7 * 24 * 60 * 60 * 1000, // 7 days
  api: 5 * 60 * 1000, // 5 minutes
  image: 30 * 24 * 60 * 60 * 1000, // 30 days
  font: 365 * 24 * 60 * 60 * 1000 // 1 year
};

// Core files to cache during install
const CORE_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache core resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll(CORE_ASSETS).catch((error) => {
          console.error('[Service Worker] Failed to cache core assets:', error);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper function to check if cache is expired
function isCacheExpired(response, maxAge) {
  if (!response) return true;
  
  const cachedTime = response.headers.get('sw-cached-time');
  if (!cachedTime) return true;
  
  const age = Date.now() - parseInt(cachedTime, 10);
  return age > maxAge;
}

// Helper function to add timestamp to cached response
function addCacheTimestamp(response) {
  // Don't add timestamps to opaque responses (cross-origin)
  if (response.type === 'opaque') {
    return Promise.resolve(response);
  }
  
  const clonedResponse = response.clone();
  const headers = new Headers(clonedResponse.headers);
  headers.append('sw-cached-time', Date.now().toString());
  
  return clonedResponse.blob().then(blob => {
    return new Response(blob, {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers: headers
    });
  });
}

// Network-first strategy for API calls
async function networkFirstStrategy(request, cacheName, maxAge) {
  try {
    const response = await fetch(request);
    
    // Cache successful responses and opaque responses (cross-origin)
    if (response.ok || response.type === 'opaque') {
      const cache = await caches.open(cacheName);
      const responseWithTimestamp = await addCacheTimestamp(response);
      cache.put(request, responseWithTimestamp.clone());
      return response;
    }
    
    return response;
  } catch (error) {
    console.log('[Service Worker] Network request failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse && !isCacheExpired(cachedResponse, maxAge)) {
      return cachedResponse;
    }
    
    // Return a custom offline response for API calls
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'You are currently offline. Please check your connection.' 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({ 'Content-Type': 'application/json' })
      }
    );
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request, cacheName, maxAge) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse && !isCacheExpired(cachedResponse, maxAge)) {
    // Fetch in background to update cache
    fetch(request).then(response => {
      if (response.ok) {
        caches.open(cacheName).then(cache => {
          addCacheTimestamp(response).then(responseWithTimestamp => {
            cache.put(request, responseWithTimestamp);
          });
        });
      }
    }).catch(() => {});
    
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    // Cache successful responses and opaque responses (cross-origin)
    if (response.ok || response.type === 'opaque') {
      const cache = await caches.open(cacheName);
      const responseWithTimestamp = await addCacheTimestamp(response);
      cache.put(request, responseWithTimestamp.clone());
    }
    
    return response;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API requests - network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE_NAME, CACHE_MAX_AGE.api));
    return;
  }

  // Font files - cache first with long expiration
  if (url.pathname.match(/\.(woff|woff2|ttf|otf|eot)$/)) {
    event.respondWith(cacheFirstStrategy(request, FONT_CACHE_NAME, CACHE_MAX_AGE.font));
    return;
  }

  // Image files - cache first with long expiration
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE_NAME, CACHE_MAX_AGE.image));
    return;
  }

  // Static assets (JS, CSS) - cache first
  if (url.pathname.match(/\.(js|css|json)$/)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME, CACHE_MAX_AGE.static));
    return;
  }

  // HTML pages - network first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const cache = caches.open(CACHE_NAME);
          cache.then(c => c.put(request, response.clone()));
          return response;
        })
        .catch(() => {
          return caches.match(request).then(cachedResponse => {
            return cachedResponse || caches.match('/');
          });
        })
    );
    return;
  }

  // Default: try network, fallback to cache
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const cache = caches.open(CACHE_NAME);
          cache.then(c => c.put(request, response.clone()));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncPendingData());
  }
});

async function syncPendingData() {
  try {
    const allClients = await self.clients.matchAll();
    allClients.forEach(client => {
      client.postMessage({
        type: 'SYNC_START'
      });
    });

    // Notify success
    allClients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE'
      });
    });
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    
    const allClients = await self.clients.matchAll();
    allClients.forEach(client => {
      client.postMessage({
        type: 'SYNC_ERROR',
        error: error.message
      });
    });
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'New update available',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ],
    requireInteraction: false,
    tag: 'dashboard-notification'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Dashboard Update', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if none exists
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Message handler for communication with clients
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
  
  if (event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              return caches.open(cacheName).then((cache) => {
                return cache.keys().then((keys) => ({
                  name: cacheName,
                  size: keys.length
                }));
              });
            })
          );
        })
        .then((cacheSizes) => {
          event.ports[0].postMessage({ cacheSizes });
        })
    );
  }
});

console.log('[Service Worker] Service Worker loaded');
