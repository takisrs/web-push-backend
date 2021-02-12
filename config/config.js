module.exports = {
    // server
    PORT: process.env.PORT || 3000,
    
    // general
    TZ: process.env.TZ || "Europe/Athens",
    UPLOAD_MAXSIZE: process.env.UPLOAD_MAXSIZE || 4,

    // mongodb
    MONGODB_HOST: process.env.MONGODB_HOST || "cluster0-0ednp.mongodb.net",
    MONGODB_USER: process.env.MONGODB_USER || "user",
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD || "pass",
    MONGODB_DATABASE: process.env.MONGODB_DATABASE || "push-notifications",

    // jwt
    JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET || "nodejswebnotifications",

    // email
    EMAIL_FROM: "takispadaz@gmail.com",
    SMTP_HOST: process.env.SMTP_HOST || "",
    SMTP_PORT: process.env.SMTP_PORT || 25,
    SMTP_USER: process.env.SMTP_USER || "",
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",

    // web push
    WEBPUSH_TIMEOUT: 5000, // 5 sec
    WEBPUSH_TTL: 60*60*24*4, // 4 days
    WEBPUSH_ENCODING: "aes128gcm",

    // localization
    AVAILABLE_LOCALES: ['en', 'el'],
    DEFAULT_LOCALE: 'en'
};