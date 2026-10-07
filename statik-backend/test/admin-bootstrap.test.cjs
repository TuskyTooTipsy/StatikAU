const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const backendRoot = path.resolve(__dirname, '..');

test('public registration never grants administrator access', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'statik-registration-'));
  process.env.NODE_ENV = 'test';
  process.env.UPLOADS_DIR = path.join(tempRoot, 'uploads');
  delete process.env.ADMIN_EMAIL;
  delete process.env.ADMIN_PASSWORD;

  require('ts-node/register');
  const { createApp } = require('../src/server');
  const server = createApp().listen(0, '127.0.0.1');

  try {
    await new Promise((resolve, reject) => {
      server.once('listening', resolve);
      server.once('error', reject);
    });

    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'first.member@example.test',
        password: 'test-password-123',
        displayName: 'First Member',
        termsAccepted: true,
      }),
    });
    const payload = await response.json();

    assert.equal(response.status, 201);
    assert.equal(payload.user.role, 'user');
    assert.equal(Object.hasOwn(payload, 'foundingAdmin'), false);

    const adminResponse = await fetch(`http://127.0.0.1:${address.port}/api/admin/overview`, {
      headers: { authorization: `Bearer ${payload.token}` },
    });
    assert.equal(adminResponse.status, 403);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('production startup fails when no administrator or bootstrap credentials exist', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'statik-production-bootstrap-'));
  const childEnv = {
    ...process.env,
    NODE_ENV: 'production',
    UPLOADS_DIR: path.join(tempRoot, 'uploads'),
    UPLOAD_SIGNING_SECRET: 'test-upload-signing-secret-with-32-chars',
  };
  delete childEnv.ADMIN_EMAIL;
  delete childEnv.ADMIN_PASSWORD;

  const childScript = `
    require('ts-node/register');
    try {
      require('./src/lib/bootstrap').ensureBootstrapAdmin();
      process.exit(2);
    } catch (error) {
      if (/No production administrator exists/.test(error.message)) process.exit(0);
      console.error(error);
      process.exit(1);
    }
  `;

  try {
    const result = spawnSync(process.execPath, ['-e', childScript], {
      cwd: backendRoot,
      env: childEnv,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('production startup fails when upload signing secret is missing', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'statik-production-upload-secret-'));
  const childEnv = {
    ...process.env,
    NODE_ENV: 'production',
    UPLOADS_DIR: path.join(tempRoot, 'uploads'),
    ADMIN_EMAIL: 'admin@example.test',
    ADMIN_PASSWORD: 'test-admin-password',
  };
  delete childEnv.UPLOAD_SIGNING_SECRET;

  const childScript = `
    require('ts-node/register');
    try {
      require('./src/lib/bootstrap').ensureBootstrapAdmin();
      process.exit(2);
    } catch (error) {
      if (/UPLOAD_SIGNING_SECRET must be set/.test(error.message)) process.exit(0);
      console.error(error);
      process.exit(1);
    }
  `;

  try {
    const result = spawnSync(process.execPath, ['-e', childScript], {
      cwd: backendRoot,
      env: childEnv,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
