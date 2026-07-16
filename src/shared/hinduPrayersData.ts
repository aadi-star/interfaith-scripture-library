export interface ScriptureVerse {
  number: string;
  originalText: string;
  transliteration: string;
  translation: string;
}

export interface PrayerData {
  introSummary: string;
  verses: ScriptureVerse[];
  commentary: string;
}

export const HINDU_PRAYERS_FULL_DATA: Record<number, PrayerData> = {
  1: {
    introSummary: "The Gayatri Mantra is the supreme, ancient Vedic chant from the Rigveda (3.62.10) for mental illumination, paired with traditional Shanti Mantras invoking absolute peace across the cosmos.",
    verses: [
      {
        number: "Mantra 1 (Gayatri)",
        originalText: "ॐ भूर्भुवः स्वः ।\nतत्सवितुर्वरेण्यं ।\nभर्गो देवस्य धीमहि ।\nधियो यो नः प्रचोदयात् ॥",
        transliteration: "Om Bhur Bhuvah Svah |\nTat Savitur Varenyam |\nBhargo Devasya Dheemahi |\nDhiyo Yo Nah Prachodayaat ||",
        translation: "We contemplate the glorious solar light of the Divine Creator; may that divine illumination inspire and guide our intellect on the right path."
      },
      {
        number: "Mantra 2 (Shanti)",
        originalText: "ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै । तेजस्वि नावधीतमस्तु मा विद्विषावहै ॥ ॐ शान्तिः शान्तिः शान्तिः ॥",
        transliteration: "oṁ saha nāvavatu | saha nau bhunaktu | saha vīryaṁ karavāvahai | tejasvi nāvad hītam astu mā vidviṣāvahai | oṁ śāntiḥ śāntiḥ śāntiḥ",
        translation: "May the Divine protect us both (teacher and student) together. May we be nourished together. May we work together with great energy. May our study be enlightened and effective. May there be no animosity between us. Om Peace, Peace, Peace."
      }
    ],
    commentary: "These prayers reveal that Vedic spirituality is a collective seeking for mental clarity and peaceful study. Rather than individualistic salvation, it stresses harmonious co-existence with our environment, teachers, and student peers."
  },
  2: {
    introSummary: "The Hanuman Chalisa is a forty-verse devotional song composed by Goswami Tulsidas in Awadhi. It praises Lord Hanuman's matchless devotion, strength, courage, and surrender.",
    verses: [
      {
        number: "Doha 1",
        originalText: "श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि ।\nबरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥",
        transliteration: "Shri Guru Charan Saroj Raj, Nij Manu Mukuru Sudhaari |\nBaranaun Raghuvar Bimal Jasu, Jo Daayaku Phal Chaari ||",
        translation: "Having purified the mirror of my mind with the dust of the lotus feet of the Divine Guru, I sing the untarnished glory of the chief of Raghu's clan (Lord Rama), who bestows the four ultimate fruits of life: Dharma, Artha, Kama, and Moksha."
      },
      {
        number: "Doha 2",
        originalText: "बुद्धिहीन तनु जानिके सुमिरौ पवन-कुमार ।\nबल बुधि बिद्या देहु मोहिं हरहु कलेस बिकार ॥",
        transliteration: "Budhiheen Tanu Jaanike, Sumiraun Pavan-Kumaar |\nBal Budhi Bidya Dehu Mohim, Harahu Kales Bikaar ||",
        translation: "Knowing myself to be devoid of deep intellectual wisdom, I meditate upon you, Hanuman, the Son of the Wind. Grant me physical strength, supreme intellect, and spiritual knowledge, and dissolve all my afflictions and moral flaws."
      },
      {
        number: "Chaupai 1",
        originalText: "जय हनुमान ज्ञान गुन सागर ।\nजय कपीस तिहुँ लोक उजागर ॥",
        transliteration: "Jai Hanuman Gyaan Gun Saagar |\nJai Kapees Tihun Lok Ujaagar ||",
        translation: "Victory to Hanuman, who is a limitless ocean of wisdom and virtue! Victory to the Lord of monkeys, who illuminates the three worlds with his absolute glory."
      },
      {
        number: "Chaupai 2",
        originalText: "राम दूत अतुलित बल धामा ।\nअंजनि-पुत्र पवनसुत नामा ॥",
        transliteration: "Raam Doot Atulit Bal Dhaama |\nAnjani-Putra Pavan-Sut Naama ||",
        translation: "You are the supreme messenger of Lord Rama, the sanctuary of immeasurable power. You are known as the son of Mother Anjana and the Son of the Wind."
      },
      {
        number: "Chaupai 3",
        originalText: "महाबीर बिक्रम बजरंगी ।\nकुमति निवार सुमति के संगी ॥",
        transliteration: "Mahaaveer Bikram Bajrangi |\nKumati Nivaar Sumati Ke Sangi ||",
        translation: "O great hero, of matchless valiancy, with limbs as solid as a diamond lightning-bolt! You are the dispeller of corrupt thoughts and the companion of wisdom."
      },
      {
        number: "Chaupai 4",
        originalText: "कंचन बरन बिराज सुबेसा ।\nकानन कुंडल कुंचित केसा ॥",
        transliteration: "Kanchan Baran Biraaj Subesa |\nKanan Kundal Kunchit Kesa ||",
        translation: "Your complexion glows with the warmth of gold, and you are dressed in beautiful garments. You wear dazzling ear-rings and have beautifully curly hair."
      },
      {
        number: "Chaupai 5",
        originalText: "हाथ बज्र औ ध्वजा बिराजै ।\nकाँधे मूँज जनेऊ साजै ॥",
        transliteration: "Haath Vajra Au Dhvaja Biraajai |\nKandhe Moonj Janeoo Saajai ||",
        translation: "In your hands rest the mighty lightning-bolt (Vajra) and a victorious flag. Your shoulder is adorned with the sacred thread made of Munja grass."
      },
      {
        number: "Chaupai 6",
        originalText: "शंकर सुवन केसरीनंदन ।\nतेज प्रताप महा जग बंदन ॥",
        transliteration: "Sankar Suvan Kesaree-Nandan |\nTej Prataap Maha Jag Bandan ||",
        translation: "O incarnation of Shiva and physical son of Kesari! Your radiant brilliance and fierce valor is worshipped by the entire universe."
      },
      {
        number: "Chaupai 7",
        originalText: "बिद्यावान गुनी अति चातुर ।\nराम काज करिबे को आतुर ॥",
        transliteration: "Bidyaavaan Gunee Ati Chaatur |\nRaam Kaaj Karibe Ko Aatur ||",
        translation: "You are highly learned, filled with virtuous talents, and extremely clever. You are always enthusiastically eager to carry out the noble works of Lord Rama."
      },
      {
        number: "Chaupai 8",
        originalText: "प्रभु चरित्र सुनिबे को रसिया ।\nराम लखन सीता मन बसिया ॥",
        transliteration: "Prabhu Charitra Sunibe Ko Rasiya |\nRaam Lakhan Seeta Man Basiya ||",
        translation: "You take infinite delight in listening to the stories of the Lord's noble life. Lord Rama, Lakshmana, and Mother Sita reside forever within your heart."
      },
      {
        number: "Chaupai 9",
        originalText: "सूक्ष्म रूप धरि सियहिं दिखावा ।\nबिकट रूप धरि लंक जरावा ॥",
        transliteration: "Sukshma Roop Dhari Siyahin Dikhaava |\nBikat Roop Dhari Lank Jaraava ||",
        translation: "You assumed an extremely minute, humble form when appearing before Mother Sita, but assumed a terrifying colossal form when burning the golden city of Lanka."
      },
      {
        number: "Chaupai 10",
        originalText: "भीम रूप धरि असुर संहारे ।\nरामचंद्र के काज सँवारे ॥",
        transliteration: "Bheema Roop Dhari Asur Sanhaare |\nRamachandra Ke Kaaj Sanvaare ||",
        translation: "Assuming a formidable, mighty form, you destroyed the negative forces (asuras), successfully coordinating and fulfilling the commands of Lord Rama."
      },
      {
        number: "Chaupai 11",
        originalText: "लाय सजीवन लखन जियाए ।\nश्रीरघुबीर हरषि उर लाए ॥",
        transliteration: "Laay Sajeevan Lakhan Jiyaaye |\nShree-Raghubeer Harashi Ur Laaye ||",
        translation: "You brought the life-saving Sanjivani herb from the Himalayas, restoring Lakshmana back to life. Overflowing with joy, Lord Rama embraced you closely to his heart."
      },
      {
        number: "Chaupai 12",
        originalText: "रघुपति कीन्ही बहुत बड़ाई ।\nतुम मम प्रिय भरतहि सम भाई ॥",
        transliteration: "Raghupati Keenhee Bahut Badai |\nTum Mam Priya Bharatahi Sam Bhaai ||",
        translation: "The Chief of the Raghu clan (Rama) praised you with deep affection, declaring: 'You are as close and dear to me as my own beloved brother Bharata.'"
      },
      {
        number: "Chaupai 13",
        originalText: "सहस बदन तुम्हरो जस गावैं ।\nअस कहि श्रीपति कंठ लगावैं ॥",
        transliteration: "Sahas Badan Tumharo Jas Gaavain |\nAs Kahi Shreepati Kanth Lagaavain ||",
        translation: "Declaring that 'The thousand-headed celestial serpent sings of your glorious fame', the Lord of Lakshmi (Rama) embraced you with profound love."
      },
      {
        number: "Chaupai 14",
        originalText: "सनकादिक ब्रह्मादि मुनीसा ।\nनारद सारद सहित अहीसा ॥",
        transliteration: "Sanakaadik Brahmaadi Muneesa |\nNaarad Saarad Sahit Aheesa ||",
        translation: "Sages like Sanaka, Brahma, the celestial monarchs, Narada, Saraswati, and the King of Serpents (Sheshnag) are ever engaged in singing your glory."
      },
      {
        number: "Chaupai 15",
        originalText: "जम कुबेर दिगपाल जहाँ ते ।\nकबि कोबिद कहि सकैं कहाँ ते ॥",
        transliteration: "Yam Kuber Digpaal Jahaan Te |\nKabi Kobid Kahi Sakain Kahaan Te ||",
        translation: "Yama (lord of justice), Kubera (lord of wealth), the guardians of the ten directions, poets, and high scholars fail to fully describe your expansive virtue."
      },
      {
        number: "Chaupai 16",
        originalText: "तुम उपकार सुग्रीवहिं कीन्हा ।\nराम मिलाय राज पद दीन्हा ॥",
        transliteration: "Tum Upkaar Sugreevahin Keenha |\nRaam Milaay Raaj Pad Deenha ||",
        translation: "You rendered a magnificent service to Sugreeva by introducing him to Lord Rama, helping him reclaim his lost kingdom and kingly status."
      },
      {
        number: "Chaupai 17",
        originalText: "तुम्हरो मंत्र बिभीषन माना ।\nलंकेश्वर भए सब जग जाना ॥",
        transliteration: "Tumharo Mantra Vibheeshan Maana |\nLankesvar Bhae Sab Jag Jaana ||",
        translation: "Vibheeshana followed your wise counsel, securing the throne of Lanka, a historical event known and celebrated across the entire universe."
      },
      {
        number: "Chaupai 18",
        originalText: "जुग सहस्र जोजन पर भानू ।\nलील्यो ताहि मधुर फल जानू ॥",
        transliteration: "Jug Sahasra Jojan Par Bhaanoo |\nLeelyo Taahi Madhur Phal Jaanoo ||",
        translation: "The Sun, situated millions of miles away in outer space, was reached and swallowed by you in your childhood, mistaking it to be a sweet, ripe fruit."
      },
      {
        number: "Chaupai 19",
        originalText: "प्रभु मुद्रिका मेलि मुख माहीं ।\nजलधि लाँघि गये अचरज नाहीं ॥",
        transliteration: "Prabhu Mudrika Meli Mukh Maaheen |\nJaladhi Laanghi Gaye Acharaj Naaheen ||",
        translation: "Holding Lord Rama's signet ring inside your mouth, you leaped across the massive, roaring ocean—it is no wonder such a miracle was easily done by you."
      },
      {
        number: "Chaupai 20",
        originalText: "दुर्गम काज जगत के जेते ।\nसुगम अनुग्रह तुम्हरे तेते ॥",
        transliteration: "Durgam Kaaj Jagat Ke Jete |\nSugam Anugrah Tumhare Tete ||",
        translation: "Every arduous task or seemingly impossible crisis in this mortal world becomes effortlessly simple through your kind and merciful grace."
      },
      {
        number: "Chaupai 21",
        originalText: "राम दुआरे तुम रखवारे ।\nहोेत न आग्या बिनु पैसारे ॥",
        transliteration: "Raam Duaare Tum Rakhvaare |\nHot Na Aagya Binu Paisaare ||",
        translation: "You are the mighty guardian at the gateway of Lord Rama's palace. No one can enter or receive the Lord's presence without your explicit permission."
      },
      {
        number: "Chaupai 22",
        originalText: "सब सुख लहै तुम्हारी सरना ।\nतुम रक्षक काहू को डरना ॥",
        transliteration: "Sab Sukh Lahai Tumhaaree Sarana |\nTum Rakshak Kaahoo Ko Darana ||",
        translation: "All joy, peace, and ultimate security are achieved by surrendering into your refuge. When you are our supreme protector, what fear is there to touch us?"
      },
      {
        number: "Chaupai 23",
        originalText: "आपन तेज सम्हारो आपै ।\nतीनों लोक हाँक तें काँपै ॥",
        transliteration: "Aapan Tej Samhaaro Aapai |\nTeenon Lok Haank Ten Kaanpai ||",
        translation: "Only you can control and harness your immense, blinding energy. The three worlds tremble with fear when you declare your thunderous battle cry."
      },
      {
        number: "Chaupai 24",
        originalText: "भूत पिसाच निकट नहिं आवै ।\nमहाबीर जब नाम सुनावै ॥",
        transliteration: "Bhoot Pisaach Nikat Nahin Aavai |\nMahaaveer Jab Naam Sunaavai ||",
        translation: "Negative vibrations, ghosts, and malicious forces dare not approach when the sacred name of 'Mahavir' is actively recited aloud."
      },
      {
        number: "Chaupai 25",
        originalText: "नासै रोग हरै सब पीरा ।\nजपत निरंतर हनुमत बीरा ॥",
        transliteration: "Naasai Rog Harai Sab Peera |\nJapat Nirantar Hanumat Beera ||",
        translation: "All diseases are eradicated and all acute physical and mental pains are cured by continuously chanting and meditating on the courageous Hanuman."
      },
      {
        number: "Chaupai 26",
        originalText: "संकट तें हनुमान छुड़ावै ।\nमन क्रम बचन ध्यान जो लावै ॥",
        transliteration: "Sankat Ten Hanuman Chhudaavai |\nMan Kram Bachan Dhyaan Jo Laavai ||",
        translation: "Hanuman liberates from all severe crises and bondages those who align their minds, actions, and speech to contemplate him with absolute focus."
      },
      {
        number: "Chaupai 27",
        originalText: "सब पर राम तपस्वी राजा ।\nतिन के काज सकल तुम साजा ॥",
        transliteration: "Sab Par Raam Tapasvee Raaja |\nTin Ke Kaaj Sakal Tum Saaja ||",
        translation: "Lord Rama is the supreme ascetic King of all. Yet, you managed, carried out, and beautified all his projects with perfect diligence."
      },
      {
        number: "Chaupai 28",
        originalText: "और मनोरथ जो कोइ लावै ।\nसोइ अमित जीवन फल पावै ॥",
        transliteration: "Aur Manorath Jo Koi Laavai |\nSoi Amit Jeevan Phal Paavai ||",
        translation: "Whatever noble desire or prayer a seeker brings before your altar, they receive the highest, limitless nectar-fruits of fulfilled life."
      },
      {
        number: "Chaupai 29",
        originalText: "चारों जुग परताप तुम्हारा ।\nहै परसिद्ध जगत उजियारा ॥",
        transliteration: "Charon Jug Parataap Tumhaara |\nHai Parasiddh Jagat Ujiyaara ||",
        translation: "Your protective glory spans across all four cosmological world epochs (yugas). Your fame is internationally acknowledged, throwing light across the universe."
      },
      {
        number: "Chaupai 30",
        originalText: "साधु संत के तुम रखवारे ।\nअसुर निकंदन राम दुलारे ॥",
        transliteration: "Saadhu Sant Ke Tum Rakhvaare |\nAsur Nikandan Raam Dulaare ||",
        translation: "You are the dedicated guardian of saints, sages, and moral seekers. You destroy destructive, negative forces and are deeply beloved of Lord Rama."
      },
      {
        number: "Chaupai 31",
        originalText: "अष्ट सिद्धि नव निधि के दाता ।\nअस बर दीन जानकी माता ॥",
        transliteration: "Ashta Siddhi Nav Nidhi Ke Daata |\nAs Bar Deen Jaanakee Maata ||",
        translation: "You bestow the eight classical yogic attainments (siddhis) and the nine cosmic treasures (nidhis). This unique boon was granted to you by Mother Sita herself."
      },
      {
        number: "Chaupai 32",
        originalText: "राम रसायन तुम्हरे पासा ।\nसदा रहो रघुपति के दासा ॥",
        transliteration: "Raam Rasaayan Tumhare Paasa |\nSada Raho Raghupati Ke Daasa ||",
        translation: "You possess the supreme healing elixir of Lord Rama's devotion (Ram-Rasayan). May you remain forever the humble servant of the Raghu Dynasty."
      },
      {
        number: "Chaupai 33",
        originalText: "तुम्हरे भजन राम को पावै ।\nजनम जनम के दुख बिसरावै ॥",
        transliteration: "Tumhare Bhajan Raam Ko Paavai |\nJanam Janm Ke Dukh Bisraavai ||",
        translation: "By singing your devotional hymns, the seeker directly reaches Lord Rama, dissolving deep mental sorrows accumulated over cycles of birth."
      },
      {
        number: "Chaupai 34",
        originalText: "अंत काल रघूबर पुर जाई ।\nजहाँ जन्म हरि-भक्त कहाई ॥",
        transliteration: "Ant Kaal Raghubar Pur Jaai |\nJahaan Janm Hari-Bhakta Kahaai ||",
        translation: "At the end of their biological life, your devotee enters the eternal, divine abode of Rama, and remains registered as an auspicious devotee in every realm."
      },
      {
        number: "Chaupai 35",
        originalText: "और देवता चित्त न धरई ।\nहनुमत सेइ सर्ब सुख करई ॥",
        transliteration: "Aur Devata Chitta Na Dharai |\nHanumat Sei Sarb Sukh Karai ||",
        translation: "Even without contemplating any other deity, serving Hanuman alone secures complete, absolute happiness and spiritual peace."
      },
      {
        number: "Chaupai 36",
        originalText: "संकट कटै मिटै सब पीरा ।\nजो सुमिरै हनुमत बलबीरा ॥",
        transliteration: "Sankat Katai Mitai Sab Peera |\nJo Sumirai Hanumat Balbeera ||",
        translation: "All crises vanish and all lingering inner griefs are erased when one actively remembers the strong, heroic Hanuman."
      },
      {
        number: "Chaupai 37",
        originalText: "जय जय जय हनुमान गोसाईं ।\nकृपा करहु गुरुदेव की नाईं ॥",
        transliteration: "Jai Jai Jai Hanuman Gosaain |\nKripa Karahu Gurudev Kee Naain ||",
        translation: "Victory, victory, victory to the ultimate master, Hanuman! Shower your kind grace upon me just like my divine spiritual preceptor (Guru)."
      },
      {
        number: "Chaupai 38",
        originalText: "जो सत बार पाठ कर कोई ।\nछूटहि बंदि महा सुख होई ॥",
        transliteration: "Jo Sat Baar Paath Kar Koi |\nChhootahi Bandi Maha Sukh Hoi ||",
        translation: "Whoever recites this holy chalisa a hundred times is completely released from all physical and mental bondages, achieving sublime spiritual peace."
      },
      {
        number: "Chaupai 39",
        originalText: "जो यह पढ़ै हनुमान चालीसा ।\nहोय सिद्धि साखी गौरीसा ॥",
        transliteration: "Jo Yeh Padhai Hanuman Chalisa |\nHoy Siddhi Saakhee Gaureesa ||",
        translation: "Whoever studies this Hanuman Chalisa regularly gains direct spiritual victory and focus, as witnessed and vouched by Lord Shiva (husband of Mother Gauri)."
      },
      {
        number: "Chaupai 40",
        originalText: "तुलसीदास सदा हरि चेरा ।\nकीजै नाथ हृदय मँह डेरा ॥",
        transliteration: "Tulsidaas Sada Hari Chera |\nKeejai Naath Hriday Manh Dera ||",
        translation: "Goswami Tulsidas remains forever a servant of the Divine Lord. O Hanuman, please make your permanent home within my loving heart."
      },
      {
        number: "End Doha",
        originalText: "पवनतनय संकट हरन मंगल मूरति रूप ।\nराम लखन सीता सहित हृदय बसहु सुर भूप ॥",
        transliteration: "Pavantanay Sankat Haran, Mangal Moorati Roop |\nRaam Lakhan Seeta Sahit, Hriday Basahu Sur Bhoop ||",
        translation: "O Son of the Wind, savior from all hazards, very embodiment of auspicious blessings! Please dwell in my heart forever along with Lord Rama, Lakshmana, and Mother Sita. You are the king of all noble forces."
      }
    ],
    commentary: "The Hanuman Chalisa is celebrated as a masterpiece of spiritual energy. By chanting these verses, the seeker tunes into courage, physical discipline, and self-less service. Tulsidas utilizes physical Hanuman as an allegory for the vital air (Prana) that must carry the soul (Rama) back to the heights of spiritual wisdom."
  },
  3: {
    introSummary: "The Bajrang Baan is a highly potent, protective, and rhythmic petition dedicated to Hanuman. It is traditionally chanted to clear lingering fears, severe psychological blockages, and complex external/internal obstacles.",
    verses: [
      {
        number: "Doha 1",
        originalText: "निश्चय प्रेम प्रतीत ते, विनय करैं सनमान ।\nतेहि के कारज सकल शुभ, सिद्ध करैं हनुमान ॥",
        transliteration: "Nishchay Prem Prateet Te, Vinay Karain Sanmaan |\nTehi Ke Kaaraj Sakal Shubh, Siddh Karain Hanumaan ||",
        translation: "With firm conviction, sincere love, and deep humility, whoever honors Hanuman will see all their righteous and auspicious tasks brought to absolute success."
      },
      {
        number: "Chaupai 1",
        originalText: "जय हनुमंत संत हितकारी । सुन लीजै प्रभु अरज हमारी ॥",
        transliteration: "Jai Hanumant Sant Hitkaari | Sun Leejai Prabhu Araj Hamaari ||",
        translation: "Victory to Hanuman, the selfless benefactor of saints and spiritual seekers! Please listen, O Lord, to this earnest plea of mine."
      },
      {
        number: "Chaupai 2",
        originalText: "विपति हरन अंजनी के जाये । संकट काटहु हे तुम स्वामी ॥",
        transliteration: "Vipati Haran Anjani Ke Jaaye | Sankat Kaatahu He Tum Svaamee ||",
        translation: "You are the destroyer of misfortune, born of Mother Anjana. Please cut through our deepest dilemmas, O Lord of immense power."
      },
      {
        number: "Chaupai 3",
        originalText: "जय बजरंग वज्र तनधारी । दुष्ट दलन जय जय बलधारी ॥",
        transliteration: "Jai Bajrang Vajra Tanahdhari | Dusht Dalan Jai Jai Baldhaari ||",
        translation: "Victory to Bajrang (Hanuman), whose body is strong like a diamond bolt. Victory to the destroyer of negative, corrupting obstacles."
      },
      {
        number: "Chaupai 4",
        originalText: "गर्जहिं घन ज्यों शत्रु भयकारी । भक्त जनन सुख प्रदाता ॥",
        transliteration: "Garjahin Ghan Jyon Shatru Bhayakaari | Bhakt Janan Sukh Pradaata ||",
        translation: "Your celestial roar is loud and powerful like thunderclaps, striking terror into negative forces, while giving infinite reassurance to the hearts of your devotees."
      },
      {
        number: "Chaupai 5",
        originalText: "जय राम लक्ष्मण हितकारी । सीता माता शोक निवारी ॥",
        transliteration: "Jai Ram Lakshman Hitkaari | Seeta Maata Shok Nivaari ||",
        translation: "Victory to him who brought endless comfort to Lord Rama and Lakshmana, and who completely erased the deep grief of Mother Sita in Ashok Vatika."
      },
      {
        number: "Chaupai 6",
        originalText: "उठु उठु चलु तोहि राम दुहाई । पायँ परौं कर जोरि मनाई ॥",
        transliteration: "Uthu Uthu Chalu Tohi Raam Duhaai | Paayan Paraun Kar Jori Manaai ||",
        translation: "Arise, arise! Move forward with the speed of an arrow, for I invoke the sacred covenant of Lord Rama. I fall at your feet, making this petition with folded hands."
      },
      {
        number: "Chaupai 7",
        originalText: "ॐ चं चं चं चपलता हितकारी । जय हनुमान सुमति सुखकारी ॥",
        transliteration: "Om Chaan Chaan Chaan Chapatla Hitkaari | Jai Hanuman Sumati Sukhkaari ||",
        translation: "Reciting the dynamic acoustic seed-syllables invoking lightning-fast speed! Victory to Hanuman, who brings bright intellect and pure spiritual joy."
      },
      {
        number: "Doha 2",
        originalText: "धूप दीप नैवेद्य सों, पूजैं सदा तुम्हार ।\nहरहु कलेस बिकार सब, जय जय हनुमान ॥",
        transliteration: "Dhoop Deep Naivedya Son, Poojain Sada Tumhaar |\nHarahu Kales Bikaar Sab, Jai Jai Hanumaan ||",
        translation: "Offering fragrant incense, glowing lamps, and sweet offerings, we worship you constantly. Dissolve all our core grievances, obstacles, and sorrowful flaws, O victorious Hanuman!"
      }
    ],
    commentary: "The Bajrang Baan is an intensely energized mantra. Devotees recite it under severe stress or depression. It commands Hanuman with the ultimate force: swearing by the name of Supreme Lord Rama (Ram-Duhaai). Since Hanuman's entire spiritual existence is bound to Rama, this invocation is considered completely breakthrough."
  },
  4: {
    introSummary: "The Shiv Tandav Stotram is a Sanskrit hymn of brilliant rhythmic meter and acoustic power. Traditionally composed by Ravana (the king of Lanka), it sings of Lord Shiva's ecstatic cosmic dance (Tandav) of creation, sustenance, and ultimate release.",
    verses: [
      {
        number: "Stanza 1",
        originalText: "जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।\nडमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥ १ ॥",
        transliteration: "Jaṭāṭavīgalaj-jalapravāhapāvitasthale\nGale'valambya lambitāṁ bhujaṅgatuṅgamālikām |\nḌamaḍ-ḍamaḍ-ḍamaḍ-ḍamanninādavad-ḍamarvayaṁ\nCakāra caṇḍataṇḍavaṁ tanotu naḥ śivaḥ śivam || 1 ||",
        translation: "With his neck consecrated by the pure trickling rivers of the celestial system inside his forest of matted locks, a grand serpent draped around his throat like a heavy garland (Mala), and the damaru drum echoing 'Damad-Damad-Damad', Lord Shiva performs his fierce cosmic Tandav dance. May he expand our auspicious, holy well-being."
      },
      {
        number: "Stanza 2",
        originalText: "जटाकटाहसंभ्रमभ्रमन्निलिम्पनिर्झरी विलोलवीचिवल्लरीविराजमानमूर्धनि ।\nधगद्धगद्धगज्ज्वलल्ललाटपट्टपावके किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम ॥ २ ॥",
        transliteration: "Jaṭākaṭāhasaṁbhramabhramannilimpanirjharī\nVilolavīcivallarī-virājamānamūrdhani |\nDhagad-dhagad-dhagaj-jvalal-lalāṭapaṭṭapāvake\nKiśoracandraśekhare ratiḥ pratikṣaṇaṁ mama || 2 ||",
        translation: "My mind is locked in eternal bliss upon Lord Shiva, on whose forehead the brilliant fire blazes 'Dhagad-Dhagad-Dhagad', whose hair surges in spectacular waves containing the celestial Ganges, and whose crown is adorned with the silver crescent moon."
      },
      {
        number: "Stanza 3",
        originalText: "धराधरेन्द्रनन्दिनीविलासबन्धुबन्धुर स्फुरद्दिगन्तसन्ततिममोदमानमानसे ।\nकृपाकटाक्षधोरणीनिरुद्धदुर्धरापदि क्वचिद्दिगम्बरे मनो विनोदमेतु वस्तुनि ॥ ३ ॥",
        transliteration: "Dharādharendranandinī-vilāsabandhubandhura\nSphuraddigantasantati-pramodamānamānase |\nKṛpākaṭākṣadhoraṇी-niruddhadurdharāpadi\nKvaciddigambare mano vinodemetu vastuni || 3 ||",
        translation: "May my mind find absolute joy in the Supreme One, whose consort is Parvati (daughter of the mountain king), whose compassionate sidelong glances effortlessly block and freeze all crises and disasters, and who is clad only in the directions of the cosmos."
      },
      {
        number: "Stanza 4",
        originalText: "जटाभुजङ्गपिङ्गलस्फुरत्फणामणिप्रभा कदम्बकुङ्कुमद्रवप्रलिप्तदिग्वधूमुखे ।\nमदान्धसिन्धुरस्फुरत्वगुत्तरीयमेदुरे मनो विचुत्प्रभामहद्दि पैतु वस्तुनि ॥ ४ ॥",
        transliteration: "Jaṭābhujaṅgapiṅgala-sphuratphaṇāmaṇiprabhā\nKadambakuङ्kumadrava-praliptadigvadhūmukhe |\nMadāndhasindhurasphurat-tvaguttarīyamedure\nMano 'nanyabhūtaṁ bhaje bhavat-prabhā-mahaddipe || 4 ||",
        translation: "We worship Shiva, the absolute light, who is covered in reddish-yellow saffron-paste, whose matted hair reflects the golden rays of the serpent jewels, and his shoulders draped with celestial skins. His divine light shines like a massive spiritual torch."
      },
      {
        number: "Stanza 5",
        originalText: "सहस्रलोचनप्रभृत्यशेषलेखशेखर प्रसूनधूलिधोरणी विधूसराङ्घ्रिपीठभूः ।\nभुजङ्गराजमालया निबद्धजाटजूटकः श्रियै चिराय जायतां चकोरबन्धुशेखरः ॥ ५ ॥",
        transliteration: "Sahasralocanaprabhṛty-aśeṣalekhaśekhara\nPrasūnadhūlidhoraṇī-vidhūsarāṅghripīṭhabhūḥ |\nBhujaṅgarājamālayā-nibaddhajāṭajūṭakaḥ\nŚriyai cirāya jāyatāṁ cakorabandhuśekharaḥ || 5 ||",
        translation: "May Shiva, whose footstool is greyed with the pollen-dust of fresh blossoms falling from the crowns of deities like Indra, and whose hair is bound with the serpent king, expand my spiritual wealth forever."
      },
      {
        number: "Stanza 6",
        originalText: "ललाटचत्वरज्वलद्धनञ्जयस्फुलिङ्गभा निपीतपञ्चसायकं नमन्निलिम्पनायकम् ।\nसुधामयूखलेखया विराजमानशेखरं महाकपालिसम्पदे शिरोजटालमस्तु नः ॥ ६ ॥",
        transliteration: "Lalāṭacatavarajvalad-dhanañjayasphuliṅgabhā\nNipītapañcasāyakaṁ namannilimpanāyakam |\nSudhāmayūkhalekhayā-virājamānaśekharaṁ\nMahākapālisampade śirojaṭālamastu naḥ || 6 ||",
        translation: "May we achieve spiritual wealth from Shiva's matted locks! Shiva, whose third eye burns with spark-spitting fire that dissolved Kamadeva (the god of desire), and who is worshipped by the king of gods."
      },
      {
        number: "Stanza 7",
        originalText: "करालभालपट्टिकाधगद्धगद्धगज्ज्वल द्धनञ्जयाहुतीकृतप्रचण्डपञ्चसायके ।\nधराधरेन्द्रनन्दिनीकुचाग्रचित्रपत्रक प्रकल्पनैकशिल्पिनि त्रिलोचने रतिर्मम ॥ ७ ॥",
        transliteration: "Karālabhālapaṭṭikā-dhagaddhagaddhagajjvalad\nDhanañjayāhutīkṛta-pracaṇḍapañcasāyake |\nDharādharendranandinī-kucāgracitrapatraka\nPrakalpanaikaśilpini trilocane ratirmama || 7 ||",
        translation: "My mind wanders in absolute devotion on Shiva, who offered the five arrows of desire as a sacrifice into the blazing fire of his forehead, and who is the unique creator and artist of this beautiful universe."
      },
      {
        number: "Stanza 8",
        originalText: "नवीनमेघमण्डलीनिरुद्धदुर्धरस्फुरत्कुहूनिशीथिनीतमःप्रबन्धबद्धकन्धरः ।\nनिलिम्पनिर्झरीधरस्तनोतु कृत्तिसिन्धुरः कलानिधानबन्धुरः श्रियं जगद्धुरंधरः ॥ ८ ॥",
        transliteration: "Navīnameghamaṇḍalī-niruddhadurdharasphurat\nKuhūnīśīthinītamaḥ-prabandhabaddhakandharaḥ |\nNilimpanirjharī-dharastanotu kṛttisindhuraḥ\nKalānidhānabandhuraḥ śriyaṁ jagaddhuraṅdharaḥ || 8 ||",
        translation: "May he, whose neck is dark blue like the night sky covered under dense cosmic clouds, and who carries the holy Ganges upon his head, enhance my ultimate spiritual prosperity. He supports the weight of the entire world."
      },
      {
        number: "Stanza 9",
        originalText: "प्रफुल्लनीलपङ्कजप्रपञ्चकालिमप्रभावलम्बि कण्ठकन्दलीरुचिप्रबद्धकन्धरम् ।\nस्मरच्छिदं पुरच्छिदं भवच्छिदं मखच्छिदं गजच्छिदं अन्धकच्छिदं तमन्तकच्छिदं भजे ॥ ९ ॥",
        transliteration: "Praphullanīlapaṅkaja-prapañcakālimaprabhā\nValambikaṇṭhakandalī-ruciprabaddhakandharam |\nSmaracchidaṁ puracchidaṁ bhavacchidaṁ makhacchidaṁ\nGajacchidaṁ andhakacchidaṁ tamantakacchidaṁ bhaje || 9 ||",
        translation: "I worship Shiva, whose throat holds the indigo glow of a fully blossomed blue lotus, who is the destroyer of desire (Kama), the shatterer of the three fortresses of ego (Tripura), the cutter of worldly illusion, and the supreme defeater of death."
      },
      {
        number: "Stanza 10",
        originalText: "अखर्वसर्वमङ्गलाकलाकदम्बमञ्जरी रसप्रवाहमाधुरीविजृम्भणामधुव्रतम् ।\nस्मरान्तकं पुरान्तकं भवान्तकं मखान्तकं गजान्तकं अन्धकान्तकं तमन्तकान्तकं भजे ॥ १० ॥",
        transliteration: "Akharvasarvamaṅgalā-kalākadambamañjarī\nRasapravāhamādhurī-vijṛmbhaṇāmadhuvratam |\nSmarāntakaṁ purāntakaṁ bhavāntakaṁ makhāntakaṁ\nGajāntakaṁ andhakāntakaṁ tamantakāntakaṁ bhaje || 10 ||",
        translation: "I worship Shiva, who eagerly drinks the sweet nectar of cosmic arts and auspiciousness from Mother Parvati, and who is the ultimate cosmic termination of all delusions, vanity, and limitations of time."
      }
    ],
    commentary: "The Shiv Tandav Stotram is a supreme exploration of the dance of creation and dissolution. Ravana, though an egoic king, composed this in absolute devotion when realizing Shiva's infinite nature. By chanting this, we align our vital breaths with Shiva's infinite rhythm, purifying our channels."
  },
  5: {
    introSummary: "The traditional Marathi and Hindi 'Jai Ganesh Jai Ganesh Deva' is sung at the beginning of all auspicious enterprises and morning worships. Ganesha represents the supreme intellect that clears all intellectual and physical roadblocks.",
    verses: [
      {
        number: "Verse 1",
        originalText: "जय गणेश जय गणेश, जय गणेश देवा ।\nमाता जाकी पारवती, पिता महादेवा ॥",
        transliteration: "Jai Ganesh Jai Ganesh, Jai Ganesh Deva |\nMaata Jaakee Paaravatee, Pita Mahaadeva ||",
        translation: "Om! Victory, victory to Lord Ganesha, the radiant remover of obstacles. Whose mother is the divine Goddess Parvati, and whose father is Lord Shiva (Mahadeva)."
      },
      {
        number: "Verse 2",
        originalText: "एकदन्त दयावन्त, चार भुजाधारी ।\nमाथे सिन्दूर सोहे, मूस की सवारी ॥",
        transliteration: "Ekadanta Dayaavanta, Chaar Bhujaadhaaree |\nMaathe Sindoor Sohe, Moos Kee Savaaree ||",
        translation: "The single-tusked, highly compassionate Lord with four mighty arms, who is beautifully decorated with red vermillion on his forehead and rides upon his humble mouse."
      },
      {
        number: "Verse 3",
        originalText: "पान चढ़े फूल चढ़े, और चढ़े मेवा ।\nलड्डुअन का भोग लगे, सन्त करें सेवा ॥",
        transliteration: "Paan Chadhe Phool Chadhe, Aur Chadhe Meva |\nLadduan Ka Bhog Lage, Sant Karain Seva ||",
        translation: "We offer sacred betel leaves, fresh blossoms, and dried nuts before your altar. Sages and saints serve you, offering sweet laddus (golden modaks) as holy prasad."
      },
      {
        number: "Verse 4",
        originalText: "अन्धन को आँख देत, कोढ़िन को काया ।\nबाँझन को पुत्र देत, निर्धन को माया ॥",
        transliteration: "Andhan Ko Aankh Det, Kodhin Ko Kaaya |\nBanjhan Ko Putra Det, Nirdhan Ko Maaya ||",
        translation: "He restores vision to the blind, heals the physical bodies of those suffering leprosy, blesses the barren with offspring, and bestows abundance upon the poor."
      },
      {
        number: "Verse 5",
        originalText: "'सूर' श्याम शरण आए, सफल कीजै सेवा ।\nजय गणेश जय गणेश, जय गणेश देवा ॥",
        transliteration: "'Soor' Shyaam Sharan Aaye, Saphal Keejai Seva |\nJai Ganesh Jai Ganesh, Jai Ganesh Deva ||",
        translation: "All we seekers have come to take complete shelter in your sanctuary. Please bless our devotional service and make our lives dynamic and meaningful."
      }
    ],
    commentary: "Ganesha's large ears teach us to listen carefully and absorb wisdom, his small eyes denote acute focus, his elephant trunk represents immense strength paired with gentleness, and his small vehicle (the mouse) teaches us to master the small desires of our senses."
  },
  6: {
    introSummary: "A beautiful compilation of traditional chants dedicated to the Divine Mother in her forms of Durga (strength), Lakshmi (abundance), and Saraswati (knowledge), traditionally sung during Navratri.",
    verses: [
      {
        number: "1. Durga Ji (Jai Ambe Gauri)",
        originalText: "जय अम्बे गौरी, मैया जय अम्बे गौरी ।\nतुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी ॥\nमांग सिन्दूर बिराजत, टीको मृगमद को ।\nउज्ज्वल से दो नैना, चन्द्रबदन नीको ॥",
        transliteration: "Jai Ambe Gauri, Maiya Jai Ambe Gauri |\nTumako Nishadina Dhyaavata, Hari Brahma Shivari ||\nMaang Sindoor Biraajat, Teeko Mrigamad Ko |\nUjjvala Se Do Naina, Chandrabadan Neeko ||",
        translation: "Victory to Mother Ambe, the Divine Gauri! Vishnu, Brahma, and Shiva contemplate you day and night. Red vermillion shines in your parting, with a beautiful musk mark on your forehead. Your eyes are bright, and your face is peaceful like the moon."
      },
      {
        number: "2. Lakshmi Ji (Om Jai Laxmi Mata)",
        originalText: "ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता ।\nतुमको निशदिन ध्यावत, हर विष्णु विधाता ॥\nउमा रमा ब्रह्माणी, तुम ही जग माता ।\nसूर्य चन्द्रमा ध्यावत, नारद ऋषि गाता ॥",
        transliteration: "Om Jai Lakshmi Mata, Maiya Jai Lakshmi Mata |\nTumako Nishadina Dhyaavata, Hara Vishnu Vidhaata ||\nYuma Rama Brahmaanee, Tum Hee Jag Maata |\nSoorya Chandrama Dhyaavata, Naarad Rishi Gaata ||",
        translation: "Om! Victory to Mother Lakshmi, the giver of light and abundance. Shiva, Vishnu, and Brahma contemplate you. You are Uma, Roma, and Brahmani, the very Mother of the universe. The Sun, Moon, and sage Narada sing of your glory."
      },
      {
        number: "3. Saraswati Ji (Jai Saraswati Mata)",
        originalText: "जय सरस्वती माता, मैया जय सरस्वती माता ।\nसद्गुण ज्ञान प्रदायिनी, त्रिभुवन विख्याता ॥\nचन्द्रबदनि पद्मासिनि, द्युति मंगलकारी ।\nसोहे हंस सवारी, अतुलित बलधारी ॥",
        transliteration: "Jai Saraswati Mata, Maiya Jai Saraswati Mata |\nSadguna Gyaan Pradaayinee, Tribhuvana Vikhyaata ||\nChandrabadani Padmaasini, Dyuti Mangalakaaree |\nSohe Hans Savaaree, Atulit Baladhaaree ||",
        translation: "Victory to Mother Saraswati, the patroness of fine arts and absolute wisdom. You are the bestower of noble virtues and learning. Seated elegantly on a lotus with your swan vehicle, you guide our intellect into divine truth."
      },
      {
        number: "4. Kali Ji (Mangal Ki Seva)",
        originalText: "मंगल की सेवा सुन मेरी देवा, हाथ कतार खप्पर धारी ।\nसेन सिन्दूर सोहे कंचन की काया, रकत बीज विनाशिनी काली ॥\nजय जय जय महाकाली, शत्रुओं का नाश करे ॥",
        transliteration: "Mangal Kee Seva Sun Meree Deva, Haath Kataar Khappar Dhaaree |\nSen Sindoor Sohe Kanchan Kee Kaaya, Rakat Beej Vinaashinee Kaalee ||\nJai Jai Jai Mahaakaalee, Shatruon Ka Naash Kare ||",
        translation: "Listening to your auspicious service, O Mother Kali, who holds the sword and the vessel. Your golden-hued physical form is adorned with red vermillion. You are the destroyer of Raktabeeja (the egoic seed-demon). Victory to Kali, who dissolves outer and inner weaknesses."
      },
      {
        number: "5. Vaishno Devi (Sankat Harani)",
        originalText: "जय वैष्णवी माता, मैया जय वैष्णवी माता ।\nशीश पे मुकुट विराजे, हाथ त्रिशूल साजा ॥\nजम्मू की गुफा में, तुम हो कष्ट निवारी ।\nभक्तों की दुःख हरनी, हे आदिकुमारी ॥",
        transliteration: "Jai Vaishnavi Mata, Maiya Jai Vaishnavi Mata |\nSheesh Pe Mukut Viraaje, Haath Trishool Saaja ||\nJammu Kee Gupha Mein, Tum Ho Kasht Nivaaree |\nBhakton Kee Duhkh Haranee, He Aadikumaaree ||",
        translation: "Victory to Mother Vaishno Devi (Vaishnavi). A magnificent crown rests on your head, and a trident is held in your hands. Residing in your cave in Jammu, you are the remover of all physical disasters and protector of cosmic righteousness."
      },
      {
        number: "6. Santoshi Mata (Jai Santoshi Mata)",
        originalText: "जय सन्तोषी माता, मैया जय सन्तोषी माता ।\nअपने भक्तों को देती, सुख सम्पति दाता ॥\nगुड और चना नारियल, भोग लगे सुंदर ।\nसंतुष्ट करती मन को, हे माता सुखकर ॥",
        transliteration: "Jai Santoshi Mata, Maiya Jai Santoshi Mata |\nApane Bhakton Ko Detee, Sukh Sampati Daata ||\nGud Aur Chana Naariyal, Bhog Lage Sundar |\nSantusht Karatee Man Ko, He Mata Sukha-kar ||",
        translation: "Victory to Mother Santoshi, the deity of peaceful satisfaction. You bless your devotees with health, content, and inner wealth. We offer jaggery, roasted chickpeas, and fresh coconuts. You bring infinite satisfaction to our minds."
      },
      {
        number: "7. Parvati Mata Ki Aarti",
        originalText: "जय पारवती माता, मैया जय पारवती माता ।\nजगन्नाथ की माता, भोले संग राता ॥\nहिमगिरि की तुम पुत्री, शम्भू मन भाई ।\nसदा सुख प्रदायिनी, संकट दुख खाई ॥",
        transliteration: "Jai Parvati Mata, Maiya Jai Parvati Mata |\nJagannaath Kee Maata, Bhole Sang Raata ||\nHimagiri Kee Tum Putree, Shambhoo Man Bhaai |\nSada Sukh Pradaayinee, Sankat Dukh Khaai ||",
        translation: "Victory to Mother Parvati, who stays in union with Shiva. You are the daughter of the majestic Himalayas, beloved of Lord Shiva. You rescue us from difficulties."
      },
      {
        number: "8. Gayatri Mata Ki Aarti",
        originalText: "जयति जय गायत्री माता, जयति जय गायत्री माता ।\nवेद जननी जगदम्बा, बुद्धि प्रदायिनी दाता ॥\nपाप हरनी दुःख तारिणी, तुम ही कल्याणकारी ।\nचार वेद की माता, तुम हो सुखकारी ॥",
        transliteration: "Jayati Jai Gayatri Mata, Jayati Jai Gayatri Mata |\nVeda Jananee Jagadamba, Buddhi Pradaayinee Daata ||\nPaap Haranee Duhkh Taarinee, Tum Hee Kalyaanakaaree |\nChaar Veda Kee Maata, Tum Ho Sukhakaaree ||",
        translation: "Victory, glory to Mother Gayatri! The mother of the sacred Vedas, the bestower of intellectual clarity (Buddhi). You are the cleanser of negative karmas and the ultimate auspicious mother of four Vedas."
      },
      {
        number: "9. Ganga Mata Ki Aarti",
        originalText: "ॐ जय गंगे माता, मैया जय गंगे माता ।\nजो नर तुमको ध्यावत, मनवांछित फल पाता ॥\nचन्द्र सी ज्योति तुम्हारी, जल की धारा सुंदर ।\nपाप निवारिणी गंगा, हे माता सुखकर ॥",
        transliteration: "Om Jai Gange Mata, Maiya Jai Gange Mata |\nJo Nar Tumako Dhyaavata, Manavaanchhit Phal Paata ||\nChandra See Jyoti Tumhaaree, Jal Kee Dhaara Sundar |\nPaap Nivaarinee Ganga, He Mata Sukha-kar ||",
        translation: "Om! Victory to Mother Ganga, the celestial river of absolute purification. Whoever bathes in your stream or remembers your name receives ultimate rejuvenation. Your flow is bright like moonlight, washing away all sins."
      }
    ],
    commentary: "Worshipping the nine Goddesses (Shakti) symbolizes a step-by-step evolution of consciousness. Initiating with raw strength (Durga), proceeding to harvest resource stability (Lakshmi), purifying our intellectual discernment (Saraswati), and culminating in non-dual cosmic dissolution (Kali), Shakti yoga restores complete physical and mental balance."
  },
  7: {
    introSummary: "Om Jai Jagdish Hare is the ultimate universal temple aarti in Hinduism, composed by Pandit Shardha Ram Phillauri. It is a heartfelt prayer of complete surrender and devotion to the Lord of the Universe (Vishnu).",
    verses: [
      {
        number: "Verse 1",
        originalText: "ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे ।\nभक्त जनों के संकट, क्षण में दूर करे ॥",
        transliteration: "Om Jai Jagdish Hare, Swami Jai Jagdish Hare |\nBhakta Janon Ke Sankat, Kshan Mein Door Kare ||",
        translation: "Om! Victory to the Sovereign Lord of the entire Universe! Who instantly and completely dispels the heavy distresses, fears, and obstacles of his earnest devotees in a fraction of a second."
      },
      {
        number: "Verse 2",
        originalText: "जो ध्यावे फल पावे, दुःख बिनसे मन का ।\nसुख सम्पत्ति घर आवे, कष्ट मिटे तन का ॥",
        transliteration: "Jo Dhyaave Phal Paave, Dukh Binse Man Ka |\nSukh Sampatti Ghar Aave, Kasht Mite Tan Ka ||",
        translation: "Whoever sings your devotional praise obtains beautiful fruits of wisdom, and their mental grief is dissolved. Peace, joy, and spiritual prosperity flow to their homes, and physical ailments are completely healed."
      },
      {
        number: "Verse 3",
        originalText: "मात-पिता तुम मेरे, शरण गूँ किसकी ।\nतुम बिन और न दूजा, आस करूँ जिसकी ॥",
        transliteration: "Maat-Pita Tum Mere, Sharan Gahun Kiskee |\nTum Bin Aur Na Dooja, Aas Karoon Jiskee ||",
        translation: "You are my ultimate mother and father; what other shelter should I seek? There is none else besides You in whom I lay my confidence and hope."
      },
      {
        number: "Verse 4",
        originalText: "तुम पूरन परमात्मा, तुम अन्तर्यामी ।\nपारब्रह्म परमेश्वर, तुम सब के स्वामी ॥",
        transliteration: "Tum Pooran Paramaatma, Tum Antaryaamee |\nPaarabrahma Paramesvar, Tum Sab Ke Svaamee ||",
        translation: "You are the complete, perfect Supreme Soul; You are the inner Knower residing within every biological cell (Antaryami). You are the absolute transcendental Brahman, the Sovereign Creator of all."
      },
      {
        number: "Verse 5",
        originalText: "तुम करुणा के सागर, तुम पालनकर्ता ।\nमैं मूरख खल कामी, कृपा करो भर्ता ॥",
        transliteration: "Tum Karuna Ke Saagar, Tum Paalankarta |\nMain Moorakh Khal Kaamee, Kripa Karo Bharta ||",
        translation: "You are a vast, infinite ocean of compassion, the ultimate caretaker of all life. I am simple, ignorant, and trapped in sensory desires; O Lord, protect and nourish me with Your kind grace."
      },
      {
        number: "Verse 6",
        originalText: "तुम हो एक अगोचर, सब के प्राणपति ।\nकिस विधि मिलूँ दयामय, तुमको मैं कुमति ॥",
        transliteration: "Tum Ho Ek Agochar, Sab Ke Praanapati |\nKis Vidhi Miloon Dayaamay, Tumako Main Kumati ||",
        translation: "You are the one unmanifested Spirit, beyond the grasp of sensory organs, yet the vital breath of all living creatures. How should a simplistic mind like mine understand how to merge into Your presence, O Merciful Lord?"
      },
      {
        number: "Verse 7",
        originalText: "दीनबन्धु दुःखहर्ता, तुम ठाकुर मेरे ।\nअपने हाथ उठाओ, द्वार खड़ा तेरे ॥",
        transliteration: "Deenabandhu Duhkhaharta, Tum Thaakur Mere |\nApane Haath Uthaao, Dvaar Khada Tere ||",
        translation: "You are the protector of the helpless, the destroyer of physical and mental sorrow. You are my true master. Please lift Your blessings hand over me, who stands respectfully at Your gateway."
      },
      {
        number: "Verse 8",
        originalText: "विषय-विकार मिटाओ, पाप हरो देवा ।\nश्रद्धा-भक्ति बढ़ाओ, सन्तन की सेवा ॥",
        transliteration: "Vishay-Vikaar Mitaao, Paap Haro Deva |\nShraddha-Bhakti Badhaao, Santan Kee Seva ||",
        translation: "Please clear our sensory distractions, remove our negative thoughts, and lead us out of worldly desires, O Divine Lord! Enhance our deep earnest trust and devotion, and direct our hands to serve saints and humanity."
      },
      {
        number: "Verse 9",
        originalText: "तन-मन-धन सब है तेरा, स्वामी सब कुछ है तेरा ।\nतेरा तुझको अर्पण, क्या लागे मेरा ॥",
        transliteration: "Tan-Man-Dhan Sab Hai Tera, Swami Sab Kuch Hai Tera |\nTera Tujhako Arpan, Kya Laage Mera ||",
        translation: "This physical body, this mind, and all worldly assets belong entirely to You, O Lord. Everything is Yours. Offering back to You what is already Yours; what is there that I can proudly claim as mine?"
      }
    ],
    commentary: "Om Jai Jagdish Hare represents the pinnacle of Sharanagati (complete spiritual surrender). Its closing lines encapsulate absolute non-attachment: recognizing that since our biological body and earthly assets are temporary gifts from the universe, clinging to them causes suffering. Surrendering ownership cleanses the heart, bringing instant peace."
  },
  8: {
    introSummary: "The Maha Mrityunjaya Mantra is a life-giving cosmic prayer dedicated to Lord Shiva, found in the Rigveda (7.59.12). It is chanted to overcome fears of death, illnesses, and attachments.",
    verses: [
      {
        number: "Mantra 1",
        originalText: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥",
        transliteration: "Om Tryambakam Yajaamahe Sugandhim Pushti-Vardhanam |\nUrvaarukum-Iva Bandhanaan Mrityor Muksheeya Maa'mritaat ||",
        translation: "We worship the three-eyed Lord Shiva, who is fragrant and nourishes all beings. May he liberate us from the bondage of death and lead us to immortality, just as a ripe cucumber is effortlessly separated from its vine."
      }
    ],
    commentary: "This ancient mantra shields the devotee's mind from fear of transition, utilizing a beautiful metaphor of the cucumber ripening and slipping naturally from the branch."
  },
  9: {
    introSummary: "The Shree Ganesh Mantra & Shlok is the primary auspicious invocation from the Puranas dedicated to Lord Ganesha, chanted at the beginning of tasks and ceremonies to remove all physical and spiritual obstacles.",
    verses: [
      {
        number: "Shlok 1",
        originalText: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
        transliteration: "Vakratunda Mahakaya Suryakoti Samaprabha |\nNirvighnam Kuru Me Deva Sarva-Kaaryeshu Sarvada ||",
        translation: "O Lord Ganesha of curved trunk and massive body, whose brilliance is equal to millions of suns! Please remove all obstacles from my path in all my endeavors, forever."
      },
      {
        number: "Mantra 2",
        originalText: "ॐ गं गणपतये नमः ॥",
        transliteration: "Om Gam Ganapataye Namah ||",
        translation: "Om, I bow down to the Lord of all Ganas (heavenly attendants), the destroyer of obstacles."
      }
    ],
    commentary: "Universally chanted at the commencement of any spiritual ceremony, study, or project, this sacred prayer evokes Lord Ganesha to purify the pathway. It guides the intellect to overcome difficulties with sweet determination and poise."
  },
  10: {
    introSummary: "Composed by spiritual master Adi Shankaracharya, this powerful stotram sings praises of Lord Shiva, centering on the five sacred syllables: Na-Ma-Shi-Va-Ya (Panchakshara). Recited daily to purify the body and mind.",
    verses: [
      {
        number: "Verse 1",
        originalText: "नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय ।\nनित्याय शुद्धाय दिगम्बराय तस्मै नकाराय नमः शिवाय ॥",
        transliteration: "Nagendra-Haaraya Trilochanaya Bhasmanga-Raagaya Maheshvaraya |\nNityaaya Shuddhaaya Digambaraya Tasmai Nakaaraya Namah Shivaaya ||",
        translation: "Salutations to Shiva, who has the king of snakes as His garland, who has three eyes, whose body is smeared with sacred ashes, and who is the supreme Lord. Eternal, absolutely pure, and clad in directions (digambara), bow to Him represented by the letter 'Na'."
      },
      {
        number: "Verse 2",
        originalText: "मन्दाकिनीसलिलचन्दनचर्चिताय नन्दीश्वरप्रमथनाथमहेश्वराय ।\nमन्दारपुष्पबहुपुष्पसुपूजिताय तस्मै मकाराय नमः शिवाय ॥",
        transliteration: "Mandaakinee-Salila-Chandana-Charchitaaya Nandeeshvara-Pramatha-Naatha-Maheshvaraya |\nMandaara-Pushpa-Bahu-Pushpa-Supoojitaaya Tasmai Makaaraya Namah Shivaaya ||",
        translation: "Smeared with the waters of Mandakini river and sandalpaste, worshipped by Nandi and other celestial beings, and adorned with Mandara flowers, bow to Him represented by the letter 'Ma'."
      },
      {
        number: "Verse 3",
        originalText: "शिवाय गौरीवदनाब्जवृन्दसूर्याय दक्षाध्वरनाशकाय ।\nश्रीनीलकण्ठाय वृषध्वजाय तस्मै शिकाराय नमः शिवाय ॥",
        transliteration: "Shivaaya Gauree-Vadanaabja-Vrinda-Sooryaaya Daksha-Adhvara-Naashakaaya |\nShree-Neelakanthaaya Vrishadhvajaaya Tasmai Shikaaraaya Namah Shivaaya ||",
        translation: "Bow to Shiva, who is the auspicious sunrise for the lotus face of Mother Gauri, the destroyer of Daksha's egoic sacrifice. Blue-throated (Neelakantha) and riding the bull signet, bow to Him represented by the letter 'Shi'."
      },
      {
        number: "Verse 4",
        originalText: "वसिष्ठकुम्भोद्भवगौतमार्यमुनीन्द्रदेवार्चितशेखराय ।\nचन्द्रार्कवैश्वानरलोचनाय तस्मै वकाराय नमः शिवाय ॥",
        transliteration: "Vasishtha-Kumbhodbhava-Gautama-Aarya-Muneendra-Deva-Archita-Shekharaaya |\nChandra-Arka-Vaishvaanara-Lochanaaya Tasmai Vakaaraya Namah Shivaaya ||",
        translation: "Worshipped by supreme sages like Vasishtha, Agastya, and Gautama, and crowned by the assemblies of devas; having the Sun, Moon, and Fire as His three eyes, bow to Him represented by the letter 'Va'."
      },
      {
        number: "Verse 5",
        originalText: "यक्षस्वरूपाय जटाधराय पिनाकहस्ताय सनातनाय ।\nदिव्याय देवाय दिगम्बराय तस्मै यकाराय नमः शिवाय ॥",
        transliteration: "Yaksha-Swaroopaaya Jataadharaaya Pinaka-Hastaaya Sanaatanaaya |\nDivyaaya Devaaya Digambaraaya Tasmai Yakaaraya Namah Shivaaya ||",
        translation: "Who assumes the form of a Yaksha (spiritual protector), who has matted locks, who holds the Pinaka bow in His hands, and who is eternal. Radiant, divine Spirit clad in the directions, bow to Him represented by the letter 'Ya'."
      },
      {
        number: "Verse 6",
        originalText: "पञ्चाक्षरमिदं पुण्यं यः पठेच्छिवसन्निधौ ।\nशिवलोकमवाप्नोति शिवेन सह मोदते ॥",
        transliteration: "Panchaksharam-Idam Punyam Yah Pathech-Shiva-Sannidhau |\nShivalokam-Avaapnoti Shivena Saha Modate ||",
        translation: "Whoever recites this holy Panchakshara hymn in the proximity of Lord Shiva, achieves the divine realm of Shiva (Shivaloka) and rejoices in everlasting bliss with Him."
      }
    ],
    commentary: "The Panchakshara is the sound representation of Shiva's five aspects of cosmic operations: creation, preservation, destruction, concealing grace, and revealing grace. Reciting it purifies the five senses and aligns our internal micro-habitat with macro-cosmic law."
  },
  11: {
    introSummary: "An eight-verse hymn from the Padma Purana chanted to praise Goddess Lakshmi, the primary embodiment of spiritual wealth, luxury, prosperity, and auspicious beauty.",
    verses: [
      {
        number: "Verse 1",
        originalText: "नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते ।\nशङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Namastes-tu Mahaamaye Shree-peethe Surapoojite |\nShankha-chakra-gadaa-haste Mahaalakhshmi Namostu Te ||",
        translation: "Salutations to You, O Mahamaya (the Great Illusionist), who dwells on the sacred throne of Shri, and is worshipped by all the deities. You hold the conch, discus, and mace in Your hands; O Lordly Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 2",
        originalText: "नमस्ते गरुडारूढे कोलासुरभयंकरि ।\nसर्वपापहरे देवि महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Namaste Garuda-aroodhe Kola-asura-bhayankari |\nSarva-paapa-hare Devi Mahaalakhshmi Namostu Te ||",
        translation: "Salutations to You who rides the celestial eagle (Garuda) and who dispels the fear of the demon Kola. Destroyer of all sins, O Goddess Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 3",
        originalText: "सर्वज्ञे सर्ववरदे सर्वदुष्टभयंकरि ।\nसर्वदुःखहरे देवि महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Sarvajne Sarva-varade Sarva-dushta-bhayankari |\nSarva-duhkha-hare Devi Mahaalakhshmi Namostu Te ||",
        translation: "Salutations to You, O knower of all things, who bestows all boons, and who dispels the fear of all wicked forces. Destroyer of all miseries, O Goddess Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 4",
        originalText: "सिद्धिबुद्धिप्रदे देवि भुक्तिमुक्तिप्रदायिनि ।\nमन्त्रपूते सदा देवि महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Siddhi-Buddhi-Prade Devi Bhukti-Mukti-Pradaayini |\nMantra-Poote Sada Devi Mahaalakhshmi Namostu Te ||",
        translation: "O Goddess, who bestows spiritual achievements (Siddhi) and intellect (Buddhi), who grants both worldly enjoyment (Bhukti) and ultimate liberation (Mukti). Always purified by sacred mantras, O Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 5",
        originalText: "आद्यन्तरहिते देवि आद्यशक्ते महेश्वरि ।\nयोगजे योगसम्भूते महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Aadyanta-Rahite Devi Aadya-Shakte Maheshvari |\nYogaje Yoga-Sambhoote Mahaalakhshmi Namostu Te ||",
        translation: "O Goddess, who has no beginning or end, the primal energy of the cosmos (Adya-Shakti), the supreme sovereign. Born of Yoga and originating from deep meditation, O Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 6",
        originalText: "स्थूलसूक्ष्ममहारौद्रे महाशक्तिमहोदरे ।\nमहापापहरे देवि महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Sthoola-Sookshma-Mahaaraudre Mahaashakti-Mahodare |\nMahaapaapa-Hare Devi Mahaalakhshmi Namostu Te ||",
        translation: "Manifesting in both physical (gross) and spiritual (subtle) forms, a terrifying force of transformation yet possessing a vast womb of creation. Absolute cleanser of all heavy mistakes, O Goddess Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 7",
        originalText: "पद्मासनस्थिते देवि परब्रह्मस्वरूपिणि ।\nपरमेशि जगन्मातर्महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Padmaasna-Sthite Devi Parabrahma-Swaroopini |\nParameshi Jagan-maatar-Mahaalakhshmi Namostu Te ||",
        translation: "Seated elegantly on a full-blown lotus flower, You are the direct embodiment of the ultimate consciousness (Parabrahma). Supreme ruler, divine Mother of the entire universe, O Goddess Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 8",
        originalText: "श्वेताम्बरधरे देवि नानालङ्कारभूषिते ।\nजगत्स्थिते जगन्मातर्महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Shvetaambardhare Devi Nanaalankaar-Bhooshite |\nJagat-Sthite Jagan-maatar-Mahaalakhshmi Namostu Te ||",
        translation: "Dressed in spotless white garments, adorned with magnificent gems and colorful decorations. Supporting the entire cosmic platform, divine Mother, O Goddess Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 9",
        originalText: "महालक्ष्म्यष्टकं स्तोत्रं यः पठेद्भक्तिमान्नरः ।\nसर्वसिद्धिमवाप्नोति राज्यं प्राप्नोति सर्वदा ॥",
        transliteration: "Mahaalakhshmy-ashtakam Stotram Yah Pathed-Bhaktimaan-Narah |\nSarva-siddhim-avaapnoti Raajyam Praapnoti Sarvada ||",
        translation: "Sincere seekers who regularly recite this Mahalakshmi Ashtakam stotra with deep devotion obtain all spiritual successes and sovereign abundance forever."
      }
    ],
    commentary: "According to Vedic tradition, Lakshmi represents both physical prosperity (dhana) and inner values (vibhuti). The stotram teaches that prosperity is a divine energy that must be worshiped with purity and integrity to remain sustainable and auspicious."
  },
  12: {
    introSummary: "Sourced from Narada Purana, this prayer lists twelve auspicious names of Ganesha, chanted to remove obstacles, hardships and gain mental peace.",
    verses: [
      {
        number: "Verse 1",
        originalText: "प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम् ।\nभक्तावासं स्मरेन्नित्यमायुःकामार्थसिद्धये ॥",
        transliteration: "Pranamya Shirasa Devam Gauriputram Vinayakam |\nBhaktavasam Smaren-Nityam-Ayuh-Kaamartha-Siddhaye ||",
        translation: "Bowing down his head, the devotee should daily remember Gauri's son Lord Vinayaka, who resides in the hearts of His devotees, for obtaining long life, deep desires, and prospective prosperity."
      },
      {
        number: "Verse 2",
        originalText: "प्रथमं वक्रतुण्डं च एकदन्तं द्वितीयकम् ।\nतृतीयं कृष्णपिङ्गाक्षं गजवक्त्रं चतुर्थकम् ॥",
        transliteration: "Prathamam Vakratundam Cha Ekadantam Dvitiyakam |\nTritiyam Krishna-Pingaksham Gaja-Vaktram Chaturthakam ||",
        translation: "First, He is called Curved-Trunk (Vakratunda); second, Single-Tusked (Ekadanta); third, Dark-Red-Eyed (Krishna-Pingaksha); and fourth, Elephant-Headed (Gajavaktra)."
      },
      {
        number: "Verse 3",
        originalText: "लम्बोदरं पञ्चमं च षष्ठं विकटमेव च ।\nसप्तमं विघ्नराजेन्द्रं धूम्रवर्णं तथाष्टमम् ॥",
        transliteration: "Lambodaram Panchamam Cha Shashtham Vikatam-Eva Cha |\nSaptamam Vighnarajendram Dhumravarnam Tathashtamam ||",
        translation: "Fifth, He is the Pot-Bellied (Lambodara); sixth, the Formidable (Vikata); seventh, Ruler of Obstacles (Vighnarajendra); and eighth, Smoke-Colored (Dhumravarna)."
      },
      {
        number: "Verse 4",
        originalText: "नवमं भालचन्द्रं च दशमं तु विनायकम् ।\nएकादशं गणपतिं द्वादशं तु गजाननम् ॥",
        transliteration: "Navamam Bhalachandram Cha Dashamam Tu Vinayakam |\nEkadasham Ganapatim Dvadasham Tu Gajananam ||",
        translation: "Ninth, He is the Moon-Crowned (Bhalachandra); tenth, the Great Leader (Vinayaka); eleventh, Lord of the Divine Attendants (Ganapati); and twelfth, Elephant-Face (Gajanana)."
      },
      {
        number: "Verse 5",
        originalText: "द्वादशैतानि नामानि त्रिसन्ध्यं यः पठेन्नरः ।\nन च विघ्नभयं तस्य सर्वसिद्धिकरं परम् ॥",
        transliteration: "Dvaadashaitaani Naamaani Trisandhyam Yah Pathen-Narah |\nNa Cha Vighna-Bhayam Tasya Sarva-Siddhikaram Param ||",
        translation: "A person who recites these twelve names at dawn, noon, and dusk will have no fear of obstacles, and will achieve all spiritual and material success."
      },
      {
        number: "Verse 6",
        originalText: "विद्यार्थी लभते विद्यां धनार्थी लभते धनम् ।\nपुत्रार्थी लभते पुत्रं मोक्षार्थी लभते गतिम् ॥",
        transliteration: "Vidyaarthee Labhate Vidyaam Dhanaarthee Labhate Dhanam |\nPutraarthee Labhate Putram Mokshaarthee Labhate Gatim ||",
        translation: "One who seeks knowledge will obtain knowledge, one who seeks wealth will obtain wealth, one who seeks children will be blessed with children, and one who seeks liberation will find spiritual path."
      },
      {
        number: "Verse 7",
        originalText: "जपेद्गणपतिस्तोत्रं षड्भिर्मासैः फलं लभेत् ।\nसंवत्सरेण सिद्धिं च लभते नात्र संशयः ॥",
        transliteration: "Japed-Ganapati-Stotram Shadbhirmasaih Phalam Labhet |\nSamvatsarena Siddhim Cha Labhete Naatra Sanshayah ||",
        translation: "Upon chanting this Ganapati stotram regularly, one starts receiving positive benefits within six months; and within one year, complete success is attained, of this there is no doubt."
      },
      {
        number: "Verse 8",
        originalText: "अष्टेभ्यो ब्राह्मणेभ्यश्च लिखित्वा यः समर्पयेत् ।\nतस्य विद्या भवेत्सर्वा गणेशस्य प्रसादतः ॥",
        transliteration: "Ashtebhyo Braahmanebhyash-cha Likhitvaa Yah Samarpayet |\nTasya Vidya Bhavet-Sarva Ganeshasya Prasaadatah ||",
        translation: "Whosoever writes this stotram and offers it to eight scriptures/learned ones will obtain absolute wisdom and learning through the divine grace of Lord Ganesha."
      }
    ],
    commentary: "Daily chanting of these twelve sovereign names of Lord Ganesha at sunrise, noon, and sunset removes all obstacles, grants academic and intellectual excellence, and ensures peace and prosperity in all endeavors."
  },
  13: {
    introSummary: "Composed by Adi Shankaracharya to invoke Goddess Lakshmi, this prayer moved her to rain down golden gooseberries to relieve a poor woman's poverty.",
    verses: [
      {
        number: "Verse 1",
        originalText: "अङ्गं हरेः पुलकभूषणमाश्रयन्ती\nभृङ्गाङ्गनेव मुकुलाभरणं तमालम् ।\nअङ्गीकृताखिलविभूतिरपांगलीला\nमांगल्यदास्तु मम मन्मथदेवतायाः ॥",
        transliteration: "Angam Hareh Pulaka-Bhushanam-Ashrayantee\nBhriganganeva Mukulabharanam Tamalam |\nAngeekritakhila-Vibhootir-Apanga-Leela\nMangalyadastu Mama Manmatha-Devatayah ||",
        translation: "Just as a female bee surrounds the fresh flower buds of a dark Tamala tree, Goddess Lakshmi’s sidelong glances rest charmingly upon Lord Hari's thrilled, ecstatic body. May those auspicious glances, containing all cosmic treasures, bestow supreme blessings upon my life."
      },
      {
        number: "Verse 2",
        originalText: "मुग्धा मुहुर्विदधती वदने मुरारेः\nप्रेमत्रपाप्रणिहितानि गतागतानि ।\nमाला दृशोर्मधुकरीव महोत्पले या\nसा मे श्रियं दिशतु सागरसम्भवायाः ॥",
        transliteration: "Mugdha Muhur-Vidadhatee Vadane Murareh\nPrematrapapranihitani Gatagatani |\nMala Drishor-Madhukareeva Mahotpale Ya\nSa Me Shriyam Dishatu Sagara-Sambhavayah ||",
        translation: "Like a honeybee humming back and forth over a magnificent blue lotus, Her eyes dart shyly towards the sweet face of Murari, full of love and modest grace. May that sweet gaze of Goddess Lakshmi, daughter of the ocean, guide abundant streams of prosperity to me."
      },
      {
        number: "Verse 3",
        originalText: "दद्याद्दयानुपवनो द्रविणाम्बुधाराम्\nअस्मिन्नकिञ्चनविहङ्गशिशौ विषण्णें ।\nदुष्कर्मघर्ममपनीय चिराय दूरं\nनारायणप्रणयिनीनयनाम्वुवाहः ॥",
        transliteration: "Dadyad-Dayanupavano Dravinambhudharam\nAsminn-Akinchana-Vihanga-Shishau Vishanne |\nDushkarma-Gharmam-Apaneeya Chiraya Dooram\nNarayana-Pranayinee-Nayanambu-Vaahah ||",
        translation: "I am like a helpless young bird scorched by the hot summer of past bad deeds. May the shower-carrying cloud of the eyes of Goddess Lakshmi, beloved of Narayana, driven by the gentle breeze of Her compassion, pour a beautiful stream of gold to refresh my life."
      },
      {
        number: "Verse 4",
        originalText: "कालाम्बुदालिललितोरसि कैटभारेः\nधाराधरे स्फुरति या तटिदेव भूम्ना ।\nमातुः समस्तजगतां महनीयमूर्तिः\nभद्राणि मे दिशतु भार्गवनन्दिनायाः ॥",
        transliteration: "Kaalaambudaali-Lalitorasi Kaitabhareh\nDhaaradhare Sphurati Ya Tatideva Bhoomna |\nMaatuh Samasta-Jagataam Mahaneeya-Moortih\nBhadraani Me Dishatu Bhaargava-Nandinaayaah ||",
        translation: "Like a brilliant flash of lightning dancing across dark, heavy rain clouds, Her radiant form sparkles on the handsome chest of Kaitabhari (Lord Vishnu). May that graceful, universally revered form of Goddess Lakshmi, daughter of Sage Bhrigu, confer auspicious well-being on my life."
      },
      {
        number: "Verse 5",
        originalText: "प्राप्तं पदं प्रथमतः किल यत्प्रभावात्\nमांगल्यभाजि मधुमथिनि मन्मथेन ।\nमय्यापतेत्तदिह मन्थरमीक्षणार्धं\nमन्दालसं च मकरालयकन्यकायाः ॥",
        transliteration: "Praaptam Padam Prathamatah Kila Yat-Prabhaavaat\nMaangalyabhaaji Madhumathini Manmathena |\nMayyaapatet-Tadiha Mantharam-Eekshanaardham\nMandaalasam Cha Makaraalaya-Kanyakaayaah ||",
        translation: "Thanks to whose gracious glances, Kama (god of love) obtained his prime seat in Lord Madhusudana's heart. May that half-closed, gentle, and tender gaze of Goddess Lakshmi, daughter of the ocean, fall compassionately upon me."
      },
      {
        number: "Verse 6",
        originalText: "विश्वामरेन्द्रपदविभ्रमदानदक्षं\nआनन्दहेतुरधिकं मुरविद्विषोऽपि ।\nईषन्निषीदतु मयि क्षणमीक्षणार्धम्\nइन्दीवरोदरसहोदरमिन्दिरायाः ॥",
        transliteration: "Vishvaamarendra-Pada-Vibhrama-Daana-Daksham\nAananda-Hetur-Adhikam Muravidvisho-pi |\nEeshannisheedatu Mayi Kshanam-Eekshanaardham\nIndeevarodara-Sahodaram-Indiraayaah ||",
        translation: "Capable of instantly bestowing the sovereign throne of Indra (king of gods), and generating immense, ecstatic bliss even in the heart of Vishnu. May a fraction of that half-closed, dark blue lotus-like gaze of Goddess Indira rest upon me for a brief moment."
      },
      {
        number: "Verse 7",
        originalText: "इष्टाविशिष्टमतयोऽपि यया दयार्द्र-\nदृष्ट्या त्रिविष्टपपदं सुलभं लभन्ते ।\nदृष्टिः प्रहृष्टकमलोदरदीप्तिरिष्टां\nपुष्टिं कृषीष्ट मम पुष्करविष्टरायाः ॥",
        transliteration: "Ishta-Vishishta-Matayo-pi Yayaa Dayaardra-\nDrishtya Trivishtapa-Padam Sulabham Labhante |\nDrishtih Prahrishta-Kamalodara-Deeptir-Ishtaan\nPushtim Krisheeshta Mama Pushkara-Vishtaraayaah ||",
        translation: "Even simple-minded seekers easily attain the heavenly realms of gods under the influence of Her moisture-filled, compassionate glance. May that gaze, shining like the inside of a fully blossomed pink lotus, grant complete nourishment to my life."
      }
    ],
    commentary: "Kanakadhara literally means 'gold-shower'. The hymn teaches that true prosperity is an energetic state of grace that flows spontaneously into lives aligned with gratitude, purity, and absolute self-surrender."
  },
  14: {
    introSummary: "A solar anthem taught by Sage Agastya to Lord Rama on the battlefield of Lanka to help invocation of inner power, dissolving exhaustion and attaining absolute triumph.",
    verses: [
      {
        number: "Verse 1",
        originalText: "ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम् ।\nरावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम् ॥",
        transliteration: "Tato Yuddha-Parishrantam Samare Chintaya Sthitam |\nRavanam Chagrato Drishtva Yuddhaya Samupasthitam ||",
        translation: "Seeing Lord Rama completely fatigued and standing deep in contemplating thoughts on the fierce battlefield, while the demon king Ravana stood fully prepared in front of Him for the combat."
      },
      {
        number: "Verse 2",
        originalText: "दैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम् ।\nउपागम्याब्रवीद्राममगमस्त्यो भगवान् ऋषिः ॥",
        transliteration: "Daivataish-cha Samagamya Drashtum-Abhyagato Ranam |\nUpagamyabraveed-Ramam-Agastyo Bhagavan Rishih ||",
        translation: "The revered Sage Agastya, who had gathered along with other celestial demigods to witness the cosmic duel, stepped forward, approached Lord Rama, and spoke these powerful words."
      },
      {
        number: "Verse 3",
        originalText: "राम राम महाबाहो शृणु गुह्यं सनातनम् ।\nयेन सर्वानरीन् वत्स समरे विजयिष्यसे ॥",
        transliteration: "Rama Rama Mahaabaho Shrinuri Guhyam Sanatanam |\nYena Sarvan-Areen Vatsa Samare Vijayishyase ||",
        translation: "'O Rama, O mighty-armed hero! Please listen attentively to this ancient, most confidential, eternal secret, through which you will comfortably conquer all your internal and external enemy forces on the battlefield.'"
      },
      {
        number: "Verse 4",
        originalText: "आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् ।\nजयावहं जपेन्नित्यमक्षय्यं परमं शिवम् ॥",
        transliteration: "Aditya-Hrudayam Punyam Sarva-Shatru-Vinashanam |\nJayavaham Japen-Nityam-Akshayyam Paramam Shivam ||",
        translation: "'This supreme prayer is called the Aditya Hrudayam (the Heart of the Sun). It is holy, brings absolute victory, eliminates all doubts/enemies, is imperishable, and bestows supreme peace and auspiciousness when chanted daily.'"
      },
      {
        number: "Verse 5",
        originalText: "सर्वमंगलमंगल्यं सर्वपापप्रणाशनम् ।\nचिंताशोकप्रशमनं आयुर्वर्धनमुत्तमम् ॥",
        transliteration: "Sarva-mangala-mangalyam Sarva-paapa-pranaashanam |\nChinta-shoka-prashamanam Aayur-vardhanam-uttamam ||",
        translation: "'It is the most auspicious amongst all that is auspicious, the destroyer of all sins, the dispeller of all dark anxieties and sorrows, and the bestower of long, healthy, and vital life.'"
      },
      {
        number: "Verse 6",
        originalText: "रश्मिमन्तं समुद्यन्तं देवासुरनमस्कृतम् ।\nपूजयस्व विवस्वन्तं भास्करं भुवनेश्वरम् ॥",
        transliteration: "Rashmimantam Samudyantam Deva-Asura-Namaskritam |\nPoojayasva Vivasvantam Bhaaskaram Bhuvaneshvaram ||",
        translation: "'Worship the sun-god, Vivasvan, the creator of light, who is brilliant with golden rays, who rises majestically at dawn, who is worshipped by both gods and demons, and who is the lord of this universe.'"
      },
      {
        number: "Verse 7",
        originalText: "सर्वदेवात्मको ह्येष तेजस्वी रश्मिभावनः ।\nएष देवासुरगणान् लोकान् पाति गभस्तिभिः ॥",
        transliteration: "Sarva-devaatmako Hy-esha Tejasvee Rashmi-bhaavanah |\nEsha Deva-asura-ganaan Lokaan Paati Gabhastibhih ||",
        translation: "'He contains all the deities in his cosmic soul, is highly radiant, and creates life with his heat and golden rays. He protects and nourishes all the worlds of gods, demons, and humans with his light.'"
      },
      {
        number: "Verse 8",
        originalText: "नक्षत्रग्रहताराणामधिपो विश्वभावनः ।\nतेजसामपि तेजस्वी द्वादशात्मन् नमोऽस्तु ते ॥",
        transliteration: "Nakshatra-graha-taaraanaam-adhipo Vishva-bhaavanah |\nTejasam-api Tejasvee Dvaadashaatman Namostu Te ||",
        translation: "'He is the lord of all stars, planets, and constellations, the husband of the cosmos, the light of all lights, manifesting in twelve monthly solar aspects (Adityas). Salutations to You!'"
      }
    ],
    commentary: "The Aditya Hrudayam is a highly revered tool for self-realization, robust physical health, and razor-sharp intellect. Daily recitation builds clean leadership qualities, courage and dissolves dark anxieties."
  },
  15: {
    introSummary: "Composed by Vallabhacharya, this sweet eight-verse octet celebrates the sweet, charming nectar-aspects of Lord Krishna, declaring everything associated with him to be pure sweetness.",
    verses: [
      {
        number: "Verse 1",
        originalText: "अधरं मधुरं वदनं मधुरं नयनं मधुरं हसितं मधुरम् ।\nहृदयं मधुरं गमनं मधुरं मधुराधिपतेरखिलं मधुरम् ॥",
        transliteration: "Adharam Madhuram Vadanam Madhuram Nayanam Madhuram Hasitam Madhuram |\nHridayam Madhuram Gamanam Madhuram Madhuradhipater-Akhilam Madhuram ||",
        translation: "His lips are sweet, His face is sweet, His eyes are sweet, His smile is charmingly sweet. His heart is sweet, His gait is sweet; absolutely everything about the Emperor of Sweetness is sweet!"
      },
      {
        number: "Verse 2",
        originalText: "वचनं मधुरं चरितं मधुरं वसनं मधुरं वलितं मधुरम् ।\nचलितं मधुरं भ्रमितं मधुरं मधुराधिपतेरखिलं मधुरम् ॥",
        transliteration: "Vachanam Madhuram Charitam Madhuram Vasanam Madhuram Valitam Madhuram |\nChalitam Madhuram Bhramitam Madhuram Madhuradhipater-Akhilam Madhuram ||",
        translation: "His words are sweet, His character is sweet, His garments are sweet, His graceful posture is sweet. His movement is sweet, His wandering is sweet; absolutely everything about the Emperor of Sweetness is sweet!"
      },
      {
        number: "Verse 3",
        originalText: "वेणुर्मधुरो रेणुर्मधुरः पाणिर्मधुरः पादौ मधुरौ ।\nनृत्यं मधुरं सख्यं मधुरं मधुराधिपतेरखिलं मधुरम् ॥",
        transliteration: "Venur-Madhuro Renur-Madhurah Panir-Madhurah Paadau Madhurau |\nNrityam Madhuram Sakhyam Madhuram Madhuradhipater-Akhilam Madhuram ||",
        translation: "His flute is sweet, His holy dust is sweet, His hands are sweet, His feet are sweet. His dancing is sweet, His loving friendship is sweet; absolutely everything about the Emperor of Sweetness is sweet!"
      },
      {
        number: "Verse 4",
        originalText: "गीतं मधुरं पीतं मधुरं भुक्तं मधुरं सुप्तं मधुरम् ।\nरूपं मधुरं तिलकं मधुरं मधुराधिपतेरखिलं मधुरम् ॥",
        transliteration: "Geetam Madhuram Peetam Madhuram Bhuktam Madhuram Suptam Madhuram |\nRoopam Madhuram Tilakam Madhuram Madhuradhipater-Akhilam Madhuram ||",
        translation: "His singing is sweet, His drinking is sweet, His eating is sweet, His sleeping is sweet. His form is sweet, His forehead mark (tilakam) is sweet; absolutely everything about the Emperor of Sweetness is sweet!"
      },
      {
        number: "Verse 5",
        originalText: "करणं मधुरं तरणं मधुरं हरणं मधुरं रमणं मधुरम् ।\nवमितं मधुरं शमितं मधुरं मधुराधिपतेरखिलं मधुरम् ॥",
        transliteration: "Karanam Madhuram Taranam Madhuram Haranam Madhuram Ramanam Madhuram |\nVamitam Madhuram Shamitam Madhuram Madhuradhipater-Akhilam Madhuram ||",
        translation: "His actions are sweet, His salvation (guiding across) is sweet, His capturing of hearts is sweet, His play is sweet. His expressions (sighs) are sweet, His peace-making is sweet; absolutely everything about the Emperor of Sweetness is sweet!"
      },
      {
        number: "Verse 6",
        originalText: "गुञ्जा मधुरा माला मधुरा यमुना मधुरा वीची मधुरा ।\nसलिलं मधुरं कमलं मधुरं मधुराधिपतेरखिलं मधुरम् ॥",
        transliteration: "Gunja Madhura Maala Madhura Yamuna Madhura Veechee Madhura |\nSalilam Madhuram Kamalam Madhuram Madhuradhipater-Akhilam Madhuram ||",
        translation: "His berry-pendant is sweet, His garland is sweet, the Yamuna river is sweet, its rippling waves are sweet. Its water is sweet, its lotuses are sweet; absolutely everything about the Emperor of Sweetness is sweet!"
      },
      {
        number: "Verse 7",
        originalText: "गोपी मधुरा लीला मधुरा युक्तं मधुरं मुक्तं मधुरम् ।\nदृष्टं मधुरं शिष्टं मधुरं मधुराधिपतेरखिलं मधुरम् ॥",
        transliteration: "Gopee Madhura Leela Madhura Yuktam Madhuram Muktam Madhuram |\nDrishtam Madhuram Shishtam Madhuram Madhuradhipater-Akhilam Madhuram ||",
        translation: "His gopis (cowherd maidens) are sweet, His play is sweet, His union is sweet, His liberation is sweet. His glance is sweet, His refined behavior is sweet; absolutely everything about the Emperor of Sweetness is sweet!"
      },
      {
        number: "Verse 8",
        originalText: "गोपा मधुरा गावो मधुरा यष्टिर्मधुरा सृष्टिर्मधुरा ।\nदलितं मधुरं फलितं मधुरं मधुराधिपतेरखिलं मधुरम् ॥",
        transliteration: "Gopa Madhura Gaavo Madhura Yashtir-Madhura Srishtir-Madhura |\nDalitam Madhuram Phalitam Madhuram Madhuradhipater-Akhilam Madhuram ||",
        translation: "His cowherd friends are sweet, His cows are sweet, His staff is sweet, His creation is sweet. His destruction (of demons) is sweet, His fulfillment (bestowing of fruits) is sweet; absolutely everything about the Emperor of Sweetness is sweet!"
      }
    ],
    commentary: "While other scriptures portray divinity with heavy rules and awe-striking grandeur, the Madhurashtakam celebrates the intimate, charming, and accessible sweetness of the divine, invoking absolute joy and unconditional love."
  },
  16: {
    introSummary: "A north Indian devotional temple song sung in adoration of Lord Krishna (Kunj Bihari), praising his divine cosmic plays and sweet flute melodies.",
    verses: [
      {
        number: "Refrain",
        originalText: "आरती कुञ्जबिहारी की, श्री गिरिधर कृष्णमुरारी की ॥\nआरती कुञ्जबिहारी की, श्री गिरिधर कृष्णमुरारी की ॥",
        transliteration: "Aarti Kunj Bihaari Kee, Shree Giridhar Krishna Muraari Kee ||\nAarti Kunj Bihaari Kee, Shree Giridhar Krishna Muraari Kee ||",
        translation: "We perform the sweet aarti of Lord Kunj Bihari, the divine lifter of Govardhana Hill, the enchanting Krishna Murari."
      },
      {
        number: "Verse 1",
        originalText: "गले में बैजन्ती माला, बजावै मुरली मधुर बाला ।\nश्रवण में कुण्डल झलकाला, नन्द के आनन्द नन्दलाला ॥",
        transliteration: "Gale Mein Baijanti Maala, Bajaavai Murali Madhur Baala |\nShravan Mein Kundal Jhalkaa-la, Nand Ke Aanand Nandlaala ||",
        translation: "Adorned with a woodland wildflower garland, He plays sweet melodies on His divine flute. Wearing brilliant earrings, He is the source of joy to Nanda, the precious son of Nanda."
      },
      {
        number: "Verse 2",
        originalText: "कनकमय मोर मुकुट बिलसै, देवता दरसन को तरसैं ।\nगगन सों सुमन बरसि रहै, बजति मुरचंग चंग सङ्ग सहनाई ॥",
        transliteration: "Kanakamaya Mora Mukuta Bilasai, Devataa Darasana Ko Tarasai |\nGagana Son Sumana Barasi Rahai, Bajati Murachanga Changa Sanga Shahanaai ||",
        translation: "The golden peacock crown shimmers on His head, and the demigods yearn to catch a glimpse of His beauty. Flowers rain down from the sky, accompanied by the sweet sounds of the harp, drums, and flutes."
      },
      {
        number: "Verse 3",
        originalText: "जहाँ से प्रगट भई गङ्गा, कलुष कलिहारिणी श्रीगङ्गा ।\nस्मरण किये होत मोह भङ्गा, बसति शिव जटा मुकुट के माहीं ॥",
        transliteration: "Jahaan Se Pragata Bhaee Gangaa, Kalusha Kalihaarinee Shree Gangaa |\nSmarana Kiye Hota Moha Bhangaa, Basati Shiva Jataa Mukuta Ke Maahee ||",
        translation: "From whose lotus feet emerged the holy river Ganges, the purifier of Kaliyuga's sins. Just remembering her dissolves all delusion, as she resides in the matted locks of Lord Shiva."
      },
      {
        number: "Verse 4",
        originalText: "कस्तूरी तिलक सोहै भाल, हिये मणि लाल डोलै कंठ माल ।\nवरद कर कंचन वंशी धरे, मंद हास्य अमित छवि सुंदर ॥",
        transliteration: "Kastoori Tilak Sohai Bhaal, Hiye Mani Laal Dolai Kanth Maal |\nVarad Kar Kanchan Vanshi Dhare, Mand Haasya Amit Chhavi Sundar ||",
        translation: "The fragrant musk (Kasturi) tilakam shines on his forehead, a red gemstone (Mani) sparkles on his chest, and his pearl garland sways. He holds the golden flute in his boon-giving hand, and his gentle smile radiates infinite, charming beauty."
      },
      {
        number: "Verse 5",
        originalText: "मुकट सिर मोर पंख सोहै, मुख मन्द हँसनि मन मोहै ।\nछवि सुन्दर ललित बिहारी की, श्री गिरिधर कृष्णमुरारी की ॥",
        transliteration: "Mukat Sir Mor Pankh Sohai, Mukh Mand Hansani Man Mohai |\nChhavi Sundar Lalit Bihaaree Kee, Shree Giridhar Krishna Muraari Kee ||",
        translation: "His crown is beautifully adorned with a peacock feather, and his soft, subtle smile completely captivates our mind. Such is the beautiful, enchanting image of Lord Kunj Bihari, the divine Krishna Murari."
      }
    ],
    commentary: "Aarti Kunj Bihari Ki is sang with huge joy, rhythmic clapping, and devotion. It teaches that the supreme spirit isn't far, but plays as a playful cowherd in the sweet gardens of Vrindavan."
  }
};
