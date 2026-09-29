# Stella Alex Kaguri · Portfolio

A static portfolio site, ready for Vercel. No build step.

## Deploy on Vercel

**Option A: GitHub (recommended, easy updates)**
1. Create a new GitHub repository and upload everything in this folder.
2. Go to vercel.com/new, choose "Import Git Repository" and pick the repo.
3. Framework preset: **Other**. Leave build command and output directory empty.
4. Click **Deploy**. Every later push to GitHub redeploys automatically.

**Option B: Vercel CLI**
```
npm i -g vercel
cd stella-portfolio
vercel --prod
```

## Editing content

All text, links and image paths are in the JSON block inside `index.html`
(the `<script type="application/json" id="data">` section).
- Change a link: edit its `"url"` value.
- Add a thumbnail: put the image in `images/` and set `"thumb": "images/your-file.webp"`.
- Add a post: copy an existing post object inside a client's `"posts"` list and change it.

Keep the JSON valid (commas between items, double quotes). You can check it at jsonlint.com.

## Files
- `index.html` – page shell and all content
- `styles.css` – design
- `app.js` – renders the page, filters and animation
- `images/` – post thumbnails
- `og-image.png` – preview image for link sharing
- `vercel.json` – caching and clean URLs
