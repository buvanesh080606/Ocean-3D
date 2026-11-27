# Deploying OceanTwin 3D (Vercel + Render + UptimeRobot)

This guide deploys:
- **Backend (FastAPI + XGBoost + NetCDF):** Render (Free Web Service)
- **Frontend (Next.js 14 + CesiumJS):** Vercel (Free Hobby Plan)
- **Keep-Alive Ping:** UptimeRobot (pings `/api/health` every 5 minutes so the Render backend stays awake)

---

## Step 1: Push Deployment Files to GitHub

Make sure these files are committed to the root of your GitHub repo (`buvanesh080606/Ocean-3D`):
- `requirements.txt`
- `render.yaml`
- `DEPLOY.md` (optional)

> If you don't have Git installed locally, open your repo on GitHub → **Add file → Upload files** and drag `requirements.txt` and `render.yaml` into the root folder, then click **Commit changes**.

---

## Step 2: Deploy the Backend on Render

1. Go to [https://dashboard.render.com](https://dashboard.render.com) and sign in with GitHub.
2. Click **New + → Blueprint**.
3. Connect and select your **`Ocean-3D`** repository.
4. Render will automatically detect `render.yaml` (`oceantwin-backend`).
5. When prompted for environment variables:
   - `GROQ_API_KEY`: your Groq API key from [https://console.groq.com/keys](https://console.groq.com/keys) (optional, only needed for AI insights).
   - `ALLOWED_ORIGINS`: leave as `http://localhost:3000` for now (you will update this with your Vercel URL in Step 4).
6. Click **Apply** and wait for the build to finish.
7. Copy your live backend URL (e.g. `https://oceantwin-backend.onrender.com`).
8. Verify it works by opening `https://oceantwin-backend.onrender.com/api/health` — it should return `{"status": "ok", ...}`.

> **Note on Render Free Tier RAM (512 MB):** Because the backend loads XGBoost, pandas, and NetCDF datasets, if you ever see an Out-of-Memory (`OOM`) restart in Render logs, either upgrade the Render backend to Starter (\$7/mo) or host the backend on **Hugging Face Spaces** (free 16 GB RAM Docker Space).

---

## Step 3: Deploy the Frontend on Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import your **`Ocean-3D`** repository.
3. Configure the project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** Click **Edit** and select **`frontend`**
   - **Build Command:** `npm run build` (default — automatically runs `copy-cesium && next build`)
4. Expand **Environment Variables** and add:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://oceantwin-backend.onrender.com` *(your Render backend URL from Step 2, with NO trailing slash)*
5. Click **Deploy**.
6. Once deployed, copy your live frontend URL (e.g. `https://ocean-3-d.vercel.app`).

---

## Step 4: Connect CORS on Render

1. Go back to your **`oceantwin-backend`** service in the Render dashboard.
2. Open **Environment**.
3. Update **`ALLOWED_ORIGINS`** to your Vercel URL (no trailing slash), e.g.:
   ```text
   https://ocean-3-d.vercel.app,http://localhost:3000
   ```
4. Click **Save Changes** (Render will automatically restart the backend with the new CORS setting).
5. Open your Vercel URL in the browser — the 3D globe, heatmaps, Argo floats, XGBoost bias correction, and trajectory simulator should all connect live.

---

## Step 5: Keep the Backend Awake with UptimeRobot

1. Create a free account at [https://uptimerobot.com](https://uptimerobot.com).
2. Click **+ Add New Monitor**:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** `OceanTwin Backend`
   - **URL (or IP):** `https://oceantwin-backend.onrender.com/api/health`
   - **Monitoring Interval:** `5 minutes`
3. Click **Create Monitor**.

This uses ~730 hours/month (within Render's 750 free hours/month for a single free service) so the backend stays warm and responsive.
