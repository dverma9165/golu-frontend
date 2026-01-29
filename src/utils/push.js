import api from '../services/api';

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export const subscribeUser = async (role = 'user', adminPassword = null) => {
    if ('serviceWorker' in navigator) {
        try {
            const register = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('Service Worker Registered...');

            // Get Push Subscription
            // Check if already subscribed? 
            let subscription = await register.pushManager.getSubscription();

            if (!subscription) {
                // Fetch Public Key
                // Since this might be called from Admin dashboard without auth token (just password), 
                // or User dashboard with token.
                const response = await api.get('/api/notifications/config');
                const publicVapidKey = response.data.publicKey;

                console.log('Registering Push...');
                subscription = await register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
                });
            }

            console.log('Push Registered...');

            // Send Subscription to Backend
            const headers = {
                'Content-Type': 'application/json'
            };

            if (role === 'admin' && adminPassword) {
                headers['x-admin-password'] = adminPassword;
            } else {
                const token = localStorage.getItem('token');
                if (token) {
                    headers['x-auth-token'] = token;
                }
            }

            await api.post('/api/notifications/subscribe', subscription, {
                headers: headers
            });

            console.log('Push Sent to Backend...');
            return true;
        } catch (err) {
            console.error('Error in subscribeUser:', err);
            return false;
        }
    } else {
        console.error('Service Workers not supported');
        return false;
    }
};
