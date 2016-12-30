# Bahai-autocorrect
Simple replace script to correct most common Baha'i terms as UTF-8 in Text or HTML.
 

### Install the interface module into your node project with:
``` 
npm install --save bahai-term-phoneme
```

### Functionality
``` Javascript
var bac = require('bahai-autocorrect'); 

bac.correct(str) 
// Identifies and corrects common Baha'i term misspellings. Usually won't corrupt HTML.
// for example: bac.correct("Akb^ar Babi Mulla Husayn")
// output: Akbár Bábí Mullá Ḥusayn 
```
 
### Demo

Browser jsfiddle demo: https://jsfiddle.net/chadananda/u3fy3qm9/