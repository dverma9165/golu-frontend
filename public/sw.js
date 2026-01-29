self.addEventListener('push', function (event) {
    const data = event.data.json();
    console.log('Push Recieved...', data);

    self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/vite.svg', // Default vite icon, or change to logo
        data: {
            url: data.url
        }
    });
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
