---
'@grasdouble/cdn_autobuild-server': patch
---

fix: bundle CDN runtime dependencies so Passenger can start from a single deployed entry file without node_modules, and verify both bundle formats in isolation.
