# Easter egg — placeholder `.env`

The repository contained a joke file named `public/.env` with a fake `OPENAI_API_KEY` value. It is not a valid API credential. The original joke payload is preserved at `docs/easter-eggs/OPENAI_API_KEY.fake`, outside the public webroot.

A conventional-looking but deliberately inert example now lives at `docs/easter-eggs/.env.example`. Its values are unmistakably placeholders and it is documentation only; it is not loaded by the application. The file remains outside `public/` so Astro cannot publish it as a static asset.

Never store real credentials in Git or under `public/`. If a real key was ever committed, revoke it at the provider and rotate it; deleting the file alone is not sufficient.
