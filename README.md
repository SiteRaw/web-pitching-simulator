# web-pitching-simulator
A web baseball pitching simulator game using Javascript and HTML.

## About the Project

A baseball pitching simulator created by SiteRaw Projects https://www.siteraw.com

### Rules

- bottom of the 9th inning
- you need to strike out 3 batters
- only four outcomes
- - strike ("looking")
  - ball
  - foul ball
  - home run
- the batter will not swing at pitches outside the zone unless...
- ...at two strikes. In which case:
- - the strike zone expands as the hitter becomes more aggressive, i.e. he will swing at pitches outside the box
  - easier to hit home runs (at the expense of more strikes)
  - easier to hit foul balls (as he is less likely to take a "looking" strike)
- a visual aid can be turned on by setting 'const drawZones = 1;' in the Javascript file

### Languages

- HTML
- CSS
- Javascript

### Future updates?

- implement hits (singles, doubles, triples) and balls in play (popout, groundout, flyout)
- adjust the score before a game
- customizable pitch types
- a complete box score of all positions players (not just pitcher)
- different batter profiles (power hitter, contact hitter, etc)
