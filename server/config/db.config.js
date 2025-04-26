module.exports = {
    dialect: "sqlite",
    storage: "./database/database.sqlite", // SQLite database file
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  