# Deployment Guide: Publishing ArnavJainPortfolio

Follow these steps to publish your portfolio to your custom domain.

## 1. Choose a Hosting Provider (Recommended: Vercel or Netlify)
Since your site is a static website (HTML/CSS/JS), **Vercel** or **Netlify** are the best options. They are free, secure (HTTPS by default), and extremely fast.

### Option A: Using Vercel (Easiest)
1. **Push your code to GitHub:**
   - Create a new repository on GitHub named `arnavjain-portfolio`.
   - Run the following in your terminal:
     ```bash
     git init
     git add .
     git commit -m "Initial commit: Premium Portfolio"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/arnavjain-portfolio.git
     git push -u origin main
     ```
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up with GitHub.
   - Click **"Add New"** > **"Project"**.
   - Import your `arnavjain-portfolio` repository.
   - Click **"Deploy"**. Your site is now live on a `.vercel.app` URL.

## 2. Connect Your Custom Domain
Once deployed, follow these steps to use your own domain (e.g., `arnavjain.com`):

1. In your Vercel Dashboard, go to **Settings** > **Domains**.
2. Enter your domain name and click **Add**.
3. **Update DNS Records:** Vercel will give you a **CNAME** or **A Record**.
   - Log in to your domain registrar (GoDaddy, Namecheap, etc.).
   - Go to DNS Management and add the record provided by Vercel.
4. Wait 5–60 minutes for DNS propagation.

## 3. Security Best Practices
- **HTTPS:** Vercel/Netlify automatically provide SSL certificates. Never use `http://`; always ensure `https://` is active.
- **Form Security:** For your contact form, use a service like [Formspree](https://formspree.io/) or [Netlify Forms]. Simply update the `action` attribute in `contact.html` with your unique endpoint to receive emails securely without a custom backend.

## 4. Final SEO Verification
- **Google Search Console:** Submit your new URL to [Google Search Console](https://search.google.com/search-console) to help Google index "Arnav Jain" faster.
- **Sitemap:** Create a simple `sitemap.xml` listing your 4 pages to assist search crawlers.
