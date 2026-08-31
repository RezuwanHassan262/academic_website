#!/usr/bin/env node
/**
 * serve.js
 *
 * Serves the repo root over HTTP for local preview of `webpages/`.
 *
 * `http-server` exits with EADDRINUSE when the port is taken — which happens
 * often, because a previous preview is usually still running in another
 * terminal. This wrapper probes for the first free port instead of crashing.
 *
 * Usage:  node scripts/serve.js [--port 8080] [--no-open]
 */

'use strict';

const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const LANDING = 'webpages/index.html';
const PORTS_TO_TRY = 12;

const args = process.argv.slice(2);
const portFlag = args.indexOf('--port');
const startPort = portFlag !== -1 ? Number(args[portFlag + 1]) : 8080;
const shouldOpen = !args.includes('--no-open');

function isFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => server.close(() => resolve(true)));
    server.listen(port, '0.0.0.0');
  });
}

async function findPort(from) {
  for (let port = from; port < from + PORTS_TO_TRY; port++) {
    if (await isFree(port)) return port;
    console.log(`  port ${port} is busy, trying ${port + 1}...`);
  }
  return null;
}

(async () => {
  const port = await findPort(startPort);

  if (port === null) {
    console.error(
      `\nNo free port found in ${startPort}-${startPort + PORTS_TO_TRY - 1}.\n` +
      `Stop whatever is holding them, or pass one explicitly:\n` +
      `  npm run serve -- --port 9000\n`
    );
    process.exit(1);
  }

  const url = `http://127.0.0.1:${port}/${LANDING}`;
  if (port !== startPort) {
    console.log(`\nPort ${startPort} was in use — serving on ${port} instead.`);
  }
  console.log(`\n  Local preview: ${url}\n  Press Ctrl+C to stop.\n`);

  // -c-1 disables caching so a rebuild shows up on a plain refresh
  const serverArgs = ['.', '-p', String(port), '-c-1', '--silent'];
  if (shouldOpen) serverArgs.push('-o', LANDING);

  const bin = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const child = spawn(bin, ['http-server', ...serverArgs], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  const shutdown = () => { child.kill(); process.exit(0); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  child.on('exit', (code) => process.exit(code ?? 0));
})();
