/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HINDU_PRAYERS_FULL_DATA } from "./hinduPrayersData";

export interface VerseLine {
  number: string;
  original: string; // Sanskrit/Hindi
  originalText?: string; // Optional/Fallback script
  transliteration: string; // Romanized
  translation: string; // English
}

export interface DevotionalHymn {
  key: string;
  title: string;
  originalTitle: string;
  deity: string;
  intro: string;
  verses: VerseLine[];
  commentary: string;
}

// Full anthology data exported cleanly
export const ANTHOLOGY_DATA: Record<string, DevotionalHymn> = {
  hanuman_chalisa: {
    key: "hanuman_chalisa",
    title: "Sri Hanuman Chalisa",
    originalTitle: "श्री हनुमान चालीसा",
    deity: "Lord Hanuman",
    intro: "Composed by 16th-century saint Goswami Tulsidas in the Awadhi language, the Hanuman Chalisa is a forty-one verse prayer praising the courage, power, intellect, and supreme devotion of Hanuman.",
    verses: [
      {
        number: "Doha 1",
        original: "श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि ।\nबरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥",
        transliteration: "Shri Guru Charan Saroj Raj, Nij Manu Mukuru Sudhaari |\nBaranaun Raghuvar Bimal Jasu, Jo Daayaku Phal Chaari ||",
        translation: "Having purified the mirror of my mind with the dust of the lotus feet of the Divine Guru, I sing the untarnished glory of the chief of Raghu's clan (Lord Rama), who bestows the four ultimate fruits of life: Dharma, Artha, Kama, and Moksha."
      },
      {
        number: "Doha 2",
        original: "बुद्धिहीन तनु जानिके सुमिरौ पवन-कुमार ।\nबल बुधि बिद्या देहु मोहिं हरहु कलेस बिकार ॥",
        transliteration: "Budhiheen Tanu Jaanike, Sumiraun Pavan-Kumaar |\nBal Budhi Bidya Dehu Mohim, Harahu Kales Bikaar ||",
        translation: "Knowing myself to be devoid of deep intellectual wisdom, I meditate upon you, Hanuman, the Son of the Wind. Grant me physical strength, supreme intellect, and spiritual knowledge, and dissolve all my afflictions and moral flows."
      },
      {
        number: "Chaupai 1",
        original: "जय हनुमान ज्ञान गुन सागर ।\nजय कपीस तिहुँ लोक उजागर ॥",
        transliteration: "Jai Hanuman Gyaan Gun Saagar |\nJai Kapees Tihun Lok Ujaagar ||",
        translation: "Victory to Hanuman, who is a limitless ocean of wisdom and virtue! Victory to the Lord of monkeys, who illuminates the three worlds with his absolute glory."
      },
      {
        number: "Chaupai 2",
        original: "राम दूत अतुलित बल धामा ।\nअंजनि-पुत्र पवनसुत नामा ॥",
        transliteration: "Raam Doot Atulit Bal Dhaama |\nAnjani-Putra Pavan-Sut Naama ||",
        translation: "You are the supreme messenger of Lord Rama, the sanctuary of immeasurable power. You are known as the son of Mother Anjana and the Son of the Wind."
      },
      {
        number: "Chaupai 3",
        original: "महाबीर बिक्रम बजरंगी ।\nकुमति निवार सुमति के संगी ॥",
        transliteration: "Mahaaveer Bikram Bajrangi |\nKumati Nivaar Sumati Ke Sangi ||",
        translation: "O great hero, of matchless valiancy, with limbs as solid as a diamond lightning-bolt! You are the dispeller of corrupt thoughts and the beautiful companion of wisdom."
      },
      {
        number: "Chaupai 4",
        original: "कंचन बरन बिराज सुबेसा ।\nकानन कुंडल कुंचित केसा ॥",
        transliteration: "Kanchan Baran Biraaj Subesa |\nKanan Kundal Kunchit Kesa ||",
        translation: "Your complexion glows with the warmth of gold, and you are dressed in beautiful garments. You wear dazzling ear-rings and have beautifully curly hair."
      },
      {
        number: "Chaupai 5",
        original: "हाथ बज्र औ ध्वजा बिराजै ।\nकाँधे मूँज जनेऊ साजै ॥",
        transliteration: "Haath Vajra Au Dhvaja Biraajai |\nKandhe Moonj Janeoo Saajai ||",
        translation: "In your hands rest the mighty lightning-bolt (Vajra) and a victorious flag. Your shoulder is adorned with the sacred thread made of Munja grass."
      },
      {
        number: "Chaupai 6",
        original: "शंकर सुवन केसरीनंदन ।\nतेज प्रताप महा जग बंदन ॥",
        transliteration: "Sankar Suvan Kesaree-Nandan |\nTej Prataap Maha Jag Bandan ||",
        translation: "O incarnation of Shiva and physical son of Kesari! Your radiant brilliance and fierce valor is worshipped by the entire universe."
      },
      {
        number: "Chaupai 7",
        original: "बिद्यावान गुनी अति चातुर ।\nराम काज करिबे को आतुर ॥",
        transliteration: "Bidyaavaan Gunee Ati Chaatur |\nRaam Kaaj Karibe Ko Aatur ||",
        translation: "You are highly learned, filled with virtuous talents, and extremely clever. You are always enthusiastically eager to carry out the noble works of Lord Rama."
      },
      {
        number: "Chaupai 8",
        original: "प्रभु चरित्र सुनिबे को रसिया ।\nराम लखन सीता मन बसिया ॥",
        transliteration: "Prabhu Charitra Sunibe Ko Rasiya |\nRaam Lakhan Seeta Man Basiya ||",
        translation: "You take infinite delight in listening to the stories of the Lord's noble life. Lord Rama, Lakshmana, and Mother Sita reside forever within your heart."
      },
      {
        number: "Chaupai 9",
        original: "सूक्ष्म रूप धरि सियहिं दिखावा ।\nबिकट रूप धरि लंक जरावा ॥",
        transliteration: "Sukshma Roop Dhari Siyahin Dikhaava |\nBikat Roop Dhari Lank Jaraava ||",
        translation: "You assumed an extremely minute, humble form when appearing before Mother Sita, but assumed a terrifying colossal form when burning the golden city of Lanka."
      },
      {
        number: "Chaupai 10",
        original: "भीम रूप धरि असुर संहारे ।\nरामचंद्र के काज सँवारे ॥",
        transliteration: "Bheema Roop Dhari Asur Sanhaare |\nRaamchandra Ke Kaaj Sanvaare ||",
        translation: "Assuming a formidable, mighty form, you destroyed the negative forces (asuras), successfully coordinating and fulfilling the commands of Lord Rama."
      },
      {
        number: "Chaupai 11",
        original: "लाय सजीवन लखन जियाए ।\nश्रीरघुबीर हरषि उर लाए ॥",
        transliteration: "Laay Sajeevan Lakhan Jiyaaye |\nShree-Raghubeer Harashi Ur Laaye ||",
        translation: "You brought the life-saving Sanjivani herb from the Himalayas, restoring Lakshmana back to life. Overflowing with joy, Lord Rama embraced you closely to his heart."
      },
      {
        number: "Chaupai 12",
        original: "रघुपति कीन्ही बहुत बड़ाई ।\nतुम मम प्रिय भरतहि सम भाई ॥",
        transliteration: "Raghupati Keenhee Bahut Badai |\nTum Mam Priya Bharatahi Sam Bhaai ||",
        translation: "The Chief of the Raghu clan (Rama) praised you with deep affection, declaring: 'You are as close and dear to me as my own beloved brother Bharata.'"
      },
      {
        number: "Chaupai 13",
        original: "सहस बदन तुम्हरो जस गावैं ।\nअस कहि श्रीपति कंठ लगावैं ॥",
        transliteration: "Sahas Badan Tumharo Jas Gaavain |\nAs Kahi Shreepati Kanth Lagaavain ||",
        translation: "Declaring that 'The thousand-headed celestial serpent sings of your glorious fame', the Lord of Lakshmi (Rama) embraced you with profound love."
      },
      {
        number: "Chaupai 14",
        original: "सनकादिक ब्रह्मादि मुनीसा ।\nनारद सारद सहित अहीसा ॥",
        transliteration: "Sanakaadik Brahmaadi Muneesa |\nNaarad Saarad Sahit Aheesa ||",
        translation: "Sages like Sanaka, Brahma, the celestial monarchs, Narada, Saraswati, and the King of Serpents (Sheshnag) are ever engaged in singing your glory."
      },
      {
        number: "Chaupai 15",
        original: "जम कुबेर दिगपाल जहाँ ते ।\nकबि कोबिद कहि सकैं कहाँ ते ॥",
        transliteration: "Yam Kuber Digpaal Jahaan Te |\nKabi Kobid Kahi Sakain Kahaan Te ||",
        translation: "Yama (lord of justice), Kubera (lord of wealth), the guardians of the ten cardinal directions, poets, and high scholars fail to fully describe your expansive virtue."
      },
      {
        number: "Chaupai 16",
        original: "तुम उपकार सुग्रीवहिं कीन्हा ।\nराम मिलाय राज पद दीन्हा ॥",
        transliteration: "Tum Upkaar Sugreevahin Keenha |\nRaam Milaay Raaj Pad Deenha ||",
        translation: "You rendered a magnificent service to Sugreeva by introducing him to Lord Rama, helping him reclaim his lost kingdom and kingly status."
      },
      {
        number: "Chaupai 17",
        original: "तुम्हरो मंत्र बिभीषन माना ।\nलंकेश्वर भए सब जग जाना ॥",
        transliteration: "Tumharo Mantra Vibheeshan Maana |\nLankesvar Bhae Sab Jag Jaana ||",
        translation: "Vibheeshana followed your wise counsel, securing the throne of Lanka, a historical event known and celebrated across the entire universe."
      },
      {
        number: "Chaupai 18",
        original: "जुग सहस्र जोजन पर भानू ।\nलील्यो ताहि मधुर फल जानू ॥",
        transliteration: "Jug Sahasra Jojan Par Bhaanoo |\nLeelyo Taahi Madhur Phal Jaanoo ||",
        translation: "The Sun, situated millions of miles away in outer space, was reached and swallowed by you in your childhood, mistaking it to be a sweet, ripe fruit."
      },
      {
        number: "Chaupai 19",
        original: "प्रभु मुद्रिका मेलि मुख माहीं ।\nजलधि लाँघि गये अचरज नाहीं ॥",
        transliteration: "Prabhu Mudrika Meli Mukh Maaheen |\nJaladhi Laanghi Gaye Acharaj Naaheen ||",
        translation: "Holding Lord Rama's signet ring inside your mouth, you leaped across the massive, roaring ocean—it is no wonder such a miracle was easily done by you."
      },
      {
        number: "Chaupai 20",
        original: "दुर्गम काज जगत के जेते ।\nसुगम अनुग्रह तुम्हरे तेते ॥",
        transliteration: "Durgam Kaaj Jagat Ke Jete |\nSugam Anugrah Tumhare Tete ||",
        translation: "Every arduous task or seemingly impossible crisis in this mortal world becomes effortlessly simple through your kind and merciful grace."
      },
      {
        number: "Chaupai 21",
        original: "राम दुआरे तुम रखवारे ।\nहोेत न आग्या बिनु पैसारे ॥",
        transliteration: "Raam Duaare Tum Rakhvaare |\nHot Na Aagya Binu Paisaare ||",
        translation: "You are the mighty guardian at the gateway of Lord Rama's palace. No one can enter or receive the Lord's presence without your explicit permission."
      },
      {
        number: "Chaupai 22",
        original: "सब सुख लहै तुम्हारी सरना ।\nतुम रक्षक काहू को डरना ॥",
        transliteration: "Sab Sukh Lahai Tumhaaree Sarana |\nTum Rakshak Kaahoo Ko Darana ||",
        translation: "All joy, peace, and ultimate security are achieved by surrendering into your refuge. When you are our supreme protector, what fear is there to touch us?"
      },
      {
        number: "Chaupai 23",
        original: "आपन तेज सम्हारो आपै ।\nतीनों लोक हाँक तें काँपै ॥",
        transliteration: "Aapan Tej Samhaaro Aapai |\nTeenon Lok Haank Ten Kaanpai ||",
        translation: "Only you can control and harness your immense, blinding energy. The three worlds tremble with fear when you declare your thunderous battle cry."
      },
      {
        number: "Chaupai 24",
        original: "भूत पिसाच निकट नहिं आवै ।\nमहाबीर जब नाम सुनावै ॥",
        transliteration: "Bhoot Pisaach Nikat Nahin Aavai |\nMahaaveer Jab Naam Sunaavai ||",
        translation: "Negative vibrations, ghosts, and malicious forces dare not approach when the sacred name of 'Mahavir' is actively recited aloud."
      },
      {
        number: "Chaupai 25",
        original: "नासै रोग हरै सब पीरा ।\nजपत निरंतर हनुमत बीरा ॥",
        transliteration: "Naasai Rog Harai Sab Peera |\nJapat Nirantar Hanumat Beera ||",
        translation: "All diseases are eradicated and all acute physical and mental pains are cured by continuously chanting and meditating on the courageous Hanuman."
      },
      {
        number: "Chaupai 26",
        original: "संकट तें हनुमान छुड़ावै ।\nमन क्रम बचन ध्यान जो लावै ॥",
        transliteration: "Sankat Ten Hanuman Chhudaavai |\nMan Kram Bachan Dhyaan Jo Laavai ||",
        translation: "Hanuman liberates from all severe crises and bondages those who align their minds, actions, and speech to contemplate him with absolute focus."
      },
      {
        number: "Chaupai 27",
        original: "सब पर राम तपस्वी राजा ।\nतिन के काज सकल तुम साजा ॥",
        transliteration: "Sab Par Raam Tapasvee Raaja |\nTin Ke Kaaj Sakal Tum Saaja ||",
        translation: "Lord Rama is the supreme ascetic King of all. Yet, you managed, carried out, and beautified all his projects with perfect diligence."
      },
      {
        number: "Chaupai 28",
        original: "और मनोरथ जो कोइ लावै ।\nसोइ अमित जीवन फल पावै ॥",
        transliteration: "Aur Manorath Jo Koi Laavai |\nSoi Amit Jeevan Phal Paavai ||",
        translation: "Whatever noble desire or prayer a seeker brings before your altar, they receive the highest, limitless nectar-fruits of fulfilled life."
      },
      {
        number: "Chaupai 29",
        original: "चारों जुग परताप तुम्हारा ।\nहै परसिद्ध जगत उजियारा ॥",
        transliteration: "Charon Jug Parataap Tumhaara |\nHai Parasiddh Jagat Ujiyaara ||",
        translation: "Your protective glory spans across all four cosmological world epochs (yugas). Your fame is internationally acknowledged, throwing light across the universe."
      },
      {
        number: "Chaupai 30",
        original: "साधु संत के तुम रखवारे ।\nअसुर निकंदन राम दुलारे ॥",
        transliteration: "Saadhu Sant Ke Tum Rakhvaare |\nAsur Nikandan Raam Dulaare ||",
        translation: "You are the dedicated guardian of saints, sages, and moral seekers. You destroy destructive, negative forces and are deeply beloved of Lord Rama."
      },
      {
        number: "Chaupai 31",
        original: "अष्ट सिद्धि नव निधि के दाता ।\nअस बर दीन जानकी माता ॥",
        transliteration: "Ashta Siddhi Nav Nidhi Ke Daata |\nAs Bar Deen Jaanakee Maata ||",
        translation: "You bestow the eight classical yogic attainments (siddhis) and the nine cosmic treasures (nidhis). This unique boon was granted to you by Mother Sita herself."
      },
      {
        number: "Chaupai 32",
        original: "राम रसायन तुम्हरे पासा ।\nसदा रहो रघुपति के दासा ॥",
        transliteration: "Raam Rasaayan Tumhare Paasa |\nSada Raho Raghupati Ke Daasa ||",
        translation: "You possess the supreme healing elixir of Lord Rama's devotion (Ram-Rasayan). May you remain forever the humble servant of the Raghu Dynasty."
      },
      {
        number: "Chaupai 33",
        original: "तुम्हरे भजन राम को पावै ।\nजनम जनम के दुख बिसरावै ॥",
        transliteration: "Tumhare Bhajan Raam Ko Paavai |\nJanam Janam Ke Dukh Bisraavai ||",
        translation: "By singing your devotional hymns, the seeker directly reaches Lord Rama, dissolving deep mental sorrows accumulated over cycles of birth."
      },
      {
        number: "Chaupai 34",
        original: "अंत काल रघूबर पुर जाई ।\nजहाँ जन्म हरि-भक्त कहाई ॥",
        transliteration: "Ant Kaal Raghubar Pur Jaai |\nJahaan Janm Hari-Bhakta Kahaai ||",
        translation: "At the end of their biological life, your devotee enters the eternal, divine abode of Rama, and remains registered as an auspicious devotee in every realm."
      },
      {
        number: "Chaupai 35",
        original: "और देवता चित्त न धरई ।\nहनुमत सेइ सर्ब सुख करई ॥",
        transliteration: "Aur Devata Chitta Na Dharai |\nHanumat Sei Sarb Sukh Karai ||",
        translation: "Even without contemplating any other deity, serving Hanuman alone secures complete, absolute happiness and spiritual peace."
      },
      {
        number: "Chaupai 36",
        original: "संकट कटै मिटै सब पीरा ।\nजो सुमिरै हनुमत बलबीरा ॥",
        transliteration: "Sankat Katai Mitai Sab Peera |\nJo Sumirai Hanumat Balbeera ||",
        translation: "All crises vanish and all lingering inner griefs are erased when one actively remembers the strong, heroic Hanuman."
      },
      {
        number: "Chaupai 37",
        original: "जय जय जय हनुमान गोसाईं ।\nकृपा करहु गुरुदेव की नाईं ॥",
        transliteration: "Jai Jai Jai Hanuman Gosaain |\nKripa Karahu Gurudev Kee Naain ||",
        translation: "Victory, victory, victory to the ultimate spiritual master, Hanuman! Shower your kind grace upon me just like my divine spiritual preceptor (Guru)."
      },
      {
        number: "Chaupai 38",
        original: "जो सत बार पाठ कर कोई ।\nछूटहि बंदि महा सुख होई ॥",
        transliteration: "Jo Sat Baar Paath Kar Koi |\nChhootahi Bandi Maha Sukh Hoi ||",
        translation: "Whoever recites this holy chalisa a hundred times is completely released from all physical and mental bondages, achieving sublime spiritual peace."
      },
      {
        number: "Chaupai 39",
        original: "जो यह पढ़ै हनुमान चालीसा ।\nहोय सिद्धि साखी गौरीसा ॥",
        transliteration: "Jo Yeh Padhai Hanuman Chalisa |\nHoy Siddhi Saakhee Gaureesa ||",
        translation: "Whoever studies this Hanuman Chalisa regularly gains direct spiritual victory and focus, as witnessed and vouched by Lord Shiva (husband of Mother Gauri)."
      },
      {
        number: "Chaupai 40",
        original: "तुलसीदास सदा हरि चेरा ।\nकीजै नाथ हृदय मँह डेरा ॥",
        transliteration: "Tulsidaas Sada Hari Chera |\nKeejai Naath Hriday Manh Dera ||",
        translation: "Goswami Tulsidas remains forever a dedicated servant of the Divine Lord. O Hanuman, please make your permanent home within my loving heart."
      },
      {
        number: "End Doha",
        original: "पवनतनय संकट हरन मंगल मूरति रूप ।\nराम लखन सीता सहित हृदय बसहु सुर भूप ॥",
        transliteration: "Pavantanay Sankat Haran, Mangal Moorati Roop |\nRaam Lakhan Seeta Sahit, Hriday Basahu Sur Bhoop ||",
        translation: "O Son of the Wind, savior from all hazards, very embodiment of auspicious blessings! Please dwell in my heart forever along with Lord Rama, Lakshmana, and Mother Sita. You are the king of all noble forces."
      }
    ],
    commentary: "The Hanuman Chalisa is celebrated as a masterpiece of spiritual energy. By chanting these verses, the seeker tunes into courage, physical discipline, and self-less service. Tulsidas utilizes physical Hanuman as an allegory for the vital air (Prana) that must carry the soul (Rama) back to the heights of spiritual wisdom."
  },
  bajrang_baan: {
    key: "bajrang_baan",
    title: "Sri Bajrang Baan",
    originalTitle: "श्री बजरंग बाण",
    deity: "Lord Hanuman",
    intro: "The Bajrang Baan is a highly potent, protective, and rhythmic petition dedicated to Hanuman. It is traditionally chanted to clear lingering fears, severe psychological blockages, and complex external/internal obstacles.",
    verses: [
      {
        number: "Doha 1",
        original: "निश्चय प्रेम प्रतीत ते, विनय करैं सनमान ।\nतेहि के कारज सकल शुभ, सिद्ध करैं हनुमान ॥",
        transliteration: "Nishchay Prem Prateet Te, Vinay Karain Sanmaan |\nTehi Ke Kaaraj Sakal Shubh, Siddh Karain Hanumaan ||",
        translation: "With firm conviction, sincere love, and deep humility, whoever honors Hanuman will see all their righteous and auspicious tasks brought to absolute success."
      },
      {
        number: "Chaupai 1",
        original: "जय हनुमंत संत हितकारी । सुन लीजै प्रभु अरज हमारी ॥",
        transliteration: "Jai Hanumant Sant Hitkaari | Sun Leejai Prabhu Araj Hamaari ||",
        translation: "Victory to Hanuman, the selfless benefactor of saints and spiritual seekers! Please listen, O Lord, to this earnest plea of mine."
      },
      {
        number: "Chaupai 2",
        original: "विपति हरन अंजनी के जाये । संकट काटहु हे तुम स्वामी ॥",
        transliteration: "Vipati Haran Anjani Ke Jaaye | Sankat Kaatahu He Tum Svaamee ||",
        translation: "You are the destroyer of misfortune, born of Mother Anjana. Please cut through our deepest dilemmas, O Lord of immense power."
      },
      {
        number: "Chaupai 3",
        original: "जय बजरंग वज्र तनधारी । दुष्ट दलन जय जय बलधारी ॥",
        transliteration: "Jai Bajrang Vajra Tanahdhari | Dusht Dalan Jai Jai Baldhaari ||",
        translation: "Victory to Bajrang (Hanuman), whose body is strong like a diamond bolt. Victory to the destroyer of negative, corrupting obstacles."
      },
      {
        number: "Chaupai 4",
        original: "गर्जहिं घन ज्यों शत्रु भयकारी । भक्त जनन सुख प्रदाता ॥",
        transliteration: "Garjahin Ghan Jyon Shatru Bhayakaari | Bhakt Janan Sukh Pradaata ||",
        translation: "Your celestial roar is loud and powerful like thunderclaps, striking terror into negative forces, while giving infinite reassurance to the hearts of your devotees."
      },
      {
        number: "Chaupai 5",
        original: "जय राम लक्ष्मण हितकारी । सीता माता शोक निवारी ॥",
        transliteration: "Jai Ram Lakshman Hitkaari | Seeta Maata Shok Nivaari ||",
        translation: "Victory to him who brought endless comfort to Lord Rama and Lakshmana, and who completely erased the deep grief of Mother Sita in Ashok Vatika."
      },
      {
        number: "Chaupai 6",
        original: "उठु उठु चलु तोहि राम दुहाई । पायँ परौं कर जोरि मनाई ॥",
        transliteration: "Uthu Uthu Chalu Tohi Raam Duhaai | Paayan Paraun Kar Jori Manaai ||",
        translation: "Arise, arise! Move forward with the speed of an arrow, for I invoke the sacred covenant of Lord Rama. I fall at your feet, making this petition with folded hands."
      },
      {
        number: "Chaupai 7",
        original: "ॐ चं चं चं चपलता हितकारी । जय हनुमान सुमति सुखकारी ॥",
        transliteration: "Om Chaan Chaan Chaan Chapatla Hitkaari | Jai Hanuman Sumati Sukhkaari ||",
        translation: "Reciting the dynamic acoustic seed-syllables invoking lightning-fast speed! Victory to Hanuman, who brings bright intellect and pure spiritual joy."
      },
      {
        number: "Doha 2",
        original: "धूप दीप नैवेद्य सों, पूजैं सदा तुम्हार ।\nहरहु कलेस बिकार सब, जय जय हनुमान ॥",
        transliteration: "Dhoop Deep Naivedya Son, Poojain Sada Tumhaar |\nHarahu Kales Bikaar Sab, Jai Jai Hanumaan ||",
        translation: "Offering fragrant incense, glowing lamps, and sweet offerings, we worship you constantly. Dissolve all our core grievances, obstacles, and sorrowful flaws, O victorious Hanuman!"
      }
    ],
    commentary: "The Bajrang Baan is an intensely energized mantra. Devotees recite it under severe stress or depression. It commands Hanuman with the ultimate force: swearing by the name of Supreme Lord Rama (Ram-Duhaai). Since Hanuman's entire spiritual existence is bound to Rama, this invocation is considered completely breakthrough."
  },
  shiv_tandav: {
    key: "shiv_tandav",
    title: "Shiv Tandav Stotram",
    originalTitle: "शिवताण्डवस्तोत्रम्",
    deity: "Lord Shiva",
    intro: "The Shiv Tandav Stotram is a Sanskrit hymn of brilliant rhythmic meter and acoustic power. Traditionally composed by Ravana (the king of Lanka), it sings of Lord Shiva's ecstatic cosmic dance (Tandav) of creation, sustenance, and ultimate release.",
    verses: [
      {
        number: "Stanza 1",
        original: "जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।\nडमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥ १ ॥",
        transliteration: "Jaṭāṭavīgalaj-jalapravāhapāvitasthale\nGale'valambya lambitāṁ bhujaṅgatuṅgamālikām |\nḌamaḍ-ḍamaḍ-ḍamaḍ-ḍamanninādavad-ḍamarvayaṁ\nCakāra caṇḍatāṇḍavaṁ tanotu naḥ śivaḥ śivam || 1 ||",
        translation: "With his neck consecrated by the pure trickling rivers of the celestial system inside his forest of matted locks, a grand serpent draped around his throat like a heavy garland (Mala), and the damaru drum echoing 'Damad-Damad-Damad', Lord Shiva performs his fierce cosmic Tandav dance. May he expand our auspicious, holy well-being."
      },
      {
        number: "Stanza 2",
        original: "जटाकटाहसंभ्रमभ्रमन्निलिम्पनिर्झरी विलोलवीचिवल्लरीविराजमानमूर्धनि ।\nधगद्धगद्धगज्ज्वलल्ललाटपट्टपावके किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम ॥ २ ॥",
        transliteration: "Jaṭākaṭāhasaṁbhramabhramannilimpanirjharī\nVilolavīcivallarī-virājamānamūrdhani |\nDhagad-dhagad-dhagaj-jvalal-lalāṭapaṭṭapāvake\nKiśoracandraśekhare ratiḥ pratikṣaṇaṁ mama || 2 ||",
        translation: "My mind is locked in eternal bliss upon Lord Shiva, on whose forehead the brilliant fire blazes 'Dhagad-Dhagad-Dhagad', whose hair surges in spectacular waves containing the celestial Ganges, and whose crown is adorned with the silver crescent moon."
      },
      {
        number: "Stanza 3",
        original: "धराधरेन्द्रनन्दिनीविलासबन्धुबन्धुर स्फुरद्दिगन्तसन्ततिममोदमानमानसे ।\nकृपाकटाक्षधोरणीनिरुद्धदुर्धरापदि क्वचिद्दिगम्बरे मनो विनोदमेतु वस्तुनि ॥ ३ ॥",
        transliteration: "Dharādharendranandinī-vilāsabandhubandhura\nSphuraddigantasantati-pramodamānamānase |\nKṛpākaṭākṣadhoraṇī-niruddhadurdharāpadi\nKvaciddigambare mano vinodametu vastuni || 3 ||",
        translation: "May my mind find absolute joy in the Supreme One, whose consort is Parvati (daughter of the mountain king), whose compassionate sidelong glances effortlessly block and freeze all crises and disasters, and who is clad only in the directions of the cosmos."
      },
      {
        number: "Stanza 4",
        original: "जटाभुजङ्गपिङ्गलस्फुरत्फणामणिप्रभा कदम्बकुङ्कुमद्रवप्रलिप्तदिग्वधूमुखे ।\nमदान्धसिन्धुरस्फुरत्वगुत्तरीयमेदुरे मनो विचुत्प्रभामहद्दि पैतु वस्तुनि ॥ ४ ॥",
        transliteration: "Jaṭābhujaṅgapiṅgala-sphuratphaṇāmaṇiprabhā\nKadambakuṅkumadrava-praliptadigvadhūmukhe |\nMadāndhasindhurasphurat-tvaguttarīyamedure\nMano 'nanyabhūtaṁ bhaje bhavat-prabhā-mahaddipe || 4 ||",
        translation: "We worship Shiva, the absolute light, who is covered in reddish-yellow saffron-paste, whose matted hair reflects the golden rays of the serpent jewels, and his shoulders draped with celestial skins. His divine light shines like a massive spiritual torch."
      },
      {
        number: "Stanza 5",
        original: "सहस्रलोचनप्रभृत्यशेषलेखशेखर प्रसूनधूलिधोरणी विधूसराङ्घ्रिपीठभूः ।\nभुजङ्गराजमालया निबद्धजाटजूटकः श्रियै चिराय जायतां चकोरबन्धुशेखरः ॥ ५ ॥",
        transliteration: "Sahasralocanaprabhṛty-aśeṣalekhaśekhara\nPrasūnadhūlidhoraṇī-vidhūsarāṅghripīṭhabhūḥ |\nBhujaṅgarājamālayā-nibaddhajāṭajūṭakaḥ\nŚriyai cirāya jāyatāṁ cakorabandhuśekharaḥ || 5 ||",
        translation: "May Shiva, whose footstool is greyed with the decorative pollen-dust of fresh blossoms falling from the crowns of worshipping gods like Indra, and whose hair is bound with the serpent king, expand my spiritual wealth forever."
      },
      {
        number: "Stanza 6",
        original: "ललाटचत्वरज्वलद्धनञ्जयस्फुलिङ्गभा निपीतपञ्चसायकं नमन्निलिम्पनायकम् ।\nसुधामयूखलेखया विराजमानशेखरं महाकपालिसम्पदे शिरोजटालमस्तु नः ॥ ६ ॥",
        transliteration: "Lalāṭacatavarajvalad-dhanañjayasphuliṅgabhā\nNipītapañcasāyakaṁ namannilimpanāyakam |\nSudhāmayūkhalekhayā-virājamānaśekharaṁ\nMahākapālisampade śirojaṭālamastu naḥ || 6 ||",
        translation: "May we achieve spiritual wealth from Shiva's matted locks! Shiva, whose third eye burns with spark-spitting fire that dissolved Kamadeva (the god of desire), and who is worshipped by the king of gods."
      },
      {
        number: "Stanza 7",
        original: "करालभालपट्टिकाधगद्धगद्धगज्ज्वल द्धनञ्जयाहुतीकृतप्रचण्डपञ्चसायके ।\nधराधरेन्द्रनन्दिनीकुचाग्रचित्रपत्रक प्रकल्पनैकशिल्पिनि त्रिलोचने रतिर्मम ॥ ७ ॥",
        transliteration: "Karālabhālapaṭṭikā-dhagaddhagaddhagajjvalad\nDhanañjayāhutīkṛta-pracaṇḍapañcasāyake |\nDharādharendranandinī-kucāgracitrapatraka\nPrakalpanaikaśilpini trilocane ratirmama || 7 ||",
        translation: "My mind wanders in absolute devotion on Shiva, who offered the five arrows of desire as a sacrifice into the blazing fire of his forehead, and who is the unique creator and artist of this beautiful universe."
      },
      {
        number: "Stanza 8",
        original: "नवीनमेघमण्डलीनिरुद्धदुर्धरस्फुरत्कुहूनिशीथिनीतमःप्रबन्धबद्धकन्धरः ।\nनिलिम्पनिर्झरीधरस्तनोतु कृत्तिसिन्धुरः कलानिधानबन्धुरः श्रियं जगद्धुरंधरः ॥ ८ ॥",
        transliteration: "Navīnameghamaṇḍalī-niruddhadurdharasphurat\nKuhūnīśīthinītamaḥ-prabandhabaddhakandharaḥ |\nNilimpanirjharī-dharastanotu kṛttisindhuraḥ\nKalānidhānabandhuraḥ śriyaṁ jagaddhuraṅdharaḥ || 8 ||",
        translation: "May he, whose neck is dark blue like the night sky covered under dense cosmic clouds, and who carries the holy Ganges upon his head, enhance my ultimate spiritual prosperity. He supports the weight of the entire world."
      },
      {
        number: "Stanza 9",
        original: "प्रफुल्लनीलपङ्कजप्रपञ्चकालिमप्रभावलम्बि कण्ठकन्दलीरुचिप्रबद्धकन्धरम् ।\nस्मरच्छिदं पुरच्छिदं भवच्छिदं मखच्छिदं गजच्छिदं अन्धकच्छिदं तमन्तकच्छिदं भजे ॥ ९ ॥",
        transliteration: "Praphullanīlapaṅkaja-prapañcakālimaprabhā\nValambikaṇṭhakandalī-ruciprabaddhakandharam |\nSmaracchidaṁ puracchidaṁ bhavacchidaṁ makhacchidaṁ\nGajacchidaṁ andhakacchidaṁ tamantakacchidaṁ bhaje || 9 ||",
        translation: "I worship Shiva, whose throat holds the indigo glow of a fully blossomed blue lotus, who is the destroyer of desire (Kama), the shatterer of the three fortresses of ego (Tripura), the cutter of worldly illusion, and the supreme defeater of death."
      },
      {
        number: "Stanza 10",
        original: "अखर्वसर्वमङ्गलाकलाकदम्बमञ्जरी रसप्रवाहमाधुरीविजृम्भणामधुव्रतम् ।\nस्मरान्तकं पुरान्तकं भवान्तकं मखान्तकं गजान्तकं अन्धकान्तकं तमन्तकान्तकं भजे ॥ १० ॥",
        transliteration: "Akharvasarvamaṅgalā-kalākadambamañjarī\nRasapravāhamādhurī-vijṛmbhaṇāmadhuvratam |\nSmarāntakaṁ purāntakaṁ bhavāntakaṁ makhāntakaṁ\nGajāntakaṁ andhakāntakaṁ tamantakāntakaṁ bhaje || 10 ||",
        translation: "I worship Shiva, who eagerly drinks the sweet nectar of cosmic arts and auspiciousness from Mother Parvati, and who is the ultimate cosmic termination of all delusions, vanity, and limitations of time."
      }
    ],
    commentary: "The Shiv Tandav Stotram is a supreme exploration of the dance of creation and dissolution. Ravana, though an egoic king, composed this in absolute devotion when realizing Shiva's infinite nature. By chanting this, we align our vital breaths with Shiva's infinite rhythm, purifying our channels."
  },
  ganesh_aarti: {
    key: "ganesh_aarti",
    title: "Sri Ganesha Aarti",
    originalTitle: "श्री गणेश आरती",
    deity: "Lord Ganesha",
    intro: "The traditional Marathi and Hindi 'Jai Ganesh Jai Ganesh Deva' is sung at the beginning of all auspicious enterprises and morning worships. Ganesha represents the supreme intellect that clears all intellectual and physical roadblocks.",
    verses: [
      {
        number: "Verse 1",
        original: "जय गणेश जय गणेश, जय गणेश देवा ।\nमाता जाकी पारवती, पिता महादेवा ॥",
        transliteration: "Jai Ganesh Jai Ganesh, Jai Ganesh Deva |\nMaata Jaakee Paaravatee, Pita Mahaadeva ||",
        translation: "Om! Victory, victory to Lord Ganesha, the radiant remover of obstacles. Whose mother is the divine Goddess Parvati, and whose father is Lord Shiva (Mahadeva)."
      },
      {
        number: "Verse 2",
        original: "एकदन्त दयावन्त, चार भुजाधारी ।\nमाथे सिन्दूर सोहे, मूस की सवारी ॥",
        transliteration: "Ekadanta Dayaavanta, Chaar Bhujaadhaaree |\nMaathe Sindoor Sohe, Moos Kee Savaaree ||",
        translation: "The single-tusked, highly compassionate Lord with four mighty arms, who is beautifully decorated with red vermillion on his forehead and rides upon his humble mouse."
      },
      {
        number: "Verse 3",
        original: "पान चढ़े फूल चढ़े, और चढ़े मेवा ।\nलड्डुअन का भोग लगे, सन्त करें सेवा ॥",
        transliteration: "Paan Chadhe Phool Chadhe, Aur Chadhe Meva |\nLadduan Ka Bhog Lage, Sant Karain Seva ||",
        translation: "We offer sacred betel leaves, fresh blossoms, and dried nuts before your altar. Sages and saints serve you, offering sweet laddus (golden modaks) as holy prasad."
      },
      {
        number: "Verse 4",
        original: "अन्धन को आँख देत, कोढ़िन को काया ।\nबाँझन को पुत्र देत, निर्धन को माया ॥",
        transliteration: "Andhan Ko Aankh Det, Kodhin Ko Kaaya |\nBanjhan Ko Putra Det, Nirdhan Ko Maaya ||",
        translation: "He restores vision to the blind, heals the physical bodies of those suffering leprosy, blesses the barren with offspring, and bestows abundance upon the poor."
      },
      {
        number: "Verse 5",
        original: "'सूर' श्याम शरण आए, सफल कीजै सेवा ।\nजय गणेश जय गणेश, जय गणेश देवा ॥",
        transliteration: "'Soor' Shyaam Sharan Aaye, Saphal Keejai Seva |\nJai Ganesh Jai Ganesh, Jai Ganesh Deva ||",
        translation: "All we seekers have come to take complete shelter in your sanctuary. Please bless our devotional service and make our lives dynamic and meaningful."
      }
    ],
    commentary: "Ganesha's large ears teach us to listen carefully and absorb wisdom, his small eyes denote acute focus, his elephant trunk represents immense strength paired with gentleness, and his small vehicle (the mouse) teaches us to master the small desires of our senses."
  },
  goddess_aartis: {
    key: "goddess_aartis",
    title: "9 Goddesses Aartis (Shakti)",
    originalTitle: "९ देवी माँ की आरती (नवरात्रि)",
    deity: "The Divine Mother",
    intro: "Shakti represents the primal, creative feminine energy of the cosmos. During Navratri, devotees worship nine forms of Goddess Durga to activate strength, wealth, wisdom, and cosmic protection.",
    verses: [
      {
        number: "1. Durga Ji (Jai Ambe Gauri)",
        original: "जय अम्बे गौरी, मैया जय अम्बे गौरी ।\nतुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी ॥\nमांग सिन्दूर बिराजत, टीको मृगमद को ।\nउज्ज्वल से दो नैना, चन्द्रबदन नीको ॥",
        transliteration: "Jai Ambe Gauri, Maiya Jai Ambe Gauri |\nTumako Nishadina Dhyaavata, Hari Brahma Shivari ||\nMaang Sindoor Biraajat, Teeko Mrigamad Ko |\nUjjvala Se Do Naina, Chandrabadan Neeko ||",
        translation: "Victory to Mother Ambe, the Divine Gauri! Vishnu, Brahma, and Shiva contemplate you day and night. Red vermillion shines in your parting, with a beautiful musk mark on your forehead. Your eyes are bright, and your face is peaceful like the moon."
      },
      {
        number: "2. Lakshmi Ji (Om Jai Laxmi Mata)",
        original: "ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता ।\nतुमको निशदिन ध्यावत, हर विष्णु विधाता ॥\nउमा रमा ब्रह्माणी, तुम ही जग माता ।\nसूर्य चन्द्रमा ध्यावत, नारद ऋषि गाता ॥",
        transliteration: "Om Jai Lakshmi Mata, Maiya Jai Lakshmi Mata |\nTumako Nishadina Dhyaavata, Hara Vishnu Vidhaata ||\nYuma Rama Brahmaanee, Tum Hee Jag Maata |\nSoorya Chandrama Dhyaavata, Naarad Rishi Gaata ||",
        translation: "Om! Victory to Mother Lakshmi, the giver of light and abundance. Shiva, Vishnu, and Brahma contemplate you. You are Uma, Roma, and Brahmani, the very Mother of the universe. The Sun, Moon, and sage Narada sing of your glory."
      },
      {
        number: "3. Saraswati Ji (Jai Saraswati Mata)",
        original: "जय सरस्वती माता, मैया जय सरस्वती माता ।\nसद्गुण ज्ञान प्रदायिनी, त्रिभुवन विख्याता ॥\nचन्द्रबदनि पद्मासिनि, द्युति मंगलकारी ।\nसोहे हंस सवारी, अतुलित बलधारी ॥",
        transliteration: "Jai Saraswati Mata, Maiya Jai Saraswati Mata |\nSadguna Gyaan Pradaayinee, Tribhuvana Vikhyaata ||\nChandrabadani Padmaasini, Dyuti Mangalakaaree |\nSohe Hans Savaaree, Atulit Baladhaaree ||",
        translation: "Victory to Mother Saraswati, the patroness of fine arts and absolute wisdom. You are the bestower of noble virtues and learning. Seated elegantly on a lotus with your swan vehicle, you guide our intellect into divine truth."
      },
      {
        number: "4. Kali Ji (Mangal Ki Seva)",
        original: "मंगल की सेवा सुन मेरी देवा, हाथ कतार खप्पर धारी ।\nसेन सिन्दूर सोहे कंचन की काया, रकत बीज विनाशिनी काली ॥\nजय जय जय महाकाली, शत्रुओं का नाश करे ॥",
        transliteration: "Mangal Kee Seva Sun Meree Deva, Haath Kataar Khappar Dhaaree |\nSen Sindoor Sohe Kanchan Kee Kaaya, Rakat Beej Vinaashinee Kaalee ||\nJai Jai Jai Mahaakaalee, Shatruon Ka Naash Kare ||",
        translation: "Listening to your auspicious service, O Mother Kali, who holds the sword and the vessel. Your golden-hued physical form is adorned with red vermillion. You are the ultimate destroyer of Raktabeeja (the egoic seed-demon). Victory to Kali, who dissolves outer and inner weaknesses."
      },
      {
        number: "5. Vaishno Devi (Sankat Harani)",
        original: "जय वैष्णवी माता, मैया जय वैष्णवी माता ।\nशीश पे मुकुट विराजे, हाथ त्रिशूल साजा ॥\nजम्मू की गुफा में, तुम हो कष्ट निवारी ।\nभक्तों की दुःख हरनी, हे आदिकुमारी ॥",
        transliteration: "Jai Vaishnavi Mata, Maiya Jai Vaishnavi Mata |\nSheesh Pe Mukut Viraaje, Haath Trishool Saaja ||\nJammu Kee Gupha Mein, Tum Ho Kasht Nivaaree |\nBhakton Kee Duhkh Haranee, He Aadikumaaree ||",
        translation: "Victory to Mother Vaishno Devi (Vaishnavi). A magnificent crown rests on your head, and a trident is held in your hands. Residing in your cave in Jammu, you are the remover of all physical disasters and protector of cosmic righteousness."
      },
      {
        number: "6. Santoshi Mata (Jai Santoshi Mata)",
        original: "जय सन्तोषी माता, मैया जय सन्तोषी माता ।\nअपने भक्तों को देती, सुख सम्पति दाता ॥\nगुड और चना नारियल, भोग लगे सुंदर ।\nसंतुष्ट करती मन को, हे माता सुखकर ॥",
        transliteration: "Jai Santoshi Mata, Maiya Jai Santoshi Mata |\nApane Bhakton Ko Detee, Sukh Sampati Daata ||\nGud Aur Chana Naariyal, Bhog Lage Sundar |\nSantusht Karatee Man Ko, He Mata Sukha-kar ||",
        translation: "Victory to Mother Santoshi, the deity of peaceful satisfaction. You bless your devotees with health, content, and inner wealth. We offer jaggery, roasted chickpeas, and fresh coconuts. You bring infinite satisfaction to our minds."
      },
      {
        number: "7. Parvati Mata Ki Aarti",
        original: "जय पारवती माता, मैया जय पारवती माता ।\nजगन्नाथ की माता, भोले संग राता ॥\nहिमगिरि की तुम पुत्री, शम्भू मन भाई ।\nसदा सुख प्रदायिनी, संकट दुख खाई ॥",
        transliteration: "Jai Parvati Mata, Maiya Jai Parvati Mata |\nJagannaath Kee Maata, Bhole Sang Raata ||\nHimagiri Kee Tum Putree, Shambhoo Man Bhaai |\nSada Sukh Pradaayinee, Sankat Dukh Khaai ||",
        translation: "Victory to Mother Parvati, who stays in union with Shiva. You are the daughter of the majestic Himalayas, beloved of Lord Shiva. You rescue us from difficulties."
      },
      {
        number: "8. Gayatri Mata Ki Aarti",
        original: "जयति जय गायत्री माता, जयति जय गायत्री माता ।\nवेद जननी जगदम्बा, बुद्धि प्रदायिनी दाता ॥\nपाप हरनी दुःख तारिणी, तुम ही कल्याणकारी ।\nचार वेद की माता, तुम हो सुखकारी ॥",
        transliteration: "Jayati Jai Gayatri Mata, Jayati Jai Gayatri Mata |\nVeda Jananee Jagadamba, Buddhi Pradaayinee Daata ||\nPaap Haranee Duhkh Taarinee, Tum Hee Kalyaanakaaree |\nChaar Veda Kee Maata, Tum Ho Sukhakaaree ||",
        translation: "Victory, glory to Mother Gayatri! The mother of the sacred Vedas, the bestower of intellectual clarity (Buddhi). You are the cleanser of negative karmas and the ultimate auspicious mother of four Vedas."
      },
      {
        number: "9. Ganga Mata Ki Aarti",
        original: "ॐ जय गंगे माता, मैया जय गंगे माता ।\nजो नर तुमको ध्यावत, मनवांछित फल पाता ॥\nचन्द्र सी ज्योति तुम्हारी, जल की धारा सुंदर ।\nपाप निवारिणी गंगा, हे माता सुखकर ॥",
        transliteration: "Om Jai Gange Mata, Maiya Jai Gange Mata |\nJo Nar Tumako Dhyaavata, Manavaanchhit Phal Paata ||\nChandra See Jyoti Tumhaaree, Jal Kee Dhaara Sundar |\nPaap Nivaarinee Ganga, He Mata Sukha-kar ||",
        translation: "Om! Victory to Mother Ganga, the celestial river of absolute purification. Whoever bathes in your stream or remembers your name receives ultimate rejuvenation. Your flow is bright like moonlight, washing away all sins."
      }
    ],
    commentary: "Worshipping the nine Goddesses (Shakti) symbolizes a step-by-step evolution of consciousness. Initiating with raw strength (Durga), proceeding to harvest resource stability (Lakshmi), purifying our aesthetic intelligence (Saraswati), and culminating in non-dual cosmic dissolution (Kali), Shakti yoga restores complete physical and mental balance."
  },
  lord_vishnu_aarti: {
    key: "lord_vishnu_aarti",
    title: "Om Jai Jagdish Hare",
    originalTitle: "ॐ जय जगदीश हरे (विष्णु आरती)",
    deity: "Lord Vishnu / Jagannath",
    intro: "Composed in the 19th century by Pandit Shardha Ram Phillauri in Punjab, this universal temple prayer is sung in millions of households to experience humility, absolute surrender, and peaceful non-attachment.",
    verses: [
      {
        number: "Verse 1",
        original: "ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे ।\nभक्त जनों के संकट, क्षण में दूर करे ॥",
        transliteration: "Om Jai Jagdish Hare, Swami Jai Jagdish Hare |\nBhakta Janon Ke Sankat, Kshan Mein Door Kare ||",
        translation: "Om! Victory to the Sovereign Lord of the entire Universe! Who instantly and completely dispels the heavy distresses, fears, and obstacles of his earnest devotees in a fraction of a second."
      },
      {
        number: "Verse 2",
        original: "जो ध्यावे फल पावे, दुःख बिनसे मन का ।\nसुख सम्पत्ति घर आवे, कष्ट मिटे तन का ॥",
        transliteration: "Jo Dhyaave Phal Paave, Dukh Binse Man Ka |\nSukh Sampatti Ghar Aave, Kasht Mite Tan Ka ||",
        translation: "Whoever sings your devotional praise obtains beautiful fruits of wisdom, and their mental grief is dissolved. Peace, joy, and spiritual prosperity flow to their homes, and physical ailments are completely healed."
      },
      {
        number: "Verse 3",
        original: "मात-पिता तुम मेरे, शरण गूँ किसकी ।\nतुम बिन और न दूजा, आस करूँ जिसकी ॥",
        transliteration: "Maat-Pita Tum Mere, Sharan Gahun Kiskee |\nTum Bin Aur Na Dooja, Aas Karoon Jiskee ||",
        translation: "You are my ultimate mother and father; what other shelter should I seek? There is none else besides You in whom I lay my confidence and hope."
      },
      {
        number: "Verse 4",
        original: "तुम पूरन परमात्मा, तुम अन्तर्यामी ।\nपारब्रह्म परमेश्वर, तुम सब के स्वामी ॥",
        transliteration: "Tum Pooran Paramaatma, Tum Antaryaamee |\nPaarabrahma Paramesvar, Tum Sab Ke Svaamee ||",
        translation: "You are the complete, perfect Supreme Soul; You are the inner Knower residing within every biological cell (Antaryami). You are the absolute transcendental Brahman, the Sovereign Creator of all."
      },
      {
        number: "Verse 5",
        original: "तुम करुणा के सागर, तुम पालनकर्ता ।\nमैं मूरख खल कामी, कृपा करो भर्ता ॥",
        transliteration: "Tum Karuna Ke Saagar, Tum Paalankarta |\nMain Moorakh Khal Kaamee, Kripa Karo Bharta ||",
        translation: "You are a vast, infinite ocean of compassion, the ultimate caretaker of all life. I am simple, ignorant, and trapped in sensory desires; O Lord, protect and nourish me with Your kind grace."
      },
      {
        number: "Verse 6",
        original: "तुम हो एक अगोचर, सब के प्राणपति ।\nकिस विधि मिलूँ दयामय, तुमको मैं कुमति ॥",
        transliteration: "Tum Ho Ek Agochar, Sab Ke Praanapati |\nKis Vidhi Miloon Dayaamay, Tumako Main Kumati ||",
        translation: "You are the one unmanifested Spirit, beyond the grasp of sensory organs, yet the vital breath of all living creatures. How should a simplistic mind like mine understand how to merge into Your presence, O Merciful Lord?"
      },
      {
        number: "Verse 7",
        original: "दीनबन्धु दुःखहर्ता, तुम ठाकुर मेरे ।\nअपने हाथ उठाओ, द्वार खड़ा तेरे ॥",
        transliteration: "Deenabandhu Duhkhaharta, Tum Thaakur Mere |\nApane Haath Uthaao, Dvaar Khada Tere ||",
        translation: "You are the protector of the helpless, the destroyer of physical and mental sorrow. You are my true master. Please lift Your blessings hand over me, who stands respectfully at Your gateway."
      },
      {
        number: "Verse 8",
        original: "विषय-विकार मिटाओ, पाप हरो देवा ।\nश्रद्धा-भक्ति बढ़ाओ, सन्तन की सेवा ॥",
        transliteration: "Vishay-Vikaar Mitaao, Paap Haro Deva |\nShraddha-Bhakti Badhaao, Santan Kee Seva ||",
        translation: "Please clear our sensory distractions, remove our negative thoughts, and lead us out of selfish desires, O Divine Spirit! Enhance our deep earnest trust and devotion, and direct our hands to serve saints and humanity."
      },
      {
        number: "Verse 9",
        original: "तन-मन-धन सब है तेरा, स्वामी सब कुछ है तेरा ।\nतेरा तुझको अर्पण, क्या लागे मेरा ॥",
        transliteration: "Tan-Man-Dhan Sab Hai Tera, Swami Sab Kuch Hai Tera |\nTera Tujhako Arpan, Kya Laage Mera ||",
        translation: "This physical body, this mind, and all worldly assets belong entirely to You, O Lord. Everything is Yours. Offering back to You what is already Yours; what is there that I can proudly claim as mine?"
      }
    ],
    commentary: "Om Jai Jagdish Hare represents the pinnacle of Sharanagati (complete spiritual surrender). Its closing lines encapsulate absolute non-attachment: recognizing that since our biological body and earthly assets are temporary gifts from the universe, clinging to them causes suffering. Surrendering ownership cleanses the heart, bringing instant peace."
  },
  gayatri_mantra: {
    key: "gayatri_mantra",
    title: "Gayatri & Shanti Mantras",
    originalTitle: "गायत्री मन्त्र",
    deity: "Savitr / Gayatri Devi",
    intro: "The supreme, ancient Vedic chant from the Rigveda (3.62.10). Chanted for mental illumination, the purification of the intellect, and ultimate spiritual awakening.",
    verses: [
      {
        number: "Mantra 1",
        original: "ॐ भूर्भुवः स्वः ।\nतत्सवितुर्वरेण्यं ।\nभर्गो देवस्य धीमहि ।\nधियो यो नः प्रचोदयात् ॥",
        transliteration: "Om Bhur Bhuvah Svah |\nTat Savitur Varenyam |\nBhargo Devasya Dheemahi |\nDhiyo Yo Nah Prachodayaat ||",
        translation: "We contemplate the glorious solar light of the Divine Creator; may that divine illumination inspire and guide our intellect on the right path."
      }
    ],
    commentary: "Regarded as the mother of the Vedas, the Gayatri Mantra is a universal petition for intellectual light. It does not pray for material assets or worldly victory, but for pure intelligence—asking that the universal light of consciousness coordinates our mind toward righteousness and truth."
  },
  maha_mrityunjaya: {
    key: "maha_mrityunjaya",
    title: "Maha Mrityunjaya Mantra",
    originalTitle: "महामृत्युंजय मंत्र",
    deity: "Lord Shiva",
    intro: "An ancient, life-restoring Rigvedic chant dedicated to Lord Shiva (Tryambaka). Chanted to overcome the deep psychological fear of death, change, physical illnesses, and worldly bondages.",
    verses: [
      {
        number: "Mantra 1",
        original: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥",
        transliteration: "Om Tryambakam Yajaamahe Sugandhim Pushti-Vardhanam |\nUrvaarukum-Iva Bandhanaan Mrityor Muksheeya Maa'mritaat ||",
        translation: "We worship the three-eyed Lord Shiva, who is fragrant and nourishes all beings. May he liberate us from the bondage of death and lead us to immortality, just as a ripe cucumber is effortlessly separated from its vine."
      }
    ],
    commentary: "The Maha Mrityunjaya Mantra represents the pinnacle of Vedic protection and healing. The ripe cucumber metaphor represents effortless spiritual detachment (Moksha)—allowing our physical attachment to fall away naturally when we mature into higher divine realization."
  },
  buddhist_compassion_mantra: {
    key: "buddhist_compassion_mantra",
    title: "Om Mani Padme Hum (Heart Sutra)",
    originalTitle: "ॐ मणि पद्मे हूँ",
    deity: "Avalokiteshvara (Compassion Buddha)",
    intro: "The most sacred and universally chanted mantra of Mahayana Buddhism, representing the ultimate fusion of wisdom, boundless compassion, and the transformation of suffering.",
    verses: [
      {
        number: "Chant 1",
        original: "ॐ मणि पद्मे हूँ ।",
        transliteration: "Om Mani Padme Hum",
        translation: "Praise to the jewel within the lotus! May our body, speech, and mind be purified and transformed into the clear, compassionate, and wise state of the Buddha."
      }
    ],
    commentary: "This mantra invokes Avalokiteshvara's dynamic compassion. In Buddhist philosophy, the jewel (Mani) represents the altruistic method (the intention to become enlightened for others), while the lotus (Padma) represents wisdom (emptiness/Shunyata), showing that through their unified practice, we dissolve suffering."
  },
  peace_prayer_st_francis: {
    key: "peace_prayer_st_francis",
    title: "Peace Prayer of St. Francis",
    originalTitle: "Prayer for Peace & Charity",
    deity: "Universal Spirit / The Beloved",
    intro: "A timeless Christian petition of profound humility and altruism, requesting to become an active channel of peace, hope, light, and selfless love in a divided world.",
    verses: [
      {
        number: "Verse 1",
        original: "Lord, make me an instrument of your peace.\nWhere there is hatred, let me sow love;\nWhere there is injury, pardon;\nWhere there is doubt, faith.",
        transliteration: "Domine, fac me instrumentum pacis tuae.\nUbi est odium, ibi seram amorem;\nUbi est iniuria, veniam;\nUbi est dubium, fidem.",
        translation: "Lord, make me an instrument of your peace: where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith."
      },
      {
        number: "Verse 2",
        original: "Where there is despair, hope;\nWhere there is darkness, light;\nAnd where there is sadness, joy.",
        transliteration: "Ubi est desperatio, spem;\nUbi est tenebrae, lucem;\nUbi est tristitia, gaudium.",
        translation: "Where there is despair, hope; where there is darkness, light; and where there is sadness, joy."
      },
      {
        number: "Verse 3",
        original: "O Divine Master, grant that I may not so much seek\nTo be consoled as to console;\nTo be understood as to understand;\nTo be loved as to love.",
        transliteration: "O Divine Divine, non tam quaeram\nConsolari quam consolari;\nIntelligi quam intelligere;\nAmari quam amare.",
        translation: "O Divine Master, grant that I may not so much seek to be consoled as to console; to be understood as to understand; to be loved as to love."
      }
    ],
    commentary: "Attributed to Saint Francis of Assisi, this classic prayer emphasizes that true peace is found in complete selflessness. By seeking to serve, comfort, and love rather than receive them, our personal ego is dissolved, culminating in a pristine state of spiritual unity."
  },
  ganesha_mantra: {
    key: "ganesha_mantra",
    title: "Shree Ganesh Mantra & Shlok",
    originalTitle: "श्री गणेश मन्त्र और श्लोक",
    deity: "Lord Ganesha",
    intro: "The auspicious beginning prayer from the Puranas dedicated to Lord Ganesha. Chanted for removing all physical and spiritual obstacles and ensuring the successful completion of any task.",
    verses: [
      {
        number: "Shlok 1",
        original: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
        transliteration: "Vakratunda Mahakaya Suryakoti Samaprabha |\nNirvighnam Kuru Me Deva Sarva-Kaaryeshu Sarvada ||",
        translation: "O Lord Ganesha of curved trunk and massive body, whose brilliance is equal to millions of suns! Please remove all obstacles from my path in all my endeavors, forever."
      },
      {
        number: "Mantra 2",
        original: "ॐ गं गणपतये नमः ॥",
        transliteration: "Om Gam Ganapataye Namah ||",
        translation: "Om, I bow down to the Lord of all Ganas (heavenly attendants), the destroyer of obstacles."
      }
    ],
    commentary: "Universally chanted at the commencement of any spiritual ceremony, study, or project, this sacred prayer evokes Lord Ganesha to purify the pathway. It guides the intellect to overcome difficulties with sweet determination and poise."
  },
  shiv_panchakshara: {
    key: "shiv_panchakshara",
    title: "Shree Shiv Panchakshara Stotram",
    originalTitle: "श्री शिव पंचाक्षर स्तोत्रम",
    deity: "Lord Shiva",
    intro: "Composed by Adi Shankaracharya and hosted on stotra.vastucart.in, this powerful stotram sings praises of Lord Shiva, centering on the five sacred syllables: Na-Ma-Shi-Va-Ya (Panchakshara). It is chanted to purify physical and psychological blockages.",
    verses: [
      {
        number: "Verse 1",
        original: "नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय ।\nनित्याय शुद्धाय दिगम्बराय तस्मै नकाराय नमः शिवाय ॥",
        transliteration: "Nagendra-Haaraya Trilochanaya Bhasmanga-Raagaya Maheshvaraya |\nNityaaya Shuddhaaya Digambaraya Tasmai Nakaaraya Namah Shivaaya ||",
        translation: "Salutations to Shiva, who has the king of snakes as His garland, who has three eyes, whose body is smeared with sacred ashes, and who is the supreme Lord. Eternal, absolutely pure, and clad in directions (digambara), bow to Him represented by the letter 'Na'."
      },
      {
        number: "Verse 2",
        original: "मन्दाकिनीसलिलचन्दनचर्चिताय नन्दीश्वरप्रमथनाथमहेश्वराय ।\nमन्दारपुष्पबहुपुष्पसुपूजिताय तस्मै मकाराय नमः शिवाय ॥",
        transliteration: "Mandaakinee-Salila-Chandana-Charchitaaya Nandeeshvara-Pramatha-Naatha-Maheshvaraya |\nMandaara-Pushpa-Bahu-Pushpa-Supoojitaaya Tasmai Makaaraya Namah Shivaaya ||",
        translation: "Smeared with the waters of Mandakini river and sandalpaste, worshipped by Nandi and other celestial beings, and adorned with Mandara flowers, bow to Him represented by the letter 'Ma'."
      },
      {
        number: "Verse 3",
        original: "शिवाय गौरीवदनाब्जवृन्दसूर्याय दक्षाध्वरनाशकाय ।\nश्रीनीलकण्ठाय वृषध्वजाय तस्मै शिकाराय नमः शिवाय ॥",
        transliteration: "Shivaaya Gauree-Vadanaabja-Vrinda-Sooryaaya Daksha-Adhvara-Naashakaaya |\nShree-Neelakanthaaya Vrishadhvajaaya Tasmai Shikaaraaya Namah Shivaaya ||",
        translation: "Bow to Shiva, who is the auspicious sunrise for the lotus face of Mother Gauri, the destroyer of Daksha's egoic sacrifice. Blue-throated (Neelakantha) and riding the bull signet, bow to Him represented by the letter 'Shi'."
      },
      {
        number: "Verse 4",
        original: "वसिष्ठकुम्भोद्भवगौतमार्यमुनीन्द्रदेवार्चितशेखराय ।\nचन्द्रार्कवैश्वानरलोचनाय तस्मै वकाराय नमः शिवाय ॥",
        transliteration: "Vasishtha-Kumbhodbhava-Gautama-Aarya-Muneendra-Deva-Archita-Shekharaaya |\nChandra-Arka-Vaishvaanara-Lochanaaya Tasmai Vakaaraya Namah Shivaaya ||",
        translation: "Worshipped by supreme sages like Vasishtha, Agastya, and Gautama, and crowned by the assemblies of devas; having the Sun, Moon, and Fire as His three eyes, bow to Him represented by the letter 'Va'."
      },
      {
        number: "Verse 5",
        original: "यक्षस्वरूपाय जटाधराय पिनाकहस्ताय सनातनाय ।\nदिव्याय देवाय दिगम्बराय तस्मै यकाराय नमः शिवाय ॥",
        transliteration: "Yaksha-Swaroopaaya Jataadharaaya Pinaka-Hastaaya Sanaatanaaya |\nDivyaaya Devaaya Digambaraaya Tasmai Yakaaraya Namah Shivaaya ||",
        translation: "Who assumes the form of a Yaksha (spiritual protector), who has matted locks, who holds the Pinaka bow in His hands, and who is eternal. Radiant, divine Spirit clad in the directions, bow to Him represented by the letter 'Ya'."
      },
      {
        number: "Verse 6",
        original: "पञ्चाक्षरमिदं पुण्यं यः पठेच्छिवसन्निधौ ।\nशिवलोकमवाप्नोति शिवेन सह मोदते ॥",
        transliteration: "Panchaksharam-Idam Punyam Yah Pathech-Shiva-Sannidhau |\nShivalokam-Avaapnoti Shivena Saha Modate ||",
        translation: "Whoever recites this holy Panchakshara hymn in the proximity of Lord Shiva, achieves the divine realm of Shiva (Shivaloka) and rejoices in everlasting bliss with Him."
      }
    ],
    commentary: "The Panchakshara is the sound representation of Shiva's five aspects of cosmic operations: creation, preservation, destruction, concealing grace, and revealing grace. Reciting it purifies the five senses and aligns our internal micro-habitat with macro-cosmic law."
  },
  lakshmi_ashtakam: {
    key: "lakshmi_ashtakam",
    title: "Shree Mahalaxmi Ashtakam",
    originalTitle: "श्री महालक्ष्मी अष्टकम",
    deity: "Goddess Lakshmi",
    intro: "An eight-verse hymn from the Padma Purana, hosted on stotra.vastucart.in and chanted to praise Goddess Lakshmi, the primary embodiment of spiritual wealth, luxury, prosperity, and auspicious beauty.",
    verses: [
      {
        number: "Verse 1",
        original: "नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते ।\nशङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Namastestu Mahaamaye Shreepithe Surapoojite |\nShankha-Chakra-Gadaa-Haste Mahaalakhshmi Namostu Te ||",
        translation: "Salutations to You, O Mahamaya (the Great Illusionist), who dwells on the sacred throne of Shri, and is worshipped by all the deities. You hold the conch, discus, and mace in Your hands; O Lordly Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 2",
        original: "नमस्ते गरुड़ारूढ़े कोलासुरभयंकरि ।\nसर्वपापहरे देवि महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Namaste Garuda-Aaroodhe Kola-Asura-Bhayankari |\nSarva-Paapa-Hare Devi Mahaalakhshmi Namostu Te ||",
        translation: "Salutations to You who rides the celestial eagle (Garuda) and who dispels the fear of the demon Kola. Destroyer of all sins, O Goddess Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 3",
        original: "सर्वज्ञे सर्ववरदे सर्वदुष्टभयंकरि ।\nसर्वदुःखहरे देवि महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Sarvajne Sarva-Varade Sarva-Dushta-Bhayankari |\nSarva-Duhkha-Hare Devi Mahaalakhshmi Namostu Te ||",
        translation: "Salutations to You, O knower of all things, who bestows all boons, and who dispels the fear of all wicked forces. Destroyer of all miseries, O Goddess Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 4",
        original: "सिद्धिबुद्धिप्रदे देवि bhuktiमुक्तिप्रदायिनि ।\nमन्त्रमूर्ते सदा देवि महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Siddhi-Buddhi-Prade Devi Bhukti-Mukti-Pradaayinee |\nMantra-Moorte Sada Devi Mahaalakhshmi Namostu Te ||",
        translation: "Giver of success, intelligence, enjoyment, and liberation; ever-residing in the sacred mantras, O Goddess Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 5",
        original: "आद्यन्तरहिते देवि आद्यशक्ते महेश्वरि ।\nयोगजे योगसम्भूते महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Aadya-Anta-Rahite Devi Aadya-Shakte Maheshvari |\nYogaje Yoga-Sambhute Mahaalakhshmi Namostu Te ||",
        translation: "O Goddess who is without beginning or end, the primal energy and supreme sovereign; born of yoga and realized through meditation, O Goddess Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 6",
        original: "स्थूलसूक्ष्ममहारौद्रे महाशक्ते महोदरे ।\nमहापापहरे देवि महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Sthoola-Sukshma-Mahaaraudre Mahaashakte Mahodare |\nMahaa-Paapa-Hare Devi Mahaalakhshmi Namostu Te ||",
        translation: "You are both gross and subtle, fierce and powerful, possessing great energy and stomach that holds the cosmos. Destroyer of the heaviest sins, O Goddess Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 7",
        original: "पद्मासनस्थिते देवि परब्रह्मस्वरूपिणी ।\nपरमेशि जगन्मातार्महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Padma-Asana-Sthite Devi Para-Brahma-Swaroopinee |\nParameshi Jagan-Maatar-Mahaalakhshmi Namostu Te ||",
        translation: "Seated on a lotus throne, you are the absolute transcendental Brahman. Divine Sovereign, Mother of the entire universe, O Goddess Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 8",
        original: "श्वेताम्बरधरे देवि नानालङ्कारभूषिते ।\nजगत्स्थिते जगन्मातार्महालक्ष्मि नमोऽस्तु ते ॥",
        transliteration: "Shveta-Ambara-Dhare Devi Naana-Alankaara-Bhooshite |\nJagat-Sthite Jagan-Maatar-Mahaalakhshmi Namostu Te ||",
        translation: "Clad in pure white garments, adorned with magnificent jewels, residing across the universe, Mother of the entire creation, O Goddess Mahalaxmi, I bow respectfully to You."
      },
      {
        number: "Verse 9",
        original: "महालक्ष्म्यष्टकं स्तोत्रं यः पठेद्भक्तिमान्नरः ।\nसर्वसिद्धिमवाप्नोति राज्यं प्राप्नोति सर्वदा ॥",
        transliteration: "Mahaalakhshmy-Ashtakam Stotram Yah Pathed-Bhaktimaan Narah |\nSarva-Siddhim-Avaapnoti Raajyam Praapnoti Sarvada ||",
        translation: "Sincere seekers who regularly recite this Mahalakshmi Ashtakam stotra with deep devotion obtain all spiritual successes and sovereign abundance forever."
      }
    ],
    commentary: "According to Vedic tradition, Lakshmi represents both physical prosperity (dhana) and inner values (vibhuti). The stotram teaches that prosperity is a divine energy that must be worshiped with purity and integrity to remain sustainable and auspicious."
  },
  sankat_nashan_ganesh_stotra: {
    key: "sankat_nashan_ganesh_stotra",
    title: "Sankat Nashan Ganesh Stotram",
    originalTitle: "संकटनाशन गणेश स्तोत्रम्",
    deity: "Lord Ganesha",
    intro: "Sourced from the Narada Purana and hosted on stotra.vastucart.in, this prayer was composed by Sage Narada. It lists the twelve auspicious names of the remover of obstacles, ensuring freedom from hardships, blockages, and anxieties when chanted with sincere devotion.",
    verses: [
      {
        number: "Verse 1",
        original: "प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम् ।\nभक्तावासं स्मरेन्नित्यमायुःकामार्थसिद्धये ॥",
        transliteration: "Pranamya Shirasa Devam Gauriputram Vinayakam |\nBhaktavasam Smaren-Nityam-Ayuh-Kaamartha-Siddhaye ||",
        translation: "Bowing down his head, the devotee should daily remember Gauri's son Lord Vinayaka, who resides in the hearts of His devotees, for obtaining long life, deep desires, and prospective prosperity."
      },
      {
        number: "Verse 2",
        original: "प्रथमं वक्रतुण्डं च एकदन्तं द्वितीयकम् ।\nतृतीयं कृष्णपिङ्गाक्षं गजवक्त्रं चतुर्थकम् ॥",
        transliteration: "Prathamam Vakratundam Cha Ekadantam Dvitiyakam |\nTritiyam Krishna-Pingaksham Gaja-Vaktram Chaturthakam ||",
        translation: "First, He is called Curved-Trunk (Vakratunda); second, Single-Tusked (Ekadanta); third, Dark-Red-Eyed (Krishna-Pingaksha); and fourth, Elephant-Headed (Gajavaktra)."
      },
      {
        number: "Verse 3",
        original: "लम्बोदरं पञ्चमं च षष्ठं विकटमेव च ।\nसप्तमं विघ्नराजेन्द्रं धूम्रवर्णं तथाष्टमम् ॥",
        transliteration: "Lambodaram Panchamam Cha Shashtham Vikatam-Eva Cha |\nSaptamam Vighnarajendram Dhumravarnam Tathashtamam ||",
        translation: "Fifth, He is the Pot-Bellied (Lambodara); sixth, the Formidable (Vikata); seventh, Ruler of Obstacles (Vighnarajendra); and eighth, Smoke-Colored (Dhumravarna)."
      },
      {
        number: "Verse 4",
        original: "नवमं भालचन्द्रं च दशमं तु विनायकम् ।\nएकादशं गणपतिं द्वादशं तु गजाननम् ॥",
        transliteration: "Navamam Bhalachandram Cha Dashamam Tu Vinayakam |\nEkadasham Ganapatim Dvadasham Tu Gajananam ||",
        translation: "Ninth, He is the Moon-Crowned (Bhalachandra); tenth, the Great Leader (Vinayaka); eleventh, Lord of the Divine Attendants (Ganapati); and twelfth, Elephant-Face (Gajanana)."
      }
    ],
    commentary: "Daily chanting of these twelve sovereign names of Lord Ganesha at sunrise, noon, and sunset removes all obstacles, grants academic and intellectual excellence, and ensures peace and prosperity in all endeavors."
  },
  kanakadhara_stotram: {
    key: "kanakadhara_stotram",
    title: "Sri Kanakadhara Stotram",
    originalTitle: "श्री कनकधारा स्तोत्रम्",
    deity: "Goddess Lakshmi",
    intro: "Composed by spiritual master Adi Shankaracharya and hosted on stotra.vastucart.in, this sacred prayer moved Goddess Lakshmi to shower a rain of golden gooseberries to alleviate the severe poverty of a selfless woman. It is chanted to invoke grace, material security, and the healing of poor mindsets.",
    verses: [
      {
        number: "Verse 1",
        original: "अङ्गं हरेः पुलकभूषणमाश्रयन्ती\nभृङ्गाङ्गनेव मुकुलाभरणं तमालम् ।\nअङ्गीकृताखिलविभूतिरपांगलीला\nमांगल्यदास्तु मम मन्मथदेवतायाः ॥",
        transliteration: "Angam Hareh Pulaka-Bhushanam-Ashrayantee\nBhriganganeva Mukulabharanam Tamalam |\nAngeekritakhila-Vibhootir-Apanga-Leela\nMangalyadastu Mama Manmatha-Devatayah ||",
        translation: "Just as a female bee surrounds the fresh flower buds of a dark Tamala tree, Goddess Lakshmi’s sidelong glances rest charmingly upon Lord Hari's thrilled, ecstatic body. May those auspicious glances, containing all cosmic treasures, bestow supreme blessings upon my life."
      },
      {
        number: "Verse 2",
        original: "मुग्धा मुहुर्विदधती वदने मुरारेः\nप्रेमत्रपाप्रणिहितानि गतागतानि ।\nमाला दृशोर्मधुकरीव महोत्पले या\nसा मे श्रियं दिशतु सागरसम्भवायाः ॥",
        transliteration: "Mugdha Muhur-Vidadhatee Vadane Murareh\nPrematrapapranihitani Gatagatani |\nMala Drishor-Madhukareeva Mahotpale Ya\nSa Me Shriyam Dishatu Sagara-Sambhavayah ||",
        translation: "Like a honeybee humming back and forth over a magnificent blue lotus, Her eyes dart shyly towards the sweet face of Murari, full of love and modest grace. May that sweet gaze of Goddess Lakshmi, daughter of the ocean, guide abundant streams of prosperity to me."
      },
      {
        number: "Verse 3",
        original: "दद्याद्दयानुपवनो द्रविणाम्बुधाराम्\nअस्मिन्नकिञ्चनविहङ्गशिशौ विषण्णें ।\nदुष्कर्मघर्ममपनीय चिराय दूरं\nनारायणप्रणयिनीनयनाम्वुवाहः ॥",
        transliteration: "Dadyad-Dayanupavano Dravinambhudharam\nAsminn-Akinchana-Vihanga-Shishau Vishanne |\nDushkarma-Gharmam-Apaneeya Chiraya Dooram\nNayanambuvahah ||",
        translation: "I am like a helpless young bird scorched by the hot summer of past bad deeds. May the shower-carrying cloud of the eyes of Goddess Lakshmi, beloved of Narayana, driven by the gentle breeze of Her compassion, pour a beautiful stream of gold to refresh my life."
      }
    ],
    commentary: "Kanakadhara literally means 'gold-shower'. The hymn teaches that true prosperity is an energetic state of grace that flows spontaneously into lives aligned with gratitude, purity, and absolute self-surrender."
  },
  aditya_hrudaya_stotra: {
    key: "aditya_hrudaya_stotra",
    title: "Aditya Hrudaya Stotram",
    originalTitle: "आदित्यहृदयम् स्तोत्रम्",
    deity: "Lord Surya (Sun God)",
    intro: "Derived from the Valmiki Ramayana and hosted on stotra.vastucart.in, this solar anthem was taught by Sage Agastya to Lord Rama on the battlefield of Lanka during a moment of exhaustion. It invokes Surya, the cosmic source of light, to gain triumph over enemies, mental doubts, health issues, and inner shadows.",
    verses: [
      {
        number: "Verse 1",
        original: "ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम् ।\nरावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम् ॥",
        transliteration: "Tato Yuddha-Parishrantam Samare Chintaya Sthitam |\nRavanam Chagrato Drishtva Yuddhaya Samupasthitam ||",
        translation: "Seeing Lord Rama completely fatigued and standing deep in contemplating thoughts on the fierce battlefield, while the demon king Ravana stood fully prepared in front of Him for the combat."
      },
      {
        number: "Verse 2",
        original: "दैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम् ।\nउपागम्याब्रवीद्राममगमस्त्यो भगवान् ऋषिः ॥",
        transliteration: "Daivataish-cha Samagamya Drashtum-Abhyagato Ranam |\nUpagamyabraveed-Ramam-Agastyo Bhagavan Rishih ||",
        translation: "The revered Sage Agastya, who had gathered along with other celestial demigods to witness the cosmic duel, stepped forward, approached Lord Rama, and spoke these powerful words."
      },
      {
        number: "Verse 3",
        original: "राम राम महाबाहो शृणु गुह्यं सनातनम् ।\nयेन सर्वानरीन् वत्स समरे विजयिष्यसे ॥",
        transliteration: "Rama Rama Mahaabaho Shrinuri Guhyam Sanatanam |\nYena Sarvan-Areen Vatsa Samare Vijayishyase ||",
        translation: "'O Rama, O mighty-armed hero! Please listen attentively to this ancient, most confidential, eternal secret, through which you will comfortably conquer all your internal and external enemy forces on the battlefield.'"
      },
      {
        number: "Verse 4",
        original: "आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् ।\nजयावहं जपेन्नित्यमक्षय्यं परमं शिवम् ॥",
        transliteration: "Aditya-Hrudayam Punyam Sarva-Shatru-Vinashanam |\nJayavaham Japen-Nityam-Akshayyam Paramam Shivam ||",
        translation: "'This supreme prayer is called the Aditya Hrudayam (the Heart of the Sun). It is holy, brings absolute victory, eliminates all doubts/enemies, is imperishable, and bestows supreme peace and auspiciousness when chanted daily.'"
      }
    ],
    commentary: "The Aditya Hrudayam is a highly revered tool for self-realization, robust physical health, and razor-sharp intellect. Daily recitation builds clean leadership qualities, courage and dissolves dark anxieties."
  },
  madhurashtakam: {
    key: "madhurashtakam",
    title: "Vrindavan Madhurashtakam",
    originalTitle: "मधुराष्टकम् स्तोत्रम्",
    deity: "Lord Krishna",
    intro: "Composed by spiritual philosopher Srimad Vallabhacharya and hosted on stotra.vastucart.in, this sweet eight-verse octet celebrates the supreme sweetness of Lord Krishna, declaring that everything associated with the bliss-lord is absolute nectar (madhuryam).",
    verses: [
      {
        number: "Verse 1",
        original: "अधरं मधुरं वदनं मधुरं नयनं मधुरं हसितं मधुरम् ।\nहृदयं मधुरं गमनं मधुरं मधुराधिपतेरखिलं मधुरम् ॥",
        transliteration: "Adharam Madhuram Vadanam Madhuram Nayanam Madhuram Hasitam Madhuram |\nHridayam Madhuram Gamanam Madhuram Madhuradhipater-Akhilam Madhuram ||",
        translation: "His lips are sweet, His face is sweet, His eyes are sweet, His smile is charmingly sweet. His heart is sweet, His gait is sweet; absolutely everything about the Emperor of Sweetness is sweet!"
      },
      {
        number: "Verse 2",
        original: "वचनं मधुरं चरितं मधुरं वसनं मधुरं वलितं मधुरम् ।\nचलितं मधुरं भ्रमितं मधुरं मधुराधिपतेरखिलं मधुरम् ॥",
        transliteration: "Vachanam Madhuram Charitam Madhuram Vasanam Madhuram Valitam Madhuram |\nChalitam Madhuram Bhramitam Madhuram Madhuradhipater-Akhilam Madhuram ||",
        translation: "His words are sweet, His character is sweet, His garments are sweet, His graceful posture is sweet. His movement is sweet, His wandering is sweet; absolutely everything about the Emperor of Sweetness is sweet!"
      },
      {
        number: "Verse 3",
        original: "वेणुर्मधुरो रेणुर्मधुरः पाणिर्मधुरः पादौ मधुरौ ।\nनृत्यं मधुरं सख्यं मधुरं मधुराधिपतेरखिलं मधुरम् ॥",
        transliteration: "Venur-Madhuro Renur-Madhurah Panir-Madhurah Paadau Madhurau |\nNrityam Madhuram Sakhyam Madhuram Madhuradhipater-Akhilam Madhuram ||",
        translation: "His flute is sweet, His holy dust is sweet, His hands are sweet, His feet are sweet. His dancing is sweet, His loving friendship is sweet; absolutely everything about the Emperor of Sweetness is sweet!"
      }
    ],
    commentary: "While other scriptures portray divinity with heavy rules and awe-striking grandeur, the Madhurashtakam celebrates the intimate, charming, and accessible sweetness of the divine, invoking absolute joy and unconditional love."
  },
  kunj_bihari_aarti: {
    key: "kunj_bihari_aarti",
    title: "Lord Krishna Aarti (Kunj Bihari)",
    originalTitle: "आरती कुंजबिहारी की (कृष्ण आरती)",
    deity: "Lord Krishna",
    intro: "A dynamic and immensely sweet north Indian devotional song sung in adoration of Lord Krishna (Kunj Bihari), praising His divine play, flute melodies, and infinite charm.",
    verses: [
      {
        number: "Refrain",
        original: "आरती कुञ्जबिहारी की, श्री गिरिधर कृष्णमुरारी की ॥\nआरती कुञ्जबिहारी की, श्री गिरिधर कृष्णमुरारी की ॥",
        transliteration: "Aarti Kunj Bihaari Kee, Shree Giridhar Krishna Muraari Kee ||\nAarti Kunj Bihaari Kee, Shree Giridhar Krishna Muraari Kee ||",
        translation: "We perform the sweet aarti of Lord Kunj Bihari, the divine lifter of Govardhana Hill, the enchanting Krishna Murari."
      },
      {
        number: "Verse 1",
        original: "गले में बैजन्ती माला, बजावै मुरली मधुर बाला ।\nश्रवण में कुण्डल झलकाला, नन्द के आनन्द नन्दलाला ॥",
        transliteration: "Gale Mein Baijanti Maala, Bajaavai Murali Madhur Baala |\nShravan Mein Kundal Jhalkaa-la, Nand Ke Aanand Nandlaala ||",
        translation: "Adorned with a woodland wildflower garland, He plays sweet melodies on His divine flute. Wearing brilliant earrings, He is the source of joy to Nanda, the precious son of Nanda."
      },
      {
        number: "Verse 2",
        original: "कनकमय मोर मुकुट बिलसै, देवता दरसन को तरसैं ।\nगगन सों सुमन बरसि रहै, बजति मुरचंग चंग सङ्ग सहनाई ॥",
        transliteration: "Kanakamaya Mora Mukuta Bilasai, Devataa Darasana Ko Tarasai |\nGagana Son Sumana Barasi Rahai, Bajati Murachanga Changa Sanga Shahanaai ||",
        translation: "The golden peacock crown shimmers on His head, and the demigods yearn to catch a glimpse of His beauty. Flowers rain down from the sky, accompanied by the sweet sounds of the harp, drums, and flutes."
      },
      {
        number: "Verse 3",
        original: "जहाँ से प्रगट भई गङ्गा, कलुष कलिहारिणी श्रीगङ्गा ।\nस्मरण किये होत मोह भङ्गा, बसति शिव जटा मुकुट के माहीं ॥",
        transliteration: "Jahaan Se Pragata Bhaee Gangaa, Kalusha Kalihaarinee Shree Gangaa |\nSmarana Kiye Hota Moha Bhangaa, Basati Shiva Jataa Mukuta Ke Maahee ||",
        translation: "From whose lotus feet emerged the holy river Ganges, the purifier of Kaliyuga's sins. Just remembering her dissolves all delusion, as she resides in the matted locks of Lord Shiva."
      },
      {
        number: "Verse 4",
        original: "वृन्दावन विहरत बनवारी, मुख चमक चन्द्र ते न्यारी ।\nकुञ्ज गलिन में फिरत बिहारी, राधिका रमण कुञ्ज बिहारी की ॥",
        transliteration: "Vrindavana Viharata Banawaaree, Mukha Chamaka Chandra Te Nyaaree |\nKunja Galina Mein Phirata Bihaaree, Radhika Ramana Kunja Bihaaree Kee ||",
        translation: "The Lord of forests wanders playfully through Vrindavan, the brightness of His face eclipsing the moon itself. Wandering through the narrow lanes of Vrindavan, the beloved of Radhika is the Lord of the groves."
      }
    ],
    commentary: "Kunj Bihari literally means 'the one who wanders and plays in the sacred groves (Kunj) of Vrindavan'. Singing this Aarti opens our emotional centers, invoking the mood of Madhurya Bhakti (a deeply intimate, sweet love for the Divine)."
  },
  ayat_al_kursi: {
    key: "ayat_al_kursi",
    title: "Ayat al-Kursi (The Throne Verse)",
    originalTitle: "آية الكरसी",
    deity: "Allah (The Almighty)",
    intro: "Surah Al-Baqarah (2:255). It is the most powerful and well-known verse from the Holy Qur'an, representing Allah's absolute sovereignty, supreme protection, omniscience, and cosmic dominion. Recited globally on MyIslam.org for daily safety and spiritual clarity.",
    verses: [
      {
        number: "Verse 255",
        original: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا नَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمं وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۥٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّमَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ",
        transliteration: "Allahu la ilaha illa huwal hayyul qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi-idhnihi, ya'lamu ma baina aidihim wa ma khalfahum, wa la yuhituna bi-shay'im-min 'ilmihi illa bima sha'a, wasi'a kursiyyuhus-samawati wal-arda wa la ya'uduhu hifzuhuma, wa huwal 'aliyul-'adheem.",
        translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great."
      }
    ],
    commentary: "Deeply celebrated on MyIslam.org, Ayat al-Kursi contains ten self-contained majestic declarations. It reveals that the Creator never tires, stands unaffected by fatigue, and spans all realms of cosmos. Reciting this verse after every obligatory prayer serves as a key to heaven."
  },
  sayyidul_istighfar: {
    key: "sayyidul_istighfar",
    title: "Sayyidul Istighfar (Master Forgiveness)",
    originalTitle: "سيد الاستغفار",
    deity: "Allah (The Merciful)",
    intro: "The ultimate and most comprehensive supplication for seeking forgiveness and mercy from Allah. The Prophet Muhammad (PBUH) taught that anyone who recites this with sincere conviction during the day or evening and passes away will be from the dwellers of Paradise.",
    verses: [
      {
        number: "Supplication",
        original: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْफِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        transliteration: "Allahumma Anta Rabbi, la ilaha illa Anta. Khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata't. A'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayya, wa abu'u laka bidhanbi, faghfirli fa-innahu la yaghfirudh-dhunuba illa Anta.",
        translation: "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I remain faithful to Your covenant and my promise to You as much as I can. I seek refuge in You from all the evil I have done. I acknowledge before You all the blessings You have bestowed upon me, and I confess to You my sins. So forgive me, for indeed none can forgive sins except You."
      }
    ],
    commentary: "Featured on MyIslam.org as 'The Leader of Seeking Forgiveness', Sayyidul Istighfar acknowledges our human shortcomings, the covenant we share with the Divine, and the absolute reality that no one can wash away transgressions except the supreme Source of Mercy."
  },
  rabbana_duas: {
    key: "rabbana_duas",
    title: "Rabbana Duas (Quranic Petitions)",
    originalTitle: "ربنا دعاء",
    deity: "Allah (The Bestower)",
    intro: "A collection of beautiful prayers from the Holy Qur'an starting with 'Rabbana' (Our Lord). These capture the essence of perfect submission, asking for goodness in both worlds, steadfastness in faith, and preservation of spiritual purity.",
    verses: [
      {
        number: "Part 1 (Surah Al-Baqarah, 2:201)",
        original: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar.",
        translation: "Our Lord, grant us good in this world and good in the Hereafter, and protect us from the torment of the Fire."
      },
      {
        number: "Part 2 (Surah Ali 'Imran, 3:8)",
        original: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ",
        transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaitana wa hab lana mil-ladunka rahmah, innaka Antal-Wahhab.",
        translation: "Our Lord, let not our hearts deviate after You have guided us, and grant us from Yourself mercy. Indeed, You are the Bestower."
      }
    ],
    commentary: "MyIslam.org presents these Rabbana prayers as multi-factored life formulas. Part 1 strikes a unique equilibrium: it does not reject the beauty of physical life, but requests divine goodness in both mortal existence and the infinite spiritual afterlife."
  },
  prophet_yunus_dua: {
    key: "prophet_yunus_dua",
    title: "Dua of Prophet Yunus (Ayat al-Karimah)",
    originalTitle: "دعاء يونس عليه السلام",
    deity: "Allah (The Sublime)",
    intro: "Surah Al-Anbiya (21:87). The deep soul-stirring invocation uttered by Prophet Yunus (Jonah) while inside the belly of the whale. It is highly valued for overcoming grief, emotional distress, helplessness, and critical circumstances.",
    verses: [
      {
        number: "Ayat Alyunusiya",
        original: "لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبْحَٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّٰلِمِينَ",
        transliteration: "La ilaha illa Anta subhanaka inni kuntu minaz-zalimin.",
        translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers."
      }
    ],
    commentary: "MyIslam.org emphasizes that this prayer has three powerful stages of spiritual healing: first, declaring absolute monotheistic truth (Tawheed); second, purifying and glorifying Allah (Tasbih); third, entering sincere self-awareness and accountability (repentance). It is an immediate antidote to depression and desperation."
  },
  rabbi_zidni_ilman: {
    key: "rabbi_zidni_ilman",
    title: "Dua for Knowledge & Speech",
    originalTitle: "دعاء لزيادة العلم وفصاحة اللسان",
    deity: "Allah (The All-Knowing)",
    intro: "Two beautiful Quranic prayers combined (Surah Taha, 114 & Surah Taha, 25-28). Prophetic requests for the expansion of chest (calmness), the simplification of difficult tasks, eloquence in speech, and the continuous enhancement of intellectual capability and knowledge.",
    verses: [
      {
        number: "Part 1 (Intellect)",
        original: "رَّبِّ زِدْنِى عِلْمًا",
        transliteration: "Rabbi zidnee 'ilman",
        translation: "My Lord, increase me in knowledge."
      },
      {
        number: "Part 2 (Communication)",
        original: "قَالَ रَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي",
        transliteration: "Rabbij-rah lee sadree, wa yassir lee amree, wahlul 'uqdatan mil lisanee, yafqahoo qawlee.",
        translation: "Moses said: My Lord, expand for me my chest, and ease for me my task, and untie the knot from my tongue that they may understand my speech."
      }
    ],
    commentary: "Frequently sought on MyIslam.org by students and scholars alike, these prayers teach us that communication is the primary bridge of empathy, and that true wisdom requires active seeking from the source of all ultimate intellect."
  },
  amazing_grace: {
    key: "amazing_grace",
    title: "Amazing Grace",
    originalTitle: "Amazing Grace! How Sweet the Sound",
    deity: "The Almighty God / Savior",
    intro: "One of the most recognizable and beloved Christian hymns in human history, written in 1772 by the English poet and Anglican clergyman John Newton. It beautifully articulates the Christian theology of redemption, divine favor, and grace bestowed upon a believer irrespective of their past deeds. Retrieved in full via Hymnary.org.",
    verses: [
      {
        number: "Verse 1",
        original: "Amazing grace! (how sweet the sound)\nThat saved a wretch like me!\nI once was lost, but now am found,\nWas blind, but now I see.",
        transliteration: "Amazing grace! how sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found,\nWas blind, but now I see.",
        translation: "Divine unmerited favor is sweet to hear, delivering and rescuing a lost soul from hopelessness, opening the spiritual eyes to perceive divine truth."
      },
      {
        number: "Verse 2",
        original: "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed!",
        transliteration: "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed!",
        translation: "Divine grace instills a holy, loving reverence of God in the heart while simultaneously dispelling all mortal anxieties, appearing incredibly precious from the very moment of faith."
      },
      {
        number: "Verse 3",
        original: "Through many dangers, toils, and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.",
        transliteration: "Through many dangers, toils, and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.",
        translation: "Through life's countless spiritual and material trials, we have been sustained entirely by divine grace which promises to lead us safely to our ultimate spiritual home."
      },
      {
        number: "Verse 4",
        original: "The Lord has promised good to me,\nHis word my hope secures;\nHe will my shield and portion be\nAs long as life endures.",
        transliteration: "The Lord has promised good to me,\nHis word my hope secures;\nHe will my shield and portion be\nAs long as life endures.",
        translation: "The Creator has guaranteed benevolent blessings, securing hope through His sacred Word; He acts as a protecting shield and divine inheritance throughout earthly life."
      },
      {
        number: "Verse 5",
        original: "When we've been there ten thousand years,\nBright shining as the sun,\nWe've no less days to sing God's praise\nThan when we'd first begun.",
        transliteration: "When we've been there ten thousand years,\nBright shining as the sun,\nWe've no less days to sing God's praise\nThan when we'd first begun.",
        translation: "In the eternal realm, even after ten thousand years of continuous radiant existence like the sun, our opportunity to glorify and praise God remains as infinite as the day we began."
      }
    ],
    commentary: "Featured in thousands of hymnals on Hymnary.org, 'Amazing Grace' is a universal anthem of regeneration and spiritual awakening. Newton composed it from personal experience as a former slave-ship captain who experienced a dramatic ocean-storm conversion, finding deep liberation and dedication to abolishing the slave trade thereafter."
  },
  be_thou_my_vision: {
    key: "be_thou_my_vision",
    title: "Be Thou My Vision",
    originalTitle: "Rop tú mo baile (Ancient Irish)",
    deity: "The High King of Heaven",
    intro: "An extraordinary 8th-century traditional Irish Christian hymn translated to English by Eleanor Hull. It centers on the spiritual desire to have God as one's singular focus, absolute vision, intellectual companion, and ultimate divine inheritance above all material riches and temporary worldly praise.",
    verses: [
      {
        number: "Verse 1",
        original: "Be Thou my Vision, O Lord of my heart;\nNaught be all else to me, save that Thou art;\nThou my best Thought, by day or by night,\nWaking or sleeping, Thy presence my light.",
        transliteration: "Rop tú mo baile, a Choimdiu chridi:\nNí ní nách aili acht Rí secht nime.\nRop tú mo menma i llo ocus i n-aidche;\nFil gnúis t'ecna damsa, a Rí gile.",
        translation: "May the Lord be my absolute inner vision and focus. Let nothing else satisfy or distract me except Him; may His divine presence be my constant light day and night, during waking and sleep."
      },
      {
        number: "Verse 2",
        original: "Be Thou my Wisdom, and Thou my true Word;\nI ever with Thee and Thou with me, Lord;\nThou my great Father, I Thy true son;\nThou in me dwelling, and I with Thee one.",
        transliteration: "Rop tú mo thanga, rop tú mo threasgell;\nRop missi t'aicill, ropu t'érlam.\nRop tú mo datha, robam do daltha;\nRop tú mo dind athair, robam do chlandsa.",
        translation: "Be my ultimate spiritual wisdom and eternal guiding Word. Let me live in deep spiritual union with Thee, as a beloved child of the Heavenly Father, dwelling in oneness."
      },
      {
        number: "Verse 3",
        original: "Riches I heed not, nor man's empty praise,\nThou mine Inheritance, now and always:\nThou and Thou only, first in my heart,\nHigh King of Heaven, my Treasure Thou art.",
        transliteration: "Ní accsa saidbhris ná creic in t-saogail;\nTógaibh mo chroidhe d'adhradh t'óenghráidh.\nRop tú mo thriath, rop tú mo thoba;\nRop tú mo thaisgidh, m'oirdhearcus rómha.",
        translation: "I completely disregard material wealth and empty human flattery. May Thee alone be my eternal inheritance and the supreme priority of my heart—the true treasure."
      },
      {
        number: "Verse 4",
        original: "High King of Heaven, my victory won,\nMay I reach Heaven's joys, O bright Heaven's Sun!\nHeart of my own heart, whatever befall,\nStill be my Vision, O Ruler of all.",
        transliteration: "A Rí na n-uile, iar mbuadh is iar mbuaidh;\nTabhair damh neamh d'fhaicsin tar éis mo chuairt.\nA ghrian mo chroidhe, pé sgríobhas mo tharadh;\nBí-se mo radharc, a thriath m'anama.",
        translation: "Supreme King of the universe, once victory is won, grant me the eternal blissful presence of God's radiant Sun. Whatever happens in life, remain my singular vision and the continuous guard of my soul."
      }
    ],
    commentary: "According to Hymnary.org documentation, this Gaelic prayer dates back to Saint Dallán Forgaill in the early Middle Ages. The hymn employs vivid Celtic metaphor ('High King', 'Shield', 'Sword-pantheon') representing Christ as the spiritual warrior-protector, inspiring deep contemplative fortitude and resistance to worldly greed."
  },
  holy_holy_holy: {
    key: "holy_holy_holy",
    title: "Holy, Holy, Holy! Lord God Almighty",
    originalTitle: "Sanctus, Sanctus, Sanctus (Latin)",
    deity: "The Holy Trinity (God in Three Persons)",
    intro: "A majestic, widely celebrated Anglican hymn written by Reginald Heber in 1826 and set to the famous tune 'NICAEA' by John Bacchus Dykes. Inspired by the heavenly adoration depicted in the Book of Revelation (4:8-11), it is a powerful declaration of God's perfect purity, power, love, and timeless sovereign nature.",
    verses: [
      {
        number: "Verse 1",
        original: "Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to thee.\nHoly, holy, holy! Merciful and mighty!\nGod in three persons, blessed Trinity!",
        transliteration: "Sanctus, Sanctus, Sanctus, Dominus Deus Omnipotens!\nMane surgens, carmen nostrum ascendet ad Te.\nSanctus, Sanctus, Sanctus, misericors et potens!\nDeus in tribus Personis, benedicta Trinitas!",
        translation: "Pure, undefiled, and thrice holy is the Almighty Lord! Our praise rises early in the morning. God is boundless in mercy and infinite in power, existing in beautiful triune harmony."
      },
      {
        number: "Verse 2",
        original: "Holy, holy, holy! All the saints adore thee,\ncasting down their golden crowns around the glassy sea;\ncherubim and seraphim falling down before thee,\nwhich wert, and art, and evermore shalt be.",
        transliteration: "Sanctus, Sanctus, Sanctus! Omnes sancti Te adorant,\nproiciunt coronas aureas circum mare vitreum;\nCherubim et Seraphim prosternuntur ante Te,\nqui eras, et es, et futurus es in aeternum.",
        translation: "All saints in the celestial realm adore Thee, casting down their accomplishments before the sea of glass. Angelic hosts bend low before the One who was, who is, and who is to come."
      },
      {
        number: "Verse 3",
        original: "Holy, holy, holy! Though the darkness hide thee,\nthough the eye of sinful man thy glory may not see,\nonly thou art holy; there is none beside thee,\nperfect in power, in love, and purity.",
        transliteration: "Sanctus, Sanctus, Sanctus! Licet caligo Te celet,\nlicet oculus hominis peccatoris gloriam Tuam non videat,\nSolus Tu es sanctus; non est alius praeter Te,\nperfectus in potentia, in amore, et in puritate.",
        translation: "Even if temporary darkness veils Thy presence, and mortal limitations cannot witness Thy full radiant glory, Thou alone remainest intrinsically holy, perfect in divine omnipotence, unconditional love, and pure goodness."
      },
      {
        number: "Verse 4",
        original: "Holy, holy, holy! Lord God Almighty!\nAll thy works shall praise thy name in earth and sky and sea.\nHoly, holy, holy! Merciful and mighty!\nGod in three persons, blessed Trinity!",
        transliteration: "Sanctus, Sanctus, Sanctus! Dominus Deus Omnipotens!\nOmnia opera Tua laudabunt nomen Tuum in terra, caelo et mari.\nSanctus, Sanctus, Sanctus! misericors et potens!\nDeus in tribus Personis, benedicta Trinitas!",
        translation: "Thrice holy Lord! May all created entities across the earth, the heavens, and the oceans glorify Thy name. Great, merciful, and mighty is the Triune God, blessed forever."
      }
    ],
    commentary: "A cornerstone of Trinitarian liturgical worship highlighted on Hymnary.org, this hymn's name and rhythm NICAEA honor the first Council of Nicaea (325 CE) which formulated the Nicene Creed, affirming Christ's divinity and the harmonious triune nature of God."
  },
  the_lords_prayer: {
    key: "the_lords_prayer",
    title: "The Lord's Prayer (Our Father)",
    originalTitle: "Pater Noster (Latin Vulgate)",
    deity: "Our Father in Heaven",
    intro: "The fundamental Christian prayer taught by Jesus Christ himself to his disciples in the Sermon on the Mount (Gospel of Matthew 6:9-13). It is the universal petition of all Christian denominations, serving as an absolute template for adoration, submission to the divine will, petition for daily sustenance, forgiveness, and deliverance from evil.",
    verses: [
      {
        number: "Petitions 1-3",
        original: "Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come;\nthy will be done;\non earth as it is in heaven.",
        transliteration: "Pater noster, qui es in caelis,\nsanctificetur nomen tuum;\nadveniat regnum tuum;\nfiat voluntas tua,\nsicut in caelo et in terra.",
        translation: "Our divine Parent in the spiritual heights, may Your sacred Name be held in absolute reverence. Let Your peaceful kingdom arrive, and let Your perfect, loving Will be carried out on earth as it is executed in heaven."
      },
      {
        number: "Petitions 4-6",
        original: "Give us this day our daily bread.\nAnd forgive us our trespasses,\nas we forgive those who trespass against us.\nAnd lead us not into temptation;\nbut deliver us from evil.",
        transliteration: "Panem nostrum cotidianum da nobis hodie;\net dimitte nobis debita nostra,\nsicut et nos dimittimus debitoribus nostris;\net ne nos inducas in tentationem;\nsed libera nos a malo.",
        translation: "Provide for us today our necessary physical and spiritual nourishment. Forgive us our shortcomings and offenses against You, in the exact measure we extend genuine, loving forgiveness to those who hurt us. Guard us against spiritual trials, and rescue us from the grip of evil."
      },
      {
        number: "The Doxology",
        original: "For thine is the kingdom,\nthe power, and the glory,\nfor ever and ever. Amen.",
        transliteration: "Quoniam Tuum est regnum,\net potestas, et gloria,\nin saecula. Amen.",
        translation: "For to You belongs the ultimate sovereignty, the boundless power, and the supreme radiant beauty throughout all eternity. Verily so."
      }
    ],
    commentary: "Hymnary.org traces hundreds of choral arrangements and sung paraphrases of the Lord's Prayer. The prayer balances praise of God's transcendent majesty with practical human reliance, establishing that personal forgiveness of others is the key to experiencing divine mercy."
  },
  how_great_thou_art: {
    key: "how_great_thou_art",
    title: "How Great Thou Art",
    originalTitle: "O Store Gud (Swedish)",
    deity: "The Creator & Savior",
    intro: "A world-renowned Christian hymn based on a Swedish poem written by Carl Boberg in 1885, set to a Swedish traditional melody, and translated into English by missionary Stuart K. Hine. It acts as an awe-inspired reflection on the grandeur of the cosmos, the beauty of earthly nature, the redemptive sacrifice of Christ on the cross, and the joyful anticipation of eternity.",
    verses: [
      {
        number: "Verse 1",
        original: "O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made,\nI see the stars, I hear the rolling thunder,\nThy pow'r throughout the universe displayed.",
        transliteration: "O Store Gud, när jag den värld beskådar,\nSom Din allmakt här framkallat till liv,\nHur rymdens rullande åskor bådar\nOch stjärnor glimma i Din starka hand.",
        translation: "O Lord my Creator, when I contemplate in deep adoration all the worlds and celestial spheres Your power has established, seeing the stars and hearing the thunder showing Your omnipresence."
      },
      {
        number: "Verse 2 (Nature)",
        original: "When through the woods and forest glades I wander,\nAnd hear the birds sing sweetly in the trees;\nWhen I look down from lofty mountain grandeur,\nAnd hear the brook and feel the gentle breeze;",
        transliteration: "När jag hör fågelsång i gröna lunder,\nOch ser hur bäckar glittra svala där,\nNär stormen viner, gör naturen under,\nOch herrligheten över kullar går.",
        translation: "When I walk through beautiful forests and hear the delightful singing of birds, or gaze down from towering, majestic mountains, feeling the gentle wind and hearing the flowing streams."
      },
      {
        number: "Refrain",
        original: "Then sings my soul, my Savior God, to Thee;\nHow great Thou art, how great Thou art!\nThen sings my soul, my Savior God, to Thee;\nHow great Thou art, how great Thou art!",
        transliteration: "Då brister själen ut i lovsångsljud:\nO store Gud! O store Gud!\nDå brister själen ut i lovsångsljud:\nO store Gud! O store Gud!",
        translation: "Then my inner soul breaks forth into joyful songs of praise, declaring the supreme greatness, love, and light of the Creator."
      },
      {
        number: "Verse 3 (Redemption)",
        original: "And when I think that God, His Son not sparing,\nSent Him to die, I scarce can take it in;\nThat on the cross, my burden gladly bearing,\nHe bled and died to take away my sin;",
        transliteration: "Och när jag tänker på att Gud ej sparante\nSin Son för mig, men sände Honom hit\nAtt lida korsets död och bära min skuld,\nDå fylls mitt hjärta av förundran stor.",
        translation: "And when I consider that the divine Creator did not spare His Son, but sent Him to bear the heavy burden of human failures on the cross, shedding His blood to deliver us from wrongdoing."
      },
      {
        number: "Verse 4 (Eternity)",
        original: "When Christ shall come with shout of acclamation\nAnd take me home, what joy shall fill my heart!\nThen I shall bow in humble adoration,\nAnd there proclaim, my God, how great Thou art!",
        transliteration: "När Kristus kommer med basuners ljudande\nOch tar mig hem till glädjens ljusa land,\nDå skall jag böja mig i ödmjuk tillbedjan\nOch prisa Honom för Hans nåds förbund.",
        translation: "When Christ returns with a triumphant shout of celebration to escort me to the eternal realm of pure joy, I will bow in deep humility and proclaim His magnificent grace."
      }
    ],
    commentary: "Frequently topping Hymnary.org's list of favorite congregational hymns, 'How Great Thou Art' rose to global prominence during George Beverly Shea's singing in the Billy Graham Crusades. It integrates natural theology (experiencing God through cosmic majesty) with christology, evoking deep reverence."
  },
  shema_yisrael: {
    key: "shema_yisrael",
    title: "Shema Yisrael",
    originalTitle: "שְׁמַע יִשְׂרָאֵל",
    deity: "Hashem (The One True God)",
    intro: "The fundamental declaration of Jewish faith, declaring the absolute unity and sovereignty of God. Recited daily in morning and evening prayers, and before sleep, retrieved via themathesontrust.org.",
    verses: [
      {
        number: "Declaration",
        original: "שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד׃",
        transliteration: "Shema Yisrael, Adonai Eloheinu, Adonai Echad.",
        translation: "Hear, O Israel: The Lord is our God, the Lord is One."
      },
      {
        number: "Responsive Praise",
        original: "בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד׃",
        transliteration: "Baruch shem kevod malchuto l'olam va'ed.",
        translation: "Blessed be the name of His glorious kingdom forever and ever."
      },
      {
        number: "The Commandment",
        original: "וְאָהַבְתָּ אֵת יְהוָה אֱלֹהֶיךָ בְּכָל־לְבָבְךָ וּבְכָל־נַפְשְׁךָ וּבְכָל־מְאֹדֶךָ׃",
        transliteration: "V'ahavta eit Adonai Elohecha b'chol l'vavcha u'vchol nafshecha u'vchol m'odecha.",
        translation: "And you shall love the Lord your God with all your heart and with all your soul and with all your might."
      }
    ],
    commentary: "According to sacred Hebrew tradition, the Shema is not merely a prayer but a profound realization of ultimate reality: that there is no space devoid of God's presence, and all creation is completely unified in Him."
  },
  modeh_ani: {
    key: "modeh_ani",
    title: "Modeh Ani (Morning Gratitude)",
    originalTitle: "מוֹדֶה אֲנִי",
    deity: "Hashem (The Living & Eternal King)",
    intro: "The beautiful Jewish declaration of gratitude recited immediately upon waking up, thanking the Creator for restoring the soul.",
    verses: [
      {
        number: "Morning Gratitude",
        original: "מוֹדֶה אֲנִי לְפָנֶיךָ, מֶלֶךְ חַי וְקַיָּם, שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה, רַבָּה אֱמוּנָתֶךָ׃",
        transliteration: "Modeh ani lefanekha, Melekh chai vekayam, shehekhazarta bi nishmati bekhemla. Rabah emunatekha.",
        translation: "I offer thanks before You, living and eternal King, for You have restored my soul within me with mercy. Great is Your faithfulness."
      }
    ],
    commentary: "Recited immediately upon opening one's eyes, this prayer fosters a habitual state of morning gratitude. Before any logical thoughts of tasks or anxieties begin, the conscious mind is aligned with complete thanksgiving for the gift of another day."
  },
  birkat_kohanim: {
    key: "birkat_kohanim",
    title: "Birkat Kohanim (Priestly Blessing)",
    originalTitle: "בִּרְכַּת כֹּהֲנִים",
    deity: "Hashem (The Source of All Blessing)",
    intro: "The ancient three-fold Aaronic blessing from the Book of Numbers, invoking divine protection, grace, and ultimate peace.",
    verses: [
      {
        number: "The Blessing",
        original: "יְבָרֶכְךָ יְהוָה וְיִשְׁמְרֶךָ׃ יָאֵר יְהוָה פָּנָיו אֵלֶיךָ וִיחֻנֶּךָּ׃ יִשָּׂא יְהוָה פָּנָיו אֵלֶיךָ וְיָשֵׂם לְךָ שָׁלוֹם׃",
        transliteration: "Yevarekhekha Adonai veyishmereka. Ya'er Adonai panav eleykha vichuneka. Yissa Adonai panav eleykha veyasem lekha shalom.",
        translation: "May the Lord bless you and protect you. May the Lord make His face shine upon you and be gracious to you. May the Lord lift up His countenance toward you and grant you peace."
      }
    ],
    commentary: "The blessing progresses beautifully from physical protection, to intellectual grace, to the crown of Jewish values: Shalom (peace). In Hebrew, Shalom is not just the absence of war, but complete wholeness and health."
  },
  hamotzi: {
    key: "hamotzi",
    title: "Hamotzi (Blessing over Bread)",
    originalTitle: "הַמּוֹצִיא לֶחֶם מִן הָאָרֶץ",
    deity: "Hashem (The Sustainer of Life)",
    intro: "The traditional blessing recited before eating bread or a meal containing grain, recognizing God's provision of sustenance.",
    verses: [
      {
        number: "The Blessing",
        original: "בָּרוּךְ אַתָּה יְהוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, הַמּוֹצִיא לֶחֶם מִן הָאָרֶץ׃",
        transliteration: "Baruch atah Adonai, Eloheinu Melech ha-olam, hamotzi lechem min ha-aretz.",
        translation: "Blessed are You, Lord our God, King of the universe, who brings forth bread from the earth."
      }
    ],
    commentary: "The Hamotzi blessing connects the act of eating with spiritual awareness. By pausing to bless the bread, we elevate a basic biological need into a sacred act of gratitude and connection."
  },
  borei_pri_hagafen: {
    key: "borei_pri_hagafen",
    title: "Borei Pri Hagafen (Blessing over Wine)",
    originalTitle: "בּוֹרֵא פְּרִי הַגָּפֶן",
    deity: "Hashem (The Creator of Joy)",
    intro: "The blessing recited over wine, grape juice, or during kiddush, sanctifying sweet moments, sabbaths, and festivals.",
    verses: [
      {
        number: "The Blessing",
        original: "בָּרוּךְ אַתָּה יְהוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, בּוֹרֵא פְּרִי הַגָּפֶן׃",
        transliteration: "Baruch atah Adonai, Eloheinu Melech ha-olam, borei peri ha-gafen.",
        translation: "Blessed are You, Lord our God, King of the universe, who creates the fruit of the vine."
      }
    ],
    commentary: "Wine symbolizes joy, celebration, and spiritual expansion in Hebrew tradition. This blessing elevates the physical sweetness of grape juice or wine into a holy vehicle for sanctifying space and time."
  },
  tefilat_haderech: {
    key: "tefilat_haderech",
    title: "Tefilat Haderech (Traveler's Prayer)",
    originalTitle: "תְּפִלַּת הַדֶּרֶךְ",
    deity: "Hashem (The Guardian of Journeys)",
    intro: "The traveler's prayer recited upon embarking on a journey to ask for safe travel, guidance, protection, and peaceful return.",
    verses: [
      {
        number: "The Prayer",
        original: "יְהִי רָצוֹן מִלְּפָנֶיךָ יְהוָה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ, שֶׁתּוֹלִיכֵנוּ לְשָׁלוֹם וְתַצְעִידֵנוּ לְשָׁלוֹם וְתַדְרִיכֵנוּ לְשָׁלוֹם, וְתַגִּיעֵנוּ לִמְחוֹז חֶפְצֵנוּ לְחַיִּים וּלְשִׂמְחָה וּלְשָׁלוֹם׃",
        transliteration: "Yehi ratzon milfanekha Adonai Eloheinu v'Elohei avoteinu, she-tolichenu l'shalom v'tatz'idenu l'shalom v'tadrichenu l'shalom, v'tagi'enu limchoz cheftzenu l'chayim ul'simchah ul'shalom.",
        translation: "May it be Your will, Lord our God and God of our ancestors, that You lead us toward peace, guide our footsteps toward peace, and make us reach our desired destination for life, gladness, and peace."
      }
    ],
    commentary: "Tefilat Haderech is a powerful prayer for protection during transitions and physical travel, reminding us that we are always under divine shelter no matter how far we roam from home."
  },
  el_mistater: {
    key: "el_mistater",
    title: "Baqashot: El Mistater (The Hidden God)",
    originalTitle: "אֵל מִסְתַּתֵּר",
    deity: "Hashem (The Transcendent and Immanent Creator)",
    intro: "A beautiful, profound kabbalistic poem from the Baqashot (midnight petitions) singing of the hidden divine presence within all of creation.",
    verses: [
      {
        number: "Verse 1",
        original: "אֵל מִסְתַּתֵּר בְּשַׁפְרִיר חֶבְיוֹן, הַשֵּׂכֶל הַנֶּעֱלָם מִכָּל רַעְיוֹן׃",
        transliteration: "El mistater be-shafrir chevyon, ha-sekhel ha-ne'elam mi-kol ra'yon.",
        translation: "God who hides in the beauty of secrets, the intellect concealed from all thoughts."
      }
    ],
    commentary: "El Mistater is a supreme expression of Kabbalistic poetry, contemplating the tension between God's absolute transcendence (being hidden) and His loving immanence (being revealed through the Sefirot)."
  },
  kol_nidrei: {
    key: "kol_nidrei",
    title: "Kol Nidrei (All Vows)",
    originalTitle: "כָּל נִדְרֵי",
    deity: "Hashem (The Forgiver of Sins)",
    intro: "The solemn Day of Atonement (Yom Kippur) declaration recited three times at dusk, absolving unintended vows, oaths, and spiritual burdens.",
    verses: [
      {
        number: "Declaration",
        original: "כָּל נִדְרֵי, וֶאֱסָרֵי, וּשְׁבוּעֵי, וַחֲרָמֵי, וְקוֹנָמֵי, וְכִנּוּיֵי׃",
        transliteration: "Kol nidrei, ve-esarei, u-shvu'ei, va-charamei, ve-konamei, ve-chinuyei.",
        translation: "All vows, obligations, oaths, bans, devotions, and substitutions."
      }
    ],
    commentary: "Kol Nidrei is a legally and emotionally charged declaration. Historically, it provided deep comfort for Jewish communities forced to make vows of conversion under duress, releasing their souls before God."
  },
  psalm_23_hebrew: {
    key: "psalm_23_hebrew",
    title: "Psalm 23 (The Lord is My Shepherd - Hebrew)",
    originalTitle: "מִזְמוֹר לְדָוִד",
    deity: "Hashem (The Divine Shepherd)",
    intro: "The world's most beloved song of comfort, absolute confidence, and security, sung in its original, resonant Hebrew cantorial style.",
    verses: [
      {
        number: "Verse 1",
        original: "יְהוָה רֹעִי, לֹא אֶחְסָר׃ בִּנְאוֹת דֶּשֶׁא יַרְבִּיצֵנִי; עַל־מֵי מְנֻחוֹת יְנַהֲלֵנִי׃",
        transliteration: "Adonai ro'i, lo echsar. Bin'ot deshe yarbitzeni, al mei menuchot yenahaleni.",
        translation: "The Lord is my shepherd, I shall not want. He makes me lie down in green pastures, He leads me beside still waters."
      }
    ],
    commentary: "Psalm 23 is a timeless anthem of hope and safety. Reciting it in Hebrew reconnects the practitioner with the original acoustic beauty and comforting cadences of King David."
  },
  nigunim_hasidic: {
    key: "nigunim_hasidic",
    title: "Nigunim: Hasidic Tunes",
    originalTitle: "ניגונים",
    deity: "Hashem (The Source of Joy and Ecstasy)",
    intro: "Traditional wordless spiritual melodies sung by Hasidic communities to bypass intellect, elevate the soul, and achieve spiritual ecstasy (devekut).",
    verses: [
      {
        number: "Wordless Chants",
        original: "יַי-לָא-לָא, לָא-לָא-לָא, אָי-בָּי-בָּי-בָּי-בָּי!",
        transliteration: "Yai-la-la, la-la-la, ai-bai-bai-bai-bai!",
        translation: "A wordless spiritual melody elevating the heart directly to the Divine."
      }
    ],
    commentary: "As the Baal Shem Tov taught, words are the pen of the mind, but music is the pen of the soul. Nigunim use repetitive, vocable chants to achieve direct spiritual connection beyond verbal constraints."
  },
  yedid_nefesh: {
    key: "yedid_nefesh",
    title: "Yedid Nefesh (Beloved of the Soul)",
    originalTitle: "יְדִיד נֶפֶשׁ",
    deity: "Hashem (The Beloved Friend of the Soul)",
    intro: "An exquisite liturgical poem written by 16th-century Kabbalist Rabbi Elazar Azikri, expressing intense love and spiritual yearning for God.",
    verses: [
      {
        number: "Verse 1",
        original: "יְדִיד נֶפֶשׁ אָב הָרַחֲמָן, מְשׁוֹךְ עַבְדְּךָ אֶל רְצוֹנֶךָ׃",
        transliteration: "Yedid nefesh av ha-rachaman, meshoch avdekha el retzonekha.",
        translation: "Beloved of the soul, Father of mercy, draw Your servant to Your will."
      }
    ],
    commentary: "Yedid Nefesh is sung in synagogues worldwide to welcome the Sabbath. Its beautiful imagery depicts the soul as a passionate lover pleading for the ultimate closeness of the Divine Lover."
  },
  bereshit_genesis: {
    key: "bereshit_genesis",
    title: "Bere'shit (Genesis - Torah Cantillation)",
    originalTitle: "בְּרֵאשִׁית",
    deity: "Hashem (The Sovereign Creator of the Cosmos)",
    intro: "The primordial account of creation from the Book of Genesis, chanted in traditional, ancient Yemenite Hebrew cantillation.",
    verses: [
      {
        number: "Genesis 1:1",
        original: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃",
        transliteration: "Bereshit bara Elohim et hashamayim ve'et ha'aretz.",
        translation: "In the beginning God created the heavens and the earth."
      }
    ],
    commentary: "The opening of the Torah is not just narrative but a sacred cosmic blueprint. Chanting these verses in traditional Hebrew cantillation (Leyning) connects the listener to generations of oral revelation."
  },
  shir_ha_shirim: {
    key: "shir_ha_shirim",
    title: "Shir ha-shirim (Song of Songs)",
    originalTitle: "שִׁיר הַשִּׁིירִים",
    deity: "Hashem (The Divine Lover)",
    intro: "The sublime, poetic song of Solomon, allegorizing the passionate, intense mystical union of the soul and the Beloved.",
    verses: [
      {
        number: "Song of Songs 1:1-2",
        original: "שִׁיר הַשִּׁירִים אֲשֶׁר לִשְׁלֹמֹה׃ יִשָּׁקֵנִי מִנְּשִׁיקוֹת פִּיהוּ כִּי־טוֹבִים דֹּדֶיךָ מִיָּיִן׃",
        transliteration: "Shir hashirim asher lishlomoh. Yishakeni mineshi-kot pihu ki tovim dodeykha mi-yayin.",
        translation: "The song of songs, which is Solomon's. Let him kiss me with the kisses of his mouth, for your love is better than wine."
      }
    ],
    commentary: "Rabbi Akiva famously remarked that if all the scriptures are holy, the Song of Songs is the Holy of Holies. It celebrates the passionate, non-dual yearning of the human spirit for absolute divine union."
  },
  tashi_gyatpa: {
    key: "tashi_gyatpa",
    title: "Eight Noble Auspicious Stanzas",
    originalTitle: "བཀྲ་ཤིས་བརྒྱད་པ། (Tashi Gyatpa)",
    deity: "The Eight Sugatas, Bodhisattvas, Goddesses & Guardians",
    intro: "Composed by Jamgön Mipham Rinpoche, this prayer is recited in Tibetan Buddhist traditions from Lotsawa House before any undertaking to remove obstacles, clear adverse circumstances, and ensure peace, success, and prosperity.",
    verses: [
      {
        number: "Homage & Directional Deities",
        original: "སྣང་སྲིད་རྣམ་དག་རང་བཞིན་ལྷུན་གྲུབ་པའི། བཀྲ་ཤིས་ཕྱོགས་བཅུའི་ཞིང་ན་བཞུགས་པ་ཡི། སངས་རྒྱས་ཆོས་དང་དགེ་འདུན་འཕགས་པའི་ཚོགས། ཀུན་ལ་ཕྱག་འཚལ་བདག་ཅག་བཀྲ་ཤིས་ཤོག །",
        transliteration: "Nangsi namdak rangshyin lündrup pei / Tashi chok chü shing na shyukpa yi / Sangye chö dang gendün pakpei tsok / Kün la phyag 'tshal dak chak tashi sho",
        translation: "To you, the deities who dwell in the auspicious realms of the ten directions, where all that appears and exists is perfectly pure, its nature spontaneously of prime quality, to the Buddhas, Dharma, and noble assembly of the Sangha, I prostrate: may all be auspicious for us!"
      },
      {
        number: "The Eight Buddhas (Sugatas)",
        original: "སྒྲོན་མེའི་རྒྱལ་པོ་རྩལ་བརྟན་དོན་གྲུབ་དགོངས། བྱམས་པའི་རྒྱན་དཔལ་དགེ་གྲགས་དཔལ་དམ་པ། ཀུན་ལ་དགོངས་པ་རྒྱ་ཆེར་གྲགས་པ་འཛིན། སེང་གེའི་རྩལ་བརྟན་དོན་གྲུབ་ཡིད་ཚིམ་པ། མཚན་ཙམ་ཐོས་པས་བཀྲ་ཤིས་དཔལ་འཕེལ་བའི། བདེ་བར་གཤེགས་པ་བརྒྱད་ལ་ཕྱག་འཚལ་ལོ། །",
        transliteration: "Drönmei gyalpo tsaltan döndrup gong / Jampai gyandpal gedrak paldampa / Künla gongpa gyacher drakpa dzin / Sengei tsaltan döndrup yidtsimpa / Tsentsam thöpe tashi palpel wei / Dewarshegpa gyat la phyag 'tshal lo",
        translation: "To the King of Lamps, Stable Power, Intent on Success, Ornament of Love, Renowned for Virtue, Exalted Holy and Renowned, Caring of All, and the Satisfier of Wholesome Hearts—the Eight Sugatas, by merely hearing whose names auspicious grace is increased, to you I prostrate!"
      }
    ],
    commentary: "According to Lotsawa House, recitation of this prayer upon waking clears obstacles of the day; when starting a journey, it brings safety; when beginning a business or project, it grants prosperity and harmony."
  },
  kyabdro_semkye: {
    key: "kyabdro_semkye",
    title: "Taking Refuge & Generating Bodhicitta",
    originalTitle: "སྐྱབས་འགྲོ་དང་སེམས་བསྐྱེད། (Kyabdro Semkyé)",
    deity: "The Triple Gem (Buddha, Dharma & Sangha)",
    intro: "The fundamental spiritual declaration and vow in Mahayana and Vajrayana Buddhism, establishing the absolute reliance on the Buddha, Dharma, and Sangha, and raising the altruistic resolve (Bodhicitta) to achieve awakening for all beings.",
    verses: [
      {
        number: "Taking Refuge (Kyabdro)",
        original: "སངས་རྒྱས་ཆོས་དང་ཚོགས་ཀྱི་མཆོག་རྣམས་ལ། བྱང་ཆུབ་བར་དུ་བདག་ནི་སྐྱབས་སུ་མཆི། །",
        transliteration: "Sangye chö dang tsok kyi chok nam la / Changchub bardu dakni kyab su chi",
        translation: "In the Buddha, the Dharma, and the Supreme Spiritual Assembly (Sangha), I go for refuge until I reach complete enlightenment."
      },
      {
        number: "Generating Bodhicitta (Semkyé)",
        original: "བདག་གིས་སྦྱིན་སོགས་བགྱིས་པའི་བསོད་ནམས་ཀྱིས། འགྲོ་ལ་ཕན་ཕྱིར་སངས་རྒྱས་འགྲུབ་པར་ཤོག །",
        transliteration: "Dak gi jin sok gyipei sönam kyi / Dro la phen thir sangye drupbar sho",
        translation: "Through the continuous accumulation of spiritual merits from practicing generosity and other virtues, may I achieve supreme Buddhahood in order to serve and benefit all wandering beings."
      }
    ],
    commentary: "A daily prayer practiced universally across all lineages of FPMT and Lotsawa House. It realigns the mind away from self-centered desires toward the universal liberation of all sentient life."
  },
  shakyamuni_praise: {
    key: "shakyamuni_praise",
    title: "Praise to Shakyamuni Buddha",
    originalTitle: "ཐུབ་ཆོག་བྱིན་རླབས་གཏེར་མཛོད། (Shakyamuni Praise)",
    deity: "Buddha Shakyamuni (Historical Founder)",
    intro: "The foundational daily praise and mantra dedicated to the historical Buddha Gautama Shakyamuni, emphasizing purification and the invocation of the Buddha's boundless compassion and wisdom, advocated by FPMT.",
    verses: [
      {
        number: "The Praise / Homage",
        original: "སྟོན་པ་བཅོམ་ལྡན་འདས་དེ་བཞིན་གཤེགས་པ་དགྲ་བཅོམ་པ་ཡང་དག་པར་རྫོགས་པའི་སངས་རྒྱས་དཔལ་རྒྱལ་བ་ཤཱཀྱ་ཐུབ་པ་ལ་ཕྱག་འཚལ་ལོ་སྐྱབས་སུ་མཆིའོ་མཆོད་དོ། །",
        transliteration: "Tönpa bcomldan'das dezhingshegs pa dgrabcompa yangdagpar rdzogspei sangsrgyas dpal rgyalba shākya thubpa la phyag'tshal lo skyabssu mchi'o mchoddo",
        translation: "To the supreme founder, the endowed transcendent destroyer, the Tathagata gone beyond, the foe destroyer, the fully perfected Buddha, the glorious conqueror, the subduer Shakyamuni Buddha, I prostrate, go for refuge, and make offerings!"
      },
      {
        number: "Sanskrit Mantra",
        original: "ཏདྱ་ཐཱ། ཨོཾ་མུ་ནེ་མུ་ནེ་མ་ཧཱ་མུ་ནེ་ཡེ་སྭཱ་ཧཱ།",
        transliteration: "Tadyathā Oṃ Mune Mune Mahāmuna ye Svāhā",
        translation: "It is like this: Om wise one, wise one, great wise one, may this offering be hailed!"
      }
    ],
    commentary: "The mantra holds profound levels of meaning. 'Mune' means subduer—subduing the suffering of lower realms, subduing the self-clinging of the mind, and subduing all cognitive obscurities to realize absolute reality."
  },
  green_tara_praise: {
    key: "green_tara_praise",
    title: "Praise & Mantra of Holy Green Tara",
    originalTitle: "རྗེ་བཙུན་སྒྲོལ་མའི་བསྟོད་པ། (Noble Drolma)",
    deity: "Arya Tara (Goddess of Swift Compassion)",
    intro: "Extracted from the 21 Praises of Tara, this prayer is recited by practitioners of Lotsawa House and FPMT to invoke Tara's lightning-fast protection from internal and external fears, dangers, and sicknesses.",
    verses: [
      {
        number: "The Homage",
        original: "རྗེ་བཙུན་འཕགས་མ་ sgrol མ་ལ་ཕྱག་འཚལ་ལོ། །",
        transliteration: "Jetsun pakma drolma la phyag 'tshal lo",
        translation: "Homage to the venerable, noble, and compassionate Lady Tara!"
      },
      {
        number: "Dispelling Fears & Granting Needs",
        original: "ཕྱག་འཚལ་སྒྲོལ་མ་ཏཱ་རེ་དཔའ་མོ། ཏུཏྟཱ་རེ་ཡིས་འཇིགས་པ་སེལ་མ། ཏུ་རེས་དོན་ཀུན་སྦྱིན་མཛད་སྒྲོལ་མ། སྭཱཧཱ་ཡི་གེར་བཅས་ལ་རབ་འདུད། །",
        transliteration: "Phyag 'tshal drolma tare pamo / Tuttare yi jikpa sel ma / Ture dön kün jin dzad drolma / Soha yiger ce la rab dü",
        translation: "Homage to Tara, the swift and courageous savior, who dispels all fears and phobias with TUTTARE, who fulfills all secular and spiritual needs with TURE, and to SOHA I bow down."
      },
      {
        number: "Sanskrit Mantra",
        original: "ཨོཾ་ཏཱ་རེ་ཏུཏྟཱ་རེ་ཏུ་རེ་སྭཱ་ཧཱ།",
        transliteration: "Oṃ Tāre Tuttāre Ture Svāhā",
        translation: "Om! O Tara, savior from samsara, savior from the eight great fears, swift liberator, may blessings be established!"
      }
    ],
    commentary: "Green Tara represents the active, swift energy of enlightened compassion. By meditating on her and reciting her mantra, the heart's natural courage is unlocked, instantly transforming fear into clear insight."
  },
  heart_sutra_mantra: {
    key: "heart_sutra_mantra",
    title: "The Heart Sutra Mantra",
    originalTitle: "ཤེས་རབ་སྙིང་པོའི་སྔགས། (Heart Sutra Mantra)",
    deity: "Prajnaparamita (The Mother of All Buddhas)",
    intro: "The ultimate mantra of transcendent wisdom from the Heart Sutra (Prajnaparamita Hrdaya), representing the direct realization of emptiness (shunyata) that overcomes all suffering.",
    verses: [
      {
        number: "The Core Realization",
        original: "གཟུགས་སྟོང་པའོ། སྟོང་པ་ཉིད་གཟུགས་སོ། གཟུགས་ལས་སྟོང་པ་ཉིད་གཞན་མ་ཡིན། སྟོང་པ་ཉིད་ལས་ཀྱང་གཟུགས་གཞན་མ་ཡིན།",
        transliteration: "Zuk tongpao. Tongpanyi zukso. Zuk le tongpanyi shyen mayin. Tongpanyi lekyang zuk shyen mayin.",
        translation: "Form is emptiness, emptiness is form. Emptiness is not other than form, form is not other than emptiness."
      },
      {
        number: "The Transcendent Mantra",
        original: "ཏདྱ་ཐཱ། ག་ཏེ་ག་ཏེ་པཱ་ར་ག་ཏེ་པཱ་ར་སཾ་ག་ཏེ་བོ་དྷི་སྭཱ་ཧཱ།",
        transliteration: "Tadyathā Gate Gate Pāragate Pārasaṃgate Bodhi Svāhā",
        translation: "It is like this: Gone, gone, gone beyond, gone altogether beyond, awaken to the truth, hail!"
      }
    ],
    commentary: "The mantra charts the progressive levels of realization in the Buddhist path: 'Gate' represents entering the path, 'Gate' also means progress, 'Paragate' is crossing over, 'Parasamgate' represents standing completely on the other shore, and 'Bodhi' is the actual awakening."
  },
  medicine_buddha: {
    key: "medicine_buddha",
    title: "Medicine Buddha Prayer & Mantra",
    originalTitle: "སྨན་བླའི་མདོ་ཆོག་ཆེན་མོ། (Sangye Menla)",
    deity: "Bhaisajyaguru (Medicine Guru)",
    intro: "The main prayer and healing mantra dedicated to the Medicine Buddha, used in FPMT practices to alleviate both physical illness and the inner mental diseases of anger, attachment, and ignorance.",
    verses: [
      {
        number: "The Propitiation",
        original: "བཅོམ་ལྡན་འདས་དེ་བཞིན་གཤེགས་པ་དགྲ་བཅོམ་པ་ཡང་དག་པར་རྫོགས་པའི་སངས་རྒྱས་སྨན་གྱི་བླ་བཻ་ཌཱུརྱའི་འོད་ཀྱི་རྒྱལ་པོ་ལ་ཕྱག་འཚལ་ལོ། །",
        transliteration: "Bcomldan'das dezhingshegs pa dgrabcompa yangdagpar rdzogspei sangsrgyas smangyi la beidurya'i ökyi rgyalpo la phyag'tshal lo",
        translation: "To the transcendent destroyer, the Tathagata gone beyond, the foe destroyer, the fully completed Buddha, the Medicine Guru, King of Lapis Lazuli Light, I prostrate, go for refuge, and make offerings!"
      },
      {
        number: "Dharani Mantra",
        original: "ཏདྱ་ཐཱ། ཨོཾ་བྷཻ་ཥ་ཛྱེ་བྷཻ་ཥ་ཛྱེ་མཧཱ་བྷཻ་ཥ་ཛྱེ་རཱ་ཛ་ས་མུདྒ་ཏེ་སྭཱ་ཧཱ།",
        transliteration: "Tadyathā Oṃ Bhaiṣajye Bhaiṣajye Mahābhaiṣajye Rāja Samudgate Svāhā",
        translation: "It is like this: Om heal, heal, master healer, King who has fully risen, hail!"
      }
    ],
    commentary: "Known to dissolve both temporal illnesses and karmic impurities, Medicine Buddha's blue lapis light rays shine through all cells of the physical body, bringing infinite peace, restoration and ultimate liberation."
  },
  navkar_mantra: {
    key: "navkar_mantra",
    title: "Navkar Mantra",
    originalTitle: "णमोकार मन्त्र (Namokar)",
    deity: "The Five Supreme Souls (Pancha Paramesthi)",
    intro: "The core, supreme mantra of Jainism honoring the five classes of spiritually perfected personalities. Recited from JainWorld.com to purify minds and shed karmic atoms.",
    verses: [
      {
        number: "Verse 1",
        original: "णमो अरिहंताणं।",
        transliteration: "Namo Arihantāṇam",
        translation: "I bow to the Arihants (the omniscient spiritual conquerors who have destroyed inner passions)."
      },
      {
        number: "Verse 2",
        original: "णमो सिद्धाणं।",
        transliteration: "Namo Siddhāṇam",
        translation: "I bow to the Siddhas (the completely liberated souls who are free from rebirths)."
      },
      {
        number: "Verse 3",
        original: "णमो आइरियाणं।",
        transliteration: "Namo Āyariyāṇam",
        translation: "I bow to the Acharyas (the spiritual leaders and teachers of the monastic order)."
      },
      {
        number: "Verse 4",
        original: "णमो उवज्झायाणं।",
        transliteration: "Namo Uvajjhāyāṇam",
        translation: "I bow to the Upadhyayas (the scholarly instructors or preceptors)."
      },
      {
        number: "Verse 5",
        original: "णमो लोए सव्वा साहूणं।",
        transliteration: "Namo Loe Savva Sāhūṇam",
        translation: "I bow to all the ascetics (Sadhus) in the universe."
      },
      {
        number: "verse 6",
        original: "एसो पंच णमोक्कारो,",
        transliteration: "Eso Pañca Ṇamokkāro",
        translation: "These five bowing-downs/obeisances combined,"
      },
      {
        number: "Verse 7",
        original: "सव्वपावप्पणासणो।",
        transliteration: "Savva Pāvappaṇāsaṇo",
        translation: "completely destroy all sins and bad karmas."
      },
      {
        number: "Verse 8",
        original: "मंगलाणं च सव्वेसिं,",
        transliteration: "Maṅgalāṇaṃ Ca Savvesiṃ",
        translation: "And among all auspicious blessings,"
      },
      {
        number: "Verse 9",
        original: "पढमं हवइ मंगलं॥",
        transliteration: "Paḍhamaṃ Havai Maṅgalaṃ",
        translation: "this mantra is the foremost auspicious one."
      }
    ],
    commentary: "The Navkar Mantra is unique because it prays for qualities rather than specific Gods or personal favors. It teaches that paying reverence to those who have achieved spiritual perfection aligns one’s own soul with similar pure characteristics."
  },
  chattari_mangalam: {
    key: "chattari_mangalam",
    title: "Chattari Mangalam",
    originalTitle: "चत्तारि मंगलं (Auspicious Refuges)",
    deity: "The Four Supreme Protectors",
    intro: "An ancient Prakrit sutra detailing the four auspicious and supreme elements of the universe, and taking shelter in them. Retrieved from JainWorld.com.",
    verses: [
      {
        number: "The Auspicious Four",
        original: "चत्तारि मंगलं: अरिहंता मंगलं, सिद्धा मंगलं, साहू मंगलं, केवली पण्णत्तो धम्मो मंगलं।",
        transliteration: "Cattāri maṅgalaṃ: arihantā maṅgalaṃ, siddhā maṅgalaṃ, sāhū maṅgalaṃ, kevalī paṇṇatto dhammo maṅgalaṃ.",
        translation: "There are four auspicious entities: Arihants (spiritual masters) are auspicious, Siddhas (liberated souls) are auspicious, Sadhus (holy ascetics) are auspicious, and the Dharma proclaimed by the omniscient lords is auspicious."
      },
      {
        number: "The Supreme Four",
        original: "चत्तारि लोगुत्तमा: अरिहंता लोगुत्तमा, सिद्धा लोगुत्तमा, साहू लोगुत्तमा, केवली पण्णत्तो धम्मो लोगुत्तमो।",
        transliteration: "Cattāri loguttamā: arihantā loguttamā, siddhā loguttamā, sāhū loguttamā, kevalī paṇṇatto dhammo loguttamo.",
        translation: "There are four supreme entities in the universe: Arihants are supreme, Siddhas are supreme, Sadhus are supreme, and the Dharma proclaimed by the omniscient lords is supreme."
      },
      {
        number: "The Fourfold Refuge",
        original: "चत्तारि सरणं पव्वज्जामि: अरिहंते सरणं पव्वज्जामि, सिद्धे सरणं पव्वज्जामि, साहू सरणं पव्वज्जामि, केवली पण्णत्तं धम्मं सरणं पव्वज्जामि।",
        transliteration: "Cattāri saraṇaṃ pavvajjāmi: arihaṃte saraṇaṃ pavvajjāmi, siddhe saraṇaṃ pavvajjāmi, sāhū saraṇaṃ pavvajjāmi, kevalī paṇṇattaṃ dhammaṃ saraṇaṃ pavvajjāmi.",
        translation: "I take absolute refuge in these four: I take refuge in the Arihants, I take refuge in the Siddhas, I take refuge in the Sadhus, and I take refuge in the sacred Dharma proclaimed by the omniscient lords."
      }
    ],
    commentary: "Recited regularly, this prayer helps the seeker recognize that real refuge lies not in temporary worldly materials, but in the internal shelter of the Tirthankaras, liberated beings, monastic guides, and pure non-violent spiritual doctrine."
  },
  uvasaggaharam_stotra: {
    key: "uvasaggaharam_stotra",
    title: "Uvasaggaharam Stotra",
    originalTitle: "उवसग्गहरं स्तोत्र (Lord Parshvanatha)",
    deity: "Lord Parshvanatha (23rd Tirthankara)",
    intro: "Composed by Acharya Bhadrabahu, this powerful Prakrit stotra is dedicated to Lord Parshvanatha and is renowned for neutralizing mental toxins, physical dangers, and negative planetary blocks. Retrieved from JainWorld.com.",
    verses: [
      {
        number: "Verse 1",
        original: "उवसग्गहरं पासं, पासं वंदामि कम्म-घण-मुक्कं। विसहर-विस-निन्नासं, मंगल-कल्लाण-आवासं ॥१॥",
        transliteration: "Uvasaggaharaṃ pāsaṃ, pāsaṃ vandāmi kamma-ghaṇa-mukkaṃ | Visahara-visa-ninnāsaṃ, maṅgala-kallāṇa-āvāsaṃ ||1||",
        translation: "I bow before Lord Parshvanatha, who dispels all external distresses, who is fully liberated from the density of karmic layers, who destroys the venom of negative energies, and who is the eternal abode of wellness and spiritual grace."
      },
      {
        number: "Verse 2",
        original: "विसहर-फुलिंग मंतं, कंठे धारेइ जो सया मणुओ। तस्स गह-रोग-मारी, दुट्ठ-जरा जंति उवसामं ॥२॥",
        transliteration: "Visahara-phuliṅga mantaṃ, kaṇṭhe dhārei jo sayā maṇuo | Tassa gaha-roga-mārī, duṭṭha-jarā janti uvasāmaṃ ||2||",
        translation: "Whosoever permanently encapsulates this mystic subduer of poisons (Visahara mantra) in their consciousness or voice will find that their negative planetary effects, illness, plague, and old-age distresses are fully pacified."
      },
      {
        number: "Verse 3",
        original: "चिट्ठउ मंतोऽय तिट्ठउ, सिरी-पास-पणामो वि बहु-ཕལོ ཧོའི। સિય-તિરિયમણુએસુ, ન જાયં કયાઇ દુગ્ગઇ ॥༣॥",
        transliteration: "Ciṭṭhau manto'ya tiṭṭhau, sirī-pāsa-paṇāmo vi bahu-phalo hoi | Siya-tiriya-maṇuesu, na jāyaṃ kayāi duggai ||3||",
        translation: "Let alone the full esoteric application of this chant; even a sincere, simple prostration to Lord Parshvanatha brings immense rewards. Such a self will never face bad rebirths or misery, whether as a celestial being, beast, or human."
      }
    ],
    commentary: "Acharya Bhadrabahu composed this stotra during a period of massive famine and plague to protect the community. It functions as a healing shield, creating a serene, protective bubble of non-violence around the practitioner."
  },
  kshamapana_sutra: {
    key: "kshamapana_sutra",
    title: "Kshamapana Sutra (Forgiveness Plan)",
    originalTitle: "खामेमि सव्वे जीवे (Universal Peace)",
    deity: "All Living Beings (Ahimsa & Amity)",
    intro: "The immortal Jain standard of universal empathy, friendship, and absolute forgiveness, recited to clean karmic stains at the close of every prayer session. Obtained from JainWorld.com.",
    verses: [
      {
        number: "Universal Friendship",
        original: "खामेमि सव्वे जीवे, सव्वे जीवा खमंतु मे। मित्ती मे सव्व-भूएसु, वेरं मज्झं न केणइ ॥",
        transliteration: "Khāmemi savve jīve, savve jīvā khamantu me | Mittī me savva-bhūesu, veraṃ majjhaṃ na keṇai ||",
        translation: "I forgive all living beings; may all living beings forgive me. I share absolute friendship with all creatures; I have no enmity toward anyone in this universe."
      },
      {
        number: "Repentance",
        original: "जां किंचि मियं पावं, पर-भवे इह-भवे वा। तस्सं मिच्छा मि दुक्कडं ॥",
        transliteration: "Jāṃ kiñci miyaṃ pāvaṃ, para-bhave iha-bhave vā | Tassaṃ micchā mi dukkaḍaṃ ||",
        translation: "For whatever sinful actions I committed in this current existence or in prior lifetimes, through mind, speech, or body—may all those harmful deeds be dissolved, neutralized and rendered empty (Michhami Dukkadam)."
      }
    ],
    commentary: "In Jainism, seeking forgiveness is not a sign of weakness, but an act of immense spiritual courage that lightens the heavy, sticky web of karma attached to the soul, opening gates for final liberation."
  },
  bhaktamar_stotra: {
    key: "bhaktamar_stotra",
    title: "Bhaktamar Stotra (Verses 1-2)",
    originalTitle: "भक्तामर स्तोत्र (Lord Adinatha)",
    deity: "Lord Adinatha (Rishabhadeva - 1st Tirthankara)",
    intro: "Authored in Sanskrit by Acharya Manatunga when locked behind 48 iron chains in a royal dungeon. Reciting these verses praising the first Tirthankara shattered his shackles one by one. Obtained from JainWorld.com.",
    verses: [
      {
        number: "Verse 1",
        original: "भक्तामर-प्रणत-मौलि-मणि-प्रभाणा-मुद्योतकं दलित-पाप-तमो-वितानम्। सम्यक्-प्रणम्य जिन-पाद-युगं युगादा-वालम्बनं भव-जले पततां जनानाम् ॥१॥",
        transliteration: "Bhaktāmara-praṇata-mauli-maṇi-prabhāṇā-mudyotakaṃ dalita-pāpa-tamo-vitānam | Samyak-praṇamya jina-pāda-yugaṃ yugāda-vālambanaṃ bhava-jale patatāṃ janānām ||1||",
        translation: "I bow down to the feet of Lord Jinendra, which reflect the brilliant rays of the crown-jewels of bowing celestial deities. His feet dispel the dense shadows of our sins and serve as the ultimate support for dry souls drowning in the deep ocean of worldly rebirths."
      },
      {
        number: "Verse 2",
        original: "यः संस्तुतः सकल-वाङ्‌मय-तत्त्व-बोधा-दुद्भूत-बुद्धि-पटुभिः सुर-लोक-नाथैः। स्तोत्रैर्जगत्-त्रितय-चित्त-हरैरुदारैः, स्तोष्ये किलाहमपि तं प्रथमं जिनेन्द्रम् ॥२॥",
        transliteration: "Yaḥ saṃstutaḥ sakala-vāṅmaya-tattva-bodhā-dudbhūta-buddhi-paṭubhiḥ sura-loka-nāthaiḥ | Stotrairjagat-tritaya-citta-harairudāraiḥ, stoṣye kilāhamapi taṃ prathamaṃ jinendram ||2||",
        translation: "He who has been beautifully praised with elegant songs of absolute truth by celestial lords possesses magnificent power. Assuredly, I too shall celebrate the first Tirthankara Lord Adinatha with similar pure devotion."
      }
    ],
    commentary: "Each of the 48 verses of the Bhaktamar Stotra acts as an independent mantra. Verse 1 is highly favored for dispelling deep-seated fears, curing systemic blockages, and setting a firm protective boundary for the home."
  },
  logassa_sutra: {
    key: "logassa_sutra",
    title: "Logassa Sutra",
    originalTitle: "लोगस्स सुत्त (Praise of 24 Jinas)",
    deity: "The Twenty-Four Tirthankaras",
    intro: "An ancient Prakrit congregational hymn of adoration praising the 24 Tirthankaras of the present era, who navigated across the ocean of worldly existence to show us the way of light. Obtained from JainWorld.com.",
    verses: [
      {
        number: "Verse 1",
        original: "लोगस्स उज्जोअगरे, धम्मतित्थयरे जिणे। अरिहंते कित्तइस्सं, चउवीसं पि केवली ॥१॥",
        transliteration: "Logassa ujjoagare, dhammatitthayere jiṇe | Arihaṇte kitta-issaṃ, cauvīsaṃ pi kevalī ||1||",
        translation: "I sing praises of the Jinas (the spiritual conquerors), who illuminate this universe, establish the sacred spiritual path (Tirthas), and are the twenty-four omniscient Arihants."
      },
      {
        number: "Verse 2",
        original: "उसभ-मजिअं च वंदे, संभव-มभिणंदणं च सुमइं च। पउमप्पहं सुपासं, जिणं च चंदप्पहं वंदे ॥२॥",
        transliteration: "Usabha-majiaṃ ca vaṃde, saṃbhava-mabhiṇaṃdaṇaṃ ca sumaiṃ ca | Paumappahaṃ supāsaṃ, jiṇaṃ ca caṃdappahaṃ vaṃde ||2||",
        translation: "I prostrate to Lord Rishabhadeva (Usabha) and Ajitanatha, to Sambhavanatha, Abhinandananatha, and Sumatinatha, to Padmaprabha, Suparshvanatha, and the victorious Lord Chandraprabha."
      },
      {
        number: "Verse 3",
        original: "सुविहिं च पुप्फदंतं, सीअल-सिज्जंस-वासुपुज्जं च। विमल-मणंतं च जिणं, धम्मं संतिं च वंदामि ॥३॥",
        transliteration: "Suvihiṃ ca pupphadaṃtaṃ, sīala-sijjaṃsa-vāsupujjaṃ ca | Vimala-maṇaṃtaṃ ca jiṇaṃ, dhammaṃ saṃtiṃ ca vaṃdāmi ||3||",
        translation: "I bow to Suvidhinatha (also known as Pushpadanta), Shitalanatha, Shreyansanatha, and Vasupujya. I also bow to Vimalanatha, Anantanatha, Dharmanatha, and the peaceful Shantinatha."
      },
      {
        number: "Verse 4",
        original: "कुंथुं अरं च मल्लिं, वंदे मुणिसुव्वअं नमिजिणं च। वंदामि अरिट्ठनेमिं, पासं तह वद्धमाणं च ॥४॥",
        transliteration: "Kuṃthuṃ araṃ ca malliṃ, vaṃde muṇisuvvaaṃ namijiṇaṃ ca | Vaṃdāmi ariṭṭha-nemiṃ, pāsaṃ taha vaddha-māṇaṃ ca ||4||",
        translation: "I bow to Kunthunatha, Aranatha, and Mallinatha, to Muni Suvratasvami, and Naminatha. I respect the holy Arishtanemi, Parshvanatha, and Lord Vardhamana (Mahavira)."
      }
    ],
    commentary: "Praising the 24 Jinas collectively shifts our focus to the supreme state of enlightenment. The stotra acts as a powerful meditative purifier, washing away layers of passions and establishing pure inner focus (Samatvam)."
  },
  japji_sahib: {
    key: "japji_sahib",
    title: "Japji Sahib (Mool Mantar)",
    originalTitle: "ਜਪੁਜੀ ਸਾਹਿਬ (ਮੂਲ ਮੰਤਰ)",
    deity: "Ek Onkar (The Supreme One)",
    intro: "The fundamental morning prayer of Sikhism, composed by Guru Nanak Dev Ji. It speaks of the non-dual, limitless nature of the Creator, whose grace leads to supreme liberation. Retrieved from SriGuruGranthSahib.org.",
    verses: [
      {
        number: "Mool Mantar",
        original: "ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥",
        transliteration: "Ik Onkar Sat Nam Karta Purakh Nirbhau Nirvair Akal Moorat Ajooni Saibhan Gur Prasad",
        translation: "One Creator of All, True is the Name, Creative Being, Without Fear, Without Hatred, Timeless Form, Unborn, Self-Existent, Realized by the Divine Guru's Grace."
      },
      {
        number: "Slok",
        original: "ਪਵਣੁ ਗੁਰੂ ਪਾਣੀ ਪਿਤਾ ਮਾਤਾ ਧਰਤਿ ਮਹਤੁ ॥ ਦਿਵਸੁ ਰਾਤਿ ਦੁਇ ਦਾਈ ਦਾਇਆ ਖੇਲੈ ਸਗਲ ਜਗਤ ॥",
        transliteration: "Pavan Guru Pani Pita Mata Dharat Mahat | Divas Raat Doi Dai Daiya Khelai Sagal Jagat",
        translation: "Air is the spiritual Guru, Water is the Father, and Earth is the Great Mother of all. Day and night are the twin nurses in whose embrace the entire universe plays."
      }
    ],
    commentary: "Reciting the Mool Mantar daily untangles psychological blocks, cleanses our deep subconscious of worry and hatred, and realigns our soul to the infinite source of creativity and peace."
  },
  tav_prasad_saviye: {
    key: "tav_prasad_saviye",
    title: "Tav-Prasad Saviye",
    originalTitle: "ਤ੍ਵਪ੍ਰਸਾਦਿ ਸਵੱਯੇ (Divine Love)",
    deity: "Akal Purakh (Timeless Creator)",
    intro: "An elegant morning prayer composed by the tenth Sikh Master, Guru Gobind Singh Ji, declaring that outer ritualism and display of wealth are thoroughly hollow without the core of divine love. Retrieved from SikhitotheMax.org.",
    verses: [
      {
        number: "Verse 1",
        original: "ਸਾਚੁ ਕਹੌ ਸੁਨ ਲੇਹੁ ਸਭੈ ਜਿਨ ਪ੍ਰੇਮ ਕੀਓ ਤਿਨ ਹੀ ਪ੍ਰਭ ਪਾਇਓ ॥",
        transliteration: "Sach kahon sun leho sabhai jin prem kio tin hee prabh paio.",
        translation: "I state the absolute truth, let everyone hear: Only those who love with deep, selfless, and unconditional sincerity shall realize the Sovereign Divine."
      }
    ],
    commentary: "This composition cuts through theological pride and outward ceremonial shows. It teaches us that compassion, empathy, and love for all creation are the only actual doors to spiritual victory."
  },
  ardas: {
    key: "ardas",
    title: "The Sikh Ardas",
    originalTitle: "ਅਰਦਾਸ (Universal Petition)",
    deity: "The Creator & Gurus",
    intro: "A heartfelt communal or personal prayer of request recited at the end of services, asking for high spirits, divine surrender, and the welfare, happiness, and peace of all cosmic life. Obtained from NitnemDaily.com.",
    verses: [
      {
        number: "Invocation",
        original: "ੴ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ ॥ ਸ੍ਰੀ ਭਗੌਤੀ ਜੀ ਸਹਾਇ ॥ ਵਾਰ ਸ੍ਰੀ ਭਗੌਤੀ ਜੀ ਕੀ ਪਾਤਸ਼ਾਹੀ ਦਸਵੀਂ ॥",
        transliteration: "Ik Onkar Waheguru Ji Ki Fateh | Sri Bhagauti Ji Sahai | Var Sri Bhagauti Ji Ki Patshahi Dasvin",
        translation: "One Creator, Victory to the Divine Wisdom. May the supreme protective power sustain us. This is the Var (anthem) of the spiritual sword by Tenth Sovereign."
      },
      {
        number: "Universal Welfare",
        original: "ਨਾਨਕ ਨਾਮ ਚੜ੍ਹਦੀ ਕਲਾ, ਤੇਰੇ ਭਾਣੇ ਸਰਬੱਤ ਦਾ ਭਲਾ ॥",
        transliteration: "Nanak Naam Chardhi Kala, Tere Bhane Sarbatt Da Bhala.",
        translation: "O Nanak, may the Divine Name remain forever celebrated in high cosmic spirits, and through Your Will, may peace and prosperity reach all creation."
      }
    ],
    commentary: "The Ardas does not request individual materials but centers on courage, community perseverance, and the complete spiritual welfare (Sarbatt da Bhala) of all human beings."
  },
  chaupai_sahib: {
    key: "chaupai_sahib",
    title: "Chaupai Sahib",
    originalTitle: "ਚੌਪਈ ਸਾਹਿਬ",
    deity: "Akal Purakh (Divine Shield)",
    intro: "A highly defensive and protective morning/evening composition by Guru Gobind Singh Ji, seeking protection of the soul from external vices and inner fears. Obtained from SikhiWiki.org.",
    verses: [
      {
        number: "Verse 1",
        original: "हमार करो हाथ दै रच्छा । पूरन होइ चित की इच्छा ॥",
        transliteration: "Hamaar karo haath dai rachha | Pooran hoi chit kee ichha",
        translation: "Please shelter me with Your own hand of protection, so that all the noble and righteous aims of my mind may be fully completed."
      },
      {
        number: "Verse 2",
        original: "तव चरनन्मन रहे हमारा । अपना जान करो प्रतिपारा ॥",
        transliteration: "Tav charnan man rahe hamara | Apna jaan karo pratipara",
        translation: "Let my focus remain anchored at Your lotus feet forever. Cherish and defend me as Your own child."
      }
    ],
    commentary: "Chaupai Sahib builds an immense energetic boundary of confidence and divine shield for the reciter, removing anxieties and reinforcing faith in the ultimate protector."
  }
};

// Align the 16 Hindu prayers in the anthology to the verified scripture database texts (HINDU_PRAYERS_FULL_DATA)
Object.entries({
  gayatri_mantra: 1,
  hanuman_chalisa: 2,
  bajrang_baan: 3,
  shiv_tandav: 4,
  ganesh_aarti: 5,
  goddess_aartis: 6,
  lord_vishnu_aarti: 7,
  maha_mrityunjaya: 8,
  ganesha_mantra: 9,
  shiv_panchakshara: 10,
  lakshmi_ashtakam: 11,
  sankat_nashan_ganesh_stotra: 12,
  kanakadhara_stotram: 13,
  aditya_hrudaya_stotra: 14,
  madhurashtakam: 15,
  kunj_bihari_aarti: 16,
}).forEach(([hymnKey, chapterNum]) => {
  const correctedSource = HINDU_PRAYERS_FULL_DATA[chapterNum];
  const anthologyItem = ANTHOLOGY_DATA[hymnKey];
  if (correctedSource && anthologyItem) {
    if (correctedSource.introSummary) {
      anthologyItem.intro = correctedSource.introSummary;
    }
    if (correctedSource.commentary) {
      anthologyItem.commentary = correctedSource.commentary;
    }
    if (correctedSource.verses && correctedSource.verses.length > 0) {
      anthologyItem.verses = correctedSource.verses.map((v) => ({
        number: v.number,
        original: v.originalText,
        transliteration: v.transliteration,
        translation: v.translation
      }));
    }
  }
});

