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
        icon: 'icone-192.png' // Alterado para o ícone padrão do jogo
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 3. LÓGICA PWA - CACHE ESSENCIAL
const CACHE_NAME = 'quiz-legends-v1';
const ASSETS_TO_CACHE = [
    'index.html',
    'manifest-jogo.json',
    'icone-192.png',
    'icone-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});

// Evento Fetch (Obrigatório para o botão de instalar aparecer)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
