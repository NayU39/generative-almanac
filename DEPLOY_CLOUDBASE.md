# CloudBase Parallel Deployment

This project keeps the existing Vercel deployment intact and adds a separate CloudBase deployment path for the static site and the receipt generation API.

## What Stays Unchanged

- Vercel continues to use `api/receipt-almanac/generate.js`
- The default frontend API path remains `/api/receipt-almanac/generate`
- Existing package scripts, UI, page structure, and response data shape stay unchanged
- No CloudBase Web SDK is introduced

## CloudBase Deployment Model

- Static frontend: deploy `dist/` to CloudBase Static Hosting
- Backend API: deploy `cloudbase/functions/receipt-generate/` as an HTTP cloud function
- CI/CD for static hosting: GitHub Actions + CloudBase CLI
- Do not use the older visual GitHub import flow

Official references:

- CloudBase CI/CD for static hosting: [docs.cloudbase.net/hosting/cli-devops](https://docs.cloudbase.net/hosting/cli-devops)
- Cloud function HTTP access: [docs.cloudbase.net/en/service/access-cloud-function](https://docs.cloudbase.net/en/service/access-cloud-function)
- Cloud function environment variables: [docs.cloudbase.net/en/cloud-function/how-coding](https://docs.cloudbase.net/en/cloud-function/how-coding)

## GitHub Secrets

Configure these repository secrets in GitHub Actions:

- `TCB_SECRET_ID`
- `TCB_SECRET_KEY`
- `TCB_ENV_ID`

The workflow file is [deploy-cloudbase.yml](E:\receipt-almanac\.github\workflows\deploy-cloudbase.yml).

## Static Hosting Deployment

CloudBase static hosting is deployed by GitHub Actions and does not affect Vercel.

Workflow behavior:

- Manual trigger only via `workflow_dispatch`
- Runs `npm ci`
- Runs `npm run build`
- Installs `@cloudbase/cli`
- Logs in with GitHub Secrets
- Deploys `./dist` to `/`

Manual equivalent:

```bash
npm ci
npm run build
npm install -g @cloudbase/cli
tcb login --apiKeyId <SecretId> --apiKey <SecretKey>
tcb hosting deploy ./dist / -e <envId>
```

## Cloud Function Deployment

CloudBase function source lives in [cloudbase/functions/receipt-generate/index.js](E:\receipt-almanac\cloudbase\functions\receipt-generate\index.js).

CloudBase CLI config lives in [cloudbase/cloudbaserc.json](E:\receipt-almanac\cloudbase\cloudbaserc.json).

The CloudBase HTTP function directory also includes:

- `package.json`
- `package-lock.json`
- `scf_bootstrap`

`scf_bootstrap` is required by CloudBase HTTP functions. It starts `@cloudbase/functions-framework`, which loads `exports.main` from `index.js` and serves HTTP traffic on port `9000`.

Deploy the function manually:

```bash
npm install -g @cloudbase/cli
tcb login --apiKeyId <SecretId> --apiKey <SecretKey>
tcb fn deploy receipt-generate --config-file cloudbase/cloudbaserc.json -e <envId> --path /api/receipt-almanac/generate --yes
```

If you need to update function environment variables from CLI, prefer merge mode so existing values are not overwritten:

```bash
tcb config update fn receipt-generate --config-file cloudbase/cloudbaserc.json -e <envId> --env DEEPSEEK_API_KEY=your_key --env DEEPSEEK_MODEL=deepseek-v4-flash --env-mode merge --yes
```

## Function Environment Variables

Configure these on the CloudBase function:

- `DEEPSEEK_API_KEY`
- `DEEPSEEK_MODEL`

The function reads them from `process.env`. Do not commit real values to:

- frontend source
- `.env.production`
- `dist`
- repository files

If `DEEPSEEK_API_KEY` is missing, or if the DeepSeek request fails, the function keeps the mock fallback behavior so the app still works for demo purposes.

## Frontend API Base URL

The frontend still defaults to Vercel-style same-origin API calls:

- default request target: `/api/receipt-almanac/generate`

To make a CloudBase build call the CloudBase function instead, set:

```bash
VITE_API_BASE_URL=https://<your-cloudbase-http-domain>
```

The app will then request:

```text
https://<your-cloudbase-http-domain>/api/receipt-almanac/generate
```

Keep the base URL at the domain root. Do not append `/api/receipt-almanac/generate` to `VITE_API_BASE_URL`.

## SPA Fallback

To avoid refresh 404s on the CloudBase static site, configure the static hosting error page to point to `index.html` in the CloudBase console.

## How To Test

### Verify Vercel Path

Do not set `VITE_API_BASE_URL`.

Expected result:

- frontend still requests `/api/receipt-almanac/generate`
- Vercel deployment behavior is unchanged

### Verify CloudBase Path

Build or run with:

```bash
VITE_API_BASE_URL=https://<your-cloudbase-http-domain>
```

Expected result:

- frontend requests CloudBase at `/api/receipt-almanac/generate`
- response still matches the existing `receipt/source/warning` shape

### Verify CloudBase Function

Check these cases:

- `POST` with valid environment variables returns AI content
- missing `DEEPSEEK_API_KEY` returns mock fallback
- DeepSeek failure returns mock fallback
- `GET` returns `405`

## Why This Does Not Affect Vercel

- existing Vercel API file is untouched
- no Vercel files are deleted or moved
- package scripts are unchanged
- CloudBase code is isolated under `cloudbase/`
- CloudBase CI is isolated in its own GitHub Actions workflow
- frontend only switches to CloudBase when `VITE_API_BASE_URL` is explicitly provided
