
# Game Booking System

This is a web application for booking games built with Express.js and React.

## Project Structure

```
├── client/             # React frontend
│   ├── src/            # Frontend source code
│   └── index.html      # HTML entry point
├── server/             # Express.js backend
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data storage interface
│   ├── mysql-storage.ts # MySQL implementation
│   └── vite.ts         # Vite server integration
├── shared/             # Shared code between client and server
│   └── schema.ts       # Database schema
└── config.js           # Configuration
```

## Local Development Setup

### Prerequisites

- Node.js (v14 or later)
- MySQL server (optional)
- Apache server (optional)

### Setup Instructions

1. Clone the repository to your local machine

2. Install dependencies:
   ```
   npm install
   ```

3. Configure MySQL (optional):
   - Create a database named 'game_booking'
   - Set environment variables:
     ```
     USE_MYSQL=true
     MYSQL_HOST=localhost
     MYSQL_USER=root
     MYSQL_PASSWORD=yourpassword
     MYSQL_DATABASE=game_booking
     ```

4. Run setup script:
   ```
   node setup.js
   ```

5. Run the development server:
   ```
   npm run dev
   ```

6. For Apache integration:
   - Copy the apache-config.conf file to your Apache configuration directory
   - Update the paths in the config file to match your local setup
   - Enable required Apache modules:
     ```
     sudo a2enmod proxy proxy_http headers rewrite
     ```
   - Add an entry to your hosts file:
     ```
     127.0.0.1 game-booking.local
     ```
   - Restart Apache:
     ```
     sudo service apache2 restart
     ```

7. Access the application:
   - Development: http://localhost:5000
   - Apache: http://game-booking.local

## Building for Production

Build the project with:

```
npm run build
```

The production files will be in the `dist` directory.

## Environment Variables

- `NODE_ENV`: Set to 'production' for production mode
- `PORT`: Server port (default: 5000)
- `USE_MYSQL`: Set to 'true' to use MySQL instead of in-memory storage
- `MYSQL_HOST`: MySQL host
- `MYSQL_USER`: MySQL username
- `MYSQL_PASSWORD`: MySQL password
- `MYSQL_DATABASE`: MySQL database name
