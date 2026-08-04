// PM2 进程配置 —— 阿里云轻量服务器生产部署
// 用法：pm2 start ecosystem.config.cjs（或由 deploy.sh 自动 reload）
//
// 说明：
// - 用 `pnpm start`（即 next start）而非 standalone，避免 sharp/静态资源拷坑，最省事
// - cwd 指向项目根，next start 会自动加载根目录的 .env.production（NODE_ENV=production）
// - PORT/HOSTNAME 由 PM2 注入，Nginx 反代 127.0.0.1:3000
module.exports = {
  apps: [
    {
      name: 'meteor-store',
      script: 'pnpm',
      args: 'start',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      // 2G 机器：进程内存上限压低到 1G，避免和系统/nginx 抢内存；超限自动重启
      max_memory_restart: '1024M',
      out_file: '/var/log/meteor-store/pm2-out.log',
      error_file: '/var/log/meteor-store/pm2-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      autorestart: true,
    },
  ],
};