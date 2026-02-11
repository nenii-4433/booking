# How to Deploy to Vercel

Follow these steps to get your booking app live on Vercel:

## 1. Prepare for Deployment
- Make sure you have a GitHub account and your project is pushed to a repository.
- Alternatively, you can use the Vercel CLI.

## 2. Deploy via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. **Project Settings**:
   - **Framework Preset**: Select **"Other"**.
   - **Build Command**: Leave **Empty** (Default).
   - **Output Directory**: Leave **Empty** (Default).
5. **Important**: In the "Environment Variables" section, add a new variable:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://husitah13_db_user:bEXkxy2S4oYVL372@cluster0.mfbsk7e.mongodb.net/test?appName=Cluster0`
5. Click **Deploy**.

## 3. Deploy via Vercel CLI
If you have the Vercel CLI installed:
1. Open your terminal in the project folder.
2. Run `vercel`.
3. Follow the prompts.
4. After the first deployment, go to the Vercel dashboard for your project and add the `MONGODB_URI` environment variable as described above, then redeploy.

## Why use Environment Variables?
We updated `server.js` to look for a `MONGODB_URI` variable. This is safer than hardcoding your password in the code and allows you to change databases easily.
