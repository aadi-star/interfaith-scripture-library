/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Upanishad {
  number: number;
  name: string;
  translation: string;
  category: "Mukhya" | "Samanya" | "Sannyasa" | "Yoga" | "Shaiva" | "Vaishnava" | "Shakta";
  veda: "Rigveda" | "Samaveda" | "Shukla Yajurveda" | "Krishna Yajurveda" | "Atharvaveda";
  keyInsight: string;
}

export const UPANISHADS_108: Upanishad[] = [
  {
    number: 1,
    name: "Isha",
    translation: "The Inner Ruler",
    category: "Mukhya",
    veda: "Shukla Yajurveda",
    keyInsight: "Proclaims that everything in this changing cosmos is pervaded by the singular Divine; one should enjoy life through renunciation."
  },
  {
    number: 2,
    name: "Kena",
    translation: "By Whom?",
    category: "Mukhya",
    veda: "Samaveda",
    keyInsight: "Inquires into the unseen power behind the mind and senses, revealing that Brahman is the ultimate Knower behind all perception."
  },
  {
    number: 3,
    name: "Katha",
    translation: "Death as the Teacher",
    category: "Mukhya",
    veda: "Krishna Yajurveda",
    keyInsight: "A dialogue between young Nachiketa and Yama (the God of Death) revealing the immortality of the individual Self (Atman)."
  },
  {
    number: 4,
    name: "Prashna",
    translation: "The Six Questions",
    category: "Mukhya",
    veda: "Atharvaveda",
    keyInsight: "Six disciples ask a sage six profound questions about the origin of life, the nature of Prana (life-force), and consciousness."
  },
  {
    number: 5,
    name: "Mundaka",
    translation: "The Shaven-Headed Seekers",
    category: "Mukhya",
    veda: "Atharvaveda",
    keyInsight: "Distinguishes between higher spiritual knowledge and lower worldly knowledge, using the metaphor of two birds on a single tree."
  },
  {
    number: 6,
    name: "Mandukya",
    translation: "The State of Consciousness",
    category: "Mukhya",
    veda: "Atharvaveda",
    keyInsight: "Analyzes the four states of human consciousness—waking, dreaming, deep sleep, and Turiya—and maps them to the syllable A-U-M."
  },
  {
    number: 7,
    name: "Taittiriya",
    translation: "The Sheaths of Being",
    category: "Mukhya",
    veda: "Krishna Yajurveda",
    keyInsight: "Explores the five layers of human existence (Koshas) and declares the absolute, non-dual essence of spiritual bliss."
  },
  {
    number: 8,
    name: "Aitareya",
    translation: "Primordial Consciousness",
    category: "Mukhya",
    veda: "Rigveda",
    keyInsight: "Traces the creation of the universe and declares the ultimate spiritual Mahavakya: 'Prajnanam Brahma' (Consciousness is Brahman)."
  },
  {
    number: 9,
    name: "Chandogya",
    translation: "The Sacred Song",
    category: "Mukhya",
    veda: "Samaveda",
    keyInsight: "Contains the sublime teaching of Sage Uddalaka to his son Shvetaketu, concluding in the Mahavakya: 'Tat Tvam Asi' (Thou Art That)."
  },
  {
    number: 10,
    name: "Brihadaranyaka",
    translation: "The Great Forest Upanishad",
    category: "Mukhya",
    veda: "Shukla Yajurveda",
    keyInsight: "The largest Upanishad, showcasing Yajnavalkya's dialogues on the absolute Atman and the passage from darkness to light."
  },
  {
    number: 11,
    name: "Brahma",
    translation: "The Eternal Reality",
    category: "Sannyasa",
    veda: "Krishna Yajurveda",
    keyInsight: "Outlines the nature of internal renunciation and explains the symbolic meaning of the sacred thread and the hair tuft."
  },
  {
    number: 12,
    name: "Kaivalya",
    translation: "Formless Liberation",
    category: "Shaiva",
    veda: "Krishna Yajurveda",
    keyInsight: "Teaches the attainment of absolute solitude and liberation through meditation on Lord Shiva as the innermost Self of all."
  },
  {
    number: 13,
    name: "Jabala",
    translation: "The Sage Jabala",
    category: "Sannyasa",
    veda: "Shukla Yajurveda",
    keyInsight: "Extols the holy city of Varanasi as a symbol of the inner third eye and provides rules for formal spiritual renunciation (Sannyasa)."
  },
  {
    number: 14,
    name: "Shvetashvatara",
    translation: "The White Mule",
    category: "Shaiva",
    veda: "Krishna Yajurveda",
    keyInsight: "Presents a beautiful synthesis of non-dual monism and intense personal devotion to Shiva, the cosmic Lord of Maya."
  },
  {
    number: 15,
    name: "Hamsa",
    translation: "The Divine Swan",
    category: "Yoga",
    veda: "Shukla Yajurveda",
    keyInsight: "Explores the internal sound of the natural breath representing the realization of 'Soham' (I am He) in the heart lotus."
  },
  {
    number: 16,
    name: "Aruni",
    translation: "The Sage Aruni",
    category: "Sannyasa",
    veda: "Samaveda",
    keyInsight: "Focuses on the complete abandonment of external rituals and familial ties to dwell purely in the silent contemplation of Brahman."
  },
  {
    number: 17,
    name: "Garbha",
    translation: "The Embryo",
    category: "Samanya",
    veda: "Krishna Yajurveda",
    keyInsight: "An analytical study of human embryology, depicting the biological development of the fetus as a temple of the indwelling soul."
  },
  {
    number: 18,
    name: "Narayana",
    translation: "The Supreme Lord Vishnu",
    category: "Vaishnava",
    veda: "Krishna Yajurveda",
    keyInsight: "Exalts Lord Narayana (Vishnu) as the ultimate source, maintainer, and absorption point of the entire cosmic creation."
  },
  {
    number: 19,
    name: "Paramahamsa",
    translation: "The Supreme Swan",
    category: "Sannyasa",
    veda: "Krishna Yajurveda",
    keyInsight: "Portrays the high state of the liberated wandering monk who has transcended all dualities, social conventions, and scriptures."
  },
  {
    number: 20,
    name: "Amritabindu",
    translation: "The Drop of Immortality",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Declares that the mind is the sole cause of both bondage and liberation, advocating for its purification and quietude."
  },
  {
    number: 21,
    name: "Amritanada",
    translation: "The Nectar-Sound",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Detailed guide on the six limbs of yoga (Pratyahara, Dharana, Pranayama, Dhyana, Tarka, Samadhi) to reach immortal consciousness."
  },
  {
    number: 22,
    name: "Atharvashira",
    translation: "The Crown of Atharva",
    category: "Shaiva",
    veda: "Atharvaveda",
    keyInsight: "The deities praise Rudra (Shiva) as the singular source, substance, and destination of the entire manifest universe."
  },
  {
    number: 23,
    name: "Atharvashikha",
    translation: "The Crest of Atharva",
    category: "Shaiva",
    veda: "Atharvaveda",
    keyInsight: "Exalts meditation on the three-and-a-half measures of the sacred syllable OM as Shiva, the supreme cosmic light."
  },
  {
    number: 24,
    name: "Maitrayani",
    translation: "The Sage Maitri's Dialogue",
    category: "Samanya",
    veda: "Krishna Yajurveda",
    keyInsight: "Presents the soul's journey through cosmic time, the nature of cosmic energy, and the transient nature of worldly existence."
  },
  {
    number: 25,
    name: "Kaushitaki",
    translation: "The Sage Kaushitaki",
    category: "Samanya",
    veda: "Rigveda",
    keyInsight: "Deals with the soul's journey after death through various celestial spheres and establishes the absolute identity of Prana and Brahman."
  },
  {
    number: 26,
    name: "Brihajjabala",
    translation: "The Great Jabala",
    category: "Shaiva",
    veda: "Atharvaveda",
    keyInsight: "Explores the metaphysical and purificatory significance of applying Bhasma (sacred ash) and wearing Rudraksha beads."
  },
  {
    number: 27,
    name: "Nrisimhatapaniya",
    translation: "Meditation on Narasimha",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "Focuses on the esoteric meanings of the Narasimha-Mantra and the realization of the non-dual protector deity as absolute."
  },
  {
    number: 28,
    name: "Kalagnirudra",
    translation: "The Fire of Rudra",
    category: "Shaiva",
    veda: "Krishna Yajurveda",
    keyInsight: "Explains the sacred meaning of the three horizontal lines of sacred ash (Tripundra) painted on the seeker's forehead."
  },
  {
    number: 29,
    name: "Subala",
    translation: "The Sage Subala",
    category: "Samanya",
    veda: "Shukla Yajurveda",
    keyInsight: "A grand cosmological dialogue detailing the sequential dissolution of elements back into Narayana, the supreme ground."
  },
  {
    number: 30,
    name: "Kshurika",
    translation: "The Razor-Sharp Mind",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Describes the razor-sharp focus required to sever worldly attachments and elevate the life-force (Prana) through subtle channels."
  },
  {
    number: 31,
    name: "Yogatattva",
    translation: "The Truth of Yoga",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "A highly comprehensive manual detailing Mantra, Laya, Hatha, and Raja Yoga, along with physical side-effects and control of elements."
  },
  {
    number: 32,
    name: "Tejobindu",
    translation: "The Point of Light",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Dwells on the supreme point of light, explaining the highest non-dual contemplation, Samadhi, and formless Brahman-hood."
  },
  {
    number: 33,
    name: "Dhyanabindu",
    translation: "The Point of Meditation",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Provides structured instructions on meditating upon the syllable OM, the inner Bindu, and the chakras of the energetic body."
  },
  {
    number: 34,
    name: "Brahmavidya",
    translation: "The Wisdom of Brahman",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Explores the deep resonance and pronunciation of OM, guiding the practitioner from sound to the absolute silence of Brahman."
  },
  {
    number: 35,
    name: "Yogashikha",
    translation: "The Crest of Yoga",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Explains how the absolute spirit (Shiva) and the individual soul (Jiva) are united through the awakening of the inner Kundalini fire."
  },
  {
    number: 36,
    name: "Yogachudamani",
    translation: "The Crown Jewel of Yoga",
    category: "Yoga",
    veda: "Samaveda",
    keyInsight: "A key text explaining the biological and spiritual secrets of the human energetic channels, mudras, and breath control."
  },
  {
    number: 37,
    name: "Nirvana",
    translation: "Formless Extinction",
    category: "Sannyasa",
    veda: "Rigveda",
    keyInsight: "An aphoristic and deeply mystical text describing the ultimate state of a liberated sage as one of formless, unbounded bliss."
  },
  {
    number: 38,
    name: "Mandalabrahmana",
    translation: "The Sun-Circle Revelation",
    category: "Yoga",
    veda: "Shukla Yajurveda",
    keyInsight: "A dialogue between Sage Yajnavalkya and Surya (the Sun God) revealing the secrets of internal light and Raja Yoga."
  },
  {
    number: 39,
    name: "Dakshinamurti",
    translation: "Shiva as the South-Facing Teacher",
    category: "Shaiva",
    veda: "Krishna Yajurveda",
    keyInsight: "Contemplates Shiva as Dakshinamurti, the youthful and silent guru who dissolves the doubts of aged disciples through silence."
  },
  {
    number: 40,
    name: "Sharabha",
    translation: "The Sacred Sharabha Winged Beast",
    category: "Shaiva",
    veda: "Atharvaveda",
    keyInsight: "Praises Shiva in his majestic, multi-limbed creature form who subdues Narasimha and brings peace back to the cosmic elements."
  },
  {
    number: 41,
    name: "Skanda",
    translation: "The Youthful War God",
    category: "Samanya",
    veda: "Krishna Yajurveda",
    keyInsight: "Proclaims the complete non-difference between Shiva and Vishnu (Hari and Hara), declaring both as the single flame of consciousness."
  },
  {
    number: 42,
    name: "Tripadvibhuti Mahanarayana",
    translation: "The Infinite Glory of Narayana",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "A monumental metaphysical scripture mapping the physical universe and the infinite, eternal spiritual realms of Vishnu."
  },
  {
    number: 43,
    name: "Advayataraka",
    translation: "The Non-Dual Ferryman",
    category: "Yoga",
    veda: "Shukla Yajurveda",
    keyInsight: "An esoteric guide to realizing non-dual Brahman through light-contemplation (Taraka) and recognizing inner spiritual light."
  },
  {
    number: 44,
    name: "Ramarahasya",
    translation: "The Secret of Lord Rama",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "Reveals the mystic significance of Rama's mantras, his yantras, and declares Rama as the non-dual supreme absolute Brahman."
  },
  {
    number: 45,
    name: "Ramatapaniya",
    translation: "The Devotion to Rama",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "Establishes Lord Rama as the supreme reality, explaining his external avatar, his cosmic seed-mantra, and absolute realization."
  },
  {
    number: 46,
    name: "Vasudeva",
    translation: "The Mark of Vishnu",
    category: "Vaishnava",
    veda: "Samaveda",
    keyInsight: "Details the sacred preparation and application of the vertical clay forehead markings (Urdhva-Pundra) of the Vaishnava tradition."
  },
  {
    number: 47,
    name: "Mudgala",
    translation: "The Sage Mudgala",
    category: "Samanya",
    veda: "Rigveda",
    keyInsight: "An exquisite philosophical interpretation of the Rigvedic Purusha Sukta, identifying the cosmic Purusha with Vasudeva."
  },
  {
    number: 48,
    name: "Shandilya",
    translation: "The Sage Shandilya",
    category: "Yoga",
    veda: "Atharvaveda",
    keyInsight: "A major Hatha Yoga scripture outlining Yamas, Niyamas, eight types of Pranayama, and the spiritual awakening of Kundalini."
  },
  {
    number: 49,
    name: "Paingala",
    translation: "The Sage Paingala",
    category: "Samanya",
    veda: "Shukla Yajurveda",
    keyInsight: "Yajnavalkya explains to Paingala the process of cosmic manifestation, the five sheaths, and the experience of ultimate liberation."
  },
  {
    number: 50,
    name: "Bhikshu",
    translation: "The Mendicant Monk",
    category: "Sannyasa",
    veda: "Shukla Yajurveda",
    keyInsight: "Classifies wandering spiritual seekers into four distinct stages based on their degree of attachment: Kutichaka, Bahudaka, Hamsa, and Paramahamsa."
  },
  {
    number: 51,
    name: "Mahat",
    translation: "The Great Spirit",
    category: "Samanya",
    veda: "Samaveda",
    keyInsight: "A poetic dialogue on the cosmic soul (Mahat-Atman), the vast universe, and the dissolution of the ego and proprietary claims."
  },
  {
    number: 52,
    name: "Shariraka",
    translation: "The Physical Body",
    category: "Samanya",
    veda: "Krishna Yajurveda",
    keyInsight: "Analyzes the physical body, describing the five elements, the organs, senses, and the indwelling witness consciousness."
  },
  {
    number: 53,
    name: "Trishikhibrahmana",
    translation: "The Three-Crested Priest",
    category: "Yoga",
    veda: "Shukla Yajurveda",
    keyInsight: "Explores the manifestation of Shiva, the deep structure of the energetic body, and the daily practice of classical Ashtanga Yoga."
  },
  {
    number: 54,
    name: "Turiyatita",
    translation: "Beyond the Fourth State",
    category: "Sannyasa",
    veda: "Shukla Yajurveda",
    keyInsight: "Delineates the life of the Avadhuta who has gone beyond waking, dreaming, sleeping, and Turiya into formless absolute oneness."
  },
  {
    number: 55,
    name: "Sannyasa",
    translation: "The Renunciation",
    category: "Sannyasa",
    veda: "Krishna Yajurveda",
    keyInsight: "Details the procedures and mental attitude for discarding external social duties, family bonds, and the home to seek truth."
  },
  {
    number: 56,
    name: "Paramahamsaparivrajaka",
    translation: "The Supreme Wandering Monk",
    category: "Sannyasa",
    veda: "Atharvaveda",
    keyInsight: "A comprehensive manual detailing the code of conduct, symbols, vows, and ultimate realization of the true wandering renunciate."
  },
  {
    number: 57,
    name: "Akshamalika",
    translation: "The Sacred Rosary",
    category: "Shaiva",
    veda: "Rigveda",
    keyInsight: "Teaches the hidden Sanskrit energy codes and the proper spiritual consecration of a Rudraksha or Sphatika bead rosary."
  },
  {
    number: 58,
    name: "Avyakta",
    translation: "The Unmanifest",
    category: "Vaishnava",
    veda: "Shukla Yajurveda",
    keyInsight: "A cosmogenic myth describing how the universe was projected from formless unmanifest space by the power of Lord Narasimha."
  },
  {
    number: 59,
    name: "Ekakshara",
    translation: "The One-Syllable Truth",
    category: "Samanya",
    veda: "Krishna Yajurveda",
    keyInsight: "An exquisite celebration of the absolute Brahman as the singular, undying syllable OM, the support of all change."
  },
  {
    number: 60,
    name: "Annapurna",
    translation: "The Goddess of Nourishment",
    category: "Shakta",
    veda: "Atharvaveda",
    keyInsight: "A beautiful dialogue between Ribhu and Nidagha on the Goddess Annapurna, conveying that true spiritual peace lies in absolute non-attachment."
  },
  {
    number: 61,
    name: "Surya",
    translation: "The Solar Deity",
    category: "Samanya",
    veda: "Atharvaveda",
    keyInsight: "Celebrates the Sun (Surya-Narayana) as the outer manifestation of the Supreme Self, the creator, maintainer, and destroyer of all."
  },
  {
    number: 62,
    name: "Akshi",
    translation: "The Divine Eye",
    category: "Samanya",
    veda: "Krishna Yajurveda",
    keyInsight: "Reveals the Solar Wisdom (Chakshushmati Vidya) and outlines the seven progressive stages of absolute spiritual enlightenment."
  },
  {
    number: 63,
    name: "Adhyatma",
    translation: "The Innermost Self",
    category: "Samanya",
    veda: "Shukla Yajurveda",
    keyInsight: "Instructs on meditating upon the innermost spiritual Atman, resulting in the instantaneous burning of all past karmas and ego-illusions."
  },
  {
    number: 64,
    name: "Kundika",
    translation: "The Water-Pot",
    category: "Sannyasa",
    veda: "Samaveda",
    keyInsight: "Describes the simple possessions (like the water-pot) of a sannyasi and explains the inner yoga of internal renunciation."
  },
  {
    number: 65,
    name: "Savitri",
    translation: "The Solar energy",
    category: "Samanya",
    veda: "Samaveda",
    keyInsight: "Explores the deeper cosmic, masculine-feminine balance represented in the Savitri-mantra and the inner light of consciousness."
  },
  {
    number: 66,
    name: "Atma",
    translation: "The Individual Spirit",
    category: "Samanya",
    veda: "Atharvaveda",
    keyInsight: "Classifies the human self into three layers: the external body, the inner thinking soul, and the supreme transcendent witness (Paramatman)."
  },
  {
    number: 67,
    name: "Pashupatabrahmana",
    translation: "The Lord of Beings",
    category: "Yoga",
    veda: "Atharvaveda",
    keyInsight: "Presents Shiva as Pashupati (the Lord of all bound creatures), teaching breath control and internal fire-meditations for liberation."
  },
  {
    number: 68,
    name: "Parabrahma",
    translation: "The Transcendent Reality",
    category: "Sannyasa",
    veda: "Atharvaveda",
    keyInsight: "Declares that the true sacred thread and hair-tuft are the inner, invisible realization of Brahman rather than physical cords."
  },
  {
    number: 69,
    name: "Avadhuta",
    translation: "The Completely Free Sage",
    category: "Sannyasa",
    veda: "Krishna Yajurveda",
    keyInsight: "Describes the state of the fully awakened Avadhuta sage who wanders without fear, shame, or conforming to societal constraints."
  },
  {
    number: 70,
    name: "Tripuratapini",
    translation: "The Goddess of the Three Cities",
    category: "Shakta",
    veda: "Atharvaveda",
    keyInsight: "Details the mystic energy of the Goddess Tripura, her sacred geometric diagram (Sri Yantra), and non-dual Shakta theology."
  },
  {
    number: 71,
    name: "Devi",
    translation: "The Goddess",
    category: "Shakta",
    veda: "Atharvaveda",
    keyInsight: "The gods ask the Supreme Goddess (Devi) who she is; she reveals herself as the single foundational energy of all cosmos."
  },
  {
    number: 72,
    name: "Tripura",
    translation: "The Three Sacred Spheres",
    category: "Shakta",
    veda: "Rigveda",
    keyInsight: "Explores the three spiritual aspects of cosmic beauty and energy governed by the supreme Goddess Tripura Sundari."
  },
  {
    number: 73,
    name: "Kathashruti",
    translation: "The Sacred Hearing",
    category: "Sannyasa",
    veda: "Krishna Yajurveda",
    keyInsight: "Details the ultimate Sannyasa rites, showing how the seeker throws their ritual fires into their own breath and walks away free."
  },
  {
    number: 74,
    name: "Satyayaniya",
    translation: "The Adherent of Truth",
    category: "Sannyasa",
    veda: "Shukla Yajurveda",
    keyInsight: "Describes the ethical standards, spiritual character, and pure life of the renunciate who holds truth (Satya) as their highest vow."
  },
  {
    number: 75,
    name: "Pranagnihotra",
    translation: "The Internal Fire Sacrifice",
    category: "Samanya",
    veda: "Krishna Yajurveda",
    keyInsight: "Replaces the external Vedic fire sacrifice with the internal eating process, where food is offered as a sacrifice to the inner life-force (Prana)."
  },
  {
    number: 76,
    name: "Vajrasuchika",
    translation: "The Diamond-Point Needle",
    category: "Samanya",
    veda: "Samaveda",
    keyInsight: "A revolutionary and logical text refuting caste by birth, declaring that a true Brahmana is defined solely by self-realization."
  },
  {
    number: 77,
    name: "Gopalatapaniya",
    translation: "The Devotion to Lord Gopala",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "An exquisite and loving text establishing Lord Krishna (Gopala) as the supreme origin of light, sound, and cosmic creation."
  },
  {
    number: 78,
    name: "Krishna",
    translation: "The Playful Creator",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "Identifies the playful sports (Lila) of Krishna in Vrindavan as symbols of the eternal cosmic dance of the ultimate Spirit."
  },
  {
    number: 79,
    name: "Hayagriva",
    translation: "The Horse-Headed Vishnu",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "Praises Lord Hayagriva, the horse-headed form of Vishnu, who rescues the Vedas and bestows supreme speech and intelligence."
  },
  {
    number: 80,
    name: "Dattatreya",
    translation: "The Cosmic Monk Dattatreya",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "Glorifies Lord Dattatreya as the singular combined manifestation of Brahma, Vishnu, and Shiva, revealing his sacred chants."
  },
  {
    number: 81,
    name: "Garuda",
    translation: "The Sacred Cosmic Eagle",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "Details the mystic sound-codes and meditations of Garuda (the cosmic bird) used to neutralize toxins and dispel fear."
  },
  {
    number: 82,
    name: "Kalisantarana",
    translation: "Crossing the Dark Age of Kali",
    category: "Vaishnava",
    veda: "Krishna Yajurveda",
    keyInsight: "Reveals the famous Hare Krishna Mahamantra as the easiest and most powerful vehicle to cross the turbulent ocean of the dark age."
  },
  {
    number: 83,
    name: "Jabali",
    translation: "The Sage Jabali",
    category: "Shaiva",
    veda: "Samaveda",
    keyInsight: "Presents a dialogue with Sage Jabali on the absolute witness consciousness and the significance of applying sacred ash (Bhasma)."
  },
  {
    number: 84,
    name: "Saubhagyalakshmi",
    translation: "The Goddess of Prosperity",
    category: "Shakta",
    veda: "Rigveda",
    keyInsight: "Explicates the worship of Goddess Lakshmi, detailing her yogic mantras, physical postures, and formless spiritual abundance."
  },
  {
    number: 85,
    name: "Sarasvatirahasya",
    translation: "The Secret of Sarasvati",
    category: "Shakta",
    veda: "Krishna Yajurveda",
    keyInsight: "A devotional and highly poetic text singing the glory of the Goddess of Wisdom, mapping her to the supreme non-dual intelligence."
  },
  {
    number: 86,
    name: "Bahvricha",
    translation: "The Goddess of the Many Hymns",
    category: "Shakta",
    veda: "Rigveda",
    keyInsight: "A key Shakta text declaring that the Goddess (Tripurasundari) is the single underlying consciousness behind the entire universe."
  },
  {
    number: 87,
    name: "Maitreyi",
    translation: "The Dialogue of Maitreyi",
    category: "Sannyasa",
    veda: "Samaveda",
    keyInsight: "Dialogue between Maitreyi and Sage Yajnavalkya on the transience of wealth and the realization that the Self is the source of all love."
  },
  {
    number: 88,
    name: "Kaushitaki",
    translation: "The Kaushitaki Recension",
    category: "Samanya",
    veda: "Rigveda",
    keyInsight: "Explores the psychological functions of the mind, the journey of the soul to Brahmaloka, and the life-breath as Brahman."
  },
  {
    number: 89,
    name: "Brihajjabala",
    translation: "The Great Jabala Lore",
    category: "Shaiva",
    veda: "Atharvaveda",
    keyInsight: "Elaborates on the fivefold classification of sacred ash and the inner purification required to behold Shiva."
  },
  {
    number: 90,
    name: "Nrisimhatapaniya",
    translation: "The Narasimha Contemplation",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "Details the mystical diagrams (Yantras) of Narasimha and the ultimate realization of the absolute non-dual cosmic roar."
  },
  {
    number: 91,
    name: "Kalagnirudra",
    translation: "The Fire of Rudra",
    category: "Shaiva",
    veda: "Krishna Yajurveda",
    keyInsight: "Deepens the spiritual and yogic understanding of the Tripundra markings and the dynamic cosmic fire of destruction."
  },
  {
    number: 92,
    name: "Subala",
    translation: "The Cosmic Dialogue",
    category: "Samanya",
    veda: "Shukla Yajurveda",
    keyInsight: "A grand discourse on the creation of the cosmic egg, the senses, and the ultimate merging of all objects back into Narayana."
  },
  {
    number: 93,
    name: "Kshurika",
    translation: "The Razor of Concentration",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Describes meditation as a razor-sharp instrument that cuts the bonds of karma and frees the soul from physical identification."
  },
  {
    number: 94,
    name: "Yogatattva",
    translation: "The Essence of Yoga",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Details the alignment of the human body's element points with the universal elements, enabling extraordinary sensory control."
  },
  {
    number: 95,
    name: "Tejobindu",
    translation: "The Drop of Light",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Celebrates the absolute state of Jivanmukti (liberated while alive) as one of pure, unblemished bliss and absolute non-difference."
  },
  {
    number: 96,
    name: "Dhyanabindu",
    translation: "The Drop of Meditation",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Details the visual and sonic meditation on OM, the three lines of the syllable, and the awakening of the heart energy."
  },
  {
    number: 97,
    name: "Brahmavidya",
    translation: "The Supreme Brahman Science",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Teaches the subtle science of soundless recitation and the ultimate experience of merging into the silent ocean of spirit."
  },
  {
    number: 98,
    name: "Yogashikha",
    translation: "The Peak of Yoga",
    category: "Yoga",
    veda: "Krishna Yajurveda",
    keyInsight: "Dwells on the union of Prana and Apana, and the ascension of light through the Sushumna channel as the ultimate human feat."
  },
  {
    number: 99,
    name: "Yogachudamani",
    translation: "The Crest of Yoga Practice",
    category: "Yoga",
    veda: "Samaveda",
    keyInsight: "Outlines the precise control of the physical postures, mudras, and mantras for the stabilization of the spiritual mind."
  },
  {
    number: 100,
    name: "Nirvana",
    translation: "Formless Peace",
    category: "Sannyasa",
    veda: "Rigveda",
    keyInsight: "Describes the absolute stillness and peaceful mind of the master who has fully cast aside all physical and mental identities."
  },
  {
    number: 101,
    name: "Mandalabrahmana",
    translation: "The Sun-Wisdom Dialogue",
    category: "Yoga",
    veda: "Shukla Yajurveda",
    keyInsight: "Outlines the solar meditation and the visual realization of the cosmic blue light within the forehead space."
  },
  {
    number: 102,
    name: "Dakshinamurti",
    translation: "The Silent Guru",
    category: "Shaiva",
    veda: "Krishna Yajurveda",
    keyInsight: "Exalts Shiva as the youthful teacher who sits in absolute silence under the banyan tree, revealing the timeless truth."
  },
  {
    number: 103,
    name: "Sharabha",
    translation: "The Multi-Limbed Protector",
    category: "Shaiva",
    veda: "Atharvaveda",
    keyInsight: "Celebrates the fierce energy of Shiva that transcends and balances all form, protecting the universe from destructive forces."
  },
  {
    number: 104,
    name: "Skanda",
    translation: "The Divine Fire",
    category: "Samanya",
    veda: "Krishna Yajurveda",
    keyInsight: "Declares that the physical body is a temporary shell; the real indwelling occupant is the immortal, birthless, and deathless Lord."
  },
  {
    number: 105,
    name: "Tripadvibhuti Mahanarayana",
    translation: "The Grand Glory of Vishnu",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "Deepens the spiritual geography of Vaikuntha (the spiritual realm), demonstrating that the entire cosmos is but a tiny fraction of it."
  },
  {
    number: 106,
    name: "Advayataraka",
    translation: "The Absolute Ferryman",
    category: "Yoga",
    veda: "Shukla Yajurveda",
    keyInsight: "Focuses on the visual perception of the inner blue light (Aura) and the sound of the internal unstruck bell (Anahata)."
  },
  {
    number: 107,
    name: "Ramarahasya",
    translation: "The Secret of Rama-Brahman",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "Explains how chanting Rama's name with deep concentration dissolves the ego and leads directly to non-dual Brahman-realization."
  },
  {
    number: 108,
    name: "Ramatapaniya",
    translation: "The Devotion to Rama-Brahman",
    category: "Vaishnava",
    veda: "Atharvaveda",
    keyInsight: "Concludes the Muktika Canon by declaring that Lord Rama is the supreme, formless absolute light who resides in the hearts of all."
  }
];
