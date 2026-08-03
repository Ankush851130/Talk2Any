const test = require('node:test');
const assert = require('node:assert');

test('Email Address Username Extraction Logic', () => {
  const email1 = 'alex.smith@gmail.com';
  const username1 = email1.split('@')[0].trim();
  assert.strictEqual(username1, 'alex.smith');

  const email2 = 'john_doe99@example.org';
  const username2 = email2.split('@')[0].trim();
  assert.strictEqual(username2, 'john_doe99');

  const email3 = 'simpleuser@domain.co';
  const username3 = email3.split('@')[0].trim();
  assert.strictEqual(username3, 'simpleuser');
});
