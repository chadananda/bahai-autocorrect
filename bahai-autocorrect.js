
// *******************************************************
var _autoCorrectBahai = function(str, stripTags) {
  // deglyph
  str = str
    // dotted letters ḍṣẓṭḥ ḌṢẒṬḤ
    .replace(/\\dd/g, 'ḍ').replace(/\\dD/g, 'Ḍ')
    .replace(/\\ds/g, 'ṣ').replace(/\\dS/g, 'Ṣ')
    .replace(/\\dz/g, 'ẓ').replace(/\\dZ/g, 'Ẓ')
    .replace(/\\dt/g, 'ṭ').replace(/\\dT/g, 'Ṭ')
    .replace(/\\dh/g, 'ḥ').replace(/\\dH/g, 'Ḥ')
    .replace(/\\hh/g, 'ḥ') // \hh ḥ common mistake
    // accented letters áíú ÁÍÚ
    .replace(/\\aa/g, 'á').replace(/\\aA/g, 'Á')
    .replace(/a\\aa/g, 'á') // common mistake
    .replace(/\\ai/g, 'í').replace(/\\aI/g, 'Í')
    .replace(/\\au/g, 'ú').replace(/\\aU/g, 'Ú')
    .replace(/\\a/g, 'á') // common mistake
    .replace(/\^a/g, 'á').replace(/\^A/g, 'Á')
    .replace(/\^i/g, 'í').replace(/\^I/g, 'Í')
    .replace(/\^u/g, 'ú').replace(/\^U/g, 'Ú')
    // underscores sh kh zh th gh ch
    .replace(/{\\"(([csghzkdt]){1,2})\{\\ /gi, '<u>$1</u>') // for glyph format {\"Dh{\ ??
    .replace(/<u>([csghzkdt]h)([csghzkdt]h)<\/u>/ig, '<u>$1</u><u>$2</u>')
    .replace(/([csghzkdt])_(h)/ig, '<u>$1$2</u>')
    // ‘Ayns
    .replace(/\`/g, '‘').replace(/\\n/g, '‘')
    // em and i
    .replace(/\{\\\((.*?)\{\\ /g, '<em>$1</em>')
    .replace(/\{\\\"(.*?)\{\\/g, '<i>$1</i>')
    // indents
    .replace(/\{\\\(/g, '\t').replace(/\{\\\!/g, '\t')
    // // footnote marker
    // .replace(/[]*\\\*[ ]*/g, '<fn> ')
    // .replace(/\/\*/g, '<fn> ')
    // add a space before marker if preceded by letter or quote
    // .replace(/([^\.\,\;\:\)\!\?])<fn>/, '$1 <fn>')
    // // now the footnote lines
    // .replace(/^[\t ]*\+F([1-9])[ ]*(.*?)$/gm, '<fn$1>$2</fn$1>')
    // .replace(/<\/fn1>\s+<fn1>/gm, '\n\t')
    // .replace(/<\/fn2>\s+<fn2>/gm, '\n\t')
    // .replace(/<\/fn3>\s+<fn3>/gm, '\n\t')
    // .replace(/<\/fn3>\s+<fn3>/gm, '\n\t');
  // unnumbered page markers
  // var pgcounter = 0;
  // str = str.replace(/[\s]+\+P[\s+]([a-z\+])/g, ' <_pg_> $1')
  //   .replace(/[\s]+\+P/g, ' <_pg_>\n\n')
  //   .replace(/<_pg_>[\s+]<_pg_>/g, '<_pg_><_pg_>')
  //   // replace unumbered page markers with numbered page markers
  //   .replace(/<_pg_>/g, function() {
  //     pgcounter++;
  //     return "<p" + pgcounter + ">";
  //   })
  //   // remove multiple page markers after numbering them
  //   .replace(/<p.*?>\s*<p.*?>\s*(<p.*?>)/gm, '$1')
  //   .replace(/<p.*?>\s*(<p.*?>)/gm, '$1');
  // some odd junk
  str = str.replace(/\{\\\#/g, '').replace(/\{\\/g, '');
  // end deglyph
  // now replace common terms

  // Rules for the list of common misspellings:
  // "[find] = [replace]"   The basic syntax
  //
  // In the [find] section:
  // \\                     This will become a backslash in the regex
  // Baha'i                 Will also replace "BAHA'I"
  // ()                     Any number of word characters [a-záíúA-ZÁÍÚ]* etc.
  // ...()                  If the () appears at the end of the find section, $1 is implied in the replacement
  // '                      Replaces any single quote character "[‘'’]"
  // [...'] OR [']          Replace ONLY a single quote (last character of class)
  // [-] OR [-...]          Replace hyphen or en-dash "[-–]" (first character of class)
  // [\\-]                  Replace ONLY a hyphen inside a character class
  //
  // In the [replace] section:
  // $1, $2, etc.           References sets in parentheses
  var CommonMispellings = [
    "Bah[aá]'?[iíI] = Bahá’í",
    "Bah[aá]'?[iíI]s = Bahá’ís",
    "'?Abd[uoe]'?l[-]? ?B[ea]h[aá] = ‘Abdu’l-Bahá",
    "'?Abd[uo]'?l = ‘Abdu’l",
    "'?Abb[aá]s = ‘Abbás",
    "All[aá]h[-]?[uoOU][-][Aa]bh[aá] = Alláh-u-Abhá",
    "Bah[aá][- ]?'?[UOuo0ú]'?[lL]+[aá]h = Bahá’u’lláh",
    "B[aá]b[ií]s = Bábís",
    "B[aá]b[ií] = Bábí",
    "B[aá]b = Báb",
    "'?A[kc][kc]a = ‘Akká",
    "Kh?[aá]nn?[uo]m = <u>Kh</u>ánum",
    "Bah[ií]yy?[ia]h = Bahíyyih",
    "Dia'iyyih = Ḍíyá’íyyih",
    "Mirza = Mírzá",
    "H[áa]d[íi]() = Hádí",
    "Sh[íi]r[áa]z[ií] = <u>Sh</u>írází",
    "Sh[íi]r[áa]z() = <u>Sh</u>íráz",
    "Shogh?ie? = Shoghi",
    "Effendie? = Effendi",
    "Ahmad() = Aḥmad",
    "[HḤ]ass?an() = Ḥasan",
    "[HḤ][uo]ss?[ea][yi]n() = Ḥusayn",
    "Sh[aá]h() = <u>Sh</u>áh",
    "B[úu]shih?r() = Bú<u>sh</u>ihr",
    "No?ur[ií] = Núrí",
    "Yazd[ií]() = Yazdí",
    "[QK][uo]'?r'?[aá][aá]?n() = Qur’án",
    "Abha = Abhá",
    "M[ao]hh?[oa]met() = Muḥammad",
    "M[uo]hh?amm?[aeá]d() = Muḥammad",
    "Muḥammad[ea]n = Muḥammadan",
    "Kuly = Qulí",
    "'?Ali([\\.\\!\\?< \\-]) = ‘Alí$1", // TODO: Why the extra regex?
    "Kitab() = Kitáb",
    "[IE][qkg][hu]?[aá]n = Íqán",
    "Ruhangiz = Rúhangíz",
    "Ro?[uú][hḥ][aá]() = Rúḥá",
    "Ro?[uú][ḥh][iíy]() = Rúḥí",
    "Jalal() = Jalál",
    "Fa[zd][ei]l() = Faḍil",
    "Fa[zd]l() = Faḍl",
    "Ri[dḍz]h?[vw][áa]a?n() = Riḍván",
    "Mash[-]?r[iea][qk][-]?[uoe]'?l[- ]?[Aa][zd]h?[kc][aá]r = Ma<u>sh</u>riqu’l-A<u>dh</u>kár",
    "Tamadd?[uo]n ?[uoa]'?l[- ][Mm][uo]lk = Tamaddunu’l-Mulk",
    "Shaykh = <u>Sh</u>ay<u>kh</u>",
    "K[aá][ẓz]im() = Káẓim",
    "R[ea]sht[ií] = Ra<u>sh</u>tí",
    "R[ea]sht = Ra<u>sh</u>t",
    "Kam[áa]l() = Kamál",
    "P[aá]sh[aá] = Pá<u>sh</u>á",
    "M[uo]n[iíe]e?r() = Munír",
    "Munír[aie][h]? = Munírih",
    "M[ou][hḥ]e?y[ie]?d[- ]?[dD][ií]n = Muḥyi’d-Dín",
    "[TṬ][ie]he?r[aá]n = Ṭihrán",
    "Zaine = Zayn",
    "N[o]?urr?[aie]d[- ]?[dD]?[ií]n = Núri’d-Dín",
    "S[uo]l[ea]ym[aá]n() = Sulaymán",
    "Kh[aá]n = <u>Kh</u>án",
    "L[uo][tṭ]f'?[uoUO]'?[-]? ?ll[aá]h = Luṭfu’lláh",
    "[HḤ][aá]k[ií]m() = Ḥakím",
    "Ta[qkg][íi] = Taqí",
    "(Port\\s+)Said = $1Sa‘íd",
    "\\bSa'[ií]d = Sa‘íd",
    "Abu'?l[- ]Fa[ḍz]l = Abu’l-Faḍl",
    "N[aá][sṣ]iri'd[-]?D[ií]n = Náṣiri’d-Dín",
    "[ḤH]a[yi]d[ae]r[- ][‘']?Al[íi]() = Ḥaydar-‘Alí",
    "Kh[uo]r[aá]ss?[aá]n[íi] = <u>Kh</u>urasání",
    "Kh[uo]r[aá]ss?[aá]n = <u>Kh</u>urasán",
    "J[ie]n[aá]b[ií] = Jinábí",
    "[HḤ][aá]d?j?j[ií] = Ḥájí",
    "No?[uú]r[ií] = Núrí",
    "No?[uú]r  = Núr ",
    "Ass?ad[- ’‘']?[uoOU]'?ll[aá]h? = Asadu’lláh",
    "'?[IE]n[áa]?y[aá]?t?'?[uOUo]'?ll[áa]h = ‘Ináyatu’lláh",
    "N[uú]r'?[uoOU]'?ll[aá]h? = Núru’lláh",
    "'?Az[ieí][e]?z'?[uoOU]'?ll[aá]h? = ‘Azízu’lláh",
    "R[úu][ḥh]?[uo]'?ll[áa]h = Rúḥu’lláh",
    "K[h]?[ae][yi]?r'?[uoOU]'?ll[aá]h? = <u>Kh</u>ayru’lláh",
    "Ab[úu]'?l[- ]Q[áa]sim = Abú’l-Qásim",
    "B[ae]h?j[íei] = Bahjí",
    "M[ae][ḥh]m[úo]o?d = Maḥmúd",
    "[ṢS][uo]b[ḥh]?[- ]?[ie][- ][AE]z[ae]l = Ṣubḥ-i-Azal",
    "Y[ae][ḥh]y[áa] = Yaḥyá",
    "N[ao][w]?[- ][Rr][uú]z = Naw-Rúz",
    "N[a][uw]?[- ]?[Rr][uoú][uo]?z = Naw-Rúz",
    "M[áa]z[ie]nd[ae]r[aá]n = Mázindarán",
    "M[áa]z[ie]nd[ae]r[aá]n[ií] = Mázindarání",
    "B[ae]y[aáe]n = Bayán",
    "[ṬT][aá]h[ie]r[ai][hy]?[y]? = Ṭáhirih",
    "Sh[ií][ií]?'?[aei]h = <u>Sh</u>í‘ah", // 54 in GPB
    //.replace(/Sh[ií][ií]?'?[i]h/g, '<u>Sh</u>í‘ih') // 0 in GPB
    "S[uo]nn[ií]() = Sunní",
    "S[íi]y[aá][h]?[- ]Ch[aá]l = Síyáh-<u>Ch</u>ál",
    "S[uo]l[eia][y]?m[aá]n[ií]y[y]?[ai][h]? = Sulaymáníyyih",
    // Afnan Aghsan
    "Afn[aá]n() = Afnán",
    "Aghs[aá]n() = A<u>gh</u>ṣán",
    "Isl[aá]m() = Islám",
    "Jam[aá]l() = Jamál",
    // Samandari
    "Samandar[ií]() = Samandarí",
    // Huquk
    "[ḤH][uo][qqk][uú][kgq]() = Ḥuqúq",
    //Majid
    "Maj[ií]d = Majíd()",
    // Qajar
    "[QG][aá]j[aá]r = Qájár",
    // Tabarsi
    "[ṬT]ab[áa]rs[íi] = Ṭabarsí",
    // Navvab
    "Nav[v]?[aá]b = Navváb",
    // Nabil
    "Nab[ií]l() = Nabíl",
    // `Alí-Akbar Furútan
    "'?Al[íi][- ]Akb[aá]r = ‘Alí-Akbar",
    "Fur[úu]t[áa]n = Furútan",
    "Yaz[ií]d() = Yazíd",
    // Surah
    "S[úu]r[aei]h = Súrah",
    "\\bAll[áa]h = Alláh",
    // Haziratu’l-Quds
    "[ḤH]a[zẓ][íi]rat'?u'?l[- ][QGK][uo]ds = Ḥaẓíratu’l-Quds", //
    "[ḤH]a[zẓ][íi]ra[h]? = Ḥaẓíra", //
    // Mashad
    "Mashad = Ma<u>sh</u>had",
    // Baghdad
    "Bag[h]?d[aá]d() = Ba<u>gh</u>dád",
    // Masra’íh // Madrih
    "Ma[sd]r[aá]?'?[ií][h]? = Masra‘ih",
    // Imam
    "Im[aá]m() = Imám",
    // Surayt’ul-Haykl  Suratu'l-Haykal
    "S[úu]ra[y]?[t]?'?[uo]'?l[- ]Hayk[a]?l = Súratu’l-Haykal",
    // Hamíd
    "[ḤH]am[ií]d() = Ḥamíd",
    // Hafiz
    "[ḤH][áa]f[ie][zẓ] = Ḥáfiẓ",
    // Hádíth
    "[ḤH][áa]d[ií][i]?th = Ḥadí<u>th</u>",
    // Zaman
    "Zaman = Zamán",
    // Paran
    "P[áa]r[áa]n = Paran",
    // Rabbani
    "Rabb[aá]n[ií]() = Rabbání",
    // Banani
    "Ban[aá]n[ií]() = Banání",
    "Abb[uú]d = Abbúd",
    "Bah[áa] = Bahá",
    // Muḥammad Ali
    "Muḥammad[- ]'?Al[íi] = Muḥammad-‘Alí",
    "[AE]zal[íi]() = Azalí",
    // Quddus
    "Qudd[uú]s() = Quddús",
    // Quddus
    "M[uo]ll[áa][h]? = Mullá",
    // Insha’allah
    "Insh[áa]'?all[áa]h = In<u>sh</u>á’alláh",
    // Fatimih
    "F[áa][ṭt][ie]m[ia]h = Fáṭimih",
    // Iṣfahán
    "[IE][ṣs][fp][h]?[aá]h[áa]n = Iṣfahán",
    "Iṣfahán[ií] = Iṣfahání",
    // Ásíyih
    "[ÁA]sí[i]?yih = Ásíyih",
    // Qayyumu’l-Asma: note, we cannot fix the end of a single-quote phrase
    "Qayy[uú]m[uo]'?l[- ][Aa]sm[aá]'? = Qayyúmu’l-Asmá’",
    //Graudian
    "G[r]?[a]?u[a]?[r]?dian = Guardian",
    "A[kqh][h]?d[aá]s = Aqdas",
    "Administraiton = Administration",
    // Rahim
    "Ra[ḥh][ií]m() = Raḥím",
    "\\b[ÁA]q[aá]() = Áqá",
    "Mihd[ií]() = Mihdí",
    "Sul[ṭt][aá]n() = Sulṭán",
    "K[aá]sh[aá]n = Ká<u>sh</u>án",
    "K[aá]sh[aá]n[ií] = Ká<u>sh</u>ání",
    // Naqiz
    "N[áa][qgk][ai][ḍzd][z]?[ieí][e]?n = Náqiḍín",
    "N[áa][qgk][ai][ḍzd][z]?() = Náqiḍ",
    // Sayad
    "S[ia]y[y]?[ia]d() = Siyyid",
    
    // OLD LIST
    "Ja[vw][aá]d() = Javád",
    "Mir = Mír",
    "Golam = Qulam",
    "Hasssan = Ḥasan",
    "Ma[hḥ]m[o]?[uú]d = Maḥmúd",
    "Kh[ou]sr[aou][w]? = <u>Kh</u>usraw",
    "Bah[aá][ ’‘']?[EUO]l[ ’‘']?Abh[aá] = Bahá’u’l-Abhá",
    "Sabz[ei]v[aá]r = Sabzivár",
    "‘Abdu’l\\s+Ḥasan = ‘Abdu’l-Ḥasan",
    "‘Abdu’l\\s+Ḥamíd = ‘Abdu’l-Ḥamíd",
    "Aflat[o]?un = Aflatún",
    "Gh[uo]ds[e]?[ei] = Qudsí",
    "As[s]?ad[-’‘ ']?[uoOU]'?ll[aá]h? = Asadu’lláh",
    "S[ií]n[aá] = Síná",
    "N[ií][aá]z = Níáz",
    "M[ea]nsh[aá]d[ií] = Man<u>sh</u>ádí",
    "Aga = Áqá",
    "'?A[z]?z[ií]z'?[ou]'?ll[aá]h = ‘Azíz’u’lláh",
    "‘Alí Muḥammad = ‘Alí-Muḥammad",
    "'?Abd[uo]l = ‘Abdu’l",
    "‘Abdu’l Ḥusayn = ‘Abdu’l-Ḥusayn",
    "Hamadan = Hamadán",
    "Ab[u]?l = Abu’l",
    "Abu’l\\s+Faḍl = Abu’l-Faḍl",
    "Rama[ḍd][aá]n = Ramaḍán",
    "Sheik = <u>Sh</u>ay<u>kh</u>",
    "sheik = <u>sh</u>ay<u>kh</u>",
    "R[ei][zdḍ][aá] = Riḍá",
    "Hajeb[-]ed[-]Doulet = Ḥájibu’d-Dawlih",
    "Nayeb[-]us[-]Saltaneh = Ná’ibu’s-Sulṭánih",
    "El Qur’án = the Qur’án",
    "Sadek = Sádiq",
    "'?Al[ií] = ‘Alí",
    "Nur = Núr",
    "Rasheed = Ra<u>sh</u>íd",
    "Motosarraf = Mutaṣarrif",
    "'?[EI]zzat = ‘Izzat",
    "Abu'?l\\s+Gasem = Abu’l-Qásim",
    "Hab[b]?ib[uo]ll[aá]h = Ḥabíb’u’lláh", // Habbibollah
    "Khodabakshi = <u>Kh</u>udabak<u>sh</u>í",
    "B[oa]shr[o]?u[a]?y[ea]h = Bu<u>sh</u>rúyyih", // Boshrouyah
    "Tarazollah = Taraz’u’lláh",
    "Faḍlollah = Faḍl’u’lláh",
    "Nourallah = Nur’u’lláh",
    "Vakil = Vakíl",
    "Masnavi = Ma<u>th</u>naví",
    "Ulema = ‘Ulamá",
    "Bab = Báb",
    "B[aá]b[ií] = Bábí",
    "Bushruyieh = Bu<u>sh</u>rú’í",
    "Tarbiat = Tarbíyát",
    "Suleiman = Sulaymán",
    "Khorsheed = <u>Kh</u>ur<u>sh</u>íd",
    "Vali = Valí",
    "Touba = Túbá",
    "Bagher = Báqir",
    "Beyrout = Beruit",
    "'?Abd[uo]'?llah = ‘Abdu’lláh",
    "Kurrat[-][Uu]l[-]Ayn[e]? = Qurratu’l-Ayn", // Kurrat-ul-ayne
    "'?Az[ií]z = ‘Azíz",
    "Pasha = Pá<u>sh</u>á",
    "Faran = Fárán",
    "Viz[iíe][e]?r = Vizír",
    "Hashem = Há<u>sh</u>im",
    "Majn[ou][o]?n = Majnún",
    "Badi = Badi‘",
    "Mazandaran = Mazindárán",
    "Dein = Dín",
    "Foad = Fu‘ad",
    "Basheer = Ba<u>sh</u>ír",
    "Heydar = Haydar",
    "Jameeleh = Jamílih",
    "'?[IE]sh[qk]ab[aá][dt] = ‘I<u>sh</u>qábád", // Ishqabad
    "'?A[ck][ck][aá] = ‘Akká",
    "B[ea]h[aá] = Bahá",
    "Marhaba = Marḥabá",
    "Q[aá][y]?[-‘’']?[ie]m = Qá’im",
    "Ishra[qg][h]?at = I<u>sh</u>ráqát", // Ishraghat
    "Tajalliat = Tajallíyát",
    "Tarazat = Ṭarázát",
    "Darab = Dáráb",
    "Darabi = Dárábí",
    "B[aá]b[-‘’']?[uo]l[-‘’']?B[aá]b = Bábu’l-Báb",
    "H[ae][zdḍ]r[aá]t[ií] = Haḍráti",
    "Qur[r]?at[-‘’']?[uo]l[-‘’']?[-‘’']?Ayn = Qurratu’l-‘Ayn",
    "Nur = Núr",
    "Karb[ie]la = Karbilá",
    "Khosroe = <u>Kh</u>usraw",
    "Kirman = Kirmán",
    "Muslem = Muslim",
    "n[aá][kqg][ai][zd]e[ei]n = náqiḍín",
    "Dhikr = <u>Dh</u>ikr",
    "T[ie][h]?r[áa]n = Ṭihrán",
    "Mozaffar = Muḍaffar", //
    "Manshadi = Man<u>sh</u>ádí",
    "Hijaz = Ḥijáz",
    "K[ei]rm[aá]n = Kirmán",
    "Sheikh = <u>Sh</u>ay<u>kh</u>",
    "Seyed = Siyyid",
    "Mushkin = Mi<u>sh</u>kín",
    "Mushkin = Mi<u>sh</u>kín",
    "Ahmed = Aḥmad",
    "R[uú][hḥ][-‘’']?[Uuo][-‘’']?ll[aá]h = Rúḥu’lláh",
    "Kit[aá]b[-‘’']?i[-‘’']{0,2}Ahd[ií] = Kitáb-i-‘Ahdí",
    "Zaqqum = Zaqqúm",
    "Hamadan = Hamadán",
    "Ta'?yid = Ta’yíd",
    "Tarbiyat = Tarbíyat",
    "Mihd[íi]y[aá]b[aá]d = Mihdíyábád",
    "[SṢ]adru[’']?[ṣs][-’']?[ṢS]ud[uú]r = Ṣadru’ṣ-Ṣudúr",
    "Afghanistan = Af<u>gh</u>ánistán",
    "Khalq = <u>Kh</u>alq",
    "Taraz = Ṭaráz",
    "Tajalli = Tajallí",
    "Bahram = Bahrám",
    "'?Ir[áa]q = ‘Iráq",
    "[ÍI]r[aá]n = Írán",
    "'?Ab[d]?u'?l[-]'?A[zẓ][ií]m = ‘Abdu’l-‘Aẓím",
    "[ḤH][uo][qk][uo][-‘’']?ll[aá]h = Ḥuqúqu’lláh",
    "[HḤ]u[qk][úu]qu'?ll[aá]h = Ḥuqúqu’lláh",
    "[HḤ]u[qk][úu]q = Ḥuqúq",
    "[hḥ]u[qk][úu]q = ḥuqúq",
    "mithq[aá]l = mi<u>th</u>qál",
    "Mithq[aá]l = Mi<u>th</u>qál",
    "Zaynu'?l[- ]Muqarrabin = Zaynu’l-Muqarrabín",
    "Jin[aá]b[- ]i[- ]Zaynu'?l[- ]Muqarrabin = Jináb-i-Zaynu’l-Muqarrabín",
    "Hadba'? = Ḥadbá’",
    "Jin[aá]b[- ]i[- ]Am[ií]n = Jináb-i-Amín",
    "Kit[aá]b[- ]i[- ]'?Ahd[iÍ] = Kitáb-i-‘Ahdí",
    "Kit[aá]b[- ]i[- ]'?Ahd = Kitáb-i-‘Ahd",
    "Varq[aá] = Varqá",
    "t[uú]m[aá]n = túmán",
    "zina = ziná",
    "Tajalliyat = Tajallíyát",
    "Kalimat = Kalimát",
    "Bisharat = Bi<u>sh</u>árát",
    "[TṬ]ar[aá]z[áa]t = Ṭarázát",
    "Adh[íi]rb[áa]yj[áa]n = A<u>dh</u>irbáyján",
    "Saadi = Sa‘dí",
    "[']?Umar = ‘Umar",
    "Khayyam = <u>Kh</u>ayyám",
    "Lawh[-]i[-]Maqsud = Lawh-i-Maqsúd",
    "Rudaki = Rúdakí",
    "Farabi = Fárábí",
    "Parviz = Parvíz",
    "Sasani = Sásání",
    "Barbud = Bárbud",
    "Shahnaz = <u>Sh</u>ahnáz",
    "Qazvin = Qazvín",
    "I[sṣ]f[aá]h[aá]n[ií] = Iṣfahání",
    "I[sṣ]f[aá]h[aá]n = Iṣfahán",
    "Ba(<u>)?gh(</u>)?d[aá]d[ií] = Ba<u>gh</u>dádí",
    // 'Ba(<u>)?gh(</u>)?d[aá]d = Ba<u>gh</u>dád",
    // Kheir-ol-Gara
    // Khodabaksh
  ];

  let anyWord = '([a-záíúA-ZÁÍÚ]*)'
  let endWord = '(?![a-záíúA-ZÁÍÚ])'
  CommonMispellings.forEach(function(item) {
    if (item.split('=').length == 2) {
      let find = item.split('=')[0].trim()
      let repl = item.split('=')[1].trim()

      if (/\(\)$/.test(find) && !(/\$\d$/.test(repl))) {
        repl += '$1'
      }

      find = find
        // Handle the end of the word
        .replace('()', anyWord)
        // Handle hyphens and en-dashes
        .replace('[-', '[-–')
        // .replace(/^/,)
        .replace(/'(?!\])/g,"[‘’']")

      let findUpper = find.split('').reduce((t,c,i,a) => {
        return t + (t.slice(-1) === '\\' ? c : c.toUpperCase())
      }).replace(/<(\/?)u>/ig, '<$1u>')

      str = str.replace(new RegExp(find + endWord, 'g'), repl)
      str = str.replace(new RegExp(findUpper + endWord, 'g'), repl.toUpperCase())

    }
  });

  str = str
    // fix the Ayn in case it shows up at the beginning of an attribute value
    .replace(/([a-z])=‘([AI])/ig, "$1='$2")


  // ‘Abdu’l- Baha[]
  // ‘Abdu’l- Baha’s
  // Bab
  // Baha‘u‘llah
  // Mirza Assad’Ullah
  // RIDVAN
  // MIRZA ABUL FAZL
  //  Mirza Abul Fazl was Abdul Hosein
  //  Tamaddun ul Molk
  //  Mirza Hassan Khorassani
  //  Mullah Muhammad ‘Ali and wife of Mullah Hassan
  //  Enyat’Ullah

  // remove html tags if asked
  if (stripTags) str = str.replace(/<\/?[^>]+(>|$)/g, "");

  return str;
}



module.exports.correct = _autoCorrectBahai;


