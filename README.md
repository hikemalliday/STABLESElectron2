# stableselectron2

Re-factor of StablesElectron. Much more performant, removed feature bloat, and the code base is much nicer, meaning I'll be able to open it up a year from now and understand what is going on.

Built with express api + reactJS (typescript). Requests are handled and cached with `react-query`. Pagination is hanlded via query params + sqlite (`OFFSET + LIMIT`). `react-query` is a great addition because now queries are cached on the frontend, which pairs well with toggling back and forth through pages.

The `campOut` and `yellowText` parses are dealt with by using `fs.readFileStream`, because these log files can scale upwards of 50mb+, we dont want to simply open them at once into memory (fs.readFileSync, for example).

Vintage UI look / feel for this iteration. Used html + css for most components this round, rather than relying on MUI. I did however use MUI for the left and right page buttons, though.

Download link:

https://drive.google.com/file/d/1iGcitOsTNiDHUDmwnSphv2UBu9TQpFfh/view?usp=sharing

Or, if you are tech savy, just clone the repo and install deps, run in dev mode (`npm run dev`) or build with `electron-builder`.
