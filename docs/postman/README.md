# Mercur Postman Assets

Import these two files into Postman:

- `mercur-store-api.postman_collection.json`
- `mercur-local.postman_environment.json`

Use the `Carrefour B2B - Mercur Local` environment.

## Recommended Run Order

1. `Health / API Health`
2. `Catalog / List Regions`
3. `Catalog / List Products`
4. `Catalog / Retrieve Product`
5. `Cart / Create Cart`
6. `Cart / Retrieve Cart`
7. `Cart / Add Line Item`

`List Products` stores `product_id`, `variant_id`, and `offer_id` in the environment.
`Create Cart` stores `cart_id`.
`Add Line Item` stores `line_item_id`.

## Notes

- Postman should call Mercur/Medusa APIs, not Postgres directly.
- Store API requests require `x-publishable-api-key`.
- Product prices require `region_id` so Mercur can calculate offer prices.
- Mercur cart line items require `offer_id`, not `variant_id`.
