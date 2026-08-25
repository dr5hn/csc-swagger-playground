# Country State City API — Playground

Interactive API documentation for the [Country State City API](https://countrystatecity.in).

**Live:** [playground.countrystatecity.in](https://playground.countrystatecity.in)

## What this is

A static [Swagger UI](https://swagger.io/tools/swagger-ui/) deployment hosted on GitHub Pages. The OpenAPI 3.0 spec lives in `config.json` and documents all geographic data endpoints, data access levels, and error responses.

## Endpoints

See the [live playground](https://playground.countrystatecity.in) for full endpoint documentation, request/response schemas, and tier availability.

## Pricing & Limits

Current tiers, limits, and data access levels are always available at:

**[countrystatecity.in/pricing](https://countrystatecity.in/pricing)**

## Local Development

No build step required. Open `index.html` in a browser or serve with any static file server:

```bash
npx serve .
```

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
