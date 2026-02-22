# Upload API (Supabase Storage)

Endpoint: `POST /api/media/upload`

Uploads an image to Supabase Storage and returns a public URL you can place into `GENIX_PREVIEW_CONFIG`.

## Requirements

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET` (default: `genix-assets`)

## Request

`multipart/form-data`

Fields:

- `file` (required): image file
- `section` (required): one of
  - `hero`
  - `trust`
  - `problem_solution`
  - `feature`
  - `security`
  - `case_study`
  - `final_cta`

Required headers:

- `Authorization: Bearer <token>` (role must resolve to `provider` or `admin`)

Optional fallback headers (when `ENABLE_HEADER_AUTH_FALLBACK=true`):

- `x-tenant-id`
- `x-user-id`
- `x-user-role` (`provider` or `admin`)

## Example curl

```bash
curl -X POST http://localhost:3000/api/media/upload \
  -F "section=feature" \
  -F "file=@/path/to/feature-image.jpg"
```

## Response

```json
{
  "bucket": "genix-assets",
  "path": "landing/feature/1700000000-uuid.jpg",
  "section": "feature",
  "publicUrl": "https://<project>.supabase.co/storage/v1/object/public/genix-assets/landing/feature/...jpg",
  "genixAssetMappingKey": "assets.section_images.feature"
}
```

## Limits

- Max size: 10MB
- Allowed MIME: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`
