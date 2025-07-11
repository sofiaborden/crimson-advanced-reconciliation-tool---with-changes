# Deployment Guide for Render

## Prerequisites

1. **GitHub Repository**: https://github.com/sofiaborden/crimson-advanced-reconciliation-tool---with-changes.git
2. **Render Account**: Sign up at https://render.com

## Deployment Steps

### 1. Connect GitHub Repository to Render

1. Log in to your Render dashboard
2. Click "New +" and select "Static Site"
3. Connect your GitHub account if not already connected
4. Select the repository: `sofiaborden/crimson-advanced-reconciliation-tool---with-changes`

### 2. Configure Build Settings

**Basic Settings:**
- **Name**: `crimson-reconciliation-tool` (or your preferred name)
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (uses repository root)

**Build Settings:**
- **Build Command**: `./render-build.sh`
- **Publish Directory**: `dist`

**Advanced Settings:**
- **Auto-Deploy**: Yes (recommended)
- **Node Version**: 18 or higher

### 3. Environment Variables (Optional)

If you want to enable AI features in production:

1. Go to your service settings in Render
2. Navigate to "Environment" tab
3. Add environment variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API key

**Note**: The app works without the API key using mock AI data for development.

### 4. Deploy

1. Click "Create Static Site"
2. Render will automatically:
   - Clone your repository
   - Install dependencies with `npm install`
   - Build the application with `npm run build`
   - Deploy to a public URL

### 5. Custom Domain (Optional)

1. In your service settings, go to "Settings" tab
2. Scroll to "Custom Domains"
3. Add your domain name
4. Configure DNS records as instructed by Render

## Build Process

The deployment uses these key files:

- **`render-build.sh`**: Build script that installs dependencies and builds the app
- **`package.json`**: Contains build commands and dependencies
- **`vite.config.ts`**: Vite configuration for production builds
- **`public/_redirects`**: Handles SPA routing for React Router

## Troubleshooting

### Build Fails
- Check that all dependencies are listed in `package.json`
- Ensure `render-build.sh` is executable
- Review build logs in Render dashboard

### App Doesn't Load
- Verify `dist` folder is set as publish directory
- Check that `_redirects` file exists in `public/` folder
- Review browser console for errors

### AI Features Not Working
- Verify `GEMINI_API_KEY` environment variable is set
- Check that the API key is valid and has proper permissions
- The app will fall back to mock data if API key is missing

## Post-Deployment

1. **Test the Application**: Visit your Render URL and test all features
2. **Monitor Performance**: Use Render's built-in monitoring
3. **Set Up Alerts**: Configure notifications for deployment failures
4. **Update DNS**: Point your custom domain to the Render URL

## Automatic Deployments

Render will automatically redeploy when you push changes to your connected GitHub branch. This ensures your live site stays up-to-date with your latest code.

## Support

- **Render Documentation**: https://render.com/docs
- **GitHub Repository**: https://github.com/sofiaborden/crimson-advanced-reconciliation-tool---with-changes
