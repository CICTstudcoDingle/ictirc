# ☁️ Cloudflare R2 Configuration Guide

To ensure the "meticulous" setup of your cold storage for archival research guides, please follow these configuration steps in your Cloudflare Dashboard.

## 1. CORS Policy (Critical for Uploads)
Since we are uploading guides directly from the Admin Dashboard, Cloudflare needs to allow requests from your domains.

1. Go to **R2 > Buckets > ictirc**.
2. Click the **Settings** tab.
3. Scroll down to **CORS Policy**.
4. Click **Add CORS Policy** and paste the following:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://ictirc-admin.vercel.app",
      "https://ictirc-web.vercel.app"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "OPTIONS"
    ],
    "AllowedHeaders": [
      "Content-Type",
      "Authorization"
    ],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3600
  }
]
```

## 2. Public Bucket URL
Your image showed `pub-d1706...r2.dev` is not resolving. 

> [!TIP]
> **Check Propagation:** If you just enabled Public Access, it can take up to 10 minutes for the `.r2.dev` subdomain to propagate across global DNS.
> **Custom Domain:** For a more "Premium" look, we recommend connecting a custom subdomain (e.g., `cdn.ictirc.me`) in the **Public Access** section of the bucket settings.

## 3. Environment Variables
Ensure your `.env.local` in `apps/admin` (and eventually production) has these correctly mapped:

```bash
# R2 Configuration
R2_ACCOUNT_ID=adca332a0dbb1a307c5037c4efc12db1
R2_ACCESS_KEY_ID=532664f8dc6d4fa29b59939de6d4be96
R2_SECRET_ACCESS_KEY=... # Your secret key
R2_BUCKET_NAME_COLD=ictirc
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-d1706b79feb04ae08bfae9f4a9fdaaa8.r2.dev
```

## 4. Next Steps
Once you've applied the CORS policy:
1. I will implement the **S3 Utility** in the admin app.
2. I will update the **FileUpload** component to use R2 for guides.
3. We will test the **CRUD** by uploading your first production-ready PDF.
