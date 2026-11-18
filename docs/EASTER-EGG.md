# Easter egg — placeholder `.env`

The repository contained a joke file named `public/.env` with a fake `OPENAI_API_KEY` value. It is not a valid API credential. The original joke payload is preserved at `docs/easter-eggs/OPENAI_API_KEY.fake`, outside the public webroot, so it cannot be served as a static asset.

Never store real credentials in Git or under `public/`.
