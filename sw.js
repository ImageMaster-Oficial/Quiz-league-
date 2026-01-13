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

// 3. LÓGICA PWA - CACHE ESSENCIAL (Versão v7 para forçar limpeza de bordas brancas)
const CACHE_NAME = 'quiz-legends-v7'; 
const ASSETS_TO_CACHE = [
    './',
    'index.html',
    'manifest-jogo.json',
    'app-192.png',
    'app-512.png',
    'admin-vertical.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Força a instalação imediata
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(asset => cache.add(asset))
            );
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    return self.clients.claim(); // Assume o controle das abas abertas imediatamente
});

// 4. ESTRATÉGIA CACHE FIRST (Carregamento Instantâneo da Splash Screen)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Se encontrar no cache (como a imagem admin-vertical), entrega na hora
            if (response) {
                return response;
            }
            // Se não estiver no cache, vai buscar na internet
            return fetch(event.request);
        })
    );
});
