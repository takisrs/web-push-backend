//https://github.com/web-push-libs/web-push-php

if ('serviceWorker' in navigator){
    navigator.serviceWorker.register("/sw.js").then(function(registration){
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(){
        console.log('ServiceWorker registration failed: ', err);
    });
}

const makeSubscription = function() {
    if ('serviceWorker' in navigator){
        let swRegistration;
        navigator.serviceWorker.ready.then(function(swReg){
            swRegistration = swReg;
            return swReg.pushManager.getSubscription();
        }).then(function(subscription){
            if (subscription == null){
                const vapidPublicKey = "BHIUqJSS5QsMpsejoLImn-iGeoHKvJ_MD_QvWQZsOdMoOuG7hxDeqXr8NKAUjVFSXEJkJrGKCzuNi528Ox0GSz0";
                const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

                console.log(convertedVapidKey);

                return swRegistration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey
                });
            } else {
                // already subscribed
            }
        }).then(function(subscription){
            console.log(subscription);
            fetch('https://push-subscriptions.firebaseio.com/subscriptions.json', {
                method: 'post',
                headers: {
                  'Content-type': 'application/json'
                },
                body: JSON.stringify({
                  subscription: subscription
                }),
            }).then(function(response){
                if (response.ok)
                    showNotification();
            }).catch(function(error){
                console.log(error);
            });
        });
    }
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
                makeSubscription();
                //showNotification();
            }
        });

    });
} else {
    const enableNotificationsBtn = document.getElementById('enable-notifications');
    enableNotificationsBtn.style.display = 'none';
}