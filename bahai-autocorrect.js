const wordDiff = require('word-diff')
const wordChar = 'a-záíúA-ZÁÍÚ'
const anyWord = `([${wordChar}]*)`
const startWord = `([^${wordChar}])`
const endWord = `(?![${wordChar}])`

  // Rules for the list of common misspellings:
  // ------------------------------------------
  // "[replace] = [find]"   The basic syntax
  //
  // In the [find] section:
  // ----------------------
  // \\               This will become a backslash in the regex
  // Baha'i           Will also replace "BAHA'I"
  // ()               Any number of word characters [a-záíúA-ZÁÍÚ]* etc.
  // ...()            Match the text at the beginning of any word
  // ...(s?)          Match (English) plural
  // '                Replaces any single quote character "[‘'’]"
  // [...'] OR [']    Replace ONLY a single quote (last character of class)
  // [-] OR [-...]    Replace hyphen or en-dash "[-–]" (first character of class)
  // [\\-]            Replace ONLY a hyphen inside a character class
  //
  // In the [replace] section:
  // -------------------------
  // $1, $2, etc.     References sets in parentheses. 
  // $1 is implied if the parenthetical set is at the end of the [find] section.
const commonMisspellings = [
  // REPLACE FIRST - DO NOT SORT!
  "$1u’l- = ()u'[l1LI][-](?![-]) ?([A-Z])", // u'l-
  "$1u’$2-$3 = ()u'([dnrstz])[-] ?([DNRSTZdnrstz])", // e.g. u'd-D
  "‘Abdu’l- = '?Abd[uoei]+'?[l1LI][-]? ?",
  "‘Abdu’l- = ‘Abdu’l[-]{2,}()",
  "u’l-Islám = u'l[-]Islam",
  "<u>Sh</u>ay<u>kh</u>u’$1 = Sh(?:ay|ei)k['h]*[Eua]'?([ldnrstz])",
  "$1u’lláh = ()[ou]'ll[aá]h()",
  "$1u’lláhí = ()[ou]'lláhi",

  // REPLACE IN ANY ORDER - SORT THESE!
  "‘Abbás = '?Abb[aá]ss?",
  "‘Abbásid = '?Abb[aá]ss?ide?(s?)",
  "‘Abdu’l-‘Aẓím = '?Ab[d]?u'?l[-]'?A[zẓ][ií]m",
  "‘Abdu’l-Bahá = '?Abd[ou][-' ]l[-' ]Bah[aá]",
  "‘Abdu’l-Bahá = '?Abd[uoei]+'?[l1I]*'*[- ]*B[ea]h[aá]a?",
  "‘Abdu’l-Bahá = '?Abd[uoei]+'?l[- ]*Babs", // ADDED
  "‘Abdu’lláh = '?Abd[uo]'?ll[aá]h?",
  "‘Akká = '?A[ck][ck][aá]",
  "‘Alá’ = 'Al[aá]'([u]?)", // ADDED
  "‘Alí = '?Al[ií](y?)",
  "‘Alí = '?Ali([\\.\\!\\?< \\-])", // TODO: Why the extra regex?
  "‘Alí-Akbar = '?Al[ií][- ]Akb[aá]r",
  "‘Arab = 'Arab", // Added
  "‘Avámid = '?Av[áa]mid", // ADDED
  "‘Aẓamat = '?A[zẓ]amat", // ADDED
  "‘Azíz = '?Az[ií]z",
  "‘Azíz’u’lláh = '?A[z]?z[ií]z'?[ou]'?ll[aá]h",
  "‘Azízu’lláh = '?Az[ieí][e]?z'?[uoOU]'?ll[aá]h?",
  "‘I<u>sh</u>qábád = '?[IE]sh[qk]ab[aá][dt]", // Ishqabad
  "‘Ilm = '?Ilm", // ADDED
  "‘Ináyatu’lláh = '?[IE]n[áa]?y[aá]?t?'?[uOUo]'?ll[áa]h",
  "‘Iráq = '?Ir[áa]q",
  "‘Izzat = '?[EI]zzat",
  "‘Ulamá = Ulema(s?)",
  "‘Umar = [']?Umar",
  "<u>Dh</u>ikr = Dhikr",
  "<u>Dh</u>ikru’lláh = Dhikr'?u'?ll[aá]h",
  "<u>Kh</u>adíjih = Khad[íi]j[ei]h",
  "<u>Kh</u>alq = Khalq",
  "<u>Kh</u>án = Kh[aá]n",
  "<u>Kh</u>ánum = Kh?[aá]nn?[uo]m",
  "<u>Kh</u>ayru’lláh = K[h]?[ae][yi]?r'?[uoOU]'?ll[aá]h?",
  "<u>Kh</u>ayyám = Khayyam",
  "<u>Kh</u>udabak<u>sh</u>í = Khodabakshi",
  "<u>Kh</u>ur<u>sh</u>íd = Khorsheed",
  "<u>Kh</u>urasán = Kh[uo]r[aá]ss?[aá]n",
  "<u>Kh</u>urasání = Kh[uo]r[aá]ss?[aá]n[iíI]",
  "<u>Kh</u>usraw = Kh[ou]sr[aou][w]?",
  "<u>Kh</u>usraw = Khosroe",
  "<u>Sh</u>áh = Sh[aá]h(s?)",
  "<u>Sh</u>áhin<u>sh</u>áh = Sh[aá]h[ie]nshah", // ADDED
  "<u>Sh</u>áhmírzád = Sh[aá]hm[ií]rz?[áa]d", // ADDED
  "<u>Sh</u>áhmírzádí = Sh[aá]hm[ií]rz?[áa]d[iíI]", // ADDED
  "<u>Sh</u>ahnáz = Shahnaz",
  "<u>Sh</u>áhrúd = Sh[aá]hro?[ouú]d", // ADDED
  "<u>Sh</u>áhzádih = Sh[aá]hz[aá]d[ie]h", // ADDED
  "<u>Sh</u>araf = Sharaf", // ADDED
  "<u>Sh</u>avirdí = Shavirdi", // ADDED
  "<u>Sh</u>ay<u>kh</u> = Shaykh()",
  "<u>Sh</u>ay<u>kh</u> = Sheikh?()",
  "<u>sh</u>ay<u>kh</u> = sheikh?()",
  "<u>Sh</u>ay<u>kh</u>í = <u>Sh</u>ay<u>kh</u>[ií]e?(s?)", // ADDED
  "<u>Sh</u>ay<u>kh</u>u’l-Islám = <u>Sh</u>ay<u>kh</u>u’l-Isl[aá]m",
  "<u>Sh</u>í‘ah = Sh[ií][ií]?'?[aei]h(s?)", // 54 in GPB
  "<u>Sh</u>íráz = Sh[ií]r[áa]z",
  "<u>Sh</u>írází = Sh[ií]r[áa]z[ií](s?)",
  "<u>Sh</u>írází = Sh[ií]r[áa]zee",
  "A<u>dh</u>irbáyján = Adh[ií]rb[áa]yj[áa]n",
  "A<u>gh</u>ṣán = Aghs[aá]n()",
  "Á<u>sh</u><u>ch</u>í = [AÁ]shch[ií]",
  "Abbúd = Abb[uú]d",
  "Abhá = Abha",
  "Abú- = Ab[uú][-]",
  "Abu’l- = Abul'?[- ]?", // ADDED
  "Abu’l- = Ab[uú]'?[lI][-] ?()",
  "Abu’l-Faḍl = Abu'?l[-_ ]+Fa[dḍz]h?le?",
  "Abu’l-Faḍl = Abu’l\\s+Faḍl",
  "Abu’l-Qásim = Ab[uú]'?l[- ]*[GQ][áa]s[ie]m", // This was changed from Abú'l-Qásim, which seems to be a misspelling
  "Administration = Administraiton",
  "Af<u>gh</u>ánistán = Afghanistan",
  "Af<u>sh</u>ar = Afshar",
  "Aflatún = Aflat[o]?un",
  "Afnán = Afn[aá]n()",
  "Afru<u>kh</u>tih = Afr[uú]khtih",
  "Aḥmad = Ahmad()",
  "Aḥmad = Ahmed",
  "Alláh = All[áa]h",
  "Alláh-u-Abhá = All[aá]h[-]?[uoOU][-' ]?[Aa]bh[aá](s?)",
  "Alláhs = All[áa]hs",
  "Áqá = [ÁA]q[aá]()",
  "Áqá = Aga",
  "Áqáy-i-Kalím = [AÁ]q[aá]y[-]i[-]Kal[ií]m",
  "Aqdas = A[kqh][h]?d[aá]s",
  "Asadu’lláh = As[s]?ad[-’‘ ']?[uoOU]'?ll[aá]h?",
  "Asadu’lláh = Ass?ad[- ’‘']?[uoOU]'?ll[aá]h?",
  "Ásíyih = [ÁA]sí[i]?yih",
  "Asmá’ = Asm[aá]'?", // ADDED
  "Azalí = [AE]zal[ií]()",
  "Ba<u>gh</u>dád = Bag[h]?d[aá]d()",
  "Ba<u>gh</u>dádí = Ba(?:<u>)?gh?(?:</u>)?d[aá]d[iíI](s?)",
  "Ba<u>sh</u>ír = Basheer",
  "Báb = B[aá]b",
  "Báb = Bab",
  "Bábí = B[aá]b[iíI]",
  "Bábís = B[aá]b[ií]s",
  "Bábu’l-Báb = B[aá]b[-‘’']?[uo]l[-‘’']?B[aá]b",
  "Badí‘ = Badi'",
  "Badí‘u’ = Bad[ií]'?[uo]'?()",
  "Bahá = B[ea]h[aá]",
  "Bahá = Bah[áa]",
  "Bahá’í = Bah[aá]'?[iíI]",
  "Bahá’ís = Bah[aá]'?[iíI]s",
  "Bahá’u’l-Abhá = Bah[aá][ ’‘']?[EUO]l[ ’‘']?Abh[aá]",
  "Bahá’u’lláh = Bah[aá][- ]?'?[UOuo0ú]'?[lL]+[aá]h",
  "Bahíyyih = Bah[ií]yy?[ia]h",
  "Bahjí = B[ae]h?j[íei]",
  "Bahrám = Bahram",
  "Banání = Ban[aá]n[ií]()",
  "Báqir = B[áa](?:gh|q)[ie]r",
  "Bárbud = Barbud",
  "Bastamí = Bastami", // ADDED
  "Bayán = B[ae]y[aáe]n(s?)",
  "Bayánu’l-‘Arabí = Bay[aá]nu'l-'?Arabi", // ADDED
  "Beruit = Beyrout",
  "Bi<u>sh</u>árát = Bisharat",
  "Bú<u>sh</u>ihr = B[úu]shih?r()",
  "Bu<u>sh</u>rú'í = Bushr[uú]'[iíI]", // ADDED
  "Bu<u>sh</u>rú’í = Bushruyieh",
  "Bu<u>sh</u>rúyyih = B[oa]shr[o]?u[a]?y[ea]h", // Boshrouyah
  "Burújird = Burujird", // ADDED
  "Burújirdí = Bur[uú]jird[iíI]", // ADDED
  "d-Dawlih = [d]-Dawla", // ADDED
  "d-Dín = [d]-Din", // ADDED
  "Dáráb = Darab",
  "Dárábí = Darabi",
  "Dín = Dein",
  "Ḍíyá’íyyih = Dia'iyyih",
  "Effendi = Effendie?",
  "Faḍil = Fa[zd][ei]l()",
  "Faḍl = Fa[zd]l()",
  "Faḍl’u’lláh = Faḍlollah",
  "Fárábí = Farabi",
  "Fárán = Faran",
  "Fáṭimih = F[áa][ṭt][ie]m[ia]h",
  "Fu‘ad = Foad",
  "Furútan = Fur[úu]t[áa]n",
  "Guardian = G[r]?[a]?u[a]?[r]?dian",
  "Gulpáygán = G[ou]lp[aá]ye?g[aá]n",
  "Gulpáygání = G[ou]lp[aá]ye?g[aá]n[ií]",
  "Há<u>sh</u>im = Hashem",
  "Ḥabíb’u’lláh = Hab[b]?ib[uo]ll[aá]h", // Habbibollah
  "Ḥadbá’ = Hadba'?",
  "Hádí = H[áa]d[ií]()",
  "Ḥadí<u>th</u> = [ḤH][áa]d[ií][i]?th",
  "Haḍráti = H[ae][zdḍ]r[aá]t[iíI]",
  "Ḥáfiẓ = [ḤH][áa]f[ie][zẓ]",
  "Ḥájí = [HḤ][aá]d?j?j[iíI]",
  "Ḥajíbu’d-Dawlih = [HḤ][aá]j[ií]b[-]ed[-]Dawl[ai]h?", // ADDED
  "Ḥajíbu’d-Dawlih = [HḤ][aá]j[ií]bu'l?d[-]?Dawl[ai]h?", // ADDED
  "Ḥájibu’d-Dawlih = Hajeb[-]ed[-]Doulet",
  "Ḥakím = [HḤ][aá]k[ií]m()",
  "Hamadán = Hamadan",
  "Hamadán = Hamadan",
  "Ḥamíd = [ḤH]am[ií]d()",
  "Ḥasan = [HḤ]ass?an()",
  "Ḥasan = Hasssan",
  "Haydar = Heydar",
  "Ḥaydar-‘Alí = [ḤH]a[yi]d[ae]r[- ][‘']?Al[ií]()",
  "Ḥaẓíra = [ḤH]a[zẓ][ií]ra[h]?(s?)",
  "Ḥaẓíratu’l-Quds = [ḤH]a[zẓ][ií]rat'?u'?[lI][- ][QGK][uo]ds",
  "Ḥijáz = Hijaz",
  "Ḥuqúq = [ḤH][uo][qqk][uú][kgq]()",
  "ḥuqúq = [hḥ]u[qk][úu]q",
  "Ḥuqúq = [HḤ]u[qk][úu]q",
  "Ḥuqúqu’lláh = [ḤH][uo][qk][uo][-‘’']?ll[aá]h",
  "Ḥuqúqu’lláh = [HḤ]u[qk][úu]qu'?ll[aá]h",
  "Ḥusayn = [HḤ][uo]ss?[ea][yi]n()",
  "i-Mírí = i-M[iíl]r[iíI]", // ADDED
  "I<u>sh</u>ráqát = Ishra[qg][h]?at",
  "In<u>sh</u>á’alláh = Insh[áa]'?all[áa]h",
  "Íqán = [IE][qkg][hu]?[aá]n",
  "Írán = [ÍI]r[aá]n",
  "Iṣfahán = [IE][ṣs][fp][h]?[aá]h[áa]n",
  "Iṣfahán = I[sṣ]f[aá]h[aá]n()",
  "Iṣfahání = I[sṣ]f[aá]h[aá]n[iíl](s?)",
  "Iṣfahání = Iṣfahán[iíI]",
  "Ismá’íl = Ism[aá]'?[ií]l", // ADDED
  "Ismu’lláh = Ism[ou]'?ll[aá]h",
  "Ismu’lláhu’l = Ism[ou]'?ll[aá]h[ou]?'?l",
  "Jalál = Jal[aá]l()",
  "Jalálu'd-Dín = Jal[aá]l[iau]'?d[- ]D[ií]n",
  "Jamál = Jam[aá]l()",
  "Jamílih = Jameeleh",
  "Javád = Ja[vw][aá]d()",
  "Jináb = J[ie]n[aá]b",
  "Jináb-i-Amín = Jin[aá]b[- ]i[- ]Am[ií]n",
  "Jináb-i-Zaynu’l-Muqarrabín = Jin[aá]b[- ]i[- ]Zaynu'?l[- ]Muqarrabin",
  "Jinábí = J[ie]n[aá]b[iíI]",
  "Julfá = Julfa", // ADDED
  "Juvayní = Juvayn[ií]", // ADDED
  "Ká<u>sh</u>án = K[aá]sh[aá]n",
  "Ká<u>sh</u>ání = K[aá]sh[aá]n[iíI]",
  "Ka<u>sh<u>í = Kash[ií]", // ADDED
  "Kalimát = Kalimat",
  "Kamál = Kam[áa]l()",
  "Karbilá = Karb[ie]la",
  "Káẓim = K[aá][ẓz]im()",
  "Kirmán = K[ei]rm[aá]n",
  "Kirmán = Kirman",
  "Kirman<u>sh</u>áh = K[ei]rm[aá]nsh[aá]h", // ADDED
  "Kirman<u>sh</u>áhí = K[ei]rm[aá]nsh[aá]h[iíI]", // ADDED
  "Kirmání = K[ei]rm[aá]n[iíI]", // ADDED
  "Kitáb = Kitab()",
  "Kitáb-i-‘Ahd = Kit[aá]b[- ]i[- ]'?Ahd",
  "Kitáb-i-‘Ahdí = Kit[aá]b[- ]i[- ]'?Ahd[iÍ]",
  "Kitáb-i-‘Ahdí = Kit[aá]b[-‘’']?i[-‘’']{0,2}Ahd[iíI]",
  "Lás-Furú<u>sh</u> = L[aá]sh?[- ]Fur[uú]sh", // ADDED
  "Lawh-i-Maqsúd = Lawh[-]i[-]Maqsud",
  "Luṭfu’lláh = L[uo][tṭ]f'?[uoUO]'?[-]? ?ll[aá]h",
  "Ma<u>sh</u>had = Mashh?[áa]d",
  "Ma<u>sh</u>hadí = Mashh?[áa]d[ií](s?)",
  "Ma<u>sh</u>íyyat = Mash[ií]yyat", // ADDED
  "Ma<u>sh</u>riqu’l-A<u>dh</u>kár = Mash[-]?r[iea][qk][-]?[uoe]'?l[- ]?[Aa][zd]h?[kc][aá]r(s?)",
  "Ma<u>th</u>naví = Masnavi",
  "Máh-Kú = Mah?[- ]?[kK]u", // ADDED
  "Maḥmúd = M[ae][ḥh]m[úo]o?d",
  "Maḥmúd = Ma[hḥ]m[o]?[uú]d",
  "Majíd = Maj[ií]d",
  "Majídí = Maj[ií]d[ií](s?)",
  "Majlisí = Majlis[ií]", // ADDED
  "Majnún = Majn[ou][o]?n",
  "Málmír = M[aá]lm[ií]r", // ADDED
  "Málmírí = M[aá]lm[ií]r[ií]", // ADDED
  "Man<u>sh</u>ádí = M[ea]nsh[aá]d[iíI]",
  "Man<u>sh</u>ádí = Manshadi",
  "Mará<u>gh</u>i = M[aá]r[aá]ghi", // ADDED
  "Mará<u>gh</u>i'í = M[aá]r[aá]ghi'[iíI]", // ADDED
  "Marḥabá = Marhaba",
  "Masá’il = Mas[aá]'?il", // ADDED
  "Masra‘ih = Ma[sd]r[aá]?'?[ií][h]?",
  "Mázindarán = M[áa]z[ie]nd[ae]r[aá]n",
  "Mazindárán = Mazandaran",
  "Mázindarání = M[áa]z[ie]nd[ae]r[aá]n[iíI]",
  "Mi<u>sh</u>kín = Mushkin",
  "mi<u>th</u>qál = mithq[aá]l(s?)",
  "Mi<u>th</u>qál = Mithq[aá]l(s?)",
  "Mihdí = Mihd[ií]()",
  "Mihdíyábád = Mihd[ií]y[aá]b[aá]d",
  "Mír = Mir",
  "Mírzá = Mirza([ys]?)",
  "Mu‘allim = M[ou]u'all[ei]m", // ADDED
  "Muḍaffar = Mozaffar", //
  "Muḥájir = Mu[ḥh][áa]j[eií]r(s?)",
  "Muḥammad = M[ao]hh?[oa]met()",
  "Muḥammad = M[uo]hh?amm?[aeá]d()",
  "Muḥammad-‘Alí = Muḥammad[- ]'?Al[ií]([ys]?)",
  "Muḥammadan = Muḥammad[ea]n",
  "Muḥyi’d-Dín = M[ou][hḥ]e?y[ie]?d[- ]?[dD][ií]n",
  "Mullá = M[uo]ll[áa][h]?(s?)",
  "Munír = M[uo]n[iíe]e?r()",
  "Munírih = Munír[aie][h]?",
  "Muslim = Muslem",
  "Musta<u>gh</u>á<u>th</u> = M[ou]stagh?[aá]th", // ADDED
  "Mutaṣarrif = Motosarraf",
  "Ná’ibu’s-Sulṭánih = Nayeb[-]us[-]Saltaneh",
  "Nabíl = Nab[ií]l()",
  "Náqiḍ = N[áa][qgk][ai][ḍzd][z]?()",
  "náqiḍín = n[aá][kqg][ai][zd]e[ei]n",
  "Náqiḍín = N[áa][qgk][ai][ḍzd][z]?[ieí][e]?n",
  "Náṣiri’d-Dín = N[aá][sṣ]iri'd[-]?D[ií]n",
  "Navváb = Nav[v]?[aá]b",
  "Naw-Rúz = N[a][uw]?[- ]?[Rr][uoú][uo]?z",
  "Naw-Rúz = N[ao][w]?[- ][Rr][uú]z",
  "Nayríz = Nayriz",
  "Nayrízí = Nayr[ií]zi",
  "Níáz = N[ií][aá]z",
  "Núr  = No?[uú]r ",
  "Núr = Nur",
  "Núr = Nur",
  "Nur’u’lláh = Nourallah",
  "Núrí = No?[uú]r[iíI]",
  "Núrí = No?ur[iíI]",
  "Núri’d-Dín = N[o]?urr?[aie]d[- ]?[dD]?[ií]n",
  "Núru’lláh = N[uú]r'?[uoOU]'?ll[aá]h?",
  "Pá<u>sh</u>á = P[aá]sh[aá]",
  "Pá<u>sh</u>á = Pasha([sy]*)",
  "Paran = P[áa]r[áa]n",
  "Parvíz = Parviz",
  "Port Sa‘íd = Port\s+Said",
  "Qá'in = Q[aá]'?in",
  "Qá'iní = Q[aá]'?in[ií]",
  "Qá’im = Q[aá][y]?[-‘’']?[ie]m",
  "Qádí-Kalá = Q[aá]d[ií][-]?[Kk][aá]l[aá]",
  "Qádí-Kalá’í = Q[aá]d[ií][-]?[Kk][aá]l[aá]'?i",
  "Qájár = [QG][aá]j[aá]r(s?)",
  "Qayyúmu’l-Asmá’ = Qayy[uú]m[uo]'?l[- ][Aa]sm[aá]'?",
  "Qazvín = Qazvin",
  "Qazvíní = Qazvíni", // ADDED
  "Quddús = Qudd[uú]s()",
  "Qudsí = Gh[uo]ds[e]?[ei]",
  "Qulam = Golam",
  "Qulí = Kuly",
  "Qur’án = [QK][uo]'?r'?[aá][aá]?n()",
  "Qurratu’l-‘Ayn = Qur[r]?at[-‘’']?[uo]l[-‘’']?[-‘’']?Ayn",
  "Qurratu’l-Ayn = Kurrat[-][Uu]l[-]Ayn[e]?", // Kurrat-ul-ayne
  "Ra<u>sh</u>íd = Rasheed",
  "Ra<u>sh</u>t = R[ea]sht",
  "Ra<u>sh</u>tí = R[ea]sht[iíI]",
  "Rabbání = Rabb[aá]n[ií]()",
  "Raḥím = Ra[ḥh][ií]m()",
  "Raḥmat = Ra[hḥ]mat",
  "Ramaḍán = Rama[ḍd][aá]n(s?)",
  "Riḍá = R[ei][zdḍ][aá]",
  "Riḍván = Ri[dḍz]h?[vw][áa]a?n()",
  "Rúdakí = Rudaki",
  "Rúḥá = Ro?[uú][hḥ][aá]()",
  "Rúhangíz = Ruhangiz",
  "Rúḥí = Ro?[uú][ḥh][iíy]()",
  "Rúḥu’lláh = R[úu][ḥh]?[uo]'?ll[áa]h",
  "Rúḥu’lláh = R[uú][hḥ][-‘’']?[Uuo][-‘’']?ll[aá]h",
  "Sa‘dí = Saadi",
  "Sa‘íd = Sa'[ií]d()",
  "Sabzivár = Sabz[aei]v[aá]r",
  "Sabzivárí = Sabz[aei]v[aá]r[iíI]", // ADDED
  "Sádiq = Sadek",
  "Salmán = Salman",
  "Salmání = Salm[aá]n[ií]",
  "Ṣadru’ṣ-Ṣudúr = [SṢ]adru[’']?[ṣs][-’']?[ṢS]ud[uú]r",
  "Samandarí = Samandar[ií]()",
  "Sardár = Sardar", // ADDED
  "Sásání = Sasani",
  "Shahr-Bánú = Shahr-[bB]anu", // ADDED
  "Shoghi = Shogh?ie?",
  "Síná = S[ií]n[aá]",
  "Síyáh-<u>Ch</u>ál = S[ií]y[aá][h]?[- ]Ch[aá]l",
  "Siyyid = S[eia]y[y]?[eia]d()",
  "Ṣubḥ-i-Azal = [ṢS][uo]b[ḥh]?[- ]?[ie][- ][AE]z[ae]l",
  "Sulaymán = S[uo]l[ea]ym[aá]n()",
  "Sulaymán = Suleiman",
  "Sulaymáníyyih = S[uo]l[eia][y]?m[aá]n[ií]y[y]?[ai][h]?",
  "Sulṭán = Sul[ṭt][aá]n()",
  "Sunní = S[uo]nn[ií]()",
  "Súrah = S[úu]r[aei]h(s?)",
  "Súratu’l-Haykal = S[úu]ra[y]?[t]?'?[uo]'?l[- ]Hayk[a]?l",
  "Ta’yíd = Ta'?yid",
  "Ṭabarsí = [ṬT]ab[áa]rs[iíI]",
  "Tabríz = Tabr[ií]z", // ADDED
  "Tabrízí = Tabr[ií]z[iíI]", // ADDED
  "Tafrí<u>sh</u> = Tafrish", // ADDED
  "Tafrí<u>sh</u>í = Tafr[ií]sh[ií]", // ADDED
  "Ṭáhirih = [ṬT][aá]h[ie]r[ai][hy]?[y]?",
  "Tajallí = Tajalli",
  "Tajallíyát = Tajalliat",
  "Tajallíyát = Tajalliyat",
  "Tamaddunu’l-Mulk = Tamadd?[uo]n ?[uoa]'?l[- ][Mm][uo]lk",
  "Taqí = Ta[qkg][ií](y?)",
  "Ṭaráz = Taraz",
  "Taraz’u’lláh = Tarazollah",
  "Ṭarázát = [TṬ]ar[aá]z[áa]t",
  "Ṭarázát = Tarazat",
  "Tarbíyát = Tarbiat",
  "Tarbíyat = Tarbiyat",
  "the Qur’án = El Qur’án",
  "Ṭihrán = [TṬ][ie]h?e?r[aá]n",
  "Ṭihrání = [TṬ][ie]h?e?r[aá]n[iíI]",
  "Túbá = Touba",
  "túmán = t[uú]m[aá]n(s?)",
  "Tur<u>sh</u>íz = Tursh[ií]z", // ADDED
  "Tur<u>sh</u>ízí = Tursh[ií]z[iíI]", // ADDED
  "Ustád = Ust[aá]d",
  "Vakíl = Vakil",
  "Valí = Vali(s?)",
  "Varqá = Varq[aá]()",
  "Vizír = Viz[iíe][e]?r()",
  "Yaḥyá = Y[ae][ḥh]y[áa]([yh]?)",
  "Yaḥyáy-i-Dárábí = Yaḥyáy[-]{,2}i[-]D[aá]r[aá]b[íia]",
  "Yazdí = Yazd[ií]()",
  "Yazíd = Yaz[ií]d()",
  "Zamán = Zaman",
  "Zaqqúm = Zaqqum",
  "Zarqán = Zarq[aá]n",
  "Zarqání = Zarq[aá]n[ií]",
  "Zayn = Zaine",
  "Zaynu’l-Muqarrabín = Zaynu'?l[- ]Muqarrabin",
  "ziná = zina",
  "Zunúz = Zunuz",
  "Zunúzí = Zun[uú]zi",

  // REPLACE LAST - DO NOT SORT!
  "‘Alí-Muḥammad = ‘Alí Muḥammad", // ‘Alí and Muḥammad both replaced earlier; this is just for the space
  "$1u’<u>$2</u>-<u>$3</u> = ()[ou]'([dst]h)[-] ?(<[uU]>|[DSTdst]h)", // u'sh-Sh
  
];

class BahaiAutocorrect {
  constructor(str = '', stripTags = false, debug = false) {
    this.original = str
    this.clean = str
    this.str = str
    this.stripTags = stripTags
    this.debug = debug
    this.diff = ''
  }
}

BahaiAutocorrect.prototype.correct = function() {

  this.changes = []
  this.str = this.str
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
    .replace(/\\l([csghzkdt]{2})/gi, '<u>$1</u>') // for glyph format \lDh
    .replace(/<u>([csghzkdt]h)([csghzkdt]h)<\/u>/ig, '<u>$1</u><u>$2</u>')
    .replace(/([csghzkdt])_(h)/ig, '<u>$1$2</u>')
    // ‘Ayns
    .replace(/\`/g, '‘').replace(/\\n/g, '‘')
    // em and i
    .replace(/\{\\\((.*?)\{\\ /g, '<em>$1</em>')
    .replace(/\{\\\"(.*?)\{\\/g, '<i>$1</i>')
    // indents
    .replace(/\{\\\(/g, '\t').replace(/\{\\\!/g, '\t')
    // weird cruft
    .replace(/\{\\\#/g, '').replace(/\{\\/g, '');

  this.clean = this.str

  commonMisspellings.forEach(function(item) {
    if (item.split('=').length == 2) {
      let find = item.split('=')[1].trim()
      let repl = item.split('=')[0].trim()

      find = find
        // Handle the end of the word
        .replace('()', anyWord)
        // Handle hyphens and en-dashes
        .replace(/\[-/g, '[-–\x1E·')
        // Handle apostrophes of all kinds
        .replace(/'(?!\])/g,"[‘’'·]")
        // Handle apostrophes within character classes
        .replace(/(\[[^\]]*)\[‘’'·\]/, "$1‘’'·")

      if (new RegExp(startWord + find + endWord, 'gi').test(this.str)) {

        // Find number of captured sets in the replacement
        let sets = ((repl || '').match(/\$\d{1}/g) || []).length

        // Handle beginnings of words
        if (!sets) {
          repl = '$1' + repl
        }
        else {
          repl = '$1' + repl.split(/\$\d{1}/g).reduce((t,v,i,a) => {
            return t + '$' + (i+1) + v
          })
        }
        sets += 1

        // Handle ends of words that should have a captured set
        if (/[^\\]\)$/.test(find) && !/\$\d$/.test(repl)) {
          repl += '$' + (sets + 1)
        }
        replUpper = repl.toUpperCase()

        let findUpper = find.split('').reduce((t,c,i,a) => {
          return t + (t.slice(-1) === '\\' ? c : c.toUpperCase())
        }).replace(/<(\/?)u>/ig, '<$1u>')

        let findRE = new RegExp(startWord + find + endWord, 'gm')
        let findUpperRE = new RegExp(startWord + findUpper + endWord, 'gm')
  

        this.str = this.str.replace(findRE, repl)
        this.str = this.str.replace(findUpperRE, replUpper)

      }

    }
  }.bind(this))

  if (this.debug) {
    // Diff must be performed line by line, so get an array of the cleaned and corrected texts
    let clean = this.clean.split('\n')
    let corrected = this.str.split('\n')

    // Only perform a diff if the arrays are the same length
    if (clean.length === corrected.length) {

      // GET LINE
      this.diff = clean.reduce((diff,line,i,a) => {
        // If the lines are exactly equal, just return
        if (line === corrected[i]) return diff
        // GET CHANGES
        return diff + new DiffChange(wordDiff.diffString(line, corrected[i])).splitDiff(/--/g).splitDiff(/\s+/g).toString()
      }, '')
    }
    else {
      this.diff = "0-length file"
      console.error('bahai-autocorrect change the number of lines in the file; this should not happen.')
    }
  }

  // Some minor cleanup
  this.str = this.str
    .replace(/·/g, ' ')

  // STRIP TAGS - TODO: remove this?
  if (this.stripTags) {
    this.str = this.str.replace(/<\/?[^>]+(>|$)/g, "")
  }

  // CLEANUP
  this.str = this.str
    // fix the Ayn in case it shows up at the beginning of an attribute value
    .replace(/([a-z])=‘([AI])/ig, "$1='$2")
  
}

BahaiAutocorrect.prototype.toString = function() {
  return this.str
}

class DiffChange {
  /**
   * @param {array} changeList an array of changes from require('word-diff').diffString(str1, str2)
   */
  constructor(changeList) {
    this.changeList = changeList
  }
}
DiffChange.prototype.splitDiff = function(regex) {
  let newChangeList = []
  for (let change of this.changeList) {
    if (change.remove || change.add) {
        // Trim the results
      change.add = change.add.trim()
      change.remove = change.remove.trim()
      // Some changed sections include multiple words which should be recorded separately
      let addList = (change.add.split(regex) || [])
      let removeList = (change.remove.split(regex) || [])
      // If the added and removed sections contain the same number of words, split them
      if (addList.length > 1 && (addList.length === removeList.length)) {
        // GET WORDS
        for (let i=0; i<addList.length; i++) {
          if (removeList[i] !== addList[i]) newChangeList.push({remove: removeList[i], add: addList[i]})
        }
      }
      // If the added and removed sections contain different numbers of words, 
      // or if the added section contains one word or none,
      else {
        // USE ENTIRE CHANGE
        newChangeList.push(change)
      }
    }
  }
  this.changeList = newChangeList
  return this
}
DiffChange.prototype.toString = function() {
  let trimRegex = /(^[\s,\.\(\){"“”'!\?;:]*)|([\]\[,\.\(\)"“”'!\?;:\*^F0-9]*$)/g
  return this.changeList.reduce((text,change,i,a) => {
    let line = `${change.add.trim().replace(trimRegex, '')}\t${change.remove.trim().replace(trimRegex, '')}`
    return (line.trim().length ? text + line + '\n' : text)
  }, '')
}

module.exports = BahaiAutocorrect


