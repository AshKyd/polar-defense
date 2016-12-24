![Polar Defender](https://raw.githubusercontent.com/AshKyd/polar-defense/master/resources/l.png)

Defend the solar system from an alien invasion on this modern twist on space
invaders.

With two game modes four levels and a bunch of aliens to destroy, there's plenty
of fun in this messy space shoot-em-up.

* [Install it on the Chrome Web Store](chrome.google.com/webstore/detail/polar-defender/gjoooadmegcpeloepjiebbpecolmfjkm)
* [Like it on js13kgames.com](http://js13kgames.com/entries/polar-defender)

An entry for js13kgames. I've wanted to do something with polar coordinates since working on the [ABC 2013-14 ashes catches game](http://www.abc.net.au/news/sport/cricket/ashes-2013-game/), so here's a little radial shooter for a bit of fun.

### Building

* `npm run build` builds everything into dist/

## Platform support

The game has been tested and made to work on the major browsers.

Browser            |Support | Mobile
-------------------|--------|--------
Chrome             | A+     | Yes
Firefox            | A+     | Yes
Safari             | B      | Yes
Android Browser 4+ | B+     | Yes
Internet Explorer  | F      | No

There have been reports IE just displays a blank screen, but I haven't got a
Windows machine or the time to debug it. The game should (eventually) work on
IE 9+.

Safari on iOS is kinda slow. It's playable but visibly choppy. I'm not sure if
it's slower hardware, browser or both.

## js13k

The #js13k build is in a separate "js13k" branch, and includes some last-minute
optimisations to bring it under the required filesize. The branch is provided
as a reference only and is out of sync with master.
