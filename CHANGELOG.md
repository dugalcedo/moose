# Changelog

## [0.2.0] - 2026-04-20

### Added

- Drizzle ORM errors are now automatically caught and handled in `defineHandler`. No configuration required.
- Unique constraint violations (duplicate key) are detected from the raw driver error across PostgreSQL, MySQL, and SQLite. They return 409 with a message like `"username is already taken"`, extracting the column name from the driver's error detail.
- `TransactionRollbackError` returns 500 with `"Transaction rolled back"`.
- Other `DrizzleQueryError`s return 500 with `"Database query failed"` (query and params are not exposed to the client).

## [0.1.0] - 2026-03-01

Initial release.
