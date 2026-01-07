importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// 1. Inicialização do Firebase (Versão Compat para SW)
firebase.initializeApp({
    apiKey: "AIzaSyC4dm0KoyJswhyCY7tgbF4D2nmuZl84X8E",
    projectId: "quizlegends-f58fc",
    messagingSenderId: "1050463164018",
    appId: "1:1050463164018:web:91de002b8afc8e678f54eb"
});

const messaging = firebase.messaging();

// 2. Gerenciamento de Notificações em Segundo Plano
messaging.onBackgroundMessage((payload) => {
    console.log('Recebido mensagem em segundo plano: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'icone-admin.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 3. LOGICA OBRIGATÓRIA PARA PWA (Instalação)
self.addEventListener('install', (event) => {
    self.skipWaiting();
    console.log('SW instalado para PWA');
});

self.addEventListener('activate', (event) => {
    console.log('SW ativo');
});

// O evento 'fetch' é o que faz o Chrome liberar o botão de "Instalar"
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
