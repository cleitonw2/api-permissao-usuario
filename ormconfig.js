require("dotenv").config();

module.exports = {
    type: "postgres",
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "migrations": ["./src/config/database/migrations/**.ts"],
    "entities": ["./src/models/**.ts"],
    "logging": false,
    "cli": {
        "migrationsDir": "./src/config/database/migrations"
    }
}