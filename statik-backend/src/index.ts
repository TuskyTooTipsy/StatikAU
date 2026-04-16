import { startServer } from './server';

// Entry point for the STATIK backend.
// Starts the Express server with proper error handling.

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});