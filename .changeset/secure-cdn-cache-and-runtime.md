---
'@grasdouble/cdn_autobuild-server': major
---

fix: harden CDN rate limiting, export resolution and atomic cache publication; build and test both runtime entry points. Remove public IP unblocking, disable implicit proxy trust, and require fresh or migrated caches with completion markers. Runtime dependencies are installed alongside the package instead of bundled.
