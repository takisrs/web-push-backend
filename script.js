if ('serviceWorker' in navigator){
    navigator.serviceWorker.register("/sw.js").then(function(registration){
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(){
        console.log('ServiceWorker registration failed: ', err);
    });
}

const showNotification = function (){
    if ('serviceWorker' in navigator){
        navigator.serviceWorker.getRegistration().then(function(registration){
            console.log(registration);
        });

        navigator.serviceWorker.ready.then(function(swReg){
            swReg.showNotification('Notification from Service Worker', {
                body: "Welcome to our Notification Service",
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
            });
        });
    } else {
        new Notification("Notification", {
            body: "Welcome to our Notification Service"
        });
    }
}

if ('Notification' in window){
    const enableNotificationsBtn = document.getElementById('enable-notifications');
    enableNotificationsBtn.addEventListener('click', function(event){
        event.preventDefault();
        Notification.requestPermission(function(result){
            console.log("Notification request result: ", result);
            if (result !== 'granted'){
                console.log('No Notification Permission granted');
            } else {
                showNotification();
            }
        });

    });
} else {
    const enableNotificationsBtn = document.getElementById('enable-notifications');
    enableNotificationsBtn.style.display = 'none';
}