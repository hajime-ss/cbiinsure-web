# CBIINSURE Versioning Rules

> [!IMPORTANT]
> The exact versioning logic is defined as: **1.[Major Features].[Minor Patches]**

**1.x.xx**
- **1** = The Major Build Generation. (Currently Version 1. Will likely stay 1 unless the entire technology stack is replaced).
- **.x** = Feature Updates. **Only** goes up by 1 for **Important Updates** (e.g. adding a completely new dashboard, changing database infrastructures, or designing new public web pages).
- **.xx** = Incremental Pushes. **Every single time** you push a bug fix, typo fix, or server tweak, this number goes up by 1.

**Example Track:**
`1.0.1` -> Mobile UI fix
`1.0.2` -> Added /admin version tracker
`1.0.3` -> Fixed a typo on the homepage
`1.1.0` -> Completely redesigned the Quote Comparison layout (Major Feature)
`1.1.1` -> Fixed a bug in the new layout
