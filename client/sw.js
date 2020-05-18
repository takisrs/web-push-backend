self.addEventListener("install", function(){
    console.log("Instalation of service worker");
});

self.addEventListener("notificationclick", function(event){
    const notification = event.notification;
    const action = event.action;

    console.log(notification);
    console.log(action);
    if (action == 'confirm'){
        notification.close();
    }
});

self.addEventListener("notificationclose", function(event){
    console.log('Notification close action');
});

self.addEventListener("push", function(event){
    console.log("push notification received", event);

    var data = {title: "Notification", message: "Hello!" };
    if (event.data){
        data = JSON.parse(event.data.text());
    }

    const notificationConfig = {
        body: data.message,
        icon: "/images/icon.png",
        image: "/images/image.jpg",
        dir: "ltr",
        lang: "el-GR",
        vibrate: [100, 20, 100],
        badge: "/images/icon.png",
        tag: "welcome-notification",
        renotify: true,
        actions: [
            {
                action: "confirm",
                title: "ok",
                icon: "/images/icon.png"
            },
            {
                action: "cancel",
                title: "cancel",
                icon: "/images/icon.png"
            },
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, notificationConfig)
    );
});