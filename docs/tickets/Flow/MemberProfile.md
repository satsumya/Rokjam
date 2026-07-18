# MemberProfile

Applies [Standards](../Standards.md) unless noted below.

- [x] Add a user name
- [x] Username available confirmation — Show “Username available” when format rules are met and the name is free (`thegoat` is taken for testing)
- [x] Required: Add a gym or climbing location/address name (could be an indoor gym or an outdoor spot)
- [x] Address search — Live suggestions while typing (no Search button); match text highlighted; “Can't find the address? Add it anyway” in the list; Enter adds the typed value
- [x] First location added defaults to home/base location
- [x] Optional: add more locations (not strongly prompted)
- [x] Optional: location nickname
- [x] Add difficulty levels for each location
- [x] One difficultly level added by default
- [x] Optional: for user to add more difficulty levels (strongly encouraged)
- [x] When adding levels, each level added has a default name and colour assigned
- [x] Default levels from easy to hard: Yellow > Blue > Purple > Green > Orange > Red > Black > White > Pink > [blank: user has to choose a colour and name]
- [x] A user can update the colour or name before confirming adding the level
- [x] Can edit levels after they’ve been added
- [x] Can reorder the added levels
- [x] Option to add strengths
- [x] Option to add areas to improve
- [x] Profile pic
- [x] After completing user goes to the dashboard
- [x] Completing profile is not required to start a climbing session
- [x] Happy path, alternate paths, and error paths in scenario tester
- [x] Need to be able to exit member profile — Exit or skip without completing required fields (skip only during initial setup; hidden when editing an already-complete profile)
- [x] Location added - encourage user to add levels — When a location is added it needs to feel more seamless to move users onto adding difficulty levels
- [x] Location edit — Address and nickname stay editable when a location is open; changing the address uses address search again; locations can be deleted (confirm in a bottom sheet)
- [x] Difficulty levels sort — Clear easy-to-hard ordering with swap to hard-to-easy
- [x] Remove level numbers — e.g. Level 1 name should just be “Level label”
- [x] Changing level colours — Colour swatch opens a bottom sheet with unused presets + custom hex
- [x] Difficulty levels - removing — Remove levels when more than one exists
- [x] Be concise when displaying levels — Show levels as a compact row
- [x] Difficulty level rearranging — Drag handle reorders levels; arrow controls remain as a backup
- [x] Level colour picker — Opens in a bottom sheet (content capped to screen max width); unused presets + custom colour picker (SV panel, hue slider, hex)
- [x] Locations added — Accordion; only one location open at a time
- [x] Change home location — Set which location is home
