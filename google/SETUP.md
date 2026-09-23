# Receiving applications in Google Sheets + Gmail

Every submission of the `/apply` form is sent to a small Google script that adds a row to a Google Sheet and emails you. No accounts or services other than your Google account are involved. Setup takes about ten minutes; you only do it once.

## 1. Create the sheet and open the script editor

1. Go to [sheets.new](https://sheets.new) and name the spreadsheet, e.g. **Cortexity applications**. Leave it empty — the script adds the column headers by itself.
2. In the menu choose **Extensions → Apps Script**. A code editor opens in a new tab with a file called `Code.gs`.

## 2. Paste the script and fill in two values

1. Delete everything in `Code.gs`, then paste the whole contents of `google/apps-script.gs` (this folder) into it.
2. Near the top, change the two lines:
   - `SECRET` — replace `change-me-to-a-long-random-string` with a long random password (for example 30+ letters and numbers). This is what stops strangers from posting junk into your sheet. Keep it somewhere safe; you need it again in step 4.
   - `NOTIFY_EMAIL` — your Gmail address, where each application should arrive.
3. Press the **Save** icon (or Cmd+S).
4. Optional but recommended: in the toolbar, pick the function `test_` in the dropdown and press **Run**. Google will ask you to allow the script to use your Sheets and Gmail — approve it (choose your account → *Advanced* → *Go to … (unsafe)* → *Allow*; the "unsafe" wording just means the script is yours, not a published add-on). Afterwards you should see a test row in the sheet and a test email in your inbox.

## 3. Publish it as a web app

1. In the top-right of the script editor click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in:
   - Description: anything, e.g. `applications`
   - **Execute as: Me**
   - **Who has access: Anyone** (this is required so the website can reach it; the secret from step 2 is what keeps it private)
4. Click **Deploy**, approve permissions if asked again, then **copy the Web app URL** (it ends in `/exec`).

> If you ever change the script later, you must go to **Deploy → Manage deployments → ✎ Edit → Version: New version → Deploy** for the change to go live. The URL stays the same.

## 4. Give the website the URL and the secret

1. In the website folder, create a file called `.env.local` (next to `package.json`) with these two lines, using your values:

   ```
   APPS_SCRIPT_URL=https://script.google.com/macros/s/…/exec
   APPS_SCRIPT_SECRET=the-same-secret-you-typed-in-step-2
   ```

   `.env.local` is ignored by git on purpose — never commit it. `.env.example` shows the two names.
2. Restart the site (`npm run dev` or `npm run start`) so it reads the new file.

## 5. On Vercel

The live site needs the same two values: in the Vercel dashboard open the project → **Settings → Environment Variables**, add `APPS_SCRIPT_URL` and `APPS_SCRIPT_SECRET` with the same values, then redeploy.

## Try it

Submit the form on `/apply`. Within a few seconds a new row appears in the sheet and an email lands in your inbox with every answer; replying to that email replies to the applicant. If the form shows "Something went wrong", check that both values in `.env.local` are correct and that the deployment's "Who has access" is **Anyone**.
