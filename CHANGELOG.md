# Changelog

## [2.4.0] - 2026-09-18

### Added
- Postcodes: `GET /countries/{ciso}/postcodes` (list and search, Supporter+) and `GET /countries/{ciso}/postcodes/{code}` (exact lookup, all tiers), with `Postcode`, `PostcodeLookupResponse` and `PostcodeListResponse` schemas
- Meta: `GET /meta/data-version` with `DataVersion` schema
- Cities: `kind` and `type` query filters on both city list endpoints, and the `kind` field on the `City` schema
- `StatusError` schema for the `status`/`message`/`details` error envelope

### Fixed
- Currency list path corrected from `/currencies` to `/currency`, matching the live API (the old path returned `404`)
- `IsoConvert` response field renamed from `value` to `input`, matching the live API response. The `value` **query parameter** is unchanged

## [2.2.0] - 2026-04-03

### Added
- Inline search filtering (`?q=`) parameter on all list endpoints (Supporter+)
- Regions API: 5 new endpoints for geographic regions and subregions (Supporter+)
- Region and Subregion schemas

## [2.1.0] - 2026-03-28

### Added
- Initial OpenAPI 3.0.3 specification
- 7 geographic endpoints (countries, states, cities)
- Tier-based data access documentation
- Rate limiting and feature gating documentation
