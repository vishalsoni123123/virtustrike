
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Create necessary directories
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Check MySQL connection
const checkMySQLConnection = () => {
  const mysql = require('mysql2');
  const config = require('./config');
  
  const connection = mysql.createConnection({
    host: config.database.mysql.host,
    user: config.database.mysql.user,
    password: config.database.mysql.password
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('❌ Error connecting to MySQL:', err.message);
      return;
    }
    
    console.log('✅ MySQL connection successful');
    
    // Create database if it doesn't exist
    connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database.mysql.database}`, (err) => {
      if (err) {
        console.error(`❌ Error creating database ${config.database.mysql.database}:`, err.message);
      } else {
        console.log(`✅ Database ${config.database.mysql.database} is ready`);
      }
      connection.end();
    });
  });
};

// Build project
const buildProject = () => {
  console.log('🔨 Building project...');
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Build error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Build stderr: ${stderr}`);
    }
    console.log(`✅ Build output: ${stdout}`);
    console.log('✅ Project built successfully!');
  });
};

// Main function
const setup = () => {
  console.log('🚀 Setting up project...');
  
  // Ensure directories exist
  ensureDir(path.join(__dirname, 'dist'));
  
  // Install dependencies if needed
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('📦 Installing dependencies...');
    exec('npm install', (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ npm install error: ${error.message}`);
        return;
      }
      
      console.log('✅ Dependencies installed');
      checkMySQLConnection();
      buildProject();
    });
  } else {
    checkMySQLConnection();
    buildProject();
  }
};

// Run setup
setup();
