# LikeC4 GitHub Pages Deployment Guide

This guide explains how to prepare and deploy LikeC4 architecture visualizations to GitHub Pages.

## Prerequisites

- Node.js and npm installed
- LikeC4 CLI installed (`npm install -g @likec4/cli`)
- A GitHub repository
- LikeC4 source files (`.likec4` or `.c4` files)

## Step 1: Project Structure

Your project should have the following structure:
```
your-repo/
├── src/                    # LikeC4 source files
│   ├── index.c4           # Main architecture file
│   └── views/             # View definitions
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions workflow
├── package.json           # Optional: for dependencies
└── README.md
```

## Step 2: Build LikeC4 for GitHub Pages

### Option A: Manual Build (Recommended for testing)

1. **Navigate to your project directory:**
   ```bash
   cd your-repo
   ```

2. **Build with correct base path:**
   ```bash
   # Replace 'your-repo-name' with your actual repository name
   likec4 build src/ -o dist/ --base "/your-repo-name/"
   ```

3. **Test locally:**
   ```bash
   cd dist
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

### Option B: Automated Build with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy LikeC4 to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install LikeC4 CLI
        run: npm install -g @likec4/cli
      
      - name: Build LikeC4
        run: |
          mkdir -p dist
          likec4 build src/ -o dist/ --base "/${{ github.event.repository.name }}/"
      
      - name: Add .nojekyll
        run: touch dist/.nojekyll
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Step 3: LikeC4 Source File Example

Create `src/index.c4`:

```c4
specification {
  element person
  element system
  element container
}

model {
  person user "User"
  system app "Application" {
    container frontend "Frontend"
    container backend "Backend"
    container database "Database"
  }
  
  user -> app.frontend "uses"
  app.frontend -> app.backend "calls"
  app.backend -> app.database "stores data"
}

views {
  view index {
    include *
    autoLayout
  }
}
```

## Step 4: GitHub Repository Setup

1. **Create repository** on GitHub
2. **Push your code:**
   ```bash
   git init
   git add .
   git commit -m "Initial LikeC4 project"
   git branch -M main
   git remote add origin https://github.com/username/your-repo-name.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Under "Source", select "GitHub Actions"
   - Save settings

## Step 5: Deployment

### Automatic Deployment
- Push changes to main branch
- GitHub Actions will automatically build and deploy
- Site will be available at: `https://username.github.io/your-repo-name/`

### Manual Deployment
If you prefer manual deployment:

```bash
# Build locally
likec4 build src/ -o dist/ --base "/your-repo-name/"

# Deploy to gh-pages branch
npm install -g gh-pages
gh-pages -d dist
```

## Common Issues and Solutions

### 1. 404 Errors on Assets
**Problem:** Assets not loading, 404 errors in console

**Solution:** Ensure you're using the correct base path:
```bash
likec4 build src/ -o dist/ --base "/your-repo-name/"
```

### 2. Blank Page or "Nothing to see here"
**Problem:** Page loads but shows no content

**Solutions:**
- Check that your `.c4` files have valid syntax
- Ensure views are properly defined
- Verify the build completed without errors

### 3. JavaScript Module Errors
**Problem:** Module loading errors in browser

**Solutions:**
- Add `.nojekyll` file to disable Jekyll processing
- Ensure files are served over HTTP(S), not file://

### 4. Build Fails
**Problem:** `likec4 build` command fails

**Solutions:**
- Update LikeC4 CLI: `npm update -g @likec4/cli`
- Check source file syntax
- Ensure all referenced files exist

## Advanced Configuration

### Custom Domain
If using a custom domain, create `CNAME` file in your dist directory:
```bash
echo "your-domain.com" > dist/CNAME
```

### Multiple Views
Organize complex architectures:
```
src/
├── index.c4              # Main model
├── views/
│   ├── system-context.c4 # System context view
│   ├── containers.c4     # Container view
│   └── components.c4     # Component view
└── includes/
    ├── styles.c4         # Custom styles
    └── elements.c4       # Element definitions
```

### Build Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "build": "likec4 build src/ -o dist/",
    "build:gh-pages": "likec4 build src/ -o dist/ --base \"/$(basename $PWD)/\"",
    "serve": "cd dist && python -m http.server 8000",
    "deploy": "npm run build:gh-pages && gh-pages -d dist"
  }
}
```

## Repository Examples

- [Basic Example](https://github.com/username/likec4-basic)
- [Multi-View Example](https://github.com/username/likec4-multiview)
- [Enterprise Architecture](https://github.com/username/enterprise-architecture)

## Troubleshooting Checklist

- [ ] Repository name matches base path in build command
- [ ] GitHub Pages is enabled in repository settings
- [ ] GitHub Actions has proper permissions
- [ ] `.nojekyll` file exists in output directory
- [ ] LikeC4 source files have valid syntax
- [ ] Build command completed without errors
- [ ] All assets are included in the build output

## Additional Resources

- [LikeC4 Documentation](https://likec4.dev/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [C4 Model Documentation](https://c4model.com/)

---

*Last updated: July 2025*