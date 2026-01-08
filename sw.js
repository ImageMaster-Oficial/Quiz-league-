const CACHE_NAME = 'quiz-legends-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './resgate.html',
  './pergunta.js',
  './manifest.json',
  // Adicione aqui outros arquivos que você tenha, como imagens ou ícones:
  // './icon.png',
  // './logo.png'
];

// Instalação do Service Worker e Cache dos arquivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aberto: Armazenando recursos do Quiz Legends');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia de Fetch: Network First (Tenta rede, se falhar, usa cache)
// Ideal para apps que dependem de dados em tempo real (Firebase), mas precisam abrir rápido.
self.addEventListener('fetch', (event) => {
  // Ignora requisições do Firebase/Firestore para não causar conflito com o SDK
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a rede funcionar, clona a resposta para o cache
        if (event.request.method === 'GET') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Se a rede falhar (offline), tenta buscar no cache
        return caches.match(event.request);
      })
  );
});
