module.exports = {

    server: {
        port: process.env.PORT || 3000,
    },

    upload: {
        maxsize: process.env.UPLOAD_MAXSIZE || 4
    },

    mongodb: {
        host: process.env.MONGODB_HOST || "cluster0-0ednp.mongodb.net",
        user: process.env.MONGODB_USER || "user",
        password: process.env.MONGODB_PASSWORD || "pass",
        database: process.env.MONGODB_DATABASE || "push-notifications"
    },

    jwt: {
        secret: process.env.JWT_TOKEN_SECRET || "nodejswebnotifications",
        expires: "1h"
    },

    smtp: {
        host: process.env.SMTP_HOST || "",
        port: process.env.SMTP_PORT || 25,
        user: process.env.SMTP_USER || "",
        password: process.env.SMTP_PASSWORD || "",
        from: "Panos Pantazopoulos <takispadaz@gmail.com>"
    },

    webpush: {
        timeout: 5000, // 5 sec
        ttl: 60*60*24*4, // 4 days
        encoding: "aes128gcm"
    },

    localization: {
        locales: ['en', 'el'],
        default: 'en'
    }

};