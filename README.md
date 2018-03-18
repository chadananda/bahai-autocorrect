# Bahai-autocorrect
Simple replace script to correct most common Baha'i terms as UTF-8 in Text or HTML.


### Install the interface module into your node project with:
```
npm install --save bahai-autocorrect
```

### Functionality
``` Javascript
var bac = require('bahai-autocorrect');

bac.correct(str)
// Identifies and corrects common Baha'i term misspellings. Usually won't corrupt HTML.
// for example: bac.correct("Akb^ar Babi Mulla Husayn")
// output: Akbár Bábí Mullá Ḥusayn
```

### Note: underscore rules were changed

Previously, transliterated underscores were done like this: `_Kh` `_Dh` etc.

Now, the underscore must be in the middle of the two characters like `K_h` and `D_h`

This is to make it compatible with Markdown which uses underscores beore a word for italics. (As it turns out, book titles are typically italicized and often begin with "_The")

### Demo

Browser jsfiddle demo: https://jsfiddle.net/chadananda/u3fy3qm9/
