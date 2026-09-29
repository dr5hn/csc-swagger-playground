# Changelog

## [2.4.1] - 2026-09-29

### Fixed
- Tier-gating text synced to the September 2026 pricing realignment: search, field selection, sorting, global states, country cities, regions, phone, currency and postcode listing are Starter+; translations, localized names and fuzzy/autocomplete/nearby search are Supporter+; the data change feed is Professional+
- City `type` filter documented as Supporter+ (it is an extended field), and the country `sort` example uses fields a Starter plan returns
- The shared feature-denied `403` (`FeatureRestricted`/`FeatureError`) now shows the real `status`/`message`/`details` envelope with `feature`, `currentTier`, `requiredTier` and `upgradeUrl`
- Fuzzy search, autocomplete and nearby search have their own `403` examples (Supporter+) instead of the shared Starter one
- City `kind`/`type` filter `400`s document the `status`/`message` body the API returns, and the `City` schema lists `kind` among the Basic fields

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
