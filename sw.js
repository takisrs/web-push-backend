self.addEventListener("install", function(){
    console.log("Instalation of service worker");
});

self.addEventListener("notificationclick", function(event){
    const notification = event.notification;
    const action = event.action;

    console.log(notification);
    console.log(action);
});