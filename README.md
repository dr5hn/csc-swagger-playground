# Country State City API — Playground

Interactive API documentation for the [Country State City API](https://countrystatecity.in).

**Live:** [playground.countrystatecity.in](https://playground.countrystatecity.in)

## What this is

A static [Swagger UI](https://swagger.io/tools/swagger-ui/) deployment hosted on GitHub Pages. The OpenAPI 3.0 spec lives in `config.json` and documents all geographic data endpoints, data access levels, and error responses.

Vendored **swagger-ui-dist 5.34.0**, from the [official npm tarball](https://registry.npmjs.org/swagger-ui-dist/-/swagger-ui-dist-5.34.0.tgz). Its SHA-512 was verified against the registry's `dist.integrity`:

```text
sha512-H6tAIjr3XqE31PbkZl0OFya1ziRLDfTwh3J6OHdumPtPCLfjTnyLeagl/55kFNZcTOz9a9QI9WP0FXldwiGJag==
```

Only the browser bundles used by `index.html`, their source maps, the stylesheet, and licence notices are retained. Keep those files from the same release when updating. Preserve the local initializer, HTML, CSS, OpenAPI spec, and OAuth redirect page. The external Swagger validator is disabled; CI validates the spec with Redocly CLI on Node 26.

## Endpoints

See the [live playground](https://playground.countrystatecity.in) for full endpoint documentation, request/response schemas, and tier availability.

## Pricing & Limits

Current tiers, limits, and data access levels are always available at:

**[countrystatecity.in/pricing](https://countrystatecity.in/pricing)**

## Local Development

No build step required. Serve the folder over HTTP so Swagger UI can fetch `config.json`:

```bash
npx serve .
```

CI runs the JSON, OpenAPI, internal-reference, and unique-operation-ID checks in `.github/workflows/ci.yml` on Node 26. There is no package manifest or build to install.

To smoke-test in **Brave Browser** with Playwright, install the test tool in a temporary folder (no browser download or repository dependencies):

```bash
export PATH='/Users/darshan/Library/Application Support/fnm/node-versions/v26.12.0/installation/bin':"$PATH"
test_tools=$(mktemp -d)
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --prefix "$test_tools" --cache "$test_tools/npm-cache" --no-save --package-lock=false --prefer-online playwright@1.64.1
NODE_PATH="$test_tools/node_modules" node scripts/smoke-brave.cjs
```

The script serves this folder on an ephemeral localhost port, launches `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser`, and blocks all network requests outside that localhost origin. It verifies the fetched spec, every tag and operation, expanded operation content, and absence of console errors. For every operation it clicks **Try it out**, fills the spec's parameter examples/defaults, and checks the generated method, path, query and displayed request URL. API fetches receive an in-memory response before reaching the network; no API credentials or real API calls are used. It exits unsuccessfully on a browser launch error and always closes its server.

## Updating the Spec

Edit `config.json` directly. It's a standard [OpenAPI 3.0.3](https://spec.openapis.org/oas/v3.0.3) document. Push to `main` and GitHub Pages deploys automatically.

When updating, keep in sync with:
- **Routes:** `csc-app/api/src/routes/world.routes.ts`
- **Tier config:** `csc-app/api/src/config/pricingTiers.ts`
- **Field access:** `csc-app/api/src/services/dataAccessService.ts`

## Links

- **Pricing:** [countrystatecity.in/pricing](https://countrystatecity.in/pricing)
- **API Dashboard:** [app.countrystatecity.in](https://app.countrystatecity.in)
- **Main API:** [api.countrystatecity.in/v1](https://api.countrystatecity.in/v1)
- **Database repo:** [github.com/dr5hn/countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database)
