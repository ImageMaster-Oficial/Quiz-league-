importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// 1. Inicialização do Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC4dm0KoyJswhyCY7tgbF4D2nmuZl84X8E",
    projectId: "quizlegends-f58fc",
    messagingSenderId: "1050463164018",
    appId: "1:1050463164018:web:91de002b8afc8e678f54eb"
});

const messaging = firebase.messaging();

// 2. Gerenciamento de Notificações
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'app-512.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 3. LÓGICA PWA - LIMPEZA EXTREMA (Versão v10)
const CACHE_NAME = 'quiz-legends-v10'; 
const ASSETS_TO_CACHE = [
    './',
    'index.html',
    'manifest-jogo.json',
    'app-192.png',
    'app-512.png',
    'admin-vertical.png'
];

// INSTALAÇÃO: Força o Service Worker a se tornar o ativo imediatamente
self.addEventListener('install', (event) => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(asset => {
                    // Adiciona um timestamp na URL de cache para garantir que baixe do servidor, não do cache local
                    return cache.add(new Request(asset, { cache: 'reload' }));
                })
            );
        })
    );
});

// ATIVAÇÃO: DESTRUIÇÃO TOTAL de caches antigos e controle imediato
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('Removendo cache antigo:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim(); // Reivindica o controle das páginas abertas na hora
        })
    );
});

// 4. ESTRATÉGIA CACHE FIRST (Com verificação de rede para o Manifest)
self.addEventListener('fetch', (event) => {
    // Se for o arquivo de manifest, tentamos sempre buscar a versão mais nova da rede primeiro
    if (event.request.url.includes('manifest-jogo.json')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
