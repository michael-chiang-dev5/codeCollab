# Sizing to enclosing div

CollabRepl sizes itself to fit the enclosing div + 30px (for the console bar at the bottom).

- You can set height to 100% for class `&` (see solarizedDarkTheme.tsx, solarizedLightTheme.tsx) but this will not fit the enclosing div. The reason is that there are intermediate divs that are not 100% height. In order to get the 100% to cascade up to the enclosing div, we use `global.css` to globally set intermediate divs to height 100%. This is not scoped and not ideal.
