import http from 'http';
import app from './app';
import config from './config';
import { setupSocket } from './sockets';

const server = http.createServer(app);

// Setup Socket.IO
setupSocket(server);

// Start server
server.listen(config.port, () => {
  console.log(`🚀 EMS Backend running on port ${config.port}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔌 Socket.IO ready`);
});

// Keep-alive ping for Render free tier (every 14 minutes, production only)
if (config.nodeEnv === 'production') {
  const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
  setInterval(() => {
    const options = {
      hostname: 'localhost',
      port: config.port,
      path: '/api/health',
      method: 'GET',
    };
    const req = http.request(options, (res) => {
      res.resume();
    });
    req.on('error', () => {});
    req.end();
    console.log('🏓 Keep-alive ping sent');
  }, PING_INTERVAL);
}

// Graceful shutdown
const shutdown = () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