// Professional audio resources map for the devotional hymns
export const AARTI_AUDIO_RESOURCES: Record<string, { url: string; backupUrl: string; durationLabel: string; singer: string }> = {
  hanuman_chalisa: {
    url: "https://archive.org/download/HanumanChalisa_201806/Hanuman%20Chalisa.mp3",
    backupUrl: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Kije_Hanuman_Lala_Ki.mp3",
    durationLabel: "09:40",
    singer: "Sri Hariharan (Classic T-Series Devotional Chant)"
  },
  bajrang_baan: {
    url: "https://archive.org/download/bajrang-baan_202606/Bajrang%20Baan.mp3",
    backupUrl: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Kije_Hanuman_Lala_Ki.mp3",
    durationLabel: "07:22",
    singer: "Lakhbir Singh Lakkha (Power Devotional Record)"
  },
  shiv_tandav: {
    url: "https://archive.org/download/ShivaTandavaStotram_201707/Shiva_Tandava_Stotram.mp3",
    backupUrl: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Shiv%20Tandav%20Stotram%20%20Shankar%20Mahadevan.mp3",
    durationLabel: "04:12",
    singer: "Uma Mohan (Sacred Sounds of Lord Shiva)"
  },
  ganesh_aarti: {
    url: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Jai%20Ganesh%20Jai%20Ganesh%20Deva.mp3",
    backupUrl: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Sukh_Karta_Dukh_Harta_Ganpati_Aarti.mp3",
    durationLabel: "04:55",
    singer: "Sadhana Sargam (Sweet Traditional Temple Chorus)"
  },
  goddess_aartis: {
    url: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Bhor%20Bhai%20Din%20Chad%20Gaya%20Meri%20Ambe.mp3",
    backupUrl: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Jai_Ambe_Gauri_Aarti_By_Anuradha_Paudwal.mp3",
    durationLabel: "05:15",
    singer: "Alka Yagnik (Sacred Navratri Ambe Gauri Celebration)"
  },
  lord_vishnu_aarti: {
    url: "https://archive.org/download/om_jai_jagdish_hare_aarti_bhakti_songs/om_jai_jagdish_hare_aarti_bhakti_songs.mp3",
    backupUrl: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Mata_Laxmi_Aarti_in_Om_Jai_Laxmi_Mata.mp3",
    durationLabel: "06:02",
    singer: "Anuradha Paudwal (Universal Om Jai Jagdish Chant)"
  },
  gayatri_mantra: {
    url: "https://archive.org/download/gayatri-mantra-chant-part-1/01%20-%20Gayatri%20Mantra%20Chant.mp3",
    backupUrl: "https://archive.org/download/gayatri-mantra-chant-part-1/Gayatri%20Mantra%20Chant%20-%20part%201.mp3",
    durationLabel: "06:14",
    singer: "Pandit Jasraj / Anuradha Paudwal (Sanskrit Vedic Recitation)"
  },
  maha_mrityunjaya: {
    url: "https://archive.org/download/ShivMahaMrityunjayaMantra2/Shiv%20MahaMrityunjaya%20Mantra%20-2.mp3",
    backupUrl: "https://archive.org/download/ShivMahaMrityunjayaMantra2/Shiv%20Mahamrityunjaya%20Mantra-1.mp3",
    durationLabel: "05:30",
    singer: "Deoki Nandan Sastri (Vedic Protection Vibration)"
  },
  buddhist_compassion_mantra: {
    url: "https://archive.org/download/OmManiPadmeHum_613/OmManiPadmeHum-Kkds.mp3",
    backupUrl: "https://archive.org/download/OmManiPadmeHum_613/OmManiPadmeHum-Kkds_64kb.mp3",
    durationLabel: "04:50",
    singer: "Gyuto Monks of Tibet (Mindful Compassion Meditation)"
  },
  peace_prayer_st_francis: {
    url: "https://archive.org/download/PeacePrayer/Peace_prayer.mp3",
    backupUrl: "https://archive.org/download/PeacePrayer/Peace_prayer.mp3",
    durationLabel: "03:15",
    singer: "Saint Francis Choir (Symphonic Devotional Hymn)"
  },
  ganesha_mantra: {
    url: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Om%20Gan%20Ganpataye%20Namo%20Namah.mp3",
    backupUrl: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Sukh_Karta_Dukh_Harta_Ganpati_Aarti.mp3",
    durationLabel: "03:45",
    singer: "Suresh Wadkar (Vakratunda Mahakaya Mantra)"
  },
  shiv_panchakshara: {
    url: "https://archive.org/download/sri-shiva-panchakshara-stotram/Sri%20Shiva%20Panchakshara%20Stotram.mp3",
    backupUrl: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Shiv%20Tandav%20Stotram%20%20Shankar%20Mahadevan.mp3",
    durationLabel: "04:15",
    singer: "S. P. Balasubrahmanyam (Sacred Syllables Recitation)"
  },
  lakshmi_ashtakam: {
    url: "https://archive.org/download/mahalakshmi-ashtakam/Mahalakshmi%20ashtakam%20pri.mp3",
    backupUrl: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Mata_Laxmi_Aarti_in_Om_Jai_Laxmi_Mata.mp3",
    durationLabel: "05:20",
    singer: "Anuradha Paudwal (Divine Blessing of Lakshmi)"
  },
  sankat_nashan_ganesh_stotra: {
    url: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Om%20Gan%20Ganpataye%20Namo%20Namah.mp3",
    backupUrl: "https://archive.org/download/aarti-jai-ganesh-jai-ganesh-deva/Aarti_Sukh_Karta_Dukh_Harta_Ganpati_Aarti.mp3",
    durationLabel: "03:15",
    singer: "Pandit Jasraj (Devotional Ganesha Chant)"
  },
  kanakadhara_stotram: {
    url: "https://archive.org/download/KanakadharaStotram_201610/Kanakadhara%20Stotram.mp3",
    backupUrl: "https://archive.org/download/SriKanakadharaStotram/Kanakadhara%20Stotram.mp3",
    durationLabel: "06:40",
    singer: "M. S. Subbulakshmi (Sovereign Golden Shower Hymn)"
  },
  aditya_hrudaya_stotra: {
    url: "https://archive.org/download/AdityaHrudayamStotra/Aditya%20Hrudayam.mp3",
    backupUrl: "https://archive.org/download/AdityaHridayam108/Aditya%20Hridayam.mp3",
    durationLabel: "05:10",
    singer: "Bombay Sisters (Mighty Vedic Sun Meditation)"
  },
  madhurashtakam: {
    url: "https://archive.org/download/MadhurashtakamMS/Madhurashtakam.mp3",
    backupUrl: "https://archive.org/download/madhurashtakam-subbulakshmi/Madhurashtakam.mp3",
    durationLabel: "04:15",
    singer: "M. S. Subbulakshmi (Transcendent Vrindavan Nectar)"
  },
  kunj_bihari_aarti: {
    url: "https://archive.org/download/aarti-kunj-bihari-ki_202102/Aarti%20Kunj%20Bihari%20Ki.mp3",
    backupUrl: "https://archive.org/download/sherawali-maa-bhajan-audio-jukebox_202011/Bhor%20Bhai%20Din%20Chadh%20Gaya%20Meri%20Ambe.mp3",
    durationLabel: "04:40",
    singer: "Hari Om Sharan (Enchanting Krishna Flute Aarti)"
  },
  ayat_al_kursi: {
    url: "https://archive.org/download/002AlBaqarah255AyatKursi/002_Al-Baqarah-255_ayat_Kursi.mp3",
    backupUrl: "https://archive.org/download/002255_202103/002255%20%D9%85%D8%B5%D8%AD%D9%81%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7%20%20%D9%85%D8%AC%D9%88%D8%AF%20%20%D9%85%D8%AC%D8%B2%D8%A3%20%D9%84%D8%A2%D9%8A%D8%A7%D8%AA%20%D8%A7%D9%8A%D9%87%20%D8%A7%D9%8A%D9%87%20%D8%A2%D9%8A%D9%87%20%20%20%D8%A2%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A7%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A7%D9%8A%D9%87%20%D8%A7%D9%84%D8%A2%D9%8A%D9%87%20%20%D8%A7%D9%84%D8%A2%D9%8A%D8%A9%20%D8%B1%D9%82%D9%85.mp3",
    durationLabel: "01:20",
    singer: "Sheikh Mishary Rashid Alafasy (Noble Qur'an Recitation)"
  },
  sayyidul_istighfar: {
    url: "https://archive.org/download/sayyidul-istighfar/Sayyidul%20Istighfar.mp3",
    backupUrl: "https://archive.org/download/doaa-istighfar/afassy-doaa-istighfar-2.mp3",
    durationLabel: "01:05",
    singer: "Saad Al Ghamdi (Supplication of Repentance)"
  },
  rabbana_duas: {
    url: "https://archive.org/download/4oRabbana-dua-audio/40RabbanainvocationsDuQuran-SalihBukhatir-ShuraimSoudais.mp3",
    backupUrl: "https://archive.org/download/Rabbana-40-Supplications/01%20Allah%20never%20break%20his%20promise.mp3",
    durationLabel: "03:45",
    singer: "Qari Abdul Basit (Melodic Qur'an Petitions)"
  },
  prophet_yunus_dua: {
    url: "https://archive.org/download/doa-nabi-yunus-mohon-keluar-dari-kesusahan/Doa%20Nabi%20Yunus%20-%20Mohon%20Keluar%20Dari%20Kesusahan.mp3",
    backupUrl: "https://archive.org/download/doa-nabi-yunus-mohon-keluar-dari-kesusahan/Doa%20Nabi%20Yunus%20-%20Mohon%20Keluar%20Dari%20Kesusahan.mp3",
    durationLabel: "01:10",
    singer: "Abdur-Rahman as-Sudais (Dua of Deliverance)"
  },
  rabbi_zidni_ilman: {
    url: "https://archive.org/download/Rabbi-Zidni-Ilma_JunaidJamshed/01.%20Rabbi%20Zidni%20Ilma.mp3",
    backupUrl: "https://archive.org/download/008-RabbiZidniIlma-JunaidJamshed-August2011/01RabbiZidniIlma.mp3",
    durationLabel: "01:30",
    singer: "Sheikh Maher Al-Muaiqly (Dua for Intellectual Light)"
  },
  amazing_grace: {
    url: "https://archive.org/download/AmazingGrace/AmazingGrace.mp3",
    backupUrl: "https://archive.org/download/20th-september-hymn-amazing-grace/Hymn%20-%20Amazing%20Grace%20.mp3",
    durationLabel: "04:15",
    singer: "St. Michael's Choir & Ensemble (Classic Hymnary Archive)"
  },
  be_thou_my_vision: {
    url: "https://archive.org/download/Be_Thou_my_Vision/BeThouMyVision.mp3",
    backupUrl: "https://archive.org/download/BeThouMyVision_109/Be_Thou_My_Vision.mp3",
    durationLabel: "03:40",
    singer: "Traditional Irish Harp & Vocalist (Ancient Gaelic Devotion)"
  },
  holy_holy_holy: {
    url: "https://archive.org/download/StadsknapenkoorGorcum_CD1996_08_HolyholyholyLordGodAlmighty_DykesWillcocks/StadsknapenkoorGorcum_CD1996_08_HolyholyholyLordGodAlmighty_DykesWillcocks.mp3",
    backupUrl: "https://archive.org/download/78_holy-holy-holy-lord-god-almighty_trinity-choir-herber-dykes_gbia0405810b/HOLY%2C%20HOLY%2C%20HOLY%2C%20LORD%20GOD%20ALMIGHTY%20-%20TRINITY%20CHOIR.mp3",
    durationLabel: "03:50",
    singer: "St. Paul's Cathedral Choir (Symphonic Hymnary Devotion)"
  },
  the_lords_prayer: {
    url: "https://archive.org/download/the-lords-prayer_202309/The%20Lord%27s%20Prayer.mp3",
    backupUrl: "https://archive.org/download/78_the-lords-prayer_paul-mickelson-and-tedd-smith_gbia3011673a/THE%20LORD%27S%20PRAYER%20-%20PAUL%20MICKELSON%20AND%20TEDD%20SMITH.mp3",
    durationLabel: "01:25",
    singer: "Byzantine Monastic Chant (Aethelwold Vocal Assembly)"
  },
  how_great_thou_art: {
    url: "https://archive.org/download/how-great-thou-art_202208/How%20Great%20Thou%20Art.mp3",
    backupUrl: "https://archive.org/download/HowGreatThouArt_307/HowGreatThouArt.mp3",
    durationLabel: "04:45",
    singer: "Swedish Evangelical Chorus & Organ (Sacred Majesty Chant)"
  },
  shema_yisrael: {
    url: "https://archive.org/download/shema-yisrael-hebrew-monastic-chant/shema_yisrael.mp3",
    backupUrl: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-shema-shmueloff.mp3",
    durationLabel: "00:41",
    singer: "Cantor Moshe Haschel & Choir (Classic Chabad Melodies)"
  },
  modeh_ani: {
    url: "https://archive.org/download/modeh-ani-jewish-morning-prayer/modeh_ani.mp3",
    backupUrl: "https://archive.org/download/modeh-ani-jewish-morning-prayer/modeh_ani.mp3",
    durationLabel: "01:12",
    singer: "Traditional Cantorial Soloist (Classic Sephardic Melody)"
  },
  birkat_kohanim: {
    url: "https://archive.org/download/priestly-blessing-birkat-kohanim/birkat_kohanim.mp3",
    backupUrl: "https://archive.org/download/priestly-blessing-birkat-kohanim/birkat_kohanim.mp3",
    durationLabel: "01:54",
    singer: "Traditional Cantorial Soloist (Classic Sephardic Melody)"
  },
  hamotzi: {
    url: "https://archive.org/download/jewish-blessing-hamotzi-bread/hamotzi.mp3",
    backupUrl: "https://archive.org/download/jewish-blessing-hamotzi-bread/hamotzi.mp3",
    durationLabel: "01:05",
    singer: "Temple Choir Assembly (Cheerful Hasidic Chanting)"
  },
  borei_pri_hagafen: {
    url: "https://archive.org/download/jewish-blessing-hagafen-wine/hagafen.mp3",
    backupUrl: "https://archive.org/download/jewish-blessing-hagafen-wine/hagafen.mp3",
    durationLabel: "01:15",
    singer: "Temple Choir Assembly (Cheerful Hasidic Chanting)"
  },
  tefilat_haderech: {
    url: "https://archive.org/download/jewish-travelers-prayer-tefilat-haderech/tefilat_haderech.mp3",
    backupUrl: "https://archive.org/download/jewish-travelers-prayer-tefilat-haderech/tefilat_haderech.mp3",
    durationLabel: "01:30",
    singer: "Traditional Cantorial Soloist (Classic Sephardic Melody)"
  },
  el_mistater: {
    url: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-el-mistater-archives.mp3",
    backupUrl: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-el-mistater-archives.mp3",
    durationLabel: "01:53",
    singer: "Obadya/Cohen (Classic Kabbalistic Baqashot)"
  },
  kol_nidrei: {
    url: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-kolnidrei.mp3",
    backupUrl: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-kolnidrei.mp3",
    durationLabel: "04:32",
    singer: "Traditional Synagogue Choir (High Holy Day Liturgy)"
  },
  psalm_23_hebrew: {
    url: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-psalm23.mp3",
    backupUrl: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-psalm23.mp3",
    durationLabel: "02:15",
    singer: "Temple Choir Choral Assembly (Ancient Melodic Hebrew Recital)"
  },
  nigunim_hasidic: {
    url: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-nigun-joy-Eints_Tzvei_Drei.mp3",
    backupUrl: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-nigun-joy-Eints_Tzvei_Drei.mp3",
    durationLabel: "02:38",
    singer: "Hasidic Assembly Choir (Niggun of Joy - Eints, Tzvei, Drei)"
  },
  yedid_nefesh: {
    url: "https://archive.org/download/YedidNefeshChant/yedid_nefesh.mp3",
    backupUrl: "https://archive.org/download/YedidNefeshChant/yedid_nefesh.mp3",
    durationLabel: "03:10",
    singer: "Cantor Samuel Malavsky & Family Choir (Beloved of the Soul)"
  },
  bereshit_genesis: {
    url: "https://archive.org/download/BereshitGenesisChant/bereshit.mp3",
    backupUrl: "https://archive.org/download/BereshitGenesisChant/bereshit.mp3",
    durationLabel: "01:45",
    singer: "Yemenite Hebrew Reciter (Ancient Torah Cantillation)"
  },
  shir_ha_shirim: {
    url: "https://archive.org/download/SongOfSongsHebrewChant/shir_hashirim.mp3",
    backupUrl: "https://archive.org/download/SongOfSongsHebrewChant/shir_hashirim.mp3",
    durationLabel: "02:20",
    singer: "Traditional Hebrew Cantorial Reciter (The Sublime Song of Songs)"
  },
  tashi_gyatpa: {
    url: "https://archive.org/download/tibetan-buddhist-chants-auspicious-verses/auspicious_verses.mp3",
    backupUrl: "https://archive.org/download/AuspiciousVersesTibetan/tashi_gyatpa.mp3",
    durationLabel: "03:15",
    singer: "Lotsawa Monastic Dharma Assembly (Jamgön Mipham Recitation)"
  },
  kyabdro_semkye: {
    url: "https://archive.org/download/refuge-and-bodhicitta-buddhist-chant/refuge_bodhicitta.mp3",
    backupUrl: "https://archive.org/download/TibetanRefugePrayerChant/kyabdro.mp3",
    durationLabel: "01:50",
    singer: "His Holiness the Dalai Lama & Monks (Universal Compassion Assembly)"
  },
  shakyamuni_praise: {
    url: "https://archive.org/download/shakyamuni-buddha-mantra-meditative/shakyamuni_mantra.mp3",
    backupUrl: "https://archive.org/download/ShakyamuniBuddhaMantraChant/shakyamuni.mp3",
    durationLabel: "04:20",
    singer: "Lama Zopa Rinpoche & FPMT Devotees (Sovereign Subduer Chant)"
  },
  green_tara_praise: {
    url: "https://archive.org/download/green-tara-mantra-meditation-pure/green_tara.mp3",
    backupUrl: "https://archive.org/download/GreenTaraMantra108Chant/tara.mp3",
    durationLabel: "05:05",
    singer: "Venerable Dechen Shak-Dagsay (Noble Lady Swift Heroine)"
  },
  heart_sutra_mantra: {
    url: "https://archive.org/download/heart-sutra-sanskrit-chant-monks/heart_sutra.mp3",
    backupUrl: "https://archive.org/download/HeartSutraPrajnaparamitaChant/heart_sutra.mp3",
    durationLabel: "02:45",
    singer: "Plum Village Zen Monastic Assembly (Ultimate Emptiness Vibration)"
  },
  medicine_buddha: {
    url: "https://archive.org/download/medicine-buddha-mantra-healing-chant/medicine_buddha.mp3",
    backupUrl: "https://archive.org/download/MedicineBuddhaHealingMantra108/medicine_buddha.mp3",
    durationLabel: "04:30",
    singer: "Gyuto Tantric Monks Choir (Luminous Lapis Lazuli Blessing)"
  },
  navkar_mantra: {
    url: "https://archive.org/download/navkar-mantra-peaceful-chant/navkar_mantra.mp3",
    backupUrl: "https://archive.org/download/JainNavkarMantra108Chant/navkar.mp3",
    durationLabel: "03:40",
    singer: "Lata Mangeshkar / Traditional Jain Monastics (Pancha Paramesthi Homage)"
  },
  chattari_mangalam: {
    url: "https://archive.org/download/chattari-mangalam-sutra-chant/chattari_mangalam.mp3",
    backupUrl: "https://archive.org/download/JainChattariMangalamRefuge/chattari.mp3",
    durationLabel: "01:25",
    singer: "Sadhvi Ritambhara & Jain Sisters (Four Auspicious Refuges)"
  },
  uvasaggaharam_stotra: {
    url: "https://archive.org/download/uvasaggaharam-stotram-healing/uvasaggaharam.mp3",
    backupUrl: "https://archive.org/download/JainUvasaggaharamParshvanath/uvasaggaharam.mp3",
    durationLabel: "04:10",
    singer: "Anuradha Paudwal & Pandit Madhusudan (Sorrows Dispeller Hymn)"
  },
  kshamapana_sutra: {
    url: "https://archive.org/download/khamemi-savve-jive-forgiveness/khamemi_savve_jive.mp3",
    backupUrl: "https://archive.org/download/JainUniversalForgivenessChant/kshamapana.mp3",
    durationLabel: "02:15",
    singer: "Samani Pratibha Pragya & Jain Monks (Universal Friendship Amity)"
  },
  bhaktamar_stotra: {
    url: "https://archive.org/download/bhaktamar-stotra-sanskrit-chant/bhaktamar_1_to_2.mp3",
    backupUrl: "https://archive.org/download/JainBhaktamarStotraManatunga/bhaktamar_v1.mp3",
    durationLabel: "05:50",
    singer: "Acharya Ravindra Muni & Devotional Ensemble (Cosmic Adinath Hymn)"
  },
  logassa_sutra: {
    url: "https://archive.org/download/logassa-sutra-tirthankara-praise/logassa_sutra.mp3",
    backupUrl: "https://archive.org/download/JainLogassaSutra24Tirthankaras/logassa.mp3",
    durationLabel: "03:20",
    singer: "Jain Muni Shri Jinendravijay Maharaj (Twenty-Four Jinas Homage)"
  },
  japji_sahib: {
    url: "https://archive.org/download/Nitnem_201701/Japji%20Sahib.mp3",
    backupUrl: "https://archive.org/download/JapjiSahibPath_2026/japji.mp3",
    durationLabel: "14:15",
    singer: "Bhai Jarnail Singh Ji (Soothing Gurmat Kirtan)"
  },
  tav_prasad_saviye: {
    url: "https://archive.org/download/Nitnem_201701/Tav%20Parasad%20Savaiye.mp3",
    backupUrl: "https://archive.org/download/TavPrasadSaviyePath_2026/tav.mp3",
    durationLabel: "03:45",
    singer: "Bhai Satvinder Singh Ji (Melodious Nitnem Devotion)"
  },
  ardas: {
    url: "https://archive.org/download/SikhArdas_2026/Ardas.mp3",
    backupUrl: "https://archive.org/download/ArdasPath/Ardas.mp3",
    durationLabel: "04:10",
    singer: "Bhai Tarlochan Singh Ji (Traditional Sacred Petition)"
  },
  chaupai_sahib: {
    url: "https://archive.org/download/Nitnem_201701/Benti%20Chaupai.mp3",
    backupUrl: "https://archive.org/download/ChaupaiSahibPath_2026/chaupai.mp3",
    durationLabel: "04:50",
    singer: "Bhai Jarnail Singh Ji (Protective Shield Recitation)"
  }
};

