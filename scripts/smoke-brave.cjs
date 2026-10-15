#!/usr/bin/env node
'use strict';

// Install Playwright outside this static site; see README.md for the command.
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const { createServer } = require('node:http');
const path = require('node:path');
const { once } = require('node:events');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const files = {
  '/': ['index.html', 'text/html'],
  '/index.html': ['index.html', 'text/html'],
  '/config.json': ['config.json', 'application/json'],
  '/index.css': ['index.css', 'text/css'],
  '/swagger-ui.css': ['swagger-ui.css', 'text/css'],
  '/swagger-ui-bundle.js': ['swagger-ui-bundle.js', 'text/javascript'],
  '/swagger-ui-standalone-preset.js': ['swagger-ui-standalone-preset.js', 'text/javascript'],
  '/swagger-initializer.js': ['swagger-initializer.js', 'text/javascript'],
  '/oauth2-redirect.html': ['oauth2-redirect.html', 'text/html'],
  '/favicon-16x16.png': ['favicon-16x16.png', 'image/png'],
  '/favicon-32x32.png': ['favicon-32x32.png', 'image/png'],
};

/** Serve only the playground's public assets, bound to the loopback interface. */
async function serve(request, response) {
  try {
    const asset = files[new URL(request.url, 'http://localhost').pathname];
    if (!asset || !['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(404).end();
      return;
    }
    const body = await readFile(path.join(root, asset[0]));
    response.writeHead(200, { 'Content-Type': asset[1] });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    console.error(error);
    response.writeHead(500).end();
  }
}

/** Verify real spec loading and every rendered tag/operation using Brave only. */
async function main() {
  const spec = JSON.parse(await readFile(path.join(root, 'config.json'), 'utf8'));
  const methods = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']);
  const expectedOperations = [];
  const expectedTags = new Set((spec.tags || []).map(tag => tag.name));
  for (const [endpoint, item] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(item)) {
      if (!methods.has(method)) continue;
      for (const tag of operation.tags?.length ? operation.tags : ['default']) {
        expectedTags.add(tag);
        expectedOperations.push(JSON.stringify([tag, method.toUpperCase(), endpoint]));
      }
    }
  }

  const server = createServer(serve);
  let browser;
  try {
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({
      executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
      headless: true,
    });
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const blocked = [];
    const errors = [];
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === origin) return route.continue();
      blocked.push(url.href);
      return route.abort('blockedbyclient');
    });
    await context.routeWebSocket('**/*', socket => {
      blocked.push(socket.url());
      socket.close();
    });
    const page = await context.newPage();
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', error => errors.push(error.stack || error.message));
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on('response', response => {
      if (response.status() >= 400) errors.push(`${response.url()}: HTTP ${response.status()}`);
    });
    const configLoaded = page.waitForResponse(`${origin}/config.json`);
    const navigation = await page.goto(origin, { waitUntil: 'networkidle' });
    assert.equal(navigation.status(), 200);
    const configResponse = await configLoaded;
    assert.equal(configResponse.status(), 200);
    assert.deepEqual(await configResponse.json(), spec);
    await page.waitForFunction(() => window.ui?.specSelectors.specJson().get('paths')?.size > 0);
    await page.locator('.opblock').last().waitFor();

    const rendered = await page.locator('.opblock-tag-section').evaluateAll(sections =>
      sections.map(section => ({
        tag: section.querySelector('.opblock-tag').getAttribute('data-tag'),
        operations: Array.from(section.querySelectorAll('.opblock'), block => [
          block.querySelector('.opblock-summary-method').textContent.trim(),
          block.querySelector('.opblock-summary-path').getAttribute('data-path'),
        ]),
      }))
    );
    assert.deepEqual(rendered.map(section => section.tag).sort(), [...expectedTags].sort());
    assert.deepEqual(rendered.flatMap(section => section.operations.map(operation =>
      JSON.stringify([section.tag, ...operation]))).sort(), expectedOperations.sort());
    for (const button of await page.locator('.opblock-summary-control').all()) await button.click();
    assert.equal(await page.locator('.opblock.is-open').count(), expectedOperations.length);
    assert.equal(await page.locator('.opblock.is-open .opblock-body').count(), expectedOperations.length);
    await page.waitForLoadState('networkidle');
    assert.deepEqual(blocked, [], `Unexpected non-local requests: ${blocked.join(', ')}`);
    assert.deepEqual(errors, [], `Browser errors: ${errors.join('\n')}`);
    console.log(`PASS: config.json loaded; ${expectedTags.size} tags and ${expectedOperations.length} operations rendered and expanded; no browser errors or non-local requests.`);
  } finally {
    try {
      if (browser) await browser.close();
    } finally {
      if (server.listening) {
        await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
      }
    }
  }
}

main().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
