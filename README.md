# Bahai-autocorrect
Simple replace script to correct most common Baha'i terms as UTF-8 in Text or HTML.


### Install the interface module into your node project with:
```
npm install --save bahai-autocorrect
```

### Functionality
``` Javascript
const BahaiAutocorrect = require('bahai-autocorrect');
let str = 'Haji Mirza Haydar-Ali'
let bahaiAutocorrect = new BahaiAutocorrect(str).correct()
let fixedStr = bahaiAutocorrect.toString()
```

### Underlined transliterations
By default, this library outputs underlined transliterations (ch, dh, gh, kh, sh, th, zh) as html with \<u> tags, e.g. "Síyáh-\<u>Ch\</u>ál".

If you wish to use underscore notation, (e.g. "C_hál", you can run `BahaiAutocorrect.stripUnderlines()`. Note that in this case the underscores go between the letters, not before them.
