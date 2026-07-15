/** @type {import('next').NextConfig} */

// If you're deploying to https://<username>.github.io/<repo-name>/ (a
// "project site"), GitHub Pages serves the site from a subpath, so Next
// needs to know that subpath to link assets/pages correctly. Set it to
// your repo name. If you're deploying to a "user/org site" repo named
// exactly <username>.github.io, or you're using a custom domain, leave
// REPO_NAME as an empty string.
const REPO_NAME = 'wedding-website';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',           // produces a static `out/` folder instead of a server
  images: { unoptimized: true }, // next/image's optimizer needs a server; this disables it
  basePath: REPO_NAME ? `/${REPO_NAME}` : '',
  assetPrefix: REPO_NAME ? `/${REPO_NAME}/` : ''
};

module.exports = nextConfig;
