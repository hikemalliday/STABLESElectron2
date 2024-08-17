# stableselectron2

Re-factor of StablesElectron. Much more performant, removed feature bloat, and the code base is much nicer, meaning I'll be able to open it up a year from now and understand what is going on.

Built with express api + reactJS (typescript). Requests are handling and cached with `react-query`. Pagination is hanlded via query params + sqlite (`OFFSET + LIMIT`). `react-query` is a great addition because now queries are cached on the frontend, which pairs well with toggling back and forth through pages.

Vintage UI look / feel for this iteration. Used html + css for most components this round, rather than relying on MUI. I did however use MUI for the left and right page buttons, though.

Download link:

https://drive.google.com/file/d/1iGcitOsTNiDHUDmwnSphv2UBu9TQpFfh/view?usp=sharing

Or, if you are tech savy, just clone the repo and install deps, run in dev mode (`npm run dev`) or build with `electron-builder`.
