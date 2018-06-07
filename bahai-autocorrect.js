const wordDiff = require('word-diff')
const wordChar = 'a-záíúA-ZÁÍÚ'
const anyWord = `([${wordChar}]*)`
const startWord = `([^${wordChar}])`
const endWord = `(?![${wordChar}])`

  // Rules for the list of common misspellings:
  // ------------------------------------------
  // "[find] = [replace]"   The basic syntax
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

  // REPLACE IN ANY ORDER
  "'?[EI]zzat = ‘Izzat",
  "'?[IE]n[áa]?y[aá]?t?'?[uOUo]'?ll[áa]h = ‘Ináyatu’lláh",
  "'?[IE]sh[qk]ab[aá][dt] = ‘I<u>sh</u>qábád", // Ishqabad
  "'?A[ck][ck][aá] = ‘Akká",
  "'?A[z]?z[ií]z'?[ou]'?ll[aá]h = ‘Azíz’u’lláh",
  "'?Ab[d]?u'?l[-]'?A[zẓ][ií]m = ‘Abdu’l-‘Aẓím",
  "'?Abb[aá]ss?ide?(s?) = ‘Abbásid",
  "'?Abb[aá]ss? = ‘Abbás",
  "'?Abd[uo]'?l = ‘Abdu’l",
  "'?Abd[uo]'?ll[aá]h? = ‘Abdu’lláh",
  "'?Abd[uo]l = ‘Abdu’l",
  "'?Abd[uoe]'?l[- ]*Babs = ‘Abdu’l-Bahá", // ADDED
  "'?Abd[uoe]'?[l1]'?[- ]*B[ea]h[aá]a? = ‘Abdu’l-Bahá",
  "'Al[aá]'([u]?) = ‘Alá’", // ADDED
  "'?Al[ií](y?) = ‘Alí",
  "'?Al[ií][- ]Akb[aá]r = ‘Alí-Akbar",
  "'?Ali([\\.\\!\\?< \\-]) = ‘Alí", // TODO: Why the extra regex?
  "'?Av[áa]mid = ‘Avámid", // ADDED
  "'?Az[ieí][e]?z'?[uoOU]'?ll[aá]h? = ‘Azízu’lláh",
  "'?A[zẓ]amat = ‘Aẓamat", // ADDED
  "'?Az[ií]z = ‘Azíz",
  "'?Ilm = ‘Ilm", // ADDED
  "'?Ir[áa]q = ‘Iráq",
  "‘Abdu’l Ḥusayn = ‘Abdu’l-Ḥusayn",
  "‘Abdu’l\\s+Ḥamíd = ‘Abdu’l-Ḥamíd",
  "‘Abdu’l\\s+Ḥasan = ‘Abdu’l-Ḥasan",
  "'Arab = ‘Arab", // Added
  "[']?Umar = ‘Umar",
  "A[kqh][h]?d[aá]s = Aqdas",
  "Ab[uú][-] = Abú-",
  "Abul'?[- ]? = Abu'l-", // ADDED
  "Ab[uú]'?([lsh]+)[-] ? = Abu’$1-",
  "Ab[uú]'?l[- ]*(\\n?)[GQ][áa]s[ie]m = $1Abu’l-Qásim", // This was changed from Abú'l-Qásim, which seems to be a misspelling
  "Abb[uú]d = Abbúd",
  "Abha = Abhá",
  "Abu'?l[-_ ]+Fa[dḍz]h?le? = Abu’l-Faḍl",
  "Abu’l\\s+Faḍl = Abu’l-Faḍl",
  "Adh[ií]rb[áa]yj[áa]n = A<u>dh</u>irbáyján",
  "Administraiton = Administration",
  "Afghanistan = Af<u>gh</u>ánistán",
  "Aflat[o]?un = Aflatún",
  "Afn[aá]n() = Afnán",
  "Aga = Áqá",
  "[ÁA]q[aá]() = Áqá",
  "[AÁ]q[aá]y[-]i[-]Kal[ií]m = Áqáy-i-Kalím",
  "Aghs[aá]n() = A<u>gh</u>ṣán",
  "Ahmad() = Aḥmad",
  "Ahmed = Aḥmad",
  "All[áa]h = Alláh",
  "All[áa]hs = Alláhs",
  "All[aá]h[-]?[uoOU][-' ]?[Aa]bh[aá](s?) = Alláh-u-Abhá",
  "As[s]?ad[-’‘ ']?[uoOU]'?ll[aá]h? = Asadu’lláh",
  "Ass?ad[- ’‘']?[uoOU]'?ll[aá]h? = Asadu’lláh",
  "Asm[aá]'? = Asmá’", // ADDED
  "[ÁA]sí[i]?yih = Ásíyih",
  "[AE]zal[ií]() = Azalí",
  "B[aá]b = Báb",
  "B[aá]b[-‘’']?[uo]l[-‘’']?B[aá]b = Bábu’l-Báb",
  "B[aá]b[iíI] = Bábí",
  "B[aá]b[ií]s = Bábís",
  "B[ae]h?j[íei] = Bahjí",
  "B[ae]y[aáe]n(s?) = Bayán",
  "Bay[aá]nu'l-'?Arabi = Bayánu’l-‘Arabí", // ADDED
  "B[ea]h[aá] = Bahá",
  "B[oa]shr[o]?u[a]?y[ea]h = Bu<u>sh</u>rúyyih", // Boshrouyah
  "B[úu]shih?r() = Bú<u>sh</u>ihr",
  "Ba(?:<u>)?gh?(?:</u>)?d[aá]d[iíI](s?) = Ba<u>gh</u>dádí",
  "Bab = Báb",
  "Badi' = Badí‘",
  "Bad[ií]'?[uo]'?() = Badí‘u’",
  "Bag[h]?d[aá]d() = Ba<u>gh</u>dád",
  "B[áa](?:gh|q)[ie]r = Báqir",
  "Bah[áa] = Bahá",
  "Bah[aá]'?[iíI] = Bahá’í",
  "Bah[aá]'?[iíI]s = Bahá’ís",
  "Bah[aá][ ’‘']?[EUO]l[ ’‘']?Abh[aá] = Bahá’u’l-Abhá",
  "Bah[aá][- ]?'?[UOuo0ú]'?[lL]+[aá]h = Bahá’u’lláh",
  "Bah[ií]yy?[ia]h = Bahíyyih",
  "Bahram = Bahrám",
  "Ban[aá]n[ií]() = Banání",
  "Barbud = Bárbud",
  "Basheer = Ba<u>sh</u>ír",
  "Bastami = Bastamí", // ADDED
  "Beyrout = Beruit",
  "Bisharat = Bi<u>sh</u>árát",
  "Burujird = Burújird", // ADDED
  "Bur[uú]jird[iíI] = Burújirdí", // ADDED
  "Bushr[uú]'[iíI] = Bu<u>sh</u>rú'í", // ADDED
  "Bushruyieh = Bu<u>sh</u>rú’í",
  "Darab = Dáráb",
  "Darabi = Dárábí",
  "[d]-Din = d-Dín", // ADDED
  "[d]-Dawla = d-Dawlih", // ADDED
  "Dein = Dín",
  "Dhikr = <u>Dh</u>ikr",
  "Dia'iyyih = Ḍíyá’íyyih",
  "Effendie? = Effendi",
  "El Qur’án = the Qur’án",
  "F[áa][ṭt][ie]m[ia]h = Fáṭimih",
  "Fa[zd][ei]l() = Faḍil",
  "Fa[zd]l() = Faḍl",
  "Faḍlollah = Faḍl’u’lláh",
  "Farabi = Fárábí",
  "Faran = Fárán",
  "Foad = Fu‘ad",
  "Fur[úu]t[áa]n = Furútan",
  "G[r]?[a]?u[a]?[r]?dian = Guardian",
  "Gh[uo]ds[e]?[ei] = Qudsí",
  "Golam = Qulam",
  "H[áa]d[ií]() = Hádí",
  "H[ae][zdḍ]r[aá]t[iíI] = Haḍráti",
  "Hab[b]?ib[uo]ll[aá]h = Ḥabíb’u’lláh", // Habbibollah
  "Hadba'? = Ḥadbá’",
  "Hajeb[-]ed[-]Doulet = Ḥájibu’d-Dawlih",
  "Hamadan = Hamadán",
  "Hamadan = Hamadán",
  "Hashem = Há<u>sh</u>im",
  "Hasssan = Ḥasan",
  "Heydar = Haydar",
  "Hijaz = Ḥijáz",
  "[HḤ][aá]d?j?j[iíI] = Ḥájí",
  "[HḤ][aá]j[ií]bu'l?d[-]?Dawl[ai]h? = Ḥajíbu’d-Dawlih", // ADDED
  "[HḤ][aá]j[ií]b[-]ed[-]Dawl[ai]h? = Ḥajíbu’d-Dawlih", // ADDED
  "[ḤH][áa]d[ií][i]?th = Ḥadí<u>th</u>",
  "[ḤH][áa]f[ie][zẓ] = Ḥáfiẓ",
  "[HḤ][aá]k[ií]m() = Ḥakím",
  "[ḤH][uo][qk][uo][-‘’']?ll[aá]h = Ḥuqúqu’lláh",
  "[ḤH][uo][qqk][uú][kgq]() = Ḥuqúq",
  "[HḤ][uo]ss?[ea][yi]n() = Ḥusayn",
  "[ḤH]a[yi]d[ae]r[- ][‘']?Al[ií]() = Ḥaydar-‘Alí",
  "[ḤH]a[zẓ][ií]ra[h]?(s?) = Ḥaẓíra",
  "[ḤH]a[zẓ][ií]rat'?u'?[lI][- ][QGK][uo]ds = Ḥaẓíratu’l-Quds",
  "[ḤH]am[ií]d() = Ḥamíd",
  "[HḤ]ass?an() = Ḥasan",
  "[hḥ]u[qk][úu]q = ḥuqúq",
  "[HḤ]u[qk][úu]q = Ḥuqúq",
  "[HḤ]u[qk][úu]qu'?ll[aá]h = Ḥuqúqu’lláh",
  "i-M[iíl]r[iíI] = i-Mírí", // ADDED
  "I[sṣ]f[aá]h[aá]n() = Iṣfahán",
  "I[sṣ]f[aá]h[aá]n[iíl](s?) = Iṣfahání",
  "Ism[aá]'?[ií]l = Ismá’íl", // ADDED
  "Im[aá]m() = Imám",
  "Insh[áa]'?all[áa]h = In<u>sh</u>á’alláh",
  "[IE][qkg][hu]?[aá]n = Íqán",
  "[ÍI]r[aá]n = Írán",
  "Iṣfahán[iíI] = Iṣfahání",
  "[IE][ṣs][fp][h]?[aá]h[áa]n = Iṣfahán",
  "Ishra[qg][h]?at = I<u>sh</u>ráqát",
  "Isl[aá]m() = Islám",
  "J[ie]n[aá]b = Jináb",
  "J[ie]n[aá]b[iíI] = Jinábí",
  "Ja[vw][aá]d() = Javád",
  "Jal[aá]l() = Jalál",
  "Jal[aá]l[iau]'?d[- ]D[ií]n = Jalálu'd-Dín",
  "Jam[aá]l() = Jamál",
  "Jameeleh = Jamílih",
  "Jin[aá]b[- ]i[- ]Am[ií]n = Jináb-i-Amín",
  "Jin[aá]b[- ]i[- ]Zaynu'?l[- ]Muqarrabin = Jináb-i-Zaynu’l-Muqarrabín",
  "Julfa = Julfá", // ADDED
  "Juvayn[ií] = Juvayní", // ADDED
  "Kash[ií] = Ka<u>sh<u>í", // ADDED
  "K[aá][ẓz]im() = Káẓim",
  "K[aá]sh[aá]n = Ká<u>sh</u>án",
  "K[aá]sh[aá]n[iíI] = Ká<u>sh</u>ání",
  "K[ei]rm[aá]n = Kirmán",
  "K[ei]rm[aá]n[iíI] = Kirmání", // ADDED
  "K[ei]rm[aá]nsh[aá]h = Kirman<u>sh</u>áh", // ADDED
  "K[ei]rm[aá]nsh[aá]h[iíI] = Kirman<u>sh</u>áhí", // ADDED
  "K[h]?[ae][yi]?r'?[uoOU]'?ll[aá]h? = <u>Kh</u>ayru’lláh",
  "Kalimat = Kalimát",
  "Kam[áa]l() = Kamál",
  "Karb[ie]la = Karbilá",
  "Kh?[aá]nn?[uo]m = <u>Kh</u>ánum",
  "Kh[aá]n = <u>Kh</u>án",
  "Kh[ou]sr[aou][w]? = <u>Kh</u>usraw",
  "Kh[uo]r[aá]ss?[aá]n = <u>Kh</u>urasán",
  "Kh[uo]r[aá]ss?[aá]n[iíI] = <u>Kh</u>urasání",
  "Khalq = <u>Kh</u>alq",
  "Khayyam = <u>Kh</u>ayyám",
  "Khodabakshi = <u>Kh</u>udabak<u>sh</u>í",
  "Khorsheed = <u>Kh</u>ur<u>sh</u>íd",
  "Khosroe = <u>Kh</u>usraw",
  "Kirman = Kirmán",
  "Kit[aá]b[- ]i[- ]'?Ahd = Kitáb-i-‘Ahd",
  "Kit[aá]b[- ]i[- ]'?Ahd[iÍ] = Kitáb-i-‘Ahdí",
  "Kit[aá]b[-‘’']?i[-‘’']{0,2}Ahd[iíI] = Kitáb-i-‘Ahdí",
  "Kitab() = Kitáb",
  "Kuly = Qulí",
  "Kurrat[-][Uu]l[-]Ayn[e]? = Qurratu’l-Ayn", // Kurrat-ul-ayne
  "L[aá]sh?[- ]Fur[uú]sh = Lás-Furú<u>sh</u>", // ADDED
  "L[uo][tṭ]f'?[uoUO]'?[-]? ?ll[aá]h = Luṭfu’lláh",
  "Lawh[-]i[-]Maqsud = Lawh-i-Maqsúd",
  "M[áa]z[ie]nd[ae]r[aá]n = Mázindarán",
  "M[áa]z[ie]nd[ae]r[aá]n[iíI] = Mázindarání",
  "M[ae][ḥh]m[úo]o?d = Maḥmúd",
  "M[ao]hh?[oa]met() = Muḥammad",
  "M[ea]nsh[aá]d[iíI] = Man<u>sh</u>ádí",
  "M[ou][hḥ]e?y[ie]?d[- ]?[dD][ií]n = Muḥyi’d-Dín",
  "M[uo]hh?amm?[aeá]d() = Muḥammad",
  "M[uo]ll[áa][h]?(s?) = Mullá",
  "M[uo]n[iíe]e?r() = Munír",
  "Mah?[- ]?[kK]u = Máh-Kú", // ADDED
  "Ma[hḥ]m[o]?[uú]d = Maḥmúd",
  "M[aá]lm[ií]r = Málmír", // ADDED
  "M[aá]lm[ií]r[ií] = Málmírí", // ADDED
  "Ma[sd]r[aá]?'?[ií][h]? = Masra‘ih",
  "Maj[ií]d = Majíd",
  "Maj[ií]d[ií](s?) = Majídí",
  "Majlis[ií] = Majlisí", // ADDED
  "Majn[ou][o]?n = Majnún",
  "Manshadi = Man<u>sh</u>ádí",
  "M[aá]r[aá]ghi'[iíI] = Mará<u>gh</u>i'í", // ADDED
  "M[aá]r[aá]ghi = Mará<u>gh</u>i", // ADDED
  "Marhaba = Marḥabá",
  "Mas[aá]'?il = Masá’il", // ADDED
  "Mash[-]?r[iea][qk][-]?[uoe]'?l[- ]?[Aa][zd]h?[kc][aá]r(s?) = Ma<u>sh</u>riqu’l-A<u>dh</u>kár",
  "Mashh?[áa]d = Ma<u>sh</u>had",
  "Mashh?[áa]d[ií](s?) = Ma<u>sh</u>hadí",
  "Mash[ií]yyat = Ma<u>sh</u>íyyat", // ADDED
  "Masnavi = Ma<u>th</u>naví",
  "Mazandaran = Mazindárán",
  "Mihd[ií]() = Mihdí",
  "Mihd[ií]y[aá]b[aá]d = Mihdíyábád",
  "Mir = Mír",
  "Mirza([ys]?) = Mírzá",
  "mithq[aá]l(s?) = mi<u>th</u>qál",
  "Mithq[aá]l(s?) = Mi<u>th</u>qál",
  "Motosarraf = Mutaṣarrif",
  "Mozaffar = Muḍaffar", //
  "M[ou]u'all[ei]m = Mu‘allim", // ADDED
  "Muḥammad[- ]'?Al[ií]([ys]?) = Muḥammad-‘Alí",
  "Muḥammad[ea]n = Muḥammadan",
  "Mu[ḥh][áa]j[ií]r(s?) = Muḥájír",
  "Munír[aie][h]? = Munírih",
  "Mushkin = Mi<u>sh</u>kín",
  "Muslem = Muslim",
  "M[ou]stagh?[aá]th = Musta<u>gh</u>á<u>th</u>", // ADDED
  "Nayriz = Nayríz",
  "Nayr[ií]zi = Nayrízí",
  "N[a][uw]?[- ]?[Rr][uoú][uo]?z = Naw-Rúz",
  "n[aá][kqg][ai][zd]e[ei]n = náqiḍín",
  "N[áa][qgk][ai][ḍzd][z]?() = Náqiḍ",
  "N[áa][qgk][ai][ḍzd][z]?[ieí][e]?n = Náqiḍín",
  "N[aá][sṣ]iri'd[-]?D[ií]n = Náṣiri’d-Dín",
  "N[ao][w]?[- ][Rr][uú]z = Naw-Rúz",
  "N[ií][aá]z = Níáz",
  "N[o]?urr?[aie]d[- ]?[dD]?[ií]n = Núri’d-Dín",
  "N[uú]r'?[uoOU]'?ll[aá]h? = Núru’lláh",
  "Nab[ií]l() = Nabíl",
  "Nav[v]?[aá]b = Navváb",
  "Nayeb[-]us[-]Saltaneh = Ná’ibu’s-Sulṭánih",
  "No?[uú]r  = Núr ",
  "No?[uú]r[iíI] = Núrí",
  "No?ur[iíI] = Núrí",
  "Nourallah = Nur’u’lláh",
  "Nur = Núr",
  "Nur = Núr",
  "P[áa]r[áa]n = Paran",
  "P[aá]sh[aá] = Pá<u>sh</u>á",
  "Parviz = Parvíz",
  "Pasha([sy]*) = Pá<u>sh</u>á",
  "(Port\\s+)Said = $1Sa‘íd",
  "Q[aá][y]?[-‘’']?[ie]m = Qá’im",
  "Q[aá]'?in = Qá'in",
  "Q[aá]'?in[ií] = Qá'iní",
  "[QG][aá]j[aá]r(s?) = Qájár",
  "Qayy[uú]m[uo]'?l[- ][Aa]sm[aá]'? = Qayyúmu’l-Asmá’",
  "Qazvin = Qazvín",
  "Qazvíni = Qazvíní", // ADDED
  "Qudd[uú]s() = Quddús",
  "[QK][uo]'?r'?[aá][aá]?n() = Qur’án",
  "Qur[r]?at[-‘’']?[uo]l[-‘’']?[-‘’']?Ayn = Qurratu’l-‘Ayn",
  "R[ea]sht = Ra<u>sh</u>t",
  "R[ea]sht[iíI] = Ra<u>sh</u>tí",
  "R[ei][zdḍ][aá] = Riḍá",
  "R[úu][ḥh]?[uo]'?ll[áa]h = Rúḥu’lláh",
  "R[uú][hḥ][-‘’']?[Uuo][-‘’']?ll[aá]h = Rúḥu’lláh",
  "Ra[ḥh][ií]m() = Raḥím",
  "Ra[hḥ]mat = Raḥmat",
  "Rabb[aá]n[ií]() = Rabbání",
  "Rama[ḍd][aá]n(s?) = Ramaḍán",
  "Rasheed = Ra<u>sh</u>íd",
  "Ri[dḍz]h?[vw][áa]a?n() = Riḍván",
  "Ro?[uú][hḥ][aá]() = Rúḥá",
  "Ro?[uú][ḥh][iíy]() = Rúḥí",
  "Rudaki = Rúdakí",
  "Ruhangiz = Rúhangíz",
  "[SṢ]adru[’']?[ṣs][-’']?[ṢS]ud[uú]r = Ṣadru’ṣ-Ṣudúr",
  "Sardar = Sardár", // ADDED
  "S[eia]y[y]?[eia]d() = Siyyid",
  "Shavirdi = <u>Sh</u>avirdí", // ADDED
  "S[ií]n[aá] = Síná",
  "S[ií]y[aá][h]?[- ]Ch[aá]l = Síyáh-<u>Ch</u>ál",
  "[ṢS][uo]b[ḥh]?[- ]?[ie][- ][AE]z[ae]l = Ṣubḥ-i-Azal",
  "S[uo]l[ea]ym[aá]n() = Sulaymán",
  "S[uo]l[eia][y]?m[aá]n[ií]y[y]?[ai][h]? = Sulaymáníyyih",
  "S[uo]nn[ií]() = Sunní",
  "S[úu]r[aei]h(s?) = Súrah",
  "S[úu]ra[y]?[t]?'?[uo]'?l[- ]Hayk[a]?l = Súratu’l-Haykal",
  "Sa'[ií]d() = Sa‘íd",
  "Saadi = Sa‘dí",
  "Sabz[aei]v[aá]r = Sabzivár",
  "Sabz[aei]v[aá]r[iíI] = Sabzivárí", // ADDED
  "Sadek = Sádiq",
  "Samandar[ií]() = Samandarí",
  "Sasani = Sásání",
  "Shahr-[bB]anu = Shahr-Bánú", // ADDED
  "Sh[aá]h(s?) = <u>Sh</u>áh",
  "Sh[aá]h[ie]nshah = <u>Sh</u>áhin<u>sh</u>áh", // ADDED
  "Sh[aá]hm[ií]rz?[áa]d = <u>Sh</u>áhmírzád", // ADDED
  "Sh[aá]hm[ií]rz?[áa]d[iíI] = <u>Sh</u>áhmírzádí", // ADDED
  "Sh[aá]hro?[ouú]d = <u>Sh</u>áhrúd", // ADDED
  "Sh[aá]hz[aá]d[ie]h = <u>Sh</u>áhzádih", // ADDED
  "Sharaf = <u>Sh</u>araf", // ADDED
  "Sh[ií][ií]?'?[aei]h(s?) = <u>Sh</u>í‘ah", // 54 in GPB
  "Sh[ií]r[áa]z = <u>Sh</u>íráz",
  "Sh[ií]r[áa]zee = <u>Sh</u>írází",
  "Sh[ií]r[áa]z[ií](s?) = <u>Sh</u>írází",
  "Shahnaz = <u>Sh</u>ahnáz",
  "Shaykh[ií]e?(s?) = <u>Sh</u>ay<u>kh</u>í", // ADDED
  "Shaykh() = <u>Sh</u>ay<u>kh</u>",
  "sheikh?() = <u>sh</u>ay<u>kh</u>",
  "Sheikh?() = <u>Sh</u>ay<u>kh</u>",
  "Shogh?ie? = Shoghi",
  "Sul[ṭt][aá]n() = Sulṭán",
  "Suleiman = Sulaymán",
  "[TṬ][ie]h?e?r[aá]n = Ṭihrán",
  "[TṬ][ie]h?e?r[aá]n[iíI] = Ṭihrání",
  "t[uú]m[aá]n(s?) = túmán",
  "[ṬT][aá]h[ie]r[ai][hy]?[y]? = Ṭáhirih",
  "Tafrish = Tafrí<u>sh</u>", // ADDED
  "Tafr[ií]sh[ií] = Tafrí<u>sh</u>í", // ADDED
  "Tabr[ií]z[iíI] = Tabrízí", // ADDED
  "Tabr[ií]z = Tabríz", // ADDED
  "[ṬT]ab[áa]rs[iíI] = Ṭabarsí",
  "[TṬ]ar[aá]z[áa]t = Ṭarázát",
  "Ta'?yid = Ta’yíd",
  "Ta[qkg][ií](y?) = Taqí",
  "Tajalli = Tajallí",
  "Tajalliat = Tajallíyát",
  "Tajalliyat = Tajallíyát",
  "Tamadd?[uo]n ?[uoa]'?l[- ][Mm][uo]lk = Tamaddunu’l-Mulk",
  "Taraz = Ṭaráz",
  "Tarazat = Ṭarázát",
  "Tarazollah = Taraz’u’lláh",
  "Tarbiat = Tarbíyát",
  "Tarbiyat = Tarbíyat",
  "Touba = Túbá",
  "Tursh[ií]z[iíI] = Tur<u>sh</u>ízí", // ADDED
  "Tursh[ií]z = Tur<u>sh</u>íz", // ADDED
  "Ulema(s?) = ‘Ulamá",
  "Vakil = Vakíl",
  "Vali(s?) = Valí",
  "Varq[aá]() = Varqá",
  "Viz[iíe][e]?r() = Vizír",
  "Y[ae][ḥh]y[áa]([yh]?) = Yaḥyá",
  "Yaḥyáy[-]{,2}i[-]D[aá]r[aá]b[íia] = Yaḥyáy-i-Dárábí",
  "Yaz[ií]d() = Yazíd",
  "Yazd[ií]() = Yazdí",
  "Zaine = Zayn",
  "Zaman = Zamán",
  "Zaqqum = Zaqqúm",
  "Zaynu'?l[- ]Muqarrabin = Zaynu’l-Muqarrabín",
  "zina = ziná",
  "Zunuz = Zunúz",
  "Zun[uú]zi = Zunúzí",

  // REPLACE LAST - DO NOT SORT!
  "‘Alí Muḥammad = ‘Alí-Muḥammad",
  
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
      let find = item.split('=')[0].trim()
      let repl = item.split('=')[1].trim()

      find = find
        // Handle the end of the word
        .replace('()', anyWord)
        // Handle hyphens and en-dashes
        .replace(/\[-/g, '[-–\x1E')
        // Handle apostrophes of all kinds
        .replace(/'(?!\])/g,"[‘’']")
        // Handle apostrophes within character classes
        .replace(/(\[[^\]]*)\[‘’'\]/, "$1‘’'")

      if (new RegExp(startWord + find + endWord, 'gi').test(this.str)) {

        // Find number of captured sets in the replacement
        let sets = ((repl || '').match(/\$\d{1}/g) || []).length

        // Handle beginnings of words
        if (!sets) {
          repl = '$1' + repl
        }
        else {
          repl = '$1' + repl.split(/\$\d{1}/g).reduce((t,v,i,a) => {
            return t + '$' + (i+1)
          })
        }
        sets += 1

        // Handle ends of words that should have a captured set
        if (/[^\\]\)$/.test(find)) {
          repl += '$' + (sets + 1)
        }
        replUpper = repl.toUpperCase()

        let findUpper = find.split('').reduce((t,c,i,a) => {
          return t + (t.slice(-1) === '\\' ? c : c.toUpperCase())
        }).replace(/<(\/?)u>/ig, '<$1u>')

        findRE = new RegExp(startWord + find + endWord, 'gm')
        findUpperRE = new RegExp(startWord + findUpper + endWord, 'gm')
  

        this.str = this.str.replace(findRE, repl)
        this.str = this.str.replace(findUpperRE, replUpper)

      }

    }
  }.bind(this))

  if (this.debug) {
    // Trim punctuation from the beginning and end of words
    let trimRE = /(^[\s,\.\(\)"!\?;:]*)|([\]\[,\.\(\)"!\?;:\*^F0-9]*$)/g

    // Diff must be performed line by line, so get an array of the cleaned and corrected texts
    let clean = this.clean.split('\n')
    let corrected = this.str.split('\n')

    // Only perform a diff if the arrays are the same length
    if (clean.length === corrected.length) {

      // GET LINE
      this.diff = clean.map((line,i) => {
        // If the lines are exactly equal, just return
        if (line === corrected[i]) return false
        // GET CHANGES
        return wordDiff.diffString(line, corrected[i]).map((v) => {
          // For any sections where there are differences
          if (v.remove || v.add) {
            // Trim the results
            v.add = v.add.trim()
            v.remove = v.remove.trim()
            // Some changed sections include multiple words which should be recorded separately
            let added = (v.add.split(/\s+/) || [])
            let removed = (v.remove.split(/\s+/) || [])
            // If the added and removed sections contain the same number of words, split them
            if (added.length > 1 && (added.length === removed.length)) {
              // GET WORDS
              return added.map((v,i) => {
                // The word diff program lets simple words thorugh, like "of" or "and"; remove these
                if (v !== removed[i]) {
                  // return a line for the single word, with punctuation removed
                  return v.replace(trimRE, '') + '\t' + removed[i].replace(trimRE, '')
                }
              }).filter(v => v).join('\n')
            }
            // If the added and removed sections contain different numbers of words, 
            // or if the added section contains one word or none,
            else {
              // USE ENTIRE CHANGE
              return (v.add.replace(trimRE, '') || '') + '\t' + (v.remove.replace(trimRE, '') || '')
            }            
          } else {
            return ''
          }
        }).filter(v => v).join('\n')
      }).filter(v => v).join('\n')
    }
  }

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


module.exports = BahaiAutocorrect


