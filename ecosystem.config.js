module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'src/index.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      error_file: './backend/logs/err.log',
      out_file: './backend/logs/out.log',
      log_file: './backend/logs/combined.log',
      time: true
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        BROWSER: 'none'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      error_file: './frontend/logs/err.log',
      out_file: './frontend/logs/out.log',
      log_file: './frontend/logs/combined.log',
      time: true
    }
  ]
};