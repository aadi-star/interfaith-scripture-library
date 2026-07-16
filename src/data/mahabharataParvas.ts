/**
 * Official division structure, Sanskrit names, English translations,
 * chapter ranges, sub-parvas, and key themes for the 18 Parvas of the Mahabharata.
 */

export interface MahabharataParva {
  number: number;
  key: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  chapters: number;
  subParvas: string[];
  verse: {
    originalText: string;
    transliteration: string;
    translation: string;
    reference: string;
  };
  commentary: string;
  parallel: {
    religion: string;
    source: string;
    similarity: string;
    lesson: string;
  };
}

export const MAHABHARATA_PARVAS: MahabharataParva[] = [
  {
    number: 1,
    key: "adi",
    sanskrit: "आदिपर्व",
    transliteration: "Adi Parva",
    translation: "Book of the Beginning",
    chapters: 233,
    subParvas: [
      "Anukramanika Parva (Table of contents)",
      "Parvasangraha Parva (Summary of books)",
      "Poushya Parva (Legend of Janamejaya)",
      "Pauloma Parva (History of Bhrigu race)",
      "Astika Parva (Rescue of snakes)",
      "Adivansavatarana Parva (Genealogy of Kuru dynasty)",
      "Sambhava Parva (Birth of princes)",
      "Yatugriha-daha Parva (House of lac)",
      "Hidimva-vadha Parva (Slaying of Hidimba)",
      "Baka-vadha Parva (Slaying of Baka)",
      "Chaitraratha Parva (Encounter with Gandharva)",
      "Swayamvara Parva (Draupadi's bride-choice)",
      "Vaivahika Parva (Marriage of Draupadi)",
      "Viduragamana Parva (Vidura's arrival)",
      "Rajyalambha Parva (Acquisition of kingdom)",
      "Arjuna-vanavasa Parva (Arjuna's exile)",
      "Subhadra-harana Parva (Abduction of Subhadra)",
      "Harana-harika Parva (Subhadra's dowry)",
      "Khandava-daha Parva (Burning of Khandava forest)"
    ],
    verse: {
      originalText: "नारायणं नमस्कृत्य नरं चैव नरोत्तमम् । देवीं सरस्वतीं व्यासं ततो जयमुदीरयेत् ॥",
      transliteration: "nārāyaṇaṁ namaskṛtya naraṁ caiva narottamam | devīṁ sarasvatīṁ vyāsaṁ tato jayam udīrayet",
      translation: "Saluting the Supreme Divine (Narayana), Nara (the ideal human), the Goddess of Wisdom (Saraswati), and the composer Sage Vyasa, let us sing the song of victory.",
      reference: "1.1"
    },
    commentary: "The Adi Parva lays the foundational background of the epic. It details the miraculous birth of the Pandavas and Kauravas, the growing sibling rivalry, Arjuna's swayamvara, and their initial establishment in Indraprastha. It establishes the theme of cosmic duty (Dharma) operating through human lineages.",
    parallel: {
      religion: "Judaism",
      source: "Genesis 12:1-2",
      similarity: "The tracing of dynastic origins and the establishment of a sacred covenant in a promised land mirrors the early genealogy of the Kurus.",
      lesson: "Understand your historical and cultural roots to gain perspective on your personal ethical and spiritual responsibilities."
    }
  },
  {
    number: 2,
    key: "sabha",
    sanskrit: "सभापर्व",
    transliteration: "Sabha Parva",
    translation: "Book of the Assembly Hall",
    chapters: 80,
    subParvas: [
      "Sabha-kriya Parva (Building of the palace)",
      "Lokapala-sabhakhayana Parva (Description of heavenly assemblies)",
      "Rajasuyarambha Parva (Initiation of Rajasuya sacrifice)",
      "Jarasandha-vadha Parva (Slaying of Jarasandha)",
      "Digvijaya Parva (Conquests of the four directions)",
      "Rajasuyika Parva (Completion of Rajasuya)",
      "Arghyaharana Parva (Offering of guest-gifts)",
      "Shishupala-vadha Parva (Slaying of Shishupala)",
      "Dyuta Parva (The fateful game of dice)",
      "Anudyuta Parva (The second game and exile)"
    ],
    verse: {
      originalText: "यत्र धर्मो ह्यधर्मेण स संसक्तः सभां विशेत् । न चास्य शल्यं कृन्तन्ति विद्धास्तस्याः सभासदः ॥",
      transliteration: "yatra dharmo hyadharmeṇa sa saṁsaktaḥ sabhāṁ viśet | na cāsya śalyaṁ kṛntanti viddhāstasyaḥ sabhāsadaḥ",
      translation: "When righteousness, compromised by unrighteousness, enters an assembly, and the members do not extract the thorn of falsehood, they themselves are wounded by it.",
      reference: "2.67.43"
    },
    commentary: "The Sabha Parva depicts Yudhisthira's rise to imperial sovereignty (Rajasuya) and his subsequent, tragic downfall in the rigged game of dice. The public humiliation of Draupadi in the royal assembly exposes the systemic moral decay of the elders, making the great war inevitable.",
    parallel: {
      religion: "Christianity",
      source: "Luke 22:47-48",
      similarity: "Betrayal in high assemblies and the failure of leaders to act with integrity in moments of crisis.",
      lesson: "Always speak truth to power in collective assemblies; silence in the face of injustice is complicity."
    }
  },
  {
    number: 3,
    key: "vana",
    sanskrit: "वनपर्व",
    transliteration: "Vana Parva",
    translation: "Book of the Forest (Aranyaka)",
    chapters: 315,
    subParvas: [
      "Aranyaka Parva (Entry into forest)",
      "Kirmira-vadha Parva (Slaying of Kirmira)",
      "Arjunabhigamana Parva (Arjuna's pilgrimage)",
      "Kairata Parva (Arjuna's battle with Shiva as a Kirata)",
      "Indralokabhigamana Parva (Arjuna's journey to Indra's heaven)",
      "Nalopakhyana Parva (The legendary story of Nala and Damayanti)",
      "Tirtha-yatra Parva (The sacred pilgrimage of Yudhisthira)",
      "Yajnasena-patigrahana Parva (Abduction and rescue of Draupadi)",
      "Jatasura-vadha Parva (Slaying of Jatasura)",
      "Yakshayudha Parva (Battle with Yakshas)",
      "Nivatakavacha-yuddha Parva (Battle with marine demons)",
      "Ajagara Parva (The python's riddle to Bhima)",
      "Markandeya-samasya Parva (Sage Markandeya's philosophical discourses)",
      "Draupadi-satyabhama Parva (Dialogue of Draupadi and Satyabhama)",
      "Ghosha-yatra Parva (Duryodhana's military patrol)",
      "Mriga-svapnabhaya Parva (The dream of deer)",
      "Vrihi-drounika Parva (The miraculous vessel of grains)",
      "Indra-dyumna Parva (Story of King Indradyumna)",
      "Pativrata-mahatmya Parva (Glory of Savitri's devotion)",
      "Kundala-harana Parva (Indra taking Karna's armor)",
      "Araneya Parva (The Yaksha's riddles on life and Dharma)"
    ],
    verse: {
      originalText: "आनृशंस्यं परो धर्मः स च मे मतिमान् मतः । आनृशंस्याच्चिकीर्षामि नकुलः यक्ष जीवतु ॥",
      transliteration: "ānṛśaṁsyaṁ paro dharmaḥ sa ca me matimān mataḥ | ānṛśaṁsyāccikīrṣāmi nakulaḥ yakṣa jīvatu",
      translation: "Compassion and non-injury is the highest Dharma, O Yaksha. Out of compassion, I desire that Nakula be restored to life.",
      reference: "3.313.129"
    },
    commentary: "Vana Parva is the longest book, depicting the Pandavas' 12-year forest exile. It is rich with spiritual sub-stories (Nala-Damayanti, Savitri-Satyavan) and culminates in the Yaksha Prashna, where Yudhisthira defines the true nature of wisdom and compassion.",
    parallel: {
      religion: "Buddhism",
      source: "Dhammapada 1:5",
      similarity: "The definition of compassion (Anrishamsya) as the highest moral law that overcomes hatred and hostility.",
      lesson: "Let times of forced adversity and exile be periods of deep spiritual preparation and purification of the heart."
    }
  },
  {
    number: 4,
    key: "virata",
    sanskrit: "विराटपर्व",
    transliteration: "Virata Parva",
    translation: "Book of Virata",
    chapters: 72,
    subParvas: [
      "Pandava-pravesha Parva (Pandavas entering Matsya Kingdom)",
      "Samayapalana Parva (Keeping the covenant of secrecy)",
      "Kichaka-vadha Parva (Slaying of Kichaka)",
      "Go-harana Parva (The cattle theft of Trigartas and Kauravas)",
      "Vaivahika Parva (Marriage of Abhimanyu and Uttara)"
    ],
    verse: {
      originalText: "धर्म एव हतो हन्ति धर्मो रक्षति रक्षितः । तस्माद्धर्मो न हन्तव्यो मा नो धर्मो हतोऽवधीत् ॥",
      transliteration: "dharma eva hato hanti dharmo rakṣati rakṣitaḥ | tasmāddharmo na hantavyo mā no dharmo hato'vadhīt",
      translation: "Dharma, when destroyed, destroys; Dharma, when protected, protects. Therefore, Dharma must never be violated, lest violated Dharma consume us.",
      reference: "4.51.10"
    },
    commentary: "The Virata Parva covers the 13th year of exile spent in disguise at King Virata's court. The Pandavas assume humble roles (cook, dance teacher, stable keeper) demonstrating that great souls can adapt to any station of life with dignity.",
    parallel: {
      religion: "Daoism",
      source: "Tao Te Ching Chapter 36",
      similarity: "Remaining hidden, yielding, and adopting a humble, disguised identity to overcome powerful rigid adversaries.",
      lesson: "Practice deep humility, and learn to yield in times of absolute constraint to preserve your inner light."
    }
  },
  {
    number: 5,
    key: "udyoga",
    sanskrit: "उद्योगपर्व",
    transliteration: "Udyoga Parva",
    translation: "Book of Effort (War Preparation)",
    chapters: 199,
    subParvas: [
      "Sainyodyoga Parva (Mobilization of armies)",
      "Sanjaya-yana Parva (Sanjaya's peace mission)",
      "Prajagara Parva (Vidura's ethical discourses to Dhritarashtra)",
      "Sanatsujata Parva (Esoteric non-dual wisdom of Sanatsujata)",
      "Yanasandhi Parva (Krishna's final peace embassy)",
      "Sambhava-parva (Sanctity of peaceful options)",
      "Drupada-yana Parva (Drupada's priest's mission)",
      "Krishna-samvalana Parva (Choosing Krishna or his army)",
      "Sainyaniryana Parva (March of armies to Kurukshetra)",
      "Uluka-dutagamana Parva (Uluka's mocking messages)",
      "Rathatiratha-sankhyana Parva (Classification of warriors)",
      "Amvopakhyana Parva (Story of Amba's vow)"
    ],
    verse: {
      originalText: "न जातु कामः कामानामुपभोगेन शाम्यति । हविषा कृष्णवर्त्मव भूय एवाभिवर्धते ॥",
      transliteration: "na jātu kāmaḥ kāmānāmupabhogena śāmyati | haviṣā kṛṣṇavartmava bhūya evābhivardhate",
      translation: "Desire is never pacified by the enjoyment of its objects; rather, it increases further, like fire fed with clarified butter.",
      reference: "5.39.11"
    },
    commentary: "Udyoga Parva focuses on diplomatic efforts to prevent the war. Lord Krishna journeys to Hastinapur as a peace envoy, but Duryodhana refuses to grant even five villages. It contains 'Vidura Niti' (ethics) and 'Sanatsujatiya' (gnosis).",
    parallel: {
      religion: "Islam",
      source: "Quran Surah 8:61",
      similarity: "The obligation to exhaust all avenues of peace before engaging in defensive conflict is a shared ethical priority.",
      lesson: "Exhaust every possible peaceful, diplomatic, and kind measure before resorting to absolute defensive action."
    }
  },
  {
    number: 6,
    key: "bhishma",
    sanskrit: "भीष्मपर्व",
    transliteration: "Bhishma Parva",
    translation: "Book of Bhishma",
    chapters: 122,
    subParvas: [
      "Jambu-khanda Nirmana Parva (Cosmography of India/Jambudvipa)",
      "Bhumi Parva (Geography of sacred land)",
      "Bhagavad Gita Parva (The discourse of Lord Krishna and Arjuna)",
      "Bhishma-vadha Parva (The fall of grandfather Bhishma on the arrow bed)"
    ],
    verse: {
      originalText: "यतो धर्मस्ततो कृष्णो यतः कृष्णस्ततो जयः ॥",
      transliteration: "yato dharmastato kṛṣṇo yataḥ kṛṣṇastato jayaḥ",
      translation: "Where there is Righteousness (Dharma), there is Krishna; and where there is Krishna, there is Victory.",
      reference: "6.66.41"
    },
    commentary: "Bhishma Parva covers the first ten days of the war, under the generalship of Bhishma. It contains the complete Bhagavad Gita, where Krishna instructs the despondent Arjuna, teaching Nishkama Karma and the immortality of the soul.",
    parallel: {
      religion: "Christianity",
      source: "Ephesians 6:13-14",
      similarity: "The spiritual armor of truth and righteousness used to stand firm against massive external and psychological battles.",
      lesson: "In the ultimate battles of life, rely on the divine light within you, rather than outer material numbers."
    }
  },
  {
    number: 7,
    key: "drona",
    sanskrit: "द्रोणपर्व",
    transliteration: "Drona Parva",
    translation: "Book of Drona",
    chapters: 204,
    subParvas: [
      "Dronabhisheka Parva (Consecration of Drona as Commander)",
      "Samsaptaka-vadha Parva (Slaying of the sworn conspirators)",
      "Abhimanyu-vadha Parva (The tragic death of young Abhimanyu in the labyrinth)",
      "Pratijna Parva (Arjuna's oath to avenge his son)",
      "Jayadratha-vadha Parva (Slaying of Jayadratha)",
      "Ghatotkacha-vadha Parva (Sacrifice and death of Ghatotkacha)",
      "Drona-vadha Parva (The fall of Guru Drona via moral dilemma)",
      "Narayana-astra-moksha Parva (Averting Ashwatthama's weapons)"
    ],
    verse: {
      originalText: "न वै मन्युर्मनुष्याणामुत्साहं हन्तुमर्हति । उत्साहात्परमं नास्ति तेजो वीर्यं च जीवितम् ॥",
      transliteration: "na vai manyurmanuṣyāṇāmutsāhaṁ hantumarhati | utsāhātparamaṁ nāsti tejo vīryaṁ ca jīvitam",
      translation: "Anger must never be allowed to destroy a person's noble enthusiasm. There is no force superior to genuine, righteous enthusiasm in life.",
      reference: "7.150.21"
    },
    commentary: "Drona Parva describes the war's 11th to 15th days under Drona's command. It contains the tragic entrapment of sixteen-year-old Abhimanyu in the Chakravyuh (labyrinth), which leads to intense grief, absolute determination, and ultimate battlefield justice.",
    parallel: {
      religion: "Sikhism",
      source: "Zafarnama Verse 22",
      similarity: "The tragic sacrifice of young, pure, and heroic warrior children in defense of righteousness against overwhelming odds.",
      lesson: "Even in moments of profound grief, draw on your deepest inner resources and keep your focus on moral duty."
    }
  },
  {
    number: 8,
    key: "karna",
    sanskrit: "कर्णपर्व",
    transliteration: "Karna Parva",
    translation: "Book of Karna",
    chapters: 96,
    subParvas: [
      "Karna Parva (Karna's command, his duel with Arjuna, and tragic fall)"
    ],
    verse: {
      originalText: "धर्मो धारयति प्रजाः । यत् स्याद् धारणसंयुक्तं स धर्म इति निश्चयः ॥",
      transliteration: "dharmo dhārayati prajāḥ | yat syād dhāraṇasaṁyuktaṁ sa dharma iti niścayaḥ",
      translation: "Dharma is that which sustains and holds together all living beings. Whatever supports social and cosmic integration is surely Dharma.",
      reference: "8.69.59"
    },
    commentary: "Karna Parva covers the 16th and 17th days of the war, where Karna takes supreme command. It portrays the legendary, tragic duel between Arjuna and Karna, illustrating how bad associations and a compromised ethical alignment can bring down a magnificent, generous hero.",
    parallel: {
      religion: "Buddhism",
      source: "Saddharmapundarika Sutra",
      similarity: "The true path of 'Lotus' righteousness that requires consistent pure associations, rather than loyalty to unrighteous masters.",
      lesson: "Recognize that immense personal talent and generosity are squandered if aligned with injustice and ego."
    }
  },
  {
    number: 9,
    key: "shalya",
    sanskrit: "शल्यपर्व",
    transliteration: "Shalya Parva",
    translation: "Book of Shalya",
    chapters: 65,
    subParvas: [
      "Shalya-vadha Parva (Slaying of Shalya)",
      "Hrada-pravesha Parva (Duryodhana hiding in the lake)",
      "Tirthayatra Parva (Balarama's peaceful pilgrimage down the Sarasvati)",
      "Gada-yuddha Parva (The final club fight of Bhima and Duryodhana)"
    ],
    verse: {
      originalText: "न हन्यते कीर्तिरपि प्रणाशे शरीरेऽपि मन्युर्मनसा नियच्छ ॥",
      transliteration: "na hanyate kīrtirapi praṇāśe śarīre'pi manyurmanasā niyaccha",
      translation: "When the body is destroyed, a person's noble legacy and honor are not destroyed; still your mind, and control your anger.",
      reference: "9.60.29"
    },
    commentary: "Shalya Parva depicts the final 18th day of the war. After Shalya falls, Duryodhana flees to hide in a sacred lake. He is discovered, leading to the ultimate mace battle (Gada-yuddha) with Bhima on the banks of Samantapanchaka.",
    parallel: {
      religion: "Islam",
      source: "Hadith on Jihad al-Nafs",
      similarity: "The transition from the outer material struggle to the internal spiritual purification and self-reckoning.",
      lesson: "External triumphs are hollow if the inner mind is not fully conquered and anchored in spiritual peace."
    }
  },
  {
    number: 10,
    key: "sauptika",
    sanskrit: "सौप्तिकपर्व",
    transliteration: "Sauptika Parva",
    translation: "Book of the Sleeping Warriors",
    chapters: 18,
    subParvas: [
      "Sauptika Parva (Ashwatthama's nocturnal massacre)",
      "Aishika Parva (The launching and neutralizing of Brahmashira weapons)"
    ],
    verse: {
      originalText: "क्रोधं नियच्छति न यो विजिगीषुरजितं मनः । तस्य क्रोधाद् विनश्यन्ति धर्माः पुण्याश्च सञ्चिताः ॥",
      transliteration: "krodhaṁ niyacchati na yo vijigīṣurajitaṁ manaḥ | tasya krodhād vinaśyanti dharmāḥ puṇyāśca sañcitāḥ",
      translation: "He who does not conquer his own mind and curb his anger loses all his accumulated virtues and moral merit in a single moment.",
      reference: "10.3.11"
    },
    commentary: "The Sauptika Parva describes the horrific nighttime raid by Ashwatthama on the sleeping Pandava camp. It is a cautionary book, showing how anger, despair, and the desire for vengeance can reduce highly advanced sages to acts of total barbarism.",
    parallel: {
      religion: "Christianity",
      source: "Matthew 26:52",
      similarity: "The warning that those who draw the sword of anger and vengeance will ultimately perish by it.",
      lesson: "Vengeance belongs only to the cosmic order; individual acts of revenge corrupt the soul and yield absolute destruction."
    }
  },
  {
    number: 11,
    key: "stri",
    sanskrit: "स्त्रीपर्व",
    transliteration: "Stri Parva",
    translation: "Book of the Women",
    chapters: 27,
    subParvas: [
      "Jalapradanika Parva (Offering of holy waters to deceased)",
      "Stri-vilapa Parva (Lamentation of Queen Gandhari and mothers)",
      "Shraddha Parva (Performing funeral obsequies for fallen warriors)"
    ],
    verse: {
      originalText: "शोचतो न प्रहीयेत दुःखं नोपशमं व्रजेत् । तस्माच्छोको न कर्तव्यो मनसा मन उपद्रवेत् ॥",
      transliteration: "śocato na prahīyeta duḥkhaṁ nopaśamaṁ vrajet | tasmācchoko na kartavyo manasā mana upadravet",
      translation: "Lamentation does not diminish grief, nor does it quiet pain. Therefore, do not cultivate excessive sorrow, which only wounds the mind further.",
      reference: "11.2.14"
    },
    commentary: "Stri Parva is a deeply moving book that depicts the grief of the women of Hastinapur (Gandhari, Kunti, Draupadi). Gandhari's curse of Krishna reveals the epic's raw psychological realism, reminding readers that war leaves only victims on both sides.",
    parallel: {
      religion: "Buddhism",
      source: "Story of Kisa Gotami",
      similarity: "The universal nature of grief and the realization that loss and death are absolute shared conditions of physical life.",
      lesson: "Mourn loss with absolute compassion, but recognize the universal transience of all physical forms."
    }
  },
  {
    number: 12,
    key: "shanti",
    sanskrit: "शान्तिपर्व",
    transliteration: "Shanti Parva",
    translation: "Book of Peace",
    chapters: 365,
    subParvas: [
      "Rajadharmanushasana Parva (Duties of kings and statecraft)",
      "Apaddharma Parva (Rules of conduct during extreme crises)",
      "Mokshadharma Parva (Systematic Upanishadic philosophy of liberation)"
    ],
    verse: {
      originalText: "न हि सत्यात् परो धर्मो नानृतात् पातकं परम् । स्थितिर्हि सत्यं धर्मस्य तस्मात् सत्यं न लोपयेत् ॥",
      transliteration: "na hi satyāt paro dharmo nānṛtāt pātakaṁ param | sthitirhi satyaṁ dharmasya tasmāt satyaṁ na lopayet",
      translation: "There is no Dharma superior to Truth, and no sin worse than falsehood. Truth is the very foundation of righteousness; therefore, never abandon Truth.",
      reference: "12.162.24"
    },
    commentary: "Shanti Parva is the massive philosophical centerpiece of the epic. From his bed of arrows, Bhishma instructs the grieving King Yudhisthira on statecraft, ethics during crisis (Apaddharma), and the profound philosophy of spiritual liberation (Mokshadharma).",
    parallel: {
      religion: "Daoism",
      source: "Tao Te Ching Chapter 57",
      similarity: "The description of a wise ruler who acts with absolute quietude, fairness, and truth to restore a devastated society.",
      lesson: "Let truth and quiet reflection be your ultimate refuge when recovering from deep traumatic experiences."
    }
  },
  {
    number: 13,
    key: "anushasana",
    sanskrit: "अनुशासनपर्व",
    transliteration: "Anushasana Parva",
    translation: "Book of Instruction",
    chapters: 168,
    subParvas: [
      "Anushasanika Parva (Bhishma's instructions on social duty, giving, and yoga)",
      "Bhishma-svargarohana Parva (Bhishma's conscious passing during Uttarayana)"
    ],
    verse: {
      originalText: "न तत् परस्य सन्दध्यात् प्रतिकूलं यदात्मनः । एष सङ्क्षेपतो धर्मः कामादन्यः प्रवर्तते ॥",
      transliteration: "na tat parasya sandadhyāt pratikūlaṁ yadātmanaḥ | eṣa saṅkṣepato dharmaḥ kāmādanyaḥ pravartate",
      translation: "One should never do to others what would be regarded as painful and adverse to oneself. This, in brief, is the essence of Dharma.",
      reference: "13.113.8"
    },
    commentary: "Anushasana Parva continues Bhishma's discourses, emphasizing charity, daily conduct, and the sacredness of all living beings. It contains the Vishnu Sahasranama (Thousand Names of Vishnu). It concludes with Bhishma's departure (svargarohana).",
    parallel: {
      religion: "Christianity",
      source: "Matthew 7:12",
      similarity: "The Golden Rule—treating others as you wish to be treated—is declared as the absolute essence of Mahabharata's Dharma.",
      lesson: "Act with absolute empathy, recognizing that the divine spark within you is identical to the spark in all other beings."
    }
  },
  {
    number: 14,
    key: "ashvamedhika",
    sanskrit: "आश्वमेधिकपर्व",
    transliteration: "Ashvamedhika Parva",
    translation: "Book of the Horse Sacrifice",
    chapters: 96,
    subParvas: [
      "Aswamedhika Parva (Preparations for Ashvamedha)",
      "Anugita Parva (Krishna's second instruction to Arjuna before leaving for Dwaraka)"
    ],
    verse: {
      originalText: "मनः समाधाय मनस्यमन्दं ततोऽपश्यद् विरजं ब्रह्म दिव्यम् ॥",
      transliteration: "manaḥ samādhāya manasyamandaṁ tato'paśyad virajaṁ brahma divyam",
      translation: "By fixing his quiet mind fully within his own consciousness, he beheld the pristine, luminous, and divine Brahman.",
      reference: "14.19.43"
    },
    commentary: "Ashvamedhika Parva details Yudhisthira's performance of the Ashvamedha sacrifice to restore imperial peace. It contains the 'Anugita', a secondary philosophical dialogue where Krishna reviews and deepens the teachings of the Bhagavad Gita.",
    parallel: {
      religion: "Buddhism",
      source: "Surangama Sutra",
      similarity: "Still-mind absorption and the internal realization of the clear, empty, and luminous nature of consciousness.",
      lesson: "Continuous study and spiritual review (Svadhyaya) are necessary to fully integrate wisdom into daily habit."
    }
  },
  {
    number: 15,
    key: "ashramavasika",
    sanskrit: "आश्रमवासिकपर्व",
    transliteration: "Ashramavasika Parva",
    translation: "Book of the Hermitage",
    chapters: 39,
    subParvas: [
      "Ashramavasa Parva (Dhritarashtra, Gandhari, and Kunti retiring to the forest)",
      "Putradarsana Parva (Sages invoking the spirits of the fallen warriors)",
      "Naradagamana Parva (Sage Narada bringing news of the forest fire)"
    ],
    verse: {
      originalText: "तपसा प्राप्यते सर्वं नास्ति तपसः दुष्करम् ॥",
      transliteration: "tapasā prāpyate sarvam nāsti tapasaḥ duṣkaram",
      translation: "Through focused discipline and voluntary purification (Tapas), everything is attained; nothing is impossible for Tapas.",
      reference: "15.34.12"
    },
    commentary: "This book portrays the elder generation—Dhritarashtra, Gandhari, and Kunti—retiring to a forest hermitage. It marks the transition from worldly engagement to spiritual reflection, highlighting the necessity of letting go of past attachments.",
    parallel: {
      religion: "Christianity",
      source: "Philippians 3:13-14",
      similarity: "Forgetting what lies behind and straining forward to what lies ahead, moving toward the ultimate high spiritual prize.",
      lesson: "Learn the art of graceful retirement and let go of past power or grievances to prepare for the final journey."
    }
  },
  {
    number: 16,
    key: "mausala",
    sanskrit: "मौसलपर्व",
    transliteration: "Mausala Parva",
    translation: "Book of the Clubs",
    chapters: 9,
    subParvas: [
      "Mausala Parva (The destruction of the Yadava clan and departure of Lord Krishna)"
    ],
    verse: {
      originalText: "कालो हि बलवान् सर्वं संक्षिपति कालचक्रं प्रधावति ॥",
      transliteration: "kālo hi balavān sarvaṁ saṅkṣipati kālacakraṁ pradhāvati",
      translation: "Time is all-powerful; it sweeps away all things in its path as the wheel of cosmic time runs its relentless course.",
      reference: "16.8.21"
    },
    commentary: "Mausala Parva depicts the destruction of the Yadava dynasty and the departure of Krishna. It is a sobering, tragic book, highlighting that even the most powerful, prosperous dynasties are subject to decay and dissolution under the law of Time.",
    parallel: {
      religion: "Islam",
      source: "Quran Surah 103 (Al-Asr)",
      similarity: "The absolute truth that all material creation and human endeavors are in a state of loss and decay through the passage of Time.",
      lesson: "Do not anchor your security in material possessions or political power, which are fragile and temporary."
    }
  },
  {
    number: 17,
    key: "mahaprasthanika",
    sanskrit: "महाप्रस्थानिकपर्व",
    transliteration: "Mahaprasthanika Parva",
    translation: "Book of the Great Journey",
    chapters: 3,
    subParvas: [
      "Mahaprasthanika Parva (Pandavas renouncing the throne and climbing the Himalayas)"
    ],
    verse: {
      originalText: "धर्म एव सहायोऽस्ति मानवानां परत्र वै । शरीरे भस्मसाद्भूते कर्मैव सह गच्छति ॥",
      transliteration: "dharma eva sahāyo'sti mānavānāṁ paratra vai | śarīre bhasmasādbhūte karmaiva saha gacchati",
      translation: "Righteousness (Dharma) alone accompanies a human soul into the hereafter. When the body turns to ashes, only one's actions travel along.",
      reference: "17.3.18"
    },
    commentary: "The Pandavas renounce their kingdom and begin their final pilgrimage up the Himalayas towards heaven. One by one, Draupadi and the brothers fall due to subtle attachments, leaving only Yudhisthira and a faithful dog representing Dharma.",
    parallel: {
      religion: "Buddhism",
      source: "Lalitavistara Sutra",
      similarity: "The Great Renunciation (Mahabhinishkramana)—leaving behind royal luxury and kingdoms to pursue the ultimate immortal truth.",
      lesson: "Cultivate absolute detachment; when you leave this world, you carry only the moral quality of your actions."
    }
  },
  {
    number: 18,
    key: "svargarohana",
    sanskrit: "स्वर्गारोहणपर्व",
    transliteration: "Svargarohana Parva",
    translation: "Book of Ascent to Heaven",
    chapters: 6,
    subParvas: [
      "Svargarohana Parva (Yudhisthira's final test in the underworld and entry into ultimate spiritual peace)"
    ],
    verse: {
      originalText: "न जातु कामाद् न भयाद् न लोभाद् धर्मं त्यजेज् जीवितस्यापि हेतोः । नित्यो धर्मः सुखदुःखे त्वनिले नित्यो जीवो धातुरस्य तु हेतोः ॥",
      transliteration: "na jātu kāmād na bhayād na lobhād dharmaṁ tyajej jīvitasyāpi hetoḥ | nityo dharmaḥ sukhaduḥkhe tvanile nityo jīvo dhāturasya tu hetoḥ",
      translation: "Never abandon Dharma—neither for desire, nor out of fear, nor for greed, nor even to save your life. Dharma is eternal; pleasure and pain are transient, as is the individual soul, but the ground of cosmic consciousness is forever.",
      reference: "18.5.50"
    },
    commentary: "The final book presents Yudhisthira's ultimate test. Offered heaven while his brothers suffer in a deceptive underworld illusion, he refuses to abandon them, demonstrating perfect, selfless compassion. The illusion dissolves, and they are all united in absolute non-dual bliss.",
    parallel: {
      religion: "Buddhism",
      source: "Bodhisattva Vow",
      similarity: "The refusal to enter personal nirvana or heaven while other living beings are suffering in delusion and pain.",
      lesson: "True spiritual enlightenment is completed only when personal ego is fully dissolved into universal, compassionate service."
    }
  }
];

export function getMahabharataParvaName(n: number): string {
  const parva = MAHABHARATA_PARVAS.find(p => p.number === n);
  if (parva) {
    return `${parva.number}. ${parva.transliteration} (${parva.translation})`;
  }
  return `Parva ${n}`;
}
