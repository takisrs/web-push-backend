/* eslint-disable no-undef */
self.addEventListener('install', (event) => {
  console.log('Installation of service worker was successfull', event);
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification Clicked!');
  const { notification } = event;
  const { action } = event;

  if (action !== 'cancel') {
    const { data } = notification;
    if (data.url !== undefined) {
      event.waitUntil(
        clients.matchAll().then((allClients) => {
          const client = allClients.find(
            (cl) => (cl.visibilityState = 'visible')
          );

          if (client) {
            client.navigate(notification.data.url);
            client.focus();
          } else {
            clients.openWindow(notification.data.url);
          }
        })
      );
    }
    notification.close();
  } else {
    notification.close();
  }
});

self.addEventListener('notificationclose', (_event) => {
  console.log('Notification close action');
});

self.addEventListener('push', (event) => {
  console.log('push notification received', event);

  if (event.data) {
    const notificationData = JSON.parse(event.data.text());
    const {
      message,
      icon,
      image,
      dir,
      lang,
      vibrate,
      silent,
      badge,
      tag,
      renotify,
      actions,
      data,
    } = notificationData;

    const notificationConfig = {
      body: message,
      icon,
      image,
      dir,
      lang,
      vibrate,
      silent,
      badge,
      tag,
      renotify,
      actions,
      data,
    };

    event.waitUntil(
      self.registration.showNotification(data.title, notificationConfig)
    );
  }
});
