
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
  str = str.replace(/Bah[aá]['’‘]?[ií]s/g, 'Bahá’ís')
    .replace(/Bah[aá]['’‘]?[ií]/g, 'Bahá’í')
    .replace(/BAH[AÁ]['’‘]?[IÍ]/g, 'BAHÁ’Í')
    .replace(/['’‘]?Abd[uoe]['’‘]?l[-]?[ ]?B[ea]h[aá]/g, '‘Abdu’l-Bahá')
    .replace(/['’‘]?ABD[UOE]['’‘]?L[-]?[ ]?B[AE]H[AÁ]/g, '‘ABDU’L-BAHÁ')
    // Abdul
    .replace(/['’‘]?Abd[uo]['’‘]?l/g, '‘Abdu’l').replace(/['’‘]?ABD[UO]['’‘]?L/g, '‘ABDU’L')
    .replace(/['’‘]?Abb[aá]s/g, '‘Abbás').replace(/['’‘]?ABB[AÁ]S/g, '‘ABBÁS')
    .replace(/All[aá]h[–-]?[uoOU][–-][Aa]bh[aá]/g, 'Alláh–u–Abhá')
    .replace(/ALL[AÁ]H[–-]?[UuOo][–-]?ABH[AÁ]/g, 'ALLÁH–U–ABHÁ')
    // Baha-Ullah
    .replace(/Bah[aá][ -]?['’‘]?[UOuo0]['’‘]?[lL]+[aá]h/g, 'Bahá’u’lláh')
    .replace(/BAH[AÁ][ -]?['’‘]?[UO0]['’‘]?LL[AÁ]H/g, 'BAHÁ’U’LLÁH')
    .replace(/B[aá]b[ií]([ <\.\?\!\,\]\)\'’‘\s])/g, 'Bábí$1').replace(/B[AÁ]B[IÍ]([ <\.\?\!\,\]\)\'’‘])/g, 'BÁBÍ$1')
    .replace(/B[aá]b([ <\.\?\!\,\]\)\'’‘s])/g, 'Báb$1').replace(/B[AÁ]B([ <\.\?\!\,\]\)\'’‘S])/g, 'BÁB$1')
    .replace(/['‘’]?A[kc][kc]a/g, '‘Akká').replace(/['‘’]?A[KC][KC]A/g, '‘AKKÁ')
    .replace(/K[h]?[aá]n[n]?[uo]m/g, '<u>Kh</u>ánum').replace(/K[H]?[AÁ]N[N]?[UO]M/g, '<U>KH</U>ÁNUM')
    .replace(/Bah[ií]y[y]?[ia]h/g, 'Bahíyyih').replace(/BAH[IÍ]Y[Y]?[IA]H/g, 'BAHÍYYIH')
    .replace(/Dia[’']iyyih/g, 'Ḍíyá’íyyih')
    .replace(/Mirza/g, 'Mírzá').replace(/MIRZA/g, 'MÍRZÁ')
    .replace(/H[áa]d[íi]/g, 'Hádí')
    .replace(/Sh[íi]r[áa]z[íi]/g, '<u>Sh</u>írází')
    .replace(/Shog[h]i[e]?/g, 'Shoghi').replace(/SHOG[H]I[E]?/g, 'SHOGHI')
    .replace(/Effendi[e]?/g, 'Effendi').replace(/EFFENDI[E]?/g, 'EFFENDI')
    .replace(/Ahmad/g, 'Aḥmad').replace(/AHMAD/g, 'AḤMAD')
    .replace(/[HḤ]as[s]?an/g, 'Ḥasan').replace(/[HḤ]AS[S]?AN/g, 'ḤASAN')
    // Hossein
    .replace(/[HḤ][uo]s[s]?[ea][yi]n/g, 'Ḥusayn').replace(/[HḤ][UO]SAYN/g, 'ḤUSAYN')
    .replace(/Sh[aá]h([^a-z])/g, '<u>Sh</u>áh$1').replace(/SH[AÁ]H([^A-Z])/g, '<U>SH</U>ÁH$1')
    .replace(/B[úu]shi[h]?r/g, 'Bú<u>sh</u>ihr')
    .replace(/Sh[íie]r[áa]z/g, '<u>Sh</u>íráz')
    .replace(/Nouri([^a-z])/g, 'Núrí$1').replace(/NOURI([^a-z])/g, 'NÚRÍ$1')
    .replace(/Yazdi/g, 'Yazdí').replace(/YAZDI/g, 'YAZDÍ')
    .replace(/[QK][uo][‘'’]?r[‘'’]?[aá][aá]?n/g, 'Qur’án').replace(/[QK][UO]R[‘'’]?[AÁ][AÁ]?N/g, 'QUR’ÁN')
    .replace(/Abha/g, 'Abhá').replace(/ABHA/g, 'ABHÁ')
    .replace(/M[ao]h[h]?[oa]met/g, 'Muḥammad').replace(/M[AO]H[OA]MET/g, 'MUḤAMMAD')
    .replace(/M[uo]h[h]?am[m]?[aeá]d/g, 'Muḥammad').replace(/M[UO]HAM[M]?[AE]D/g, 'MUḤAMMAD')
    .replace(/Muḥammad[ea]n/g, 'Muḥammadan')
    .replace(/Kuly /g, 'Qulí ')
    .replace(/[‘’']?Ali([ -\.\!\?<])/g, '‘Alí$1').replace(/[‘’']?ALI([ -\.\!\?<])/g, '‘ALÍ$1')
    .replace(/Kitab/g, 'Kitáb').replace(/KITAB/g, 'KITÁB')
    .replace(/[IE][qkg][hu]?[aá]n/g, 'Íqán').replace(/[IE][QK][H]?[AÁ]N/g, 'ÍQÁN')
    .replace(/Ruhangiz/g, 'Rúhangíz')
    .replace(/R[o]?[uú][hḥ][aá]/g, 'Rúḥá')
    .replace(/R[o]?[uú][ḥh][iíy]/g, 'Rúḥí')
    .replace(/Jalal/g, 'Jalál')
    .replace(/Fa[zd][ei]l/g, 'Faḍil')
    .replace(/Fa[zd]l/g, 'Faḍl')
    .replace(/Ri[dḍz][h]?[vw][áa][a]?n/g, 'Riḍván').replace(/RI[DḌZ][VW][ÁA][A]?N/g, 'RIḌVÁN')
    // Mash-rak-ul-azkar   // Mashrak-el-Azcar
    .replace(/Mash[\-]?r[iea][qk][\-]?[uoe][’'‘]?l[\–\- ]?[Aa][zd][h]?[kc][aá]r/g, 'Ma<u>sh</u>riqu’l-A<u>dh</u>kár')
    .replace(/MASHR[IE]Q[UO][’'‘]L[\–\- ]?[ ]?[AA][ZD][H]?K[AÁ]R/g, 'MA<U>SH</U>RIQU’L-A<U>DH</U>KÁR')
    .replace(/Tamad[d]?[uo]n[ ]?[uoa]['’‘]?l[ -][Mm][uo]lk/g, 'Tamaddunu’l-Mulk')
    // Shaykh Ahmad Kazim
    .replace(/Shaykh/g, '<u>Sh</u>ay<u>kh</u>').replace(/SHAYKH/g, '<u>SH</u>AY<u>KH</u>')
    .replace(/K[aá][ẓz]im/g, 'Káẓim').replace(/K[AÁ][ẒZ]IM/g, 'KÁẒIM')
    .replace(/R[ea]sht/g, 'Ra<u>sh</u>t').replace(/R[EA]SHT/g, 'RA<u>SH</u>T')
    // Kamál Páshá
    .replace(/Kam[áa]l/g, 'Kamál').replace(/KAM[ÁA]L/g, 'KAMÁL')
    .replace(/P[aá]sh[aá]/g, 'Pá<u>sh</u>á')
    //Moneer
    .replace(/M[uo]n[iíe][e]?r/g, 'Munír')
    .replace(/M[uo]n[iíe][e]?r[ai][h]?/g, 'Munírih')
    //Muḥyiddin
    //Moheyddin
    .replace(/M[ou][hḥ][e]?y[ie]?d[-]?[dD][ií]n/g, 'Muḥyi’d-Dín')
    // Teheran
    .replace(/[TṬ][ie]h[e]?r[aá]n/g, 'Ṭihrán').replace(/T[IE]HR[AÁ]N/g, 'ṬIHRÁN')
    // Nouraddin Zaine
    .replace(/Zaine/g, 'Zayn').replace(/ZAINE/g, 'ZAYN')
    // Nourredin
    .replace(/N[o]?ur[r]?[aie]d[- ]?[dD]?[ií]n/g, 'Núri’d-Dín').replace(/N[O]?UR[AIE]D[D]?IN/g, 'NÚRI’D-DÍN')
    // Suleyman Khan Lutfullah Hakim
    .replace(/S[uo]l[ea]ym[aá]n/g, 'Sulaymán')
    .replace(/Kh[aá]n([^a-záí\-])/g, '<u>Kh</u>án$1')
    .replace(/L[uo][tṭ]f[’'‘]?[uoUO][’'‘]?[-]?[ ]?ll[aá]h/g, 'Luṭfu’lláh')
    .replace(/[HḤ][aá]k[ií]m/g, 'Ḥakím')
    // Taki
    .replace(/Ta[qkg][íi]([^a-z])/g, 'Taqí$1')
    // Said
    .replace(/(Port\s+)Said/g, "$1Sa‘íd").replace(/(PORT\s+)SAID/g, "$1SA‘ÍD")
    .replace(/([a-z]) Sa['‘’][ií]d/g, '$1 Sa‘íd').replace(/([A-Z]) SA['‘’][IÍ]D/g, '$1 SA‘ÍD')
    // Abul Faḍl
    .replace(/Abu[’‘']?l[- ]Fa[ḍz]l/g, 'Abu’l-Faḍl').replace(/ABU[’‘']?L[ -]FA[ḌZ]L/g, 'ABU’L-FAḌL')
    // Násiri’d-Dín
    .replace(/N[aá][sṣ]iri[’'‘]d[-]?D[ií]n/g, 'Náṣiri’d-Dín')
    // Hayder-‘Alí
    .replace(/[ḤH]a[yi]d[ae]r[- ][‘']?Al[íi]/g, 'Ḥaydar-‘Alí')
    // Moneera <u>Kh</u>ánum
    .replace(/M[ou]n[ei][e]?r[aie][h]?/g, 'Munírih')
    // Khorassani  Khorassan
    .replace(/Kh[uo]r[aá]s[s]?[aá]n[íi]/g, '<u>Kh</u>urasání').replace(/Kh[uo]r[aá]s[s]?[aá]n/g, '<u>Kh</u>urasán')
    // Jenabi Haji
    .replace(/J[ie]n[aá]b[ií]/g, 'Jinábí')
    .replace(/[HḤ][aá][d]?[j]?j[ií]/g, 'Ḥájí').replace(/[HḤ][AÁ][D]?[J]?J[IÍ]/g, 'ḤÁJÍ')
    // Abdul
    .replace(/[‘'’]?Abd[uo][‘'’]?l /g, '‘Abdu’l ').replace(/[‘'’]?ABD[UO][‘'’]?L /g, '‘ABDU’L ')
    // Nour
    .replace(/N[o]?[uú]r[ií] /g, 'Núrí ').replace(/N[o]?[uú]r /g, 'Núr ')
    // Assad’Ullah  Enya’Ullah  Enyat’Ullah Enya’Ullah Nurullah
    // Assad-Ullah
    .replace(/As[s]?ad[’'‘\- ]?[uoOU][’'‘]?ll[aá]h?/g, 'Asadu’lláh')
    .replace(/[’'‘]?[IE]n[áa]?y[aá]?t?[’'‘]?[uOUo][’'‘]?ll[áa]h/g, '‘Ináyatu’lláh')
    .replace(/N[uú]r[’'‘]?[uoOU][’'‘]?ll[aá]h?/g, 'Núru’lláh')
    .replace(/[‘’']?Az[ieí][e]?z[’'‘]?[uoOU][’'‘]?ll[aá]h?/g, '‘Azízu’lláh')
    // Ruollah Rúḥu’lláh
    .replace(/R[úu][ḥh]?[uo][’'‘]?ll[áa]h/g, 'Rúḥu’lláh')
    // Kharullah
    .replace(/K[h]?[ae][yi]?r[’'‘]?[uoOU][’'‘]?ll[aá]h?/g, '<u>Kh</u>ayru’lláh')
    // Abu'l-Qasim
    .replace(/Ab[úu][’'‘]?l[- ]Q[áa]sim/g, 'Abú’l-Qásim')
    // Bahje
    .replace(/B[ae][h]?j[íei]/g, 'Bahjí')
    .replace(/M[ae][ḥh]m[úo][o]?d/g, 'Maḥmúd')
    // Subh-i-Azal  Subi-Azel
    .replace(/[ṢS][uo]b[ḥh]?[- ]?[ie][- ][AE]z[ae]l/g, 'Ṣubḥ-i-Azal')
    .replace(/Y[ae][ḥh]y[áa]/g, 'Yaḥyá')
    // Naw Ruz
    .replace(/N[ao][w]?[- ][Rr][uú]z/g, 'Naw-Rúz')
    // Naurooz
    .replace(/N[a][uw]?[ \-]?[Rr][uoú][uo]?z/g, 'Naw-Rúz')
    // Mazindaran
    .replace(/M[áa]z[ie]nd[ae]r[aá]n/g, 'Mázindarán')
    .replace(/B[ae]y[aáe]n/g, 'Bayán')
    // Tahirih
    .replace(/[ṬT][aá]h[ie]r[ai][hy]?[y]?/g, 'Ṭáhirih')
    // Shiahs  Shi’ih
    .replace(/Sh[ií][ií]?[’'‘]?[aei]h/g, '<u>Sh</u>í‘ah') // 54 in GPB
    //.replace(/Sh[ií][ií]?[’'‘]?[i]h/g, '<u>Sh</u>í‘ih') // 0 in GPB
    .replace(/S[uo]nn[ií]/g, 'Sunní')
    // Siyah-Chal
    .replace(/S[íi]y[aá][h]?[- ]Ch[aá]l/g, 'Síyáh-<u>Ch</u>ál')
    // Sullimaniyyeh - Sulimaniyih
    .replace(/S[uo]l[eia][y]?m[aá]n[ií]y[y]?[ai][h]?/g, 'Sulaymáníyyih')
    // Afnan Aghsan
    .replace(/Afn[aá]n/g, 'Afnán')
    .replace(/Aghs[aá]n/g, 'A<u>gh</u>ṣán')
    .replace(/Isl[aá]m/g, 'Islám').replace(/ISL[AÁ]M/g, 'ISLÁM')
    .replace(/Jam[aá]l/g, 'Jamál')
    // Samandari
    .replace(/Samandar[ií]/g, 'Samandarí')
    // Huquk
    .replace(/[ḤH][uo][qqk][uú][kgq]/g, 'Ḥuqúq')
    //Majid
    .replace(/Maj[ií]d/g, 'Majíd')
    // Qajar
    .replace(/[QG][aá]j[aá]r/g, 'Qájár')
    // Tabarsi
    .replace(/[ṬT]ab[áa]rs[íi]/g, 'Ṭabarsí')
    // Navvab
    .replace(/Nav[v]?[aá]b/g, 'Navváb')
    // Nabil
    .replace(/Nab[ií]l/g, 'Nabíl')
    // `Alí-Akbar Furútan
    .replace(/[‘'’]?Al[íi][- ]Akb[aá]r/g, '‘Alí-Akbar')
    .replace(/Fur[úu]t[áa]n/g, 'Furútan')
    .replace(/Yaz[ií]d/g, 'Yazíd')
    // Surah
    .replace(/S[úu]r[aei]h/g, 'Súrah')
    .replace(/All[áa]h/g, 'Alláh')
    // Haziratu’l-Quds
    .replace(/[ḤH]a[zẓ][íi]ratu[’'‘]?l[- ][QGK][uo]ds/g, 'Ḥaẓíratu’l-Quds') //
    .replace(/[ḤH]a[zẓ][íi]ra[h]?/g, 'Ḥaẓíra') //
    // Mashad
    .replace(/Mashad/g, 'Ma<u>sh</u>had')
    // Baghdad
    .replace(/Bag[h]?d[aá]d/g, 'Ba<u>gh</u>dád')
    // Babylon
    .replace(/B[aá]b([^a-zá\-])/g, 'Bab$1')
    // Masra’íh // Madrih
    .replace(/Ma[sd]r[aá]?[‘'’]?[ií][h]?([^a-z])/g, 'Masra‘ih$1')
    // Imam
    .replace(/Im[aá]m/g, 'Imám')
    // Surayt’ul-Haykl  Suratu'l-Haykal
    .replace(/S[úu]ra[y]?[t]?[‘'’]?[uo][‘'’]?l[- ]Hayk[a]?l/g, 'Súratu’l-Haykal')
    // Hamíd
    .replace(/[ḤH]am[ií]d/g, 'Ḥamíd')
    // Hafiz
    .replace(/[ḤH][áa]f[ie][zẓ]/g, 'Ḥáfiẓ')
    // Hádíth
    .replace(/[ḤH][áa]d[ií][i]?th/g, 'Ḥadí<u>th</u>')
    // Zaman
    .replace(/Zaman/g, 'Zamán')
    // Paran
    .replace(/P[áa]r[áa]n/g, 'Paran')
    // Rabbani
    .replace(/Rabb[aá]n[ií]/g, 'Rabbání')
    // Banani
    .replace(/Ban[aá]n[ií]/g, 'Banání')
    // Banani
    .replace(/Abb[uú]d/g, 'Abbúd')
    // Banani
    .replace(/Bah[áa]([^a-záí\-])/g, 'Bahá$1')
    // Muḥammad Ali
    .replace(/Muḥammad[- ][‘'’]?Al[íi]/g, 'Muḥammad-‘Alí')
    .replace(/[AE]zal[íi]s/g, 'Azalís')
    // Quddus
    .replace(/Qudd[uú]s/g, 'Quddús')
    // Quddus
    .replace(/M[uo]ll[áa][h]?/g, 'Mullá')
    // Insha’allah
    .replace(/Insh[áa][‘'’]?all[áa]h/g, 'In<u>sh</u>á’alláh')
    // Fatimih
    .replace(/F[áa][ṭt][ie]m[ia]h/g, 'Fáṭimih')
    // Iṣfahán
    .replace(/[IE][ṣs][fp][h]?[aá]h[áa]n/g, 'Iṣfahán')
    // Ásíyih
    .replace(/[ÁA]s[í][i]?yih/g, 'Ásíyih')
    // Qayyumu’l-Asma: note, we cannot fix the end of a single-quote phrase
    .replace(/Qayy[uú]m[uo][‘'’]?l[- ][Aa]sm[aá][‘'’]?/g, 'Qayyúmu’l-Asmá’')
    // misspellings
    //Graudian
    .replace(/G[r]?[a]?u[a]?[r]?dian/g, 'Guardian')
    .replace(/A[kqh][h]?d[aá]s/g, 'Aqdas').replace(/A[KQH][H]?D[AÁ]S/g, 'AQDAS')
    .replace(/Administraiton/g, 'Administration')
    // Rahim
    .replace(/Ra[ḥh][ií]m/g, 'Raḥím')
    .replace(/[ÁA]q[aá]/g, 'Áqá')
    .replace(/Mihd[ií]/g, 'Mihdí')
    .replace(/Sul[ṭt][aá]n/g, 'Sulṭán')
    .replace(/K[aá]sh[aá]n/g, 'Ká<u>sh</u>án')
    // Naqiz
    .replace(/N[áa][qgk][ai][ḍzd][z]?[ieí][e]?n/g, 'Náqiḍín')
    .replace(/N[áa][qgk][ai][ḍzd][z]?/g, 'Náqiḍ')
    // Sayad
    .replace(/S[ia]y[y]?[ia]d/g, 'Siyyid')
    // fix the Ayn in case is shows up at the beginning of an attribute value
    .replace(/([a-z])=‘A/ig, "$1='‘A").replace(/([a-z])=‘I/ig, "$1='‘I");
  var CommonMispellings = [
    'Ja[vw][aá]d, Javád',
    'Mir, Mír',
    'Golam, Qulam',
    'Hasssan, Ḥasan',
    'Ma[hḥ]m[o]?[uú]d, Maḥmúd',
    'Kh[ou]sr[aou][w]?, <u>Kh</u>usraw',
    'Bah[aá][ \'’‘]?[EUO]l[ \'’‘]?Abh[aá], Bahá’u’l-Abhá',
    'Sabz[ei]v[aá]r, Sabzivár',
    '‘Abdu’l\\s+Ḥasan, ‘Abdu’l-Ḥasan',
    '‘Abdu’l\\s+Ḥamíd, ‘Abdu’l-Ḥamíd',
    'Aflat[o]?un, Aflatún',
    'Gh[uo]ds[e]?[ei], Qudsí',
    'As[s]?ad[’\'‘\\- ]?[uoOU][’\'‘]?ll[aá]h?, Asadu’lláh',
    'S[ií]n[aá], Síná',
    'N[ií][aá]z, Níáz',
    'M[ea]nsh[aá]d[ií], Man<u>sh</u>ádí',
    'Aga, Áqá',
    '[’\'‘]?A[z]?z[ií]z[’\'‘]?[ou][’\'‘]?ll[aá]h, ‘Azíz’u’lláh',
    '‘Alí Muḥammad, ‘Alí-Muḥammad',
    '[’\'‘]?Abd[uo]l, ‘Abdu’l',
    '‘Abdu’l Ḥusayn, ‘Abdu’l-Ḥusayn',
    'Hamadan, Hamadán',
    'Ab[u]?l, Abu’l',
    'Abu’l\\s+Faḍl, Abu’l-Faḍl',
    'Rama[ḍd][aá]n, Ramaḍán',
    'Sheik, <u>Sh</u>ay<u>kh</u>',
    'sheik, <u>sh</u>ay<u>kh</u>',
    'R[ei][zdḍ][aá], Riḍá',
    'Hajeb-ed-Doulet, Ḥájibu’d-Dawlih',
    'Nayeb-us-Saltaneh, Ná’ibu’s-Sulṭánih',
    'El Qur’án, the Qur’án',
    'Sadek, Sádiq',
    '[’\'‘]?Al[ií], ‘Alí',
    'Nur, Núr',
    'Rasheed, Ra<u>sh</u>íd',
    'Motosarraf, Mutaṣarrif',
    '[’\'‘]?[EI]zzat, ‘Izzat',
    'Abu[’\'‘]?l\\s+Gasem, Abu’l-Qásim',
    // Habbibollah
    'Hab[b]?ib[uo]ll[aá]h, Ḥabíb’u’lláh',
    'Khodabakshi, <u>Kh</u>udabak<u>sh</u>í',
    'B[oa]shr[o]?u[a]?y[ea]h, Bu<u>sh</u>rúyyih', // Boshrouyah
    'Tarazollah, Taraz’u’lláh',
    'Faḍlollah, Faḍl’u’lláh',
    'Nourallah, Nur’u’lláh',
    'Vakil, Vakíl',
    'Masnavi, Ma<u>th</u>naví',
    'Ulema, ‘Ulamá',
    'Bab, Báb',
    'B[aá]b[ií], Bábí',
    'Bushruyieh, Bu<u>sh</u>rú’í',
    'Tarbiat, Tarbíyát',
    'Suleiman, Sulaymán',
    'Khorsheed, <u>Kh</u>ur<u>sh</u>íd',
    'Vali, Valí',
    'Touba, Túbá',
    'Bagher, Báqir',
    'Beyrout, Beruit',
    '[’\'‘]?Abd[uo][’\'‘]?llah, ‘Abdu’lláh',
    'Kurrat-[Uu]l-Ayn[e]?, Qurratu’l-Ayn', // Kurrat-ul-ayne
    '[’\'‘]?Az[ií]z, ‘Azíz',
    'Pasha, Pá<u>sh</u>á',
    'Faran, Fárán',
    'Viz[iíe][e]?r, Vizír',
    'Hashem, Há<u>sh</u>im',
    'Majn[ou][o]?n, Majnún',
    'Badi, Badi‘',
    'Mazandaran, Mazindárán',
    'Dein, Dín',
    'Foad, Fu‘ad',
    'Basheer, Ba<u>sh</u>ír',
    'Heydar, Haydar',
    'Jameeleh, Jamílih',
    '[‘\'’]?[IE]sh[qk]ab[aá][dt], ‘I<u>sh</u>qábád', // Ishqabad
    '[’\'‘]?A[ck][ck][aá], ‘Akká',
    'B[ea]h[aá], Bahá',
    'Marhaba, Marḥabá',
    'Q[aá][y]?[‘\'’\\-]?[ie]m, Qá’im',
    // Ishraghat
    'Ishra[qg][h]?at, I<u>sh</u>ráqát',
    'Tajalliat, Tajallíyát',
    'Tarazat, Ṭarázát',
    'Darab, Dáráb',
    'Darabi, Dárábí',
    'B[aá]b[‘\'’\\-]?[uo]l[‘\'’\\-]?B[aá]b, Bábu’l-Báb',
    'H[ae][zdḍ]r[aá]t[ií], Haḍráti',
    'Qur[r]?at[‘\'’\\-]?[uo]l[‘\'’\\-]?[‘\'’\\-]?Ayn, Qurratu’l-‘Ayn',
    'Nur, Núr',
    'Karb[ie]la, Karbilá',
    'Khosroe, <u>Kh</u>usraw',
    'Kirman, Kirmán',
    'Muslem, Muslim',
    'n[aá][kqg][ai][zd]e[ei]n, náqiḍín',
    'Dhikr, <u>Dh</u>ikr',
    'T[ie][h]?r[áa]n, Ṭihrán',
    'Mozaffar, Muḍaffar', //
    'Manshadi, Man<u>sh</u>ádí',
    'Hijaz, Ḥijáz',
    'K[ei]rm[aá]n, Kirmán',
    'Sheikh, <u>Sh</u>ay<u>kh</u>',
    'Seyed, Siyyid',
    'Mushkin, Mi<u>sh</u>kín',
    'Mushkin, Mi<u>sh</u>kín',
    'Ahmed, Aḥmad',
    'R[uú][hḥ][‘\'’\\-]?[Uuo][‘\'’\\-]?ll[aá]h, Rúḥu’lláh',
    '[ḤH][uo][qk][uo][‘\'’\\-]?ll[aá]h, Ḥuqúqu’llah',
    'Kit[aá]b[‘\'’\\-]?i[‘\'’\\-]{0,2}Ahd[ií], Kitáb-i-‘Ahdí',
    'Zaqqum, Zaqqúm',
    'Hamadan, Hamadán',
    'Ta[‘\'’]?yid, Ta’yíd',
    'Tarbiyat, Tarbíyat',
    'Mihd[íi]y[aá]b[aá]d, Mihdíyábád',
    '[SṢ]adru[\'’]?[ṣs][\'’\\-]?[ṢS]ud[uú]r, Ṣadru’ṣ-Ṣudúr',
    'Afghanistan, Af<u>gh</u>ánistán',
    'Khalq, <u>Kh</u>alq',
    'Taraz, Ṭaráz',
    'Tajalli, Tajallí',
    'Bahram, Bahrám',
    '[‘\'’]?Ir[áa]q, ‘Iráq',
    '[ÍI]r[aá]n, Írán',
    '[‘\'’]?Ab[d]?u[‘\'’]?l-[‘\'’]?A[zẓ][ií]m, ‘Abdu’l-‘Aẓím',
    '[HḤ]u[qk][úu]qu[‘\'’]?ll[aá]h, Ḥuqúqu’lláh',
    '[HḤ]u[qk][úu]q, Ḥuqúq',
    '[hḥ]u[qk][úu]q, ḥuqúq',
    'mithq[aá]l, mi<u>th</u>qál',
    'Mithq[aá]l, Mi<u>th</u>qál',
    'Zaynu[‘\'’]?l[\\- ]Muqarrabin, Zaynu’l-Muqarrabín',
    'Jin[aá]b[\\- ]i[\\- ]Zaynu[‘\'’]?l[\\- ]Muqarrabin, Jináb-i-Zaynu’l-Muqarrabín',
    'Hadba[‘\'’]?, Ḥadbá’',
    'Jin[aá]b[\\- ]i[\\- ]Am[ií]n, Jináb-i-Amín',
    'Kit[aá]b[\\- ]i[\\- ][‘\'’]?Ahd[iÍ], Kitáb-i-‘Ahdí',
    'Kit[aá]b[\\- ]i[\\- ][‘\'’]?Ahd, Kitáb-i-‘Ahd',
    'Varq[aá], Varqá',
    't[uú]m[aá]n, túmán',
    'zina, ziná',
    'Tajalliyat, Tajallíyát',
    'Kalimat, Kalimát',
    'Bisharat, Bi<u>sh</u>árát',
    '[TṬ]ar[aá]z[áa]t, Ṭarázát',
    'Adh[íi]rb[áa]yj[áa]n, A<u>dh</u>irbáyján',
    'Saadi, Sa‘dí',
    '[\']?Umar, ‘Umar',
    'Khayyam, <u>Kh</u>ayyám',
    'Lawh-i-Maqsud, Lawh-i-Maqsúd',
    'Rudaki, Rúdakí',
    'Farabi, Fárábí',
    'Parviz, Parvíz',
    'Sasani, Sásání',
    'Barbud, Bárbud',
    'Shahnaz, <u>Sh</u>ahnáz',
    'Qazvin, Qazvín',
    'Ba<u>gh</u>d[aá]di, Ba<u>gh</u>dádí',
    'I[sṣ]f[aá]h[aá]n[ií], Iṣfahání',
    'I[sṣ]f[aá]h[aá]n, Iṣfahán',
    'Ba(<u>)?gh(</u>)?d[aá]d[ií], Ba<u>gh</u>dádí',
    'Ba(<u>)?gh(</u>)?d[aá]d, Ba<u>gh</u>dád',
    // Kheir-ol-Gara
    // Khodabaksh
    ''
  ];

  CommonMispellings.forEach(function(item) {
    if (item.split(',').length == 2) {
      var find = item.split(',').shift().trim();
      var repl = item.split(',').pop().trim();
      // replace normal case version
      var reg = new RegExp(find + '([^a-záíú])', 'g');
      str = str.replace(reg, repl + '$1');
      // var reg = new RegExp(find, 'g');
      // str = str.replace(reg, repl);
      // replace plural version
      reg = new RegExp(find + 's([^a-záíú])', 'g');
      str = str.replace(reg, repl + 's$1');
      // uppercase version
      find = find.toUpperCase().replace(/<u>/ig, '<u>').replace(/<\/u>/ig, '</u>').replace(/\\S/g, '\\s');
      repl = repl.toUpperCase().replace(/<u>/ig, '<u>').replace(/<\/u>/ig, '</u>').replace(/\\S/g, '\\s');
      reg = new RegExp(find + '([^A-ZÁÍÚ])', 'g');
      str = str.replace(reg, repl + '$1');
    }
  });



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


