module.exports = {
  apps: [{
    name: 'shopsmart-api',
    script: 'app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      SERVER_NAME: 'local-dev'
    },
    env_production: {
      NODE_ENV: 'production',
      SERVER_NAME: process.env.SERVER_NAME || 'production-server'
    },
    error_file: '/var/log/shopsmart/err.log',
    out_file: '/var/log/shopsmart/out.log',
    log_file: '/var/log/shopsmart/combined.log',
    time: true,
    merge_logs: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    autorestart: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    kill_timeout: 5000,
    listen_timeout: 3000
  }]
};
