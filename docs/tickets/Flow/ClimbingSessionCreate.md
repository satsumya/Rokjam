# ClimbingSessionCreate

Applies [Standards](../Standards.md) unless noted below.

**Start climbing log/climbing session from dashboard:**
- [x] Date auto adds current date in the standardised format ONLY
- [x] can be updated
- [x] Location auto fills to home/primary location from member profile
- [x] If no location added users will need an option to be able to add now — Opens a centered modal (not a bottom sheet) with address search, optional nickname, and full difficulty-level setup (same journey as member profile)
- [x] Users must be able to swap the location or add a new location but adding a new location is not a prominent option
- [x] Start time auto adds current time
- [x] Option to set the end time using a dropdown or choose length of the climbing session using a dropdown — True dropdown menu (native select on web; floating overlay on native), not an inline accordion; presets plus custom field per Standards
- [x] Add climbs
- [x] While adding or editing a climb, footer primary action is Save climb (replaces Add climb until saved or cancelled)
- [x] Edit climbs
- [x] Remove climbs
- [x] Sort climbs by difficulty: either easy to hard or hard to easy; unlabelled climbs at top
- [x] Sort climbs by order added (most recently added is default): newest first or oldest first
- [x] Sort climbs by name: A–Z or Z–A; unnamed climbs at top
- [x] Filter by difficulty (if location has been added to the session and if difficulty has been added to at least one climb)
- [x] Filter by tags (if tags have been added and only show tags that have been added already - include any custom tags as these are still tags)
- [x] show/hide warm up climbs
- [x] show/hide repeat climbs
- [x] Save/end session
- [x] Can choose to allow it to be public
- [x] If it's public and they don't have a user name they will have to add one
- [x] Default is private
- [x] Option to confirm end time (if added) or default to time user first ends the session — End time always has a value when save/end opens (defaults to current time)
- [x] Share session (after session is saved/ended — see Standards)
- [x] Incomplete profile — Can start session from dashboard even when profile is incomplete; show a prompt when something crucial is missing (Climbing section always visible)
- [x] Return to dashboard mid-session without saving/ending
- [x] In-progress session on dashboard — Continue existing session(s) and start a new session; both actions always available in the Climbing section
- [x] One location per climbing session

**For each climb:**
- [x] Option to add difficulty (if location has been added)
- [x] Option to add and remove attempts
- [x] Option to add tags to characterise
- [x] Tags include suggestions (dyno, slab, overhang, crimpy, etc.) and custom tags
- [x] Option to add a name or wall name
- [x] Option to add notes
- [x] Option to add one image of the climb (replace overrides previous)
- [x] Option to add one video of the climb (replace overrides previous)
- [x] Mark as a warm up climb
- [x] Mark as a repeat climb
- [x] Mark as a project
- [x] At a glance it should be easy to view
- [x] Difficulty if added
- [x] able to quick add difficulty if not added already
- [x] Attempt progress summary
- [x] Attempt summary in order of priority: Flash, Send, then Partial (start/middle/end)
- [x] able to quick view all attempts and edit
- [x] Name
- [x] If media has been added (icons: 📷 photo, 🎥 video)
- [x] If it's a new climb (e.g. not a repeat climb) — text label: New (repeat climbs are unlabelled)
- [x] at least one tag (if tags are added)
- [x] able to quick view all tags
- [x] Share climb (after session is saved/ended — see Standards)

**For each attempt**
- [x] Option to add progress
- [x] Progress can be start, middle, end, or a combination (shown as Partial)
- [x] or flash
- [x] or send
- [x] Send or flash cannot combine with start/middle/end
- [x] Flash only available on the first attempt
- [x] Send only available from the second attempt (first-attempt send is a flash)

**Scenarios**
- [x] Happy path — User with full profile and existing sessions
- [x] New user — No sessions logged yet
- [x] Inline location add — Modal with address search and difficulty levels when no location on profile or session
- [x] Mid-session dashboard — Active session shown with Continue session and Start climbing session both available
