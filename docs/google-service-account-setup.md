# Google Service Account Setup Guide

This guide walks you through setting up a Google Service Account for automated backups to Google Drive.

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name it `ICTIRC-Backups` (or similar)
4. Click **Create**

---

## Step 2: Enable the Google Drive API

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for **Google Drive API**
3. Click on it and press **Enable**

---

## Step 3: Create a Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in:
   - **Service account name**: `ictirc-backup-service`
   - **Service account ID**: auto-generated
   - **Description**: `Backup automation for ICTIRC`
4. Click **Create and Continue**
5. Skip the optional steps (no roles needed)
6. Click **Done**

---

## Step 4: Generate a Private Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Click **Create** — a JSON file will be downloaded

**⚠️ Keep this file secure!** It contains sensitive credentials.

---

## Step 5: Share Your Drive Folder

1. Open [Google Drive](https://drive.google.com/)
2. Create a folder for backups (e.g., `ICTIRC-Backups`)
3. Right-click the folder → **Share**
4. Add the service account email (from the JSON file, looks like: `ictirc-backup-service@your-project.iam.gserviceaccount.com`)
5. Give it **Editor** access
6. Click **Share**

---

## Step 6: Get the Folder ID

1. Open the shared folder in Google Drive
2. Look at the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
3. Copy the `FOLDER_ID_HERE` part

---

## Step 7: Configure Environment Variables

Add these to your `.env.local` file in the admin app:

```bash
# Google Drive Backup Configuration
GDRIVE_SERVICE_EMAIL=ictirc-backup-service@your-project.iam.gserviceaccount.com
GDRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GDRIVE_BACKUP_FOLDER_ID=your_folder_id_here
```

### Important Notes:

- **GDRIVE_PRIVATE_KEY**: Copy the `private_key` field from the downloaded JSON file
- The key contains `\n` characters — keep them as literal `\n` (not actual newlines)
- Wrap the entire key in double quotes

---

## Step 8: Test the Integration

1. Navigate to **Admin Dashboard** → **Settings** → **Backup**
2. Check "Also upload to Google Drive"
3. Click **Create Backup Now**
4. Verify the backup appears in your Google Drive folder

---

## Security Best Practices

| Practice | Description |
|----------|-------------|
| **Never commit credentials** | Add `.env.local` to `.gitignore` |
| **Limit scope** | Only grant the service account access to the backup folder |
| **Rotate keys** | Regenerate the private key periodically |
| **Monitor access** | Check Google Cloud audit logs for unusual activity |

---

## Troubleshooting

### "Permission denied" error
- Ensure the folder is shared with the service account email
- Verify the service account has **Editor** (not Viewer) access

### "API not enabled" error
- Go to Google Cloud Console → APIs & Services → Library
- Enable the Google Drive API

### "Invalid key" error
- Make sure the private key includes the full `-----BEGIN PRIVATE KEY-----` header
- Check that `\n` characters are preserved (not converted to actual newlines)

---

## Environment Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `GDRIVE_SERVICE_EMAIL` | Service account email | `name@project.iam.gserviceaccount.com` |
| `GDRIVE_PRIVATE_KEY` | Private key from JSON | `-----BEGIN PRIVATE KEY-----...` |
| `GDRIVE_BACKUP_FOLDER_ID` | Google Drive folder ID | `1A2b3C4d5E6f7G8h9I0j` |
