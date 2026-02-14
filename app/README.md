# Personal Website

A modern personal website built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- React 19 + TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- GSAP animations
- Three.js 3D elements
- Custom cursor effects
- Smooth scrolling with Lenis

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Option 1: Cloudflare Pages (Recommended)

**Free tier includes:** Unlimited bandwidth, custom domains, SSL, global CDN, CI/CD

#### Setup via Git (Automatic Deploys)

1. Push your code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
3. Click "Connect to Git"
4. Select your repository
5. Configure build settings:
   - **Framework preset:** None (or Vite)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `app`
6. Click "Save and Deploy"

#### Setup via Direct Upload

1. Build locally: `npm run build`
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
3. Click "Upload assets"
4. Drag and drop the `app/dist` folder
5. Your site will be live instantly

#### Custom Domain (Cloudflare)

1. In your Pages project, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain name
4. Cloudflare will automatically configure DNS if the domain is on Cloudflare
5. Otherwise, follow the provided DNS instructions

---

### Option 2: GitHub Pages

**Free tier includes:** 1GB storage, 100GB bandwidth/month, custom domains

#### Setup with GitHub Actions (Automatic)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./app
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: ./app/package-lock.json
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./app/dist
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then enable Pages:
1. Go to Settings → Pages
2. Source: GitHub Actions
3. Push the workflow file to trigger deployment

#### Setup with `gh-pages` Package (Manual)

1. Install the package: `npm install --save-dev gh-pages`
2. Add to `package.json`:

```json
{
  "homepage": "https://yourusername.github.io/repo-name",
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

3. Build and deploy: `npm run build && npm run deploy`

#### Custom Domain (GitHub Pages)

1. In your repository, go to Settings → Pages
2. Under "Custom domain", enter your domain
3. Click "Save"
4. Add a CNAME file to your `dist` folder with your domain name
5. Configure DNS:
   - **Apex domain:** Create A records pointing to:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **Subdomain (www):** Create CNAME record pointing to `username.github.io`

---

## Build Configuration

Make sure your `vite.config.ts` has the correct base path:

### For Cloudflare Pages:
```typescript
export default defineConfig({
  plugins: [react()],
  // No base path needed for custom domains
})
```

### For GitHub Pages (project site):
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
})
```

### For GitHub Pages (user/org site):
```typescript
export default defineConfig({
  plugins: [react()],
  // No base path needed for username.github.io
})
```

## Project Structure

```
app/
├── dist/              # Production build output
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── sections/      # Page sections
│   ├── hooks/         # Custom React hooks
│   ├── data/          # JSON data files
│   ├── lib/           # Utility functions
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules.

## License

MIT
