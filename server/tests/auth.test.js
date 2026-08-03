const test = require('node:test');
const assert = require('node:assert');
const { generateTokens } = require('../utils/generateTokens');

test('JWT Token Generation Utility', () => {
  const userId = '654321654321654321654321';
  const { accessToken, refreshToken } = generateTokens(userId);

  assert.ok(accessToken, 'Access token should be generated');
  assert.ok(refreshToken, 'Refresh token should be generated');
  assert.strictEqual(typeof accessToken, 'string');
  assert.strictEqual(typeof refreshToken, 'string');
});

test('AppError utility instantiation', () => {
  const AppError = require('../utils/appError');
  const err = new AppError('Unauthorized access', 401);

  assert.strictEqual(err.statusCode, 401);
  assert.strictEqual(err.status, 'fail');
  assert.strictEqual(err.message, 'Unauthorized access');
});
