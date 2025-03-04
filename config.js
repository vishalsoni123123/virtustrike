// Configuration for both development and production
const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || '0.0.0.0',
  },

  // Database configuration
  database: {
    // Set USE_MYSQL=true in your environment to use MySQL
    useMySQL: process.env.USE_MYSQL === 'true',
    mysql: {
      host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
      user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
      password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
      database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'game_booking',
      connectionLimit: 10
    }
  },

  // Static file serving
  static: {
    // Path to static files (relative to project root)
    path: './dist/public'
  },

  // Environment
  isDevelopment: process.env.NODE_ENV !== 'production'
};

export default config;