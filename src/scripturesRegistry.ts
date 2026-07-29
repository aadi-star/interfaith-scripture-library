/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScriptureBook } from "./types";
import { UPANISHADS_108 } from "./data/upanishads";
import { AGAMAS_200 } from "./data/agamas";

export const RELIGION_LABELS: Record<string, string> = {
  hinduism: "Hinduism",
  islam: "Islam",
  christianity: "Christianity",
  judaism: "Judaism",
  buddhism: "Buddhism",
  jainism: "Jainism",
  sikhism: "Sikhism",
  mythology: "Mythology & Lore",
  history: "Historical Epics & Lore",
  space: "Cosmic & Space Chronicles",
  other: "Other Sacred Texts",
  prayers: "Prayers, Slokas & Aartis",
};

export const RELIGION_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  hinduism: {
    bg: "bg-amber-50/70",
    text: "text-amber-900",
    border: "border-amber-200",
    accent: "bg-amber-600 text-white hover:bg-amber-700",
  },
  islam: {
    bg: "bg-emerald-50/70",
    text: "text-emerald-950",
    border: "border-emerald-200",
    accent: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  christianity: {
    bg: "bg-indigo-50/70",
    text: "text-indigo-900",
    border: "border-indigo-200",
    accent: "bg-indigo-600 text-white hover:bg-indigo-700",
  },
  judaism: {
    bg: "bg-blue-50/70",
    text: "text-blue-900",
    border: "border-blue-200",
    accent: "bg-blue-600 text-white hover:bg-blue-700",
  },
  buddhism: {
    bg: "bg-rose-50/70",
    text: "text-rose-900",
    border: "border-rose-200",
    accent: "bg-rose-600 text-white hover:bg-rose-700",
  },
  jainism: {
    bg: "bg-orange-50/70",
    text: "text-orange-900",
    border: "border-orange-200",
    accent: "bg-orange-600 text-white hover:bg-orange-700",
  },
  sikhism: {
    bg: "bg-yellow-50/70",
    text: "text-yellow-950",
    border: "border-yellow-200",
    accent: "bg-yellow-600 text-white hover:bg-yellow-700",
  },
  mythology: {
    bg: "bg-violet-900/20",
    text: "text-violet-300",
    border: "border-violet-500/20",
    accent: "bg-violet-500 text-black hover:bg-violet-400",
  },
  history: {
    bg: "bg-cyan-900/20",
    text: "text-cyan-300",
    border: "border-cyan-500/20",
    accent: "bg-cyan-500 text-black hover:bg-cyan-400",
  },
  space: {
    bg: "bg-fuchsia-900/20",
    text: "text-fuchsia-300",
    border: "border-fuchsia-500/20",
    accent: "bg-fuchsia-500 text-black hover:bg-fuchsia-400",
  },
  other: {
    bg: "bg-slate-50/70",
    text: "text-slate-900",
    border: "border-slate-200",
    accent: "bg-slate-600 text-white hover:bg-slate-700",
  },
  prayers: {
    bg: "bg-emerald-900/20",
    text: "text-emerald-300",
    border: "border-emerald-500/20",
    accent: "bg-emerald-500 text-black hover:bg-emerald-400",
  },
};

export const SCRIPTURE_BOOKS: ScriptureBook[] = [
  // --- HINDUISM ---
  {
    key: "mahapuranas",
    title: "Mahapuranas (महापुराणाणि)",
    originalTitle: "महापुराणाणि",
    religion: "hinduism",
    description: "The 18 traditional Mahapuranas of Hinduism detailing creation, cosmology, genealogies of kings and sages, philosophical discourses, and divine legends.",
    divisionsName: "Purana",
    divisionsCount: 18,
    featuredPortions: [
      { name: "1. Brahma Purana", reference: "1", topicMessage: "The Adi Purana detailing creation and solar worship." },
      { name: "2. Padma Purana", reference: "2", topicMessage: "Cosmology and pilgrimage sites across the sacred earth." },
      { name: "3. Vishnu Purana", reference: "3", topicMessage: "Detailed genealogies, Vishnu avatars, and Vaishnava philosophy." },
      { name: "4. Shiva Purana", reference: "4", topicMessage: "Manifestations of Lord Shiva, Rudraksha, and Shaiva devotion." },
      { name: "5. Bhagavata Purana", reference: "5", topicMessage: "The premier devotional text celebrating Krishna's lila and divine bhakti." },
      { name: "6. Narada Purana", reference: "6", topicMessage: "Summaries of all major scriptures, astronomy, and devotion." },
      { name: "7. Markandeya Purana", reference: "7", topicMessage: "Contains the renowned Devi Mahatmya (Durga Saptashati)." },
      { name: "8. Agni Purana", reference: "8", topicMessage: "An encyclopedic treatise covering rituals, medicine, martial arts, and grammar." },
      { name: "9. Bhavishya Purana", reference: "9", topicMessage: "Prophecies, solar worship, and social ethics across temporal cycles." },
      { name: "10. Brahmavaivarta Purana", reference: "10", topicMessage: "Legends of Radha and Krishna, divine creation, and nature of reality." },
      { name: "11. Linga Purana", reference: "11", topicMessage: "Manifestation of the Shiva Lingam and Shaiva philosophy." },
      { name: "12. Varaha Purana", reference: "12", topicMessage: "Dialogue between Lord Varaha and Mother Earth on salvation and dharma." },
      { name: "13. Skanda Purana", reference: "13", topicMessage: "The largest Purana detailing Kartikeya, temples, and sacred geography." },
      { name: "14. Vamana Purana", reference: "14", topicMessage: "The Vamana incarnation and King Bali's supreme surrender." },
      { name: "15. Kurma Purana", reference: "15", topicMessage: "Narrated by the Kurma avatar, containing the Ishvara Gita." },
      { name: "16. Matsya Purana", reference: "16", topicMessage: "Narrated by Matsya avatar during the deluge, preserving life and Vedas." },
      { name: "17. Garuda Purana", reference: "17", topicMessage: "Cosmology, transition of the soul, and life after death." },
      { name: "18. Brahmanda Purana", reference: "18", topicMessage: "Structure of the cosmic egg, containing the Lalitha Sahasranama." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1543157145-f78c636d023d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A sacred altar surrounded by glowing oil lamps and ancient manuscripts, representing the rich spiritual legacy of the 18 Mahapuranas."
  },
  {
    key: "bhagavad_gita",
    title: "Bhagavad Gita",
    originalTitle: "भगवद्गीता",
    religion: "hinduism",
    description: "A 700-verse Hindu scripture that is part of the epic Mahabharata. It takes form of a dialogue between Pandava prince Arjuna and his guide and charioteer Lord Krishna on the battlefield of Kurukshetra, covering duty, devotion, self-knowledge, and the paths of Yoga.",
    divisionsName: "Chapter",
    divisionsCount: 18,
    featuredPortions: [
      { name: "Chapter 1: Arjuna Vishada Yoga (Grief of Arjuna)", reference: "1", topicMessage: "Arjuna, standing on the battlefield, is overcome by despondency and questions the morality of the impending war." },
      { name: "Chapter 2: Sankhya Yoga (Yoga of Knowledge)", reference: "2", topicMessage: "Krishna explains the immortality of the soul (Atman) and the standard of selfless action (Nishkama Karma)." },
      { name: "Chapter 3: Karma Yoga (Yoga of Action)", reference: "3", topicMessage: "Krishna explains how performing duties selflessly as an offering to the Divine leads to purification and freedom." },
      { name: "Chapter 4: Jnana Karma Sanyasa Yoga (Wisdom of Action)", reference: "4", topicMessage: "The secret of divine incarnation, the ancient lineage of yoga, and how wisdom burns all karmic reactions." },
      { name: "Chapter 5: Karma Sanyasa Yoga (Renunciation and Action)", reference: "5", topicMessage: "Krishna reconciles the paths of outward action and inward renunciation, showing both lead to the same goal." },
      { name: "Chapter 6: Dhyana Yoga (Yoga of Meditation)", reference: "6", topicMessage: "Practical guidelines for meditation, controlling the mind, and achieving absolute inner peace and equanimity." },
      { name: "Chapter 7: Jnana Vijnana Yoga (Wisdom and Discernment)", reference: "7", topicMessage: "Krishna reveals His material and spiritual energies, explaining how to transcend the illusions of Maya." },
      { name: "Chapter 8: Akshara Brahma Yoga (The Imperishable Brahman)", reference: "8", topicMessage: "The nature of creation, life, death, and the path of remembering the Divine at the moment of passing." },
      { name: "Chapter 9: Raja Vidya Raja Guhya Yoga (Sovereign Wisdom)", reference: "9", topicMessage: "The king of secret sciences, emphasizing direct realization, supreme devotion, and unconditional refuge." },
      { name: "Chapter 10: Vibhuti Vistara Yoga (Infinite Splendors)", reference: "10", topicMessage: "Krishna describes His infinite manifestations and divine glories pervading every aspect of the cosmos." },
      { name: "Chapter 11: Vishwarupa Darshana Yoga (Cosmic Vision)", reference: "11", topicMessage: "Krishna grants Arjuna divine vision, revealing His awe-inspiring and terrifying form as the entire Universe." },
      { name: "Chapter 12: Bhakti Yoga (Path of Devotion)", reference: "12", topicMessage: "Defines the qualities of an ideal devotee who is serene, compassionate, and free from malice." },
      { name: "Chapter 13: Kshetra Kshetrajna Vibhaga Yoga (Matter and Spirit)", reference: "13", topicMessage: "The distinction between the body (field) and the conscious soul (knower of the field)." },
      { name: "Chapter 14: Gunatraya Vibhaga Yoga (Three Modes of Nature)", reference: "14", topicMessage: "How the three forces of Sattva (goodness), Rajas (passion), and Tamas (ignorance) govern human behavior." },
      { name: "Chapter 15: Purushottama Yoga (The Supreme Divine Person)", reference: "15", topicMessage: "The metaphor of the cosmic Upside-down Tree, and the characteristics of the Supreme Transcendental Being." },
      { name: "Chapter 16: Daivasura Sampad Vibhaga Yoga (Divine and Demonic Natures)", reference: "16", topicMessage: "Categorizes traits that lead to spiritual liberation versus those that lead to bondage." },
      { name: "Chapter 17: Shraddhatraya Vibhaga Yoga (Threefold Division of Faith)", reference: "17", topicMessage: "Explains how faith, food, charity, sacrifice, and penance are divided under the three gunas." },
      { name: "Chapter 18: Moksha Sanyasa Yoga (Yoga of Liberation)", reference: "18", topicMessage: "The final synthesis of dharma, surrender, and spiritual freedom." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1612240498936-65f5101365d2?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A beautifully detailed golden brass statue of Lord Krishna playing his divine flute, representing the supreme teacher, philosopher, and guide who imparts the timeless wisdom of the Gita."
  },
  {
    key: "ramayana",
    title: "Ramayana (रामायणम्)",
    originalTitle: "रामायणम्",
    religion: "hinduism",
    description: "An ancient Sanskrit epic composed by Sage Valmiki. It narrates the life and adventures of Prince Rama, an avatar of Vishnu, his exile, the abduction of his wife Sita by King Ravana, and the subsequent war, embodying ideal ethical duties and righteousness (Dharma).",
    divisionsName: "Kanda (Book)",
    divisionsCount: 7,
    featuredPortions: [
      { name: "Kanda 1: Bala Kanda (Book of Youth)", reference: "1", topicMessage: "The early childhood, training, marriages of Rama and his brothers, and protection of Sage Vishwamitra's sacrifices." },
      { name: "Kanda 2: Ayodhya Kanda (Book of Ayodhya)", reference: "2", topicMessage: "The preparation for Rama's coronation, Kaikeyi's intervention resulting in exile, and the grief of the royal court." },
      { name: "Kanda 3: Aranya Kanda (Book of the Forest)", reference: "3", topicMessage: "The peaceful forest life of Rama, Sita, and Lakshmana, encounters with sages, and the dramatic abduction of Sita by Ravana." },
      { name: "Kanda 4: Kishkindha Kanda (Book of Kishkindha)", reference: "4", topicMessage: "The alliance with Sugriva, the monkey kingdom, the search for Sita, and Hanuman's discovery of her location." },
      { name: "Kanda 5: Sundara Kanda (Book of Beauty)", reference: "5", topicMessage: "The heroic journey of Hanuman across the ocean to Lanka, his meeting with Sita, and the demonstration of supreme devotion and hope." },
      { name: "Kanda 6: Yuddha Kanda (Book of War)", reference: "6", topicMessage: "The construction of the Rama Setu bridge, the epic battle between Rama's forces and Ravana's army in Lanka, and the rescue of Sita." },
      { name: "Kanda 7: Uttara Kanda (Book of Afterwards)", reference: "7", topicMessage: "The return to Ayodhya, Rama's coronation, subsequent trials, the exile of Sita, the birth of twins Lava and Kusha, and final ascension." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Sunset illuminating the ancient columns and architecture of a sacred temple, representing Lord Rama's path of Dharma."
  },
  {
    key: "upanishads",
    title: "Principal Upanishads",
    originalTitle: "उपनिषद्",
    religion: "hinduism",
    description: "Philosophical treatises nested within the ancient Vedas. They contain the foundation of Vedanta, exploring the non-dual nature of ultimate reality (Brahman), the innermost self of humanity (Atman), and how liberation is attained through realization.",
    divisionsName: "Upanishad",
    divisionsCount: 108,
    featuredPortions: UPANISHADS_108.map(up => ({
      name: `${up.name} Upanishad`,
      reference: String(up.number),
      topicMessage: `[${up.category}] Source: ${up.veda}. Insight: ${up.keyInsight}`
    })),
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A pristine flowing mountain stream surrounded by lush green forests, representing Upanishadic silence, natural oneness, and supreme spiritual contemplation."
  },
  {
    key: "dharmashastras",
    title: "Dharmashastras",
    originalTitle: "धर्मशास्त्र",
    religion: "hinduism",
    description: "Sacred treatises on dharma, duties, laws, and personal conduct composed by ancient sages including Manu, Yajnavalkya, and Parashara.",
    divisionsName: "Treatise",
    divisionsCount: 15,
    featuredPortions: [
      { name: "Manusmriti (Laws of Manu)", reference: "1", topicMessage: "Codes of conduct, social duties, and ethical guidelines for various stages of life." },
      { name: "Yajnavalkya Smriti", reference: "2", topicMessage: "Key guidelines on jurisprudence, social relationships, and spiritual purification." },
      { name: "Parashara Smriti", reference: "3", topicMessage: "Dharma and moral directives prescribed specifically for the current cosmic age (Kali Yuga)." },
      { name: "Vishnu Smriti", reference: "4", topicMessage: "Exposition of duties focusing on devotion to Lord Vishnu, state laws, and inheritance." },
      { name: "Narada Smriti", reference: "5", topicMessage: "A highly specialized treatise focusing entirely on civil, criminal, and procedural law." },
      { name: "Brihaspati Smriti", reference: "6", topicMessage: "Legal codes detailing the division of property, contracts, and settlement of disputes." },
      { name: "Katyayana Smriti", reference: "7", topicMessage: "Comprehensive text on judicial procedure, evidence, and commercial transactions." },
      { name: "Daksha Smriti", reference: "8", topicMessage: "Practical guidelines on daily rituals, domestic duties, and yogic moral disciplines." },
      { name: "Likhita Smriti", reference: "9", topicMessage: "Duties of householders, public morality, and the administration of justice." },
      { name: "Atri Smriti", reference: "10", topicMessage: "Directives on moral purification, penance, charity, and ethical living." },
      { name: "Harita Smriti", reference: "11", topicMessage: "Detailed guidelines on Vedic study, absolute truth, and monastic disciplines." },
      { name: "Apastamba Smriti", reference: "12", topicMessage: "Moral conduct, dietary rules, and purification rites for personal righteousness." },
      { name: "Yama Smriti", reference: "13", topicMessage: "Treatise on the consequences of action (karma), penance (prayaschitta), and moral purification." },
      { name: "Samvarta Smriti", reference: "14", topicMessage: "Guidelines on charity, self-restraint, and the path of peaceful spiritual dedication." },
      { name: "Shankha Smriti", reference: "15", topicMessage: "Codes on individual cleanliness, societal ethics, and administrative righteousness." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "An open ancient scroll on textured parchment, representing the codification of social and cosmic duties."
  },
  {
    key: "hindu_sutras",
    title: "Hindu Sutras",
    originalTitle: "सूत्र",
    religion: "hinduism",
    description: "Foundational aphoristic texts covering yoga, classical philosophy, logic, and ritual duties.",
    divisionsName: "Sutra Collection",
    divisionsCount: 7,
    featuredPortions: [
      { name: "Yoga Sutras of Patanjali", reference: "1", topicMessage: "The eight-limbed path (Ashtanga) to mental stillness, concentration, and spiritual liberation." },
      { name: "Brahma Sutras of Badarayana", reference: "2", topicMessage: "Aphorisms systematizing and reconciling the philosophical teachings of the Upanishads." },
      { name: "Nyaya Sutras of Aksapada Gautama", reference: "3", topicMessage: "The foundation of classical Indian logic, reasoning, and epistemology." },
      { name: "Vaisheshika Sutras of Kanada", reference: "4", topicMessage: "Pluralist metaphysics classifying reality into six categories (Padarthas) and atomism (Anu)." },
      { name: "Mimamsa Sutras of Jaimini", reference: "5", topicMessage: "Rules for interpreting the Vedas, focusing on ritual duty (Dharma) and action (Karma)." },
      { name: "Dharma Sutras (Gautama, Baudhayana, Apastamba)", reference: "6", topicMessage: "Ancient manuals outlining societal laws, personal ethics, conduct, and ritual duties." },
      { name: "Grihya Sutras", reference: "7", topicMessage: "Aphorisms detailing domestic rituals, rites of passage (Samskaras), and household sacraments." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A quiet, meditative lotus posture by a serene lakeside, embodying the self-discipline of the Yoga Sutras."
  },
  {
    key: "six_darshans",
    title: "The Six Darshans (Philosophy)",
    originalTitle: "षड्दर्शन",
    religion: "hinduism",
    description: "The six orthodox (astika) schools of classical Hindu philosophy: Nyaya, Vaisheshika, Samkhya, Yoga, Mimamsa, and Vedanta.",
    divisionsName: "Philosophical School",
    divisionsCount: 6,
    featuredPortions: [
      { name: "Nyaya (School of Logic)", reference: "1", topicMessage: "The school of logical reasoning, epistemology, and systematic analysis to attain true knowledge." },
      { name: "Vaisheshika (School of Atomism)", reference: "2", topicMessage: "A physicalist, atomistic philosophy that classifies all of reality into six key categories (Padarthas)." },
      { name: "Samkhya (Dualist Cosmos)", reference: "3", topicMessage: "The oldest dualist philosophy, analyzing the relationship between consciousness (Purusha) and material nature (Prakriti)." },
      { name: "Yoga (School of Meditation)", reference: "4", topicMessage: "The practical path of mind-control, physical discipline, and deep meditation to achieve liberation (Samadhi)." },
      { name: "Mimamsa (School of Rituals)", reference: "5", topicMessage: "The hermeneutic system of interpreting Vedic ritual commands, duty (Dharma), and ethical action (Karma)." },
      { name: "Vedanta (Non-dual Truth)", reference: "6", topicMessage: "The philosophical culmination of Vedic wisdom (Upanishads), exploring the supreme non-dual nature of Atman and Brahman." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Deep sunset over a vast landscape, symbolizing the profound cognitive horizons of the six philosophical systems."
  },
  {
    key: "agamas",
    title: "The 200 Agamas & Tantras",
    originalTitle: "आगम",
    religion: "hinduism",
    description: "The primary manuals of temple architecture, public worship, deity installation, and advanced spiritual practice. They are structured into Shaiva Agamas (28), Vaishnava Agamas/Pancharatra (108), and Shakta Agamas/Tantras (64), containing the complete practical application of philosophical wisdom.",
    divisionsName: "Agama",
    divisionsCount: 200,
    featuredPortions: AGAMAS_200.map(ag => ({
      name: `${ag.name} (${ag.category})`,
      reference: String(ag.number),
      topicMessage: `[${ag.subCategory}] Description: ${ag.description} Insight: ${ag.keyInsight}`
    })),
    imageUrl: "https://images.unsplash.com/photo-1609137144813-94c632616238?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Majestic peaks of Mount Kailash surrounded by sacred mists, representing the eternal origin of Agamic wisdom."
  },
  {
    key: "rigveda",
    title: "Rigveda (ऋग्वेद)",
    originalTitle: "ऋग्वेद",
    religion: "hinduism",
    description: "The oldest and most sacred of the Hindu Vedas, consisting of 1,028 hymns (Suktas) organized into 10 Mandalas (books). It celebrates cosmic order (Rta), elemental deities like Agni, Indra, and Soma, and contains the famous Purusha Sukta and Gayatri Mantra.",
    divisionsName: "Mandala",
    divisionsCount: 10,
    featuredPortions: [
      { name: "Mandala 1: Hymn to Agni (Cosmic Fire)", reference: "1", topicMessage: "The opening hymn of the Rigveda, praising Agni as the high priest, divine mediator, and dispenser of spiritual illumination." },
      { name: "Mandala 2: Gritsamada Clan Hymns (Indra & Agni)", reference: "2", topicMessage: "Ancient family hymns praising the supreme strength of Indra and the purifying power of Agni, emphasizing cosmic law (Rta)." },
      { name: "Mandala 3: Vishvamitra Clan & Gayatri Mantra", reference: "3", topicMessage: "Features the supreme Gayatri Mantra (3.62.10) invoking the divine solar intellect (Savitr) for absolute mental illumination." },
      { name: "Mandala 4: Vamadeva Clan (Divine Dawn & Ribhus)", reference: "4", topicMessage: "Hymns detailing spiritual liberation, the radiant dawn (Ushas), and the craftsmanship of the divine artisans (Ribhus)." },
      { name: "Mandala 5: Atri Clan (Guardians of Cosmic Light)", reference: "5", topicMessage: "Praise of Agni, the Maruts (storm deities), and Mitra-Varuna, representing the eternal guardians of light, truth, and cosmic order." },
      { name: "Mandala 6: Bharadvaja Clan (Spiritual Leadership)", reference: "6", topicMessage: "Powerful family hymns highlighting spiritual vigor, leadership, and the protection of the community through divine cosmic forces." },
      { name: "Mandala 7: Vasishtha Clan & Maha Mrityunjaya", reference: "7", topicMessage: "Contains the life-giving Maha Mrityunjaya Mantra (7.59.12) and hymns celebrating rains (Parjanya), rivers, and moral righteousness." },
      { name: "Mandala 8: Kanva Clan (Metrical Chants of Devotion)", reference: "8", topicMessage: "A collection of diverse metrical hymns celebrating the Ashvins (divine healers), Indra, and the universal friendship of all creation." },
      { name: "Mandala 9: Soma Pavamana (Nectar of Immortality)", reference: "9", topicMessage: "The entire collection dedicated to the purification of Soma, representing the flow of cosmic bliss, spiritual ecstasy, and higher consciousness." },
      { name: "Mandala 10: Cosmic Creation & Unity Hymns", reference: "10", topicMessage: "The famous Nasadiya (Creation) and Purusha (Cosmic Sacrifice) Suktas, concluding with the majestic Rigvedic prayer for global unity (10.191.4)." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Golden cosmic energy patterns, representing Hiranyagarbha (the golden cosmic womb) and the Rigvedic creation hymns of Nasadiya Sukta."
  },
  {
    key: "yajurveda",
    title: "Yajurveda (यजुर्वेदः)",
    originalTitle: "यजुर्वेदः",
    religion: "hinduism",
    description: "The Veda of prose mantras and ritual actions. Composed of two main branches—the Krishna (dark) and Shukla (white) Yajurveda—it integrates outer ritual actions with inner psychological contemplation, outlining moral actions (Karma) and featuring the profound Sri Rudram and Isha Upanishad.",
    branches: ["Krishna", "Shukla"],
    hierarchy_type: "kandas_prashanas",
    divisionsName: "Kanda / Chapter",
    divisionsCount: 7,
    featuredPortions: [
      { name: "Shukla Ch 1: Darshapurnamasa I", reference: "1", topicMessage: "Prayers invoking Savitr for mental clarity, right intention, and the preparation of sacred lunar offerings." },
      { name: "Shukla Ch 2: Darshapurnamasa II", reference: "2", topicMessage: "Rites of consecration, processing of sacrificial firewood, and aligning daily labor with spiritual focus." },
      { name: "Shukla Ch 3: Agnihotra & Seasonal Rites", reference: "3", topicMessage: "Daily fire offerings and chaturmasya rituals invoking cosmic warmth and moral purification." },
      { name: "Shukla Ch 4: Somayajna (Soma Preparation)", reference: "4", topicMessage: "Initial mantras for pressing sacred soma juice, invoking divine wisdom and sensory alignment." },
      { name: "Shukla Ch 5: Somayajna (SACRED ALTAR PREP)", reference: "5", topicMessage: "Mantras for erecting the sacrificial post and preparing the consecrated vedi (altar)." },
      { name: "Shukla Ch 6: Somayajna (Tools & Vessels)", reference: "6", topicMessage: "Detailed purification of the press-stones and vessels used to filter the nectar of devotion." },
      { name: "Shukla Ch 7: Somayajna (Divine Cups)", reference: "7", topicMessage: "Dedication of the soma cups to Indra, Vayu, and Varuna, symbolizing the integration of vital forces." },
      { name: "Shukla Ch 8: Somayajna (Closing Mantras)", reference: "8", topicMessage: "The final celebratory purificatory bath (Avabhritha) and chants of completion and thanksgiving." },
      { name: "Shukla Ch 9: Vajapeya (Royal Vigor Rite)", reference: "9", topicMessage: "A magnificent rite celebrating supreme physical energy, mental clarity, and the swift chariot race." },
      { name: "Shukla Ch 10: Rajasuya (Sovereignty)", reference: "10", topicMessage: "The consecration of a righteous leader, invoking Varuna and Mitra to protect the moral order." },
      { name: "Shukla Ch 11: Agnicayana (Gathering Clay)", reference: "11", topicMessage: "Searching for and digging sacred soil, representing the foundational search for absolute truth." },
      { name: "Shukla Ch 12: Agnicayana (Brick Crafting)", reference: "12", topicMessage: "Prayers and techniques for crafting clay bricks, symbolizing the building blocks of human life." },
      { name: "Shukla Ch 13: Agnicayana (Brick Consecration)", reference: "13", topicMessage: "Laying the bottom perforated bricks (Swayamatrinna) to allow free passage of life breath." },
      { name: "Shukla Ch 14: Agnicayana (Lower Altar Tiers)", reference: "14", topicMessage: "Rites for establishing the first and second tiers of the giant bird-shaped fire altar." },
      { name: "Shukla Ch 15: Agnicayana (Middle Altar Tiers)", reference: "15", topicMessage: "Prayers for the middle brick layers, invoking specialized structural and cosmic powers." },
      { name: "Shukla Ch 16: Sri Rudram (Omnipresent Lord)", reference: "16", topicMessage: "The famous Satarudriya hymn, praising Rudra-Shiva's presence in every particle of nature and life." },
      { name: "Shukla Ch 17: Agnicayana (Shower of Wealth)", reference: "17", topicMessage: "The Vasordhara continuous offering of ghee, representing the infinite flow of cosmic abundance." },
      { name: "Shukla Ch 18: Agnicayana (Altar Completion)", reference: "18", topicMessage: "Concluding ceremonies of the fire-altar building, invoking harmony, peace, and long life." },
      { name: "Shukla Ch 19: Sautramani (Purification I)", reference: "19", topicMessage: "Chants for the sautramani sacrifice, using healing herbs to restore balance and strength." },
      { name: "Shukla Ch 20: Sautramani (Purification II)", reference: "20", topicMessage: "Mantras for mental rejuvenation, clearing obstacles, and washing away moral transgressions." },
      { name: "Shukla Ch 21: Sautramani (Purification III)", reference: "21", topicMessage: "Concluding sautramani prayers for longevity, intellectual luster, and complete vital vigor." },
      { name: "Shukla Ch 22: Ashvamedha (Peace Opening)", reference: "22", topicMessage: "The opening verses of the royal horse sacrifice, celebrating national prosperity and cosmic peace." },
      { name: "Shukla Ch 23: Ashvamedha (Cosmic Riddles)", reference: "23", topicMessage: "Intellectual theological debates (Brahmodya) among priests on the ultimate origin of creation." },
      { name: "Shukla Ch 24: Ashvamedha (Animal Catalog)", reference: "24", topicMessage: "A poetic cataloging of all land and water creatures, dedicating all biodiversity to God." },
      { name: "Shukla Ch 25: Ashvamedha (Closing Chants)", reference: "25", topicMessage: "Final horse sacrifice prayers invoking beneficial rains, heavy crops, and global harmony." },
      { name: "Shukla Ch 26: Supplementary Rites (Khila I)", reference: "26", topicMessage: "Additional verses for individual welfare, mental purification, and social cohesion." },
      { name: "Shukla Ch 27: Supplementary Rites (Khila II)", reference: "27", topicMessage: "Special invocations to Agni's seven tongues of fire to transmit human prayers to higher realms." },
      { name: "Shukla Ch 28: Supplementary Sautramani", reference: "28", topicMessage: "Rejuvenating mantras focusing on sensory health, strength, and overcoming illness." },
      { name: "Shukla Ch 29: Supplementary Ashvamedha", reference: "29", topicMessage: "Vigorous chants celebrating cosmic victory over greed, division, and inner darkness." },
      { name: "Shukla Ch 30: Purushamedha (Social Dedication)", reference: "30", topicMessage: "Symbolic dedication of every profession in society to the collective welfare of the world." },
      { name: "Shukla Ch 31: Purusha Sukta (Cosmic Hymn)", reference: "31", topicMessage: "The famous creation hymn describing the universe's manifestation from the supreme Purusha." },
      { name: "Shukla Ch 32: Sarvamedha (Universal Offering I)", reference: "32", topicMessage: "Complete self-surrender to the supreme reality, identifying Brahman as the all-pervading life." },
      { name: "Shukla Ch 33: Sarvamedha (Universal Offering II)", reference: "33", topicMessage: "Invocations to the divine solar power (Aditya) as the external reflection of our inner soul." },
      { name: "Shukla Ch 34: Shivashankalpa Upanishad", reference: "34", topicMessage: "Six beautiful verses for the mind, praying that it always resolves on auspicious, noble thoughts." },
      { name: "Shukla Ch 35: Pitrimedha (Ancestral Comfort)", reference: "35", topicMessage: "Memorial prayers and funeral chants for departed souls, comfort for the grieving, and rebirth." },
      { name: "Shukla Ch 36: Cosmic Shanti (Peace Prayer)", reference: "36", topicMessage: "The ultimate Vedic peace mantra seeking absolute harmony in space, earth, waters, and all plants." },
      { name: "Shukla Ch 37: Pravargya (Mystic Milk Altar I)", reference: "37", topicMessage: "Initiating the heating of ghee and milk in the Mahavira clay pot, representing pure cosmic heat." },
      { name: "Shukla Ch 38: Pravargya (Mystic Milk Altar II)", reference: "38", topicMessage: "Offering the radiant hot-milk (Gharma) to the Ashvins and Indra, invoking supreme vital energy." },
      { name: "Shukla Ch 39: Pravargya (Sacred Ascension)", reference: "39", topicMessage: "Concluding pravargya ceremonies, representing the transformation of physical elements into spirit." },
      { name: "Shukla Ch 40: Isha Upanishad (Supreme Truth)", reference: "40", topicMessage: "The final sublime chapter outlining selfless action, non-covetousness, and seeing God in all." },
      { name: "Krishna Kanda 1: Sacrificial Rites & Rajasuya", reference: "krishna_1", topicMessage: "First book of Black Yajurveda detailing lunar sacrifices and royal coronation ceremonies." },
      { name: "Krishna Kanda 2: Desire-Oriented Sacrifices", reference: "krishna_2", topicMessage: "Presents special rituals (Kamya Ishtis) to align natural elements for rain, health, and welfare." },
      { name: "Krishna Kanda 3: Supplements & Chants", reference: "krishna_3", topicMessage: "Detailed ritual micro-instructions, responsibilities of priests, and auditory meditation mantras." },
      { name: "Krishna Kanda 4: Agnicayana & Sri Rudram", reference: "krishna_4", topicMessage: "Construction of the eagle fire altar, featuring Sri Rudram (TS 4.5) and Chamakam (TS 4.7)." },
      { name: "Krishna Kanda 5: Altar Geometry & Symbols", reference: "krishna_5", topicMessage: "Deep mathematical and geometric guidelines for layering the bricks of the grand bird altar." },
      { name: "Krishna Kanda 6: Soma Sacrifice Analysis", reference: "krishna_6", topicMessage: "Philosophical explanations and inner psychological meaning of the sacred soma offering." },
      { name: "Krishna Kanda 7: Ashvamedha & Sattras", reference: "krishna_7", topicMessage: "Exposition on long-term seasonal sacrifices (Sattras) and horse sacrifice for social integration." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Rays of holy dawn light passing through woodsmoke, representing the sacrificial fireplaces and sacred rites of the Yajurveda."
  },
  {
    key: "samaveda",
    title: "Samaveda",
    originalTitle: "सामवेद",
    religion: "hinduism",
    description: "The Veda of Melodies and Chants. Comprising almost entirely of verses selected from the Rigveda but set to beautiful musical notations (Gana), it is chanting's oldest repository. Lord Krishna in the Bhagavad Gita states 'Of the Vedas, I am the Samaveda', highlighting its supreme musical and spiritual devotion.",
    divisionsName: "Part / Chapter",
    divisionsCount: 6,
    featuredPortions: [
      { name: "Part 1: Agneya Kanda (Chants to Agni)", reference: "1", topicMessage: "Invoking Agni, the sacred fire of consciousness, representing cognitive clarity and divine mediation." },
      { name: "Part 2: Aindra Kanda I (Chants to Indra I)", reference: "2", topicMessage: "Chants of inner vitality, cosmic strength, and sensory empowerment dedicated to Lord Indra." },
      { name: "Part 3: Aindra Kanda II (Chants to Indra II)", reference: "3", topicMessage: "Continuing prayers to Indra, focusing on cognitive focus, divine protection, and overcoming internal blockages." },
      { name: "Part 4: Aindra Kanda III (Chants to Indra III)", reference: "4", topicMessage: "Concluding chants to Indra, aligning personal power with celestial order and social harmony." },
      { name: "Part 5: Pavamana Kanda (Chants to Soma)", reference: "5", topicMessage: "Invocations of Soma Pavamana, the flow of purified spiritual nectar and absolute devotion." },
      { name: "Part 6: Aranya Kanda (Forest & Mystic Chants)", reference: "6", topicMessage: "The forest book of secret and mystic melodies, ideal for silent study and solitary meditation." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Symmetrical sound ripples or abstract musical waves, embodying the sacred, primordial acoustic chants of the Samaveda."
  },
  {
    key: "atharvaveda",
    title: "Atharvaveda",
    originalTitle: "अथर्ववेद",
    religion: "hinduism",
    description: "The Veda of Everyday Life and Wisdom. Departing from ritual-heavy texts, it compiles 20 books (Kandas) of domestic prayers, healing charms, herbal medical guidelines, statecraft duties, and deep environmental hymns like the renowned Prithvi Sukta celebrating Mother Earth.",
    divisionsName: "Book (Kanda)",
    divisionsCount: 20,
    featuredPortions: [
      { name: "Book 1: Bhaishajya & Vac (Healing & Divine Speech)", reference: "1", topicMessage: "Chants for curing physical diseases, restoring health, and invoking Vac (divine speech) for mental clarity and strength." },
      { name: "Book 2: Ayushya (Longevity & Vitality)", reference: "2", topicMessage: "Divine prayers for a full life span, physical strength, protection from negative influences, and bodily vigor." },
      { name: "Book 3: Rashtriya (Statecraft & Social Concord)", reference: "3", topicMessage: "Prayers for community cohesion, social and family harmony, trade prosperity, and the righteous rule of leaders." },
      { name: "Book 4: Paushtika (Prosperity & Cosmic Wisdom)", reference: "4", topicMessage: "Hymns for welfare, agricultural success, protective charms, and the realization of supreme spiritual and mystic light." },
      { name: "Book 5: Prayashcitta (Purification & Ritual Integrity)", reference: "5", topicMessage: "Chants of expiation, purification from errors, protective measures, and aligning with righteous cosmic laws." },
      { name: "Book 6: Sadharana (General Prayers & Daily Blessings)", reference: "6", topicMessage: "The largest compilation of short domestic blessings, resolving disputes, invoking friendship, safety, and psychological peace." },
      { name: "Book 7: Shanti & Abhicara (Mystic Harmony & Devotional Chants)", reference: "7", topicMessage: "Short, focused chants for peace, warding off obstacles, invoking protective deities, and mental illumination." },
      { name: "Book 8: Prana Sukta (Vital Breath & Cosmic Order)", reference: "8", topicMessage: "Highly philosophical, featuring the Prana Sukta, which worships the vital life-breath as the sovereign of all existence." },
      { name: "Book 9: Madhu Sukta (Cosmic Sweetness & Hospitality)", reference: "9", topicMessage: "Includes the Madhu Sukta celebrating hospitality, gratitude, kindness, and the sweet abundance of nature." },
      { name: "Book 10: Skambha Sukta (Supreme Cosmic Pillar)", reference: "10", topicMessage: "Deeply metaphysical hymns exploring Skambha, the supreme cosmic framework and support of all manifest worlds." },
      { name: "Book 11: Brahmachari Sukta (Spiritual Discipline & Devotion)", reference: "11", topicMessage: "Celebrating the path of active spiritual study, dedication, the student as a cosmic force, and meditations on inner fire and breath." },
      { name: "Book 12: Prithvi Sukta (Hymn to Mother Earth)", reference: "12", topicMessage: "A phenomenal, highly poetic hymn expressing deep environmental reverence, proclaiming 'The Earth is my Mother, and I am her Child'." },
      { name: "Book 13: Rohit Sukta (The Radiant Solar Power)", reference: "13", topicMessage: "Dedicated to Rohit, the Red Solar Deity, representing the radiant energy of consciousness that sustains the cosmos." },
      { name: "Book 14: Vivaha Sukta (Sacred Marriage & Partnership)", reference: "14", topicMessage: "The foundational marriage hymns detailing the sacred vows of partnership, mutual support, and family harmony." },
      { name: "Book 15: Vratya Sukta (The Wandering Mystic)", reference: "15", topicMessage: "Highly symbolic hymns glorifying the Vratya, the unconditioned, wandering ascetic who experiences non-dual unity." },
      { name: "Book 16: Duhsvapna-Nashana (Cleansing of the Dream Mind)", reference: "16", topicMessage: "Prayers for dispelling nightmares, subconscious worries, and purifying the internal mind to restore pure peace." },
      { name: "Book 17: Abhyudaya (Invocations for Victory and Upliftment)", reference: "17", topicMessage: "A grand, singular invocation to the solar force and Indra for personal, moral, and political victory." },
      { name: "Book 18: Pitrimedha (Ancestral Blessings & Funeral Rites)", reference: "18", topicMessage: "Commemorative prayers for funeral rites, honoring ancestors (Pitris), and guiding the soul peacefully to higher realms of light." },
      { name: "Book 19: Shanti Sukta (Peace & Universal Harmony)", reference: "19", topicMessage: "Profound invocations of cosmic, physical, and personal peace to dispel disease, ignorance, and discord." },
      { name: "Book 20: Soma & Indra (Spiritual Vitality & Divine Illumination)", reference: "20", topicMessage: "A major book of hymns dedicated to Lord Indra and the flow of Soma, celebrating divine strength and spiritual awakening." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Lush green plants growing out of fertile soil under soft sunlight, representing the herbal medicine, health, and environmental hymns of the Atharvaveda."
  },
  {
    key: "brahma_purana",
    title: "Brahma Purana",
    originalTitle: "ब्रह्म पुराण",
    religion: "hinduism",
    description: "Considered the very first (Adi) Purana. It consists of 245 chapters detailing the stories of creation, the solar deity (Surya), the sacred geography of Odisha (and the Konark Temple), and early descriptions of cosmic epochs.",
    divisionsName: "Chapter",
    divisionsCount: 245,
    featuredPortions: [
      { name: "Adi Srishti: Divine Creation", reference: "1", topicMessage: "How the Supreme creator brought forth the elements, sages, and cosmic order." },
      { name: "Surya Mahatmya: Hymn to the Sun", reference: "28", topicMessage: "Profound praises dedicated to Lord Surya, representing the physical source of energy and inner light." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    imageCaption: "The pristine golden light of dawn rising over silent mountains, representing Lord Surya's solar wisdom celebrated in the Brahma Purana."
  },
  {
    key: "padma_purana",
    title: "Padma Purana",
    originalTitle: "पद्म पुराण",
    religion: "hinduism",
    description: "The third largest Purana, structured into five Khandas (sections). It explores cosmology, genealogies, temple sites like Pushkar Lake, and integrates the epic stories of Rama and Krishna into a tapestry of devotion and righteousness.",
    divisionsName: "Khanda (Section)",
    divisionsCount: 5,
    featuredPortions: [
      { name: "Srishti Khanda: The Cosmic Lotus", reference: "1", topicMessage: "Explaining how the universe was created from the divine lotus arising from Vishnu." },
      { name: "Uttara Khanda: Yoga & Devotion", reference: "5", topicMessage: "Deeper guidelines on Bhakti yoga, moral righteousness, and the ultimate goals of life." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A sacred lotus blossoming elegantly in still water, symbolizing the Padma Purana's description of cosmic birth and purity."
  },
  {
    key: "vishnu_purana",
    title: "Vishnu Purana",
    originalTitle: "विष्णु पुराण",
    religion: "hinduism",
    description: "An incredibly systematic Purana structured in six books (Anshas). Formatted as a conversation between Sage Parasara and Maitreya, it lays down Vaishnava philosophy, the life story of Krishna, and the characteristics of the four Yugas.",
    divisionsName: "Book (Ansha)",
    divisionsCount: 6,
    featuredPortions: [
      { name: "Book I: The Eternal Brahman", reference: "1", topicMessage: "Pristine philosophical explanations regarding the nature of Vishnu as the source, preserver, and end of all." },
      { name: "Book V: The Life of Lord Krishna", reference: "5", topicMessage: "Exquisite narratives of Krishna's early childhood in Gokul, his pastimes, and his moral teachings." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1612240498936-65f5101365d2?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Golden light radiating around holy shrines, symbolizing the preservation power of Lord Vishnu."
  },
  {
    key: "shiva_purana",
    title: "Shiva Purana",
    originalTitle: "शिव पुराण",
    religion: "hinduism",
    description: "The primary scripture dedicated to Lord Shiva, exploring his cosmic dance (Tandava), his marriage with Parvati, the meaning of his symbolism (Trishul, ashes), and the sublime non-dual Shaiva philosophy of liberation.",
    divisionsName: "Samhita (Book)",
    divisionsCount: 12,
    featuredPortions: [
      { name: "Jnana Samhita: Divine Gnosis", reference: "1", topicMessage: "Entering the ultimate nature of Shiva as formless consciousness, exceeding birth and decay." },
      { name: "Rudra Samhita: Sacred Marriage", reference: "2", topicMessage: "The mystical union of Shiva and Parvati, symbolizing the merging of pure spirit and creative energy." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Majestic, snow-capped Himalayan peaks representing Mount Kailash, the abode of Lord Shiva."
  },
  {
    key: "vayu_purana",
    title: "Vayu Purana",
    originalTitle: "वायु पुराण",
    religion: "hinduism",
    description: "A highly historical and geographical Purana dedicated to Lord Shiva and narrated by the Wind-God (Vayu). It describes the structure of the earth, the lineage of ancient dynasties, and non-dual Shaiva yoga.",
    divisionsName: "Part",
    divisionsCount: 2,
    featuredPortions: [
      { name: "Part I: Purva Bhaga (Universal Creation)", reference: "1", topicMessage: "Creation, the measurement of time, and the holy lineages of the early sages." },
      { name: "Part II: Uttara Bhaga (Shaiva Yoga and Gaya Mahatmya)", reference: "2", topicMessage: "Deep insights into the yoga of meditation on Shiva, and the sacred geography of Gaya pilgrimage center." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A majestic wind blowing over mountain crests, representing Lord Vayu's revelation of Shiva's cosmic play."
  },
  {
    key: "bhagavata_purana",
    title: "Bhagavata Purana",
    originalTitle: "श्रीमद्भागवत पुराण",
    religion: "hinduism",
    description: "Also known as the Srimad Bhagavatam, this central scripture consists of 12 Skandas (Books). It describes bhakti (unconditional devotion) as the highest path and details the 22 avatars of Vishnu, featuring Krishna's life in the tenth book.",
    divisionsName: "Skanda (Book)",
    divisionsCount: 12,
    featuredPortions: [
      { name: "Skanda I: The Seeking Sages", reference: "1", topicMessage: "The beautiful gathering of sages at Naimisharanya forest seeking a path of peace for the age of Kali." },
      { name: "Skanda X: The Glory of Krishna", reference: "10", topicMessage: "The beloved dialogues and sweet spiritual pastimes of Krishna with his devotees in Vrindavan." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1612240498936-65f5101365d2?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A sacred metallic flute-playing statue of Lord Krishna, representing the heart's surrender to divine love."
  },
  {
    key: "narada_purana",
    title: "Narada Purana",
    originalTitle: "नारद पुराण",
    religion: "hinduism",
    description: "A profound Purana structured as a discourse by Sage Narada. It provides a detailed map of the major pilgrimage centers (Tirthas) of India, instructions on worship rituals, fasts, and the core disciplines of devotion and purity.",
    divisionsName: "Part",
    divisionsCount: 2,
    featuredPortions: [
      { name: "Part 1: The Nine Paths of Bhakti", reference: "1", topicMessage: "Narada explains the steps of devotional practice, ranging from listening to divine pastimes to complete self-offering." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
    imageCaption: "An open desk with historic writing materials, representing Sage Narada's cosmic travels and scripture teachings."
  },
  {
    key: "markandeya_purana",
    title: "Markandeya Purana",
    originalTitle: "मार्कण्डेय पुराण",
    religion: "hinduism",
    description: "One of the oldest Puranas, narrated by Sage Markandeya. It is highly famous for containing the complete 'Devi Mahatmyam' (Durga Saptashati), which is the primary text of Shakta worship celebrating the victory of active divine feminine energy over dark forces.",
    divisionsName: "Chapter",
    divisionsCount: 137,
    featuredPortions: [
      { name: "Devi Mahatmyam: The Divine Mother", reference: "81", topicMessage: "The appearance of Goddess Durga from the combined heat of all devas to restore cosmic balance and peace." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1543157145-f78c636d023d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Glow of a burning holy fire, evoking Goddess Durga's birth as the supreme uncreated cosmic power."
  },
  {
    key: "agni_purana",
    title: "Agni Purana",
    originalTitle: "अग्नि पुराण",
    religion: "hinduism",
    description: "An absolute encyclopedia of medieval India, delivered directly by Agni (the Fire God) to Sage Vasistha. It spans medicine, layout grammar, astrology, architecture (Vastu Shastra), statecraft, ethics, and martial principles.",
    divisionsName: "Chapter",
    divisionsCount: 383,
    featuredPortions: [
      { name: "Chapter 1: The Revelation of Agni", reference: "1", topicMessage: "How the fire element acts as a conveyer of pure physical and spiritual wisdom to humanity." },
      { name: "Chapter 280: Ayurvedic Remedies", reference: "280", topicMessage: "A fascinating compilation of herbal recipes, diagnosis parameters, and healthy living guidelines." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1543157145-f78c636d023d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Vibrant fire rising from a sacred Havan Kund, representing Agni as the ultimate purifier and standard of wisdom."
  },
  {
    key: "bhavishya_purana",
    title: "Bhavishya Purana",
    originalTitle: "भविष्य पुराण",
    religion: "hinduism",
    description: "The 'Book of the Future' consisting of four sections. It focuses on the progression of cosmic time, outlining the lineages of future kingdoms, moral challenges of the Kali Yuga, and worship protocols for sun and planetary deities.",
    divisionsName: "Part (Parva)",
    divisionsCount: 4,
    featuredPortions: [
      { name: "Pratisarga Parva: Cyclic Epochs", reference: "3", topicMessage: "Prophetic evaluations of humanity's trials, the decay of values, and eventual resurrection of truth." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A gorgeous cosmic wave of purple and gold light, representing the endless cycles of historical destiny."
  },
  {
    key: "brahmavaivarta_purana",
    title: "Brahmavaivarta Purana",
    originalTitle: "ब्रह्मवैवर्त पुराण",
    religion: "hinduism",
    description: "A major Vaishnava Purana consisting of four Khandas. It is unique for its deep theological focus on Radha and Krishna, portraying them as the primordial active and passive forces of supreme creation and source of all other gods.",
    divisionsName: "Khanda (Section)",
    divisionsCount: 4,
    featuredPortions: [
      { name: "Goloka Vijaya: The Divine Abode", reference: "4", topicMessage: "Deeper descriptions of Goloka, where perfect love, music, and divine harmony exist infinitely." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1601058268499-e52658bdfaf1?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Symmetrical floral artwork, reflecting the sweet aesthetic love and cosmic order of Radha-Krishna."
  },
  {
    key: "linga_purana",
    title: "Linga Purana",
    originalTitle: "लिङ्ग पुराण",
    religion: "hinduism",
    description: "A prominent Shaiva scripture focusing on Lord Shiva's manifestation as the formless pillar of light (Shiva Lingam), proving the ultimate unity of consciousness after all physical forms dissolve.",
    divisionsName: "Part",
    divisionsCount: 2,
    featuredPortions: [
      { name: "Part I: The Pillar of Light", reference: "1", topicMessage: "Brahma and Vishnu witness a boundless column of fire, realizing that the ultimate limit of reality is formless and supreme Shiva." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A majestic pillar of morning sunlight piercing through thick woodland mist, representing Shiva's formless pillar of fire (Jyotirlinga)."
  },
  {
    key: "varaha_purana",
    title: "Varaha Purana",
    originalTitle: "वराह पुराण",
    religion: "hinduism",
    description: "Formated as a warm dialogue between Lord Varaha (Vishnu's cosmic wild boar avatar) and Bhu Devi (Mother Earth). It explores the salvation of the earth from the oceans, prayers, and temple protocols.",
    divisionsName: "Chapter",
    divisionsCount: 218,
    featuredPortions: [
      { name: "Bhu Varaha Samvada: Saved by Grace", reference: "1", topicMessage: "The tender and heroic salvation of the sinking Earth, showing how the Divine protects eco-balance." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Lush green plants growing out of pristine mountain soil, representing Varaha's supreme devotion to the preservation of Mother Earth."
  },
  {
    key: "skanda_purana",
    title: "Skanda Purana",
    originalTitle: "स्कन्द पुराण",
    religion: "hinduism",
    description: "The largest of all Mahapuranas with 81,000 verses. It details the acts of Kartikeya (Skanda), the warrior deity, and provides an unmatched encyclopedia of regional temples, holy lakes, and cultural geographies.",
    divisionsName: "Khanda (Section)",
    divisionsCount: 7,
    featuredPortions: [
      { name: "Margarit Mahatmya: Temple Shrines", reference: "1", topicMessage: "The divine layout of India's ancient sacred temples, sacred water systems, and natural shrines." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Deep red and gold temple towers cutting across sunset skies, representing the architectural geography of Skanda Purana."
  },
  {
    key: "vamana_purana",
    title: "Vamana Purana",
    originalTitle: "वामन पुराण",
    religion: "hinduism",
    description: "Dedicated to Vishnu's fifth incarnation as Vamana (the dwarf scholar). It describes how King Bali surrenders his ego by letting Vamana measure the entire universe in three majestic strides.",
    divisionsName: "Chapter",
    divisionsCount: 95,
    featuredPortions: [
      { name: "Bali Yajna: The Three Steps", reference: "1", topicMessage: "King Bali's supreme surrender of personal pride and territory, paving his path to eternal spiritual security." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Stepping stones traversing a serene reflecting pond, evoking Vamana's cosmic strides transcending physical boundaries."
  },
  {
    key: "kurma_purana",
    title: "Kurma Purana",
    originalTitle: "कूर्म पुराण",
    religion: "hinduism",
    description: "Narrated directly by Lord Vishnu in his tortoise incarnation (Kurma) during the churning of the milk ocean. This text contains the famous Ishvara Gita which teaches yoga, knowledge, and devotion in a direct manner.",
    divisionsName: "Part",
    divisionsCount: 2,
    featuredPortions: [
      { name: "Ishvara Gita: Yoga of Knowledge", reference: "1", topicMessage: "The tortoise incarnation delivers the inner secret of self-realization, non-attachment, and union with truth." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    imageCaption: "An open, serene oceanside sunrise, symbolizing Vishnu's tortoise (Kurma) support during cosmic evolution."
  },
  {
    key: "matsya_purana",
    title: "Matsya Purana",
    originalTitle: "मत्स्य पुराण",
    religion: "hinduism",
    description: "A highly historical Purana narrated by Lord Vishnu as the primordial Golden Fish (Matsya) saving Satyavrata (Manu), the plant seeds, and the holy Vedas from the cosmic deluge of rejuvenation.",
    divisionsName: "Chapter",
    divisionsCount: 291,
    featuredPortions: [
      { name: "Manu Samvada: The Saving Fish", reference: "1", topicMessage: "The golden fish directs the ark across the raging waters of deluge, explaining cosmic cycles and survival." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Reflective, calm deep waters after a storm, signifying the preservation of life and wisdom through Matsya."
  },
  {
    key: "garuda_purana",
    title: "Garuda Purana",
    originalTitle: "गरुड़ पुराण",
    religion: "hinduism",
    description: "An essential dialogue between Lord Vishnu and his eagle vehicle Garuda. It explores cosmology, astrology, medicine, and the journey of the soul after physical death, detailing the transition to higher dimensions.",
    divisionsName: "Part",
    divisionsCount: 2,
    featuredPortions: [
      { name: "Preta Khanda: Transition of Soul", reference: "2", topicMessage: "Detailed guidance on death, mourning, and how loving actions of relatives soothe the voyager's path." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A clean path through an old forest leading to glowing mist, symbolizing the transition of the immortal soul."
  },
  {
    key: "brahmanda_purana",
    title: "Brahmanda Purana",
    originalTitle: "ब्रह्माण्ड पुराण",
    religion: "hinduism",
    description: "Cosmic and geographical in scope, describing the structure of the golden egg of the universe (Brahmanda). It serves as the rich container of the sacred Lalitha Sahasranama and the Adhyatma Ramayana.",
    divisionsName: "Part",
    divisionsCount: 4,
    featuredPortions: [
      { name: "Lalitha Sahasranama: 1000 Names", reference: "4", topicMessage: "A gorgeous hymn chanting the thousand majestic names of Goddess Lalitha Tripura Sundari, the absolute queen of cosmic plays." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Deep astronomical views of stars and nebulae, representing the Brahmanda or golden egg of cosmic creation."
  },
  {
    key: "devi_bhagavata_purana",
    title: "Devi Bhagavata Purana (Upapurana)",
    originalTitle: "देवीभागवत पुराण",
    religion: "hinduism",
    description: "A paramount Shakta scripture sometimes elevated as a Mahapurana. It glorifies Adi Parashakti (the Divine Mother) as the supreme, all-encompassed creator and source of all consciousness, elements, and cosmic evolution.",
    divisionsName: "Book (Skanda)",
    divisionsCount: 12,
    featuredPortions: [
      { name: "Skanda III: The Nature of Adi Shakti", reference: "3", topicMessage: "The Divine Mother reveals that all dualities under her play come back to the single non-dual divine feminine spark of existence." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1543157145-f78c636d023d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Glowing ceremonial embers and light, representing the majestic fire-energy of the Supreme Divine Mother."
  },
  {
    key: "ganesha_purana",
    title: "Ganesha Purana (Upapurana)",
    originalTitle: "गणेश पुराण",
    religion: "hinduism",
    description: "The foremost scripture focused on Lord Ganesha. It catalogs his many avatars to remove inner and outer obstacles, detailing Ganesha Sahasranama and Ganesha-focused meditation.",
    divisionsName: "Part (Khanda)",
    divisionsCount: 2,
    featuredPortions: [
      { name: "Kridakhanda: Cosmic Incarnations", reference: "2", topicMessage: "Exploring Ganesha's eight major incarnations down through the ages to conquer obstacles of greed, anger, and delusion." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1601058268499-e52658bdfaf1?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Warm traditional entrance designs and symbols, welcoming Lord Ganesha's wisdom into household thresholds."
  },
  {
    key: "mudgala_purana",
    title: "Mudgala Purana (Upapurana)",
    originalTitle: "मुद्गल पुराण",
    religion: "hinduism",
    description: "A highly revered Ganesha-focused text working hand-in-hand with the Ganesha Purana, describing deeper philosophical alignments of Ganesha as the supreme sound Om and Ruler of Maya.",
    divisionsName: "Book (Khanda)",
    divisionsCount: 9,
    featuredPortions: [
      { name: "Vakratunda Avatar: Overcoming Delusion", reference: "1", topicMessage: "The story of how Ganesha assumes his first avatar to melt away the demon of cosmic delusion (Moha)." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Emanating wave ripples of sacred acoustic sounds, representing Ganesha as the primordial sound of Om (Vakratunda)."
  },
  {
    key: "kalika_purana",
    title: "Kalika Purana (Upapurana)",
    originalTitle: "कालिका पुराण",
    religion: "hinduism",
    description: "An intensive Shakta Upapurana exploring the mysteries of Goddess Kali and Kamakhya. It discusses the flow of natural forces, cosmic balance, and deep feminine spiritual methods.",
    divisionsName: "Chapter",
    divisionsCount: 93,
    featuredPortions: [
      { name: "Kamakhya Mahatmya: Temple of Power", reference: "1", topicMessage: "The sacred mythology surrounding the shrine of Kamakhya in Assam, celebrating feminine creation." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1543157145-f78c636d023d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Sacred deep red colors and fire rituals of Shakta temples, representing Goddess Kali's transformation power."
  },
  {
    key: "saura_purana",
    title: "Saura Purana (Upapurana)",
    originalTitle: "सौर पुराण",
    religion: "hinduism",
    description: "A solar-focused Upapurana dedicated to Lord Surya (the Sun God). It covers natural health, calendar calculations, and meditations aligned with the daily orbit of light.",
    divisionsName: "Chapter",
    divisionsCount: 69,
    featuredPortions: [
      { name: "Surya Yoga: Physical and Spiritual Fire", reference: "12", topicMessage: "How using the sun rays, clean breathing, and early-morning contemplation preserves life and grants enlightenment." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    imageCaption: "The radiant sun slicing through wild trees at sunrise, representing Surya's healing and illuminating rays."
  },
  {
    key: "vishnudharmottara_purana",
    title: "Vishnudharmottara Purana (Upapurana)",
    originalTitle: "विष्णुधर्मोत्तर पुराण",
    religion: "hinduism",
    description: "An encyclopedic companion to the Vishnu Purana. It is world-famous for its detailed treatises on ancient Indian fine arts, including painting (Chitrasutra), sculpture, classical music, dance, and temple architecture rules.",
    divisionsName: "Khanda (Section)",
    divisionsCount: 3,
    featuredPortions: [
      { name: "Chitrasutra: Laws of Painting", reference: "3", topicMessage: "Laying out precise aesthetics of measurement, proportions, colors, expressions, and the beauty of human form in sacred art." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Beautiful ancient carvings on soft-hued stone temple walls, representing classical aesthetics defined in the Vishnudharmottara Purana."
  },
  {
    key: "sanatkumara_purana",
    title: "Sanatkumara Purana (Upapurana)",
    originalTitle: "सनत्कुमार पुराण",
    religion: "hinduism",
    description: "First of the traditional eighteen Upapuranas. This Vaishnava-aligned text delivers discussions between the four Kumaras (led by Sanatkumara) and Sage Narada regarding divine cosmology, temple sacrifices, the yoga of self-realization, and the nature of Maya.",
    divisionsName: "Chapter",
    divisionsCount: 15,
    featuredPortions: [
      { name: "Kumara Gita: Eternal Path", reference: "1", topicMessage: "A dialogue detailing the nature of the transcendental soul and how detachment from earthly illusions guides the scholar home." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    imageCaption: "An ancient rustic library representing the spiritual dialogue between Narada and the four Kumaras."
  },
  {
    key: "narasimha_purana",
    title: "Narasimha Purana (Upapurana)",
    originalTitle: "नरसिंह पुराण",
    religion: "hinduism",
    description: "A gorgeous Upapurana dedicated to Narasimha, the half-man, half-lion incarnation of Lord Vishnu. It integrates mythological wars between gods and demons, the extreme devotion of young Prahlada, duties of different ashramas, and geological changes across yugas.",
    divisionsName: "Chapter",
    divisionsCount: 68,
    featuredPortions: [
      { name: "Prahlada Charitra: Supreme Faith", reference: "44", topicMessage: "Underlining Prahlada's invincible faith that compelled Vishnu to manifest from a giant stone pillar to protect his devotee." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1612240498936-65f5101365d2?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Strong pillars of a historical monument representing the stone pillar from which Lord Narasimha emerged."
  },
  {
    key: "brihaddharma_purana",
    title: "Brihaddharma Purana (Upapurana)",
    originalTitle: "बृहद्धर्म पुराण",
    religion: "hinduism",
    description: "A major Upapurana compiled in Eastern India, outlining the complex social relationships, ethical codes of respect, musical acoustics (describing Ragas and Raginis as divine entities), and the ultimate synthesis of Shiva and Shakti principles.",
    divisionsName: "Section (Khanda)",
    divisionsCount: 3,
    featuredPortions: [
      { name: "Raga Ragini Sutra: Divine Music", reference: "3", topicMessage: "A rare, exquisitely beautiful treatise explaining how classical musical ragas are celestial manifestations of spiritual forces." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A classical string instrument under warm stage lighting, representing the sacred Raga acoustic grids defined in the Brihaddharma Purana."
  },
  {
    key: "sivarahasya_purana",
    title: "Sivarahasya Purana (Upapurana)",
    originalTitle: "शिवरहस्य पुराण",
    religion: "hinduism",
    description: "An extraordinary, highly advanced Shaiva Upapurana. It is widely renowned for containing the Ribhu Gita (the ultimate song of Sage Ribhu), which expounds pure non-dual Advaita Vedanta, declaring that the nature of Brahman is all-pervading consciousness.",
    divisionsName: "Section (Amsa)",
    divisionsCount: 12,
    featuredPortions: [
      { name: "Ribhu Gita: Monistic Song", reference: "6", topicMessage: "Sage Ribhu instructs Nidagha in the ultimate truth of non-duality—refuting the physical world as a dream, affirming Brahman as Self." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A calm, misty forest lake in total stillness, representing the peaceful non-dual state of self-awareness taught in the Ribhu Gita."
  },
  {
    key: "durvasa_purana",
    title: "Durvasa Purana (Upapurana)",
    originalTitle: "दुर्वासा पुराण",
    religion: "hinduism",
    description: "A Shaiva-Shakta text attributed to Sage Durvasa, an incarnation of Lord Shiva's anger. It highlights how the divine energy punishes arrogance, tests the humility of kings and gods alike, and provides rules for standard household purity.",
    divisionsName: "Chapter",
    divisionsCount: 32,
    featuredPortions: [
      { name: "Sage Humility: Shiva Tests", reference: "5", topicMessage: "Stories showing how spiritual power must be balanced with supreme humility, with warnings against intellectual arrogance." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Flames of a sacrificial fire representing Sage Durvasa's blazing yogic heat and intense codes of cosmic discipline."
  },
  {
    key: "kapila_purana",
    title: "Kapila Purana (Upapurana)",
    originalTitle: "कपिल पुराण",
    religion: "hinduism",
    description: "An Upapurana centered around Sage Kapila, the traditional founder of the Samkhya system of philosophy. It details cosmic evolution (the dance of Purusha and Prakriti), the mechanics of human minds, and the geographical praise of Odisha spiritual centers.",
    divisionsName: "Chapter",
    divisionsCount: 21,
    featuredPortions: [
      { name: "Samkhya Vimarsa: Dualist Gnosis", reference: "8", topicMessage: "Explains how distinguishing the detached supreme consciousness (Purusha) from natural matter (Prakriti) dissolves karma." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Gilded autumn trees reflecting onto a still lake, illustrating the separation of the observer from the observed (Prakriti)."
  },
  {
    key: "bhargava_purana",
    title: "Bhargava Purana (Upapurana)",
    originalTitle: "भार्गव पुराण",
    religion: "hinduism",
    description: "An Upapurana tracing the lineages and ethical codes of the legendary Bhrigu clan (Bhriguvansha), featuring Sage Bhrigu and Parashurama. It emphasizes values of integrity, vow-keeping, and temple geometries.",
    divisionsName: "Chapter",
    divisionsCount: 40,
    featuredPortions: [
      { name: "Bhrigu's Epochs: Cosmic Journeys", reference: "15", topicMessage: "Sage Bhrigu's testing of the Trinity to find the most compassionate and stable god, and how his progeny upheld righteousness." }
    ],
    imageUrl: "https://www.worldreligionsphotolibrary.com/images/gallery/vedic-fire-yajna-ceremony.jpg",
    imageCaption: "The pristine fire of Agni rising with prayers from a traditional Vedic fire sacrifice altar, representing Bhrigu's sacred fire."
  },
  {
    key: "samba_purana",
    title: "Samba Purana (Upapurana)",
    originalTitle: "साम्ब पुराण",
    religion: "hinduism",
    description: "A unique, legendary Upapurana centering around Samba: the incredibly handsome son of Lord Krishna and Jambavati. Having been cursed with leprosy, Samba built the historic Sun Temple in Multan and was completely healed through Surya's mystical grace.",
    divisionsName: "Chapter",
    divisionsCount: 84,
    featuredPortions: [
      { name: "Samba's Worship: Surya Heals", reference: "20", topicMessage: "Details solar mantras, yoga calculations of light rays, and how daily pranayama under dawn sun rays revives skin cells and cures diseases." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A brilliant sunrise over dynamic ocean tides, depicting the life-giving, cellular healing power of solar radiations."
  },
  {
    key: "nandi_purana",
    title: "Nandi Purana (Upapurana)",
    originalTitle: "नन्दि पुराण",
    religion: "hinduism",
    description: "An Upapurana dedicated to Shiva's primary disciple, mount, and gatekeeper, Nandi the bull. Prophesied as a manual of supreme devotion, it covers moral purifications, the significance of wearing rudraksha beads, and temple layouts.",
    divisionsName: "Chapter",
    divisionsCount: 52,
    featuredPortions: [
      { name: "Rudraksha Mahatmya: Cosmic Seeds", reference: "7", topicMessage: "Explains how the tears of Lord Shiva solidified into sacred Rudraksha seeds, carrying electromagnetic healing properties." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A beautiful, majestic white bull (Nandi), representing Lord Shiva's divine vehicle, gatekeeper, and symbol of continuous devotion."
  },
  {
    key: "nila_purana",
    title: "Nila Purana (Upapurana)",
    originalTitle: "नील पुराण",
    religion: "hinduism",
    description: "Also known as the Nilamata Purana, this is the sacred, highly revered regional chronicle of Kashmir. Gifted to humanity by the serpent king Nila, it lists Kashmir's geography, winter rituals, river praise, and social history.",
    divisionsName: "Verse",
    divisionsCount: 1453,
    featuredPortions: [
      { name: "Sati Saras: Lake of the Goddess", reference: "100", topicMessage: "The beautiful account describing Kashmir as a vast holy mountain lake drained by Sage Kashyapa to build a sanctuary of learning." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Symmetrical snow-capped Kashmiri mountains reflecting in a mirror-like high altitude water body, matching the Nilamata description."
  },
  {
    key: "parashara_purana",
    title: "Parashara Purana (Upapurana)",
    originalTitle: "पराशर पुराण",
    religion: "hinduism",
    description: "A highly specialized ethical Upapurana written by Sage Parashara, Vyasa's father. It focuses on historical astrology (Jyotisha), codes of conduct for different generations, the conservation of forests, and deep spiritual ethics for the dark Kali Yuga epoch.",
    divisionsName: "Chapter",
    divisionsCount: 18,
    featuredPortions: [
      { name: "Kali Dharma: Integrity in Decay", reference: "3", topicMessage: "A guide on how of all yogic methods, simple truthfulness (Satya) and charity (Dana) are the only surviving pillars of peace in Kali Yuga." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Stardust and starry night sky backgrounds, representing the deep astronomical and astrological charts drawn by Parashara."
  },
  {
    key: "chandi_purana",
    title: "Chandi Purana (Upapurana)",
    originalTitle: "चण्डी पुराण",
    religion: "hinduism",
    description: "A powerful Shakta-aligned Upapurana originally written in Odia by the famous medieval poet Sarala Das. It details the supreme, raw cosmic force of Goddess Durga as Chandi who destroyed the buffalo-demon Mahishasura to restore cosmic equity.",
    divisionsName: "Chapter",
    divisionsCount: 45,
    featuredPortions: [
      { name: "Mahishasura Vadha: Triumph of Light", reference: "9", topicMessage: "How the combined radiant energies of all gods coalesced into a single supreme maternal goddess to defeat unstoppable ego." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1609137144813-7d8487b1ef03?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Beautiful golden traditional deity sculpture depicting Goddess Chandi slaying Mahishasura."
  },
  {
    key: "sivadharma_purana",
    title: "Sivadharma Purana (Upapurana)",
    originalTitle: "शिवधर्म पुराण",
    religion: "hinduism",
    description: "A highly revered Shaiva Upapurana focused on the daily duties, rituals, and ethical behavior of Shiva devotees (Shivabhaktas), explaining the rules of temple service, yoga, and mental peace.",
    divisionsName: "Chapter",
    divisionsCount: 12,
    featuredPortions: [
      { name: "Chapter 1: Shiva Bhakti", reference: "1", topicMessage: "Underlines the deep meaning of devotion to Shiva and the virtues of mental purification." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1609137144813-94c632616238?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A serene visual representation of a Shiva shrine, representing steady devotion and inner calmness."
  },
  {
    key: "adi_purana",
    title: "Adipurana (Upapurana)",
    originalTitle: "आदि पुराण",
    religion: "hinduism",
    description: "The 'primordial' Purana, delivering exquisite descriptions of early cosmic creation, deep devotion to Vishnu or Shiva in their supreme non-dual forms, and ancestral lineages of the ancient sages.",
    divisionsName: "Chapter",
    divisionsCount: 29,
    featuredPortions: [
      { name: "Chapter 1: Primordial Creation", reference: "1", topicMessage: "Explains how the formless Supreme Consciousness first projected the universe through Maya." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Vibrant cosmic gas clouds and nebulae in deep space, representing the primordial origin of the universe."
  },
  {
    key: "manava_purana",
    title: "Manava Purana (Upapurana)",
    originalTitle: "मानव पुराण",
    religion: "hinduism",
    description: "A traditional Upapurana attributed to Swayambhuva Manu. It discusses cosmic laws, the spiritual duties of human beings (Manava-Dharma), codes of ethical conduct, and the nature of the universal soul.",
    divisionsName: "Chapter",
    divisionsCount: 32,
    featuredPortions: [
      { name: "Chapter 1: Duties of Humanity", reference: "1", topicMessage: "Introduction to the moral obligations and universal virtues prescribed for all human life." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    imageCaption: "An ancient open scroll displaying Sanskrit verses, signifying the cosmic laws of Manu."
  },
  {
    key: "ushanasa_purana",
    title: "Ushanasa Purana (Upapurana)",
    originalTitle: "औशनस पुराण",
    religion: "hinduism",
    description: "An essential Upapurana authored by Sage Ushanas (Shukracharya), the preceptor of the Asuras. It is a highly analytical text describing legal ethics, purification rules, and the path of absolute righteousness.",
    divisionsName: "Chapter",
    divisionsCount: 9,
    featuredPortions: [
      { name: "Chapter 1: Absolute Purity", reference: "1", topicMessage: "Sage Ushanas delivers codes of conduct and physical/mental purification to remove obstacles." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Sunlight filtering through fresh green forest leaves, representing moral purification and pristine clarity."
  },
  {
    key: "saunaka_purana",
    title: "Saunaka Purana (Upapurana)",
    originalTitle: "शौनक पुराण",
    religion: "hinduism",
    description: "Dedicated to the teachings of the great Sage Saunaka. It provides dynamic instruction regarding domestic sacrifices, Vedic ritual alignments, and spiritual pathways for the householder life.",
    divisionsName: "Chapter",
    divisionsCount: 45,
    featuredPortions: [
      { name: "Chapter 1: Saunaka's Questions", reference: "1", topicMessage: "Sage Saunaka and other sages ask deep questions in Naimisharanya forest regarding human welfare." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Deep ancient woodlands with mossy soil, signifying the discussions of Saunaka at Naimisharanya forest."
  },
  {
    key: "varuna_purana",
    title: "Varuna Purana (Upapurana)",
    originalTitle: "वरुण पुराण",
    religion: "hinduism",
    description: "A watery cosmic Upapurana dedicated to Lord Varuna (the Lord of Oceans and Waters). It describes ecological conservation, prayers for rain, the purity of rivers, and the spiritual secrets of the cosmic ocean.",
    divisionsName: "Chapter",
    divisionsCount: 12,
    featuredPortions: [
      { name: "Chapter 1: The Cosmic Waters", reference: "1", topicMessage: "Explaining the vital life force of water as the fluid manifestation of the supreme reality." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Clear blue ocean water waves under a bright morning sky, representing Lord Varuna's aquatic domain."
  },
  {
    key: "maheshwara_purana",
    title: "Maheshwara Purana (Upapurana)",
    originalTitle: "महेश्वर पुराण",
    religion: "hinduism",
    description: "A glorious Shaiva Upapurana dedicated to Maheshwara (Lord Shiva). It describes the grandeur of the Shiva-Shakti union, the origins of sacred lingas, and supreme meditations for self-realization.",
    divisionsName: "Chapter",
    divisionsCount: 12,
    featuredPortions: [
      { name: "Chapter 1: The Splendor of Maheshwara", reference: "1", topicMessage: "The sages gather to praise the formless Lord Shiva who manifests out of compassion." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1609137144813-94c632616238?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Warm traditional temple light radiating from a sanctum, signifying Maheshwara's presence."
  },
  {
    key: "maricha_purana",
    title: "Maricha Purana (Upapurana)",
    originalTitle: "मारीच पुराण",
    religion: "hinduism",
    description: "An esoteric Upapurana narrated by Sage Marichi, one of the mind-born sons of Brahma. It contains advanced cosmological models, solar light formulas, and ethical philosophies.",
    divisionsName: "Chapter",
    divisionsCount: 18,
    featuredPortions: [
      { name: "Chapter 1: Wisdom of Marichi", reference: "1", topicMessage: "Marichi reveals how pure devotion to the absolute source transcends the material realm of karma." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Gleaming stars and golden nebulae, representing the deep astronomical and light theories of Sage Marichi."
  },

  // --- ISLAM ---
  {
    key: "quran",
    title: "The Holy Quran",
    originalTitle: "القرآن الكريم",
    religion: "islam",
    description: "The central religious text of Islam, believed by Muslims to be a revelation from God (Allah). Formatted into 114 Surahs, it establishes Islamic monotheism, daily guidance, historical parables, and codes of conduct across personal, civic, and moral realms.",
    divisionsName: "Surah (Chapter)",
    divisionsCount: 114,
    featuredPortions: [
      { name: "Surah 1: Al-Fatiha", reference: "1", topicMessage: "The Opening Surah, reciting praise, guidance, and the path of the upright." },
      { name: "Surah 2: Al-Baqarah", reference: "2", topicMessage: "The largest Surah, containing the famous Kursi verse (Ayat al-Kursi) outlining divine majesty." },
      { name: "Surah 36: Ya-Sin", reference: "36", topicMessage: "Considered the heart of the Quran, delivering profound reflections on life, death, and resurrection." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Prismatic light casting beautiful shadows through classic arches, representing monotheistic beauty and structural wisdom."
  },
  {
    key: "hadith_bukhari",
    title: "Sunni: Sahih al-Bukhari",
    originalTitle: "صحيح البخاري",
    religion: "islam",
    description: "The most authentic compilation of Hadith in Sunni Islam, compiled by Imam Muhammad al-Bukhari. It serves as a secondary source of law, theology, and ethical guidance to the Quran.",
    divisionsName: "Book",
    divisionsCount: 97,
    featuredPortions: [
      { name: "Book 1: Revelation", reference: "1", topicMessage: "Accounts of how the first revelations descended upon the Prophet Muhammad." },
      { name: "Book 2: Belief (Iman)", reference: "2", topicMessage: "Insights into true faith, declaring love, safety, and charity as essential aspects of belief." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Classical calligraphic lines and Islamic structural arches, representing the scholarly preservation and validation of Sunni prophetic traditions."
  },
  {
    key: "hadith_muslim",
    title: "Sunni: Sahih Muslim",
    originalTitle: "صحيح مسلم",
    religion: "islam",
    description: "The second of the two highly authentic collections of Hadith in Sunni Islam, compiled by Imam Muslim ibn al-Hajjaj.",
    divisionsName: "Book",
    divisionsCount: 56,
    featuredPortions: [
      { name: "Book 1: Faith (Iman)", reference: "1", topicMessage: "Comprehensive discourses defining belief, faith, and monotheism." },
      { name: "Book 4: Prayer (Salah)", reference: "4", topicMessage: "Specific details and spiritual directives regarding the daily Islamic prayers." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A vast quiet mosque interior with elegant prayer carpets, signifying peace and devotion."
  },
  {
    key: "hadith_abudawood",
    title: "Sunni: Sunan Abu Dawood",
    originalTitle: "سنن أبي داود",
    religion: "islam",
    description: "One of the six major Sunni Hadith collections, compiled by Imam Abu Dawood, highly esteemed for legal rulings and jurisprudence.",
    divisionsName: "Book",
    divisionsCount: 43,
    featuredPortions: [
      { name: "Book 1: Purification", reference: "1", topicMessage: "Laws of physical and ritual purity in preparation for connection with the divine." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Sacred courtyard fountain, signifying physical and spiritual cleansing."
  },
  {
    key: "hadith_tirmidhi",
    title: "Sunni: Jami' al-Tirmidhi",
    originalTitle: "جامع الترمذي",
    religion: "islam",
    description: "One of the six canonical Sunni Hadith collections, compiled by Imam al-Tirmidhi, famous for legal and ethical teachings.",
    divisionsName: "Book",
    divisionsCount: 49,
    featuredPortions: [
      { name: "Book 1: Purification", reference: "1", topicMessage: "Practical guidelines on cleaning and purification." },
      { name: "Book 25: Virtues (Al-Adab)", reference: "25", topicMessage: "Prophetic teachings on good manners, hospitality, and humility." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Intricately woven calligraphic script from medieval parchment."
  },
  {
    key: "hadith_nasai",
    title: "Sunni: Sunan al-Nasa'i",
    originalTitle: "سنن النسائي",
    religion: "islam",
    description: "A highly respected Sunni Hadith collection compiled by Imam al-Nasa'i, featuring extremely precise lines of transmission.",
    divisionsName: "Book",
    divisionsCount: 51,
    featuredPortions: [
      { name: "Book 1: Taharah", reference: "1", topicMessage: "The supreme importance of personal hygiene and purity." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Dappled light over beautiful sacred spaces."
  },
  {
    key: "hadith_ibnmajah",
    title: "Sunni: Sunan ibn Majah",
    originalTitle: "سنن ابن ماجه",
    religion: "islam",
    description: "One of the six major Sunni Hadith collections, compiled by Imam ibn Majah, covering religious duties and lifestyle laws.",
    divisionsName: "Book",
    divisionsCount: 37,
    featuredPortions: [
      { name: "Book 1: Prophetic Sunnah", reference: "1", topicMessage: "The theoretical and practical foundations of following the Prophet's path." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Geometric tiled arches reflecting light, representing scholarly structure."
  },
  {
    key: "hadith_kafi",
    title: "Shia: Kitab al-Kafi",
    originalTitle: "الكافي",
    religion: "islam",
    description: "The most foundational and extensive Shia Hadith collection, compiled by Muhammad ibn Ya'qub al-Kulayni.",
    divisionsName: "Book",
    divisionsCount: 34,
    featuredPortions: [
      { name: "Book 1: Intellect and Ignorance (Aql)", reference: "1", topicMessage: "Foundational traditions praising reason, intellect, and knowledge as the bedrock of faith." },
      { name: "Book 2: The Excellence of Knowledge", reference: "2", topicMessage: "Prophetic calls to seek wisdom and scholarship." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Scholarly desk with ancient bound manuscripts, representing intellectual wisdom."
  },
  {
    key: "hadith_faqih",
    title: "Shia: Man La Yahduruhu al-Faqih",
    originalTitle: "من لا يحضره الفقيه",
    religion: "islam",
    description: "The second of the Shia 'Four Books', compiled by Sheikh al-Saduq, focusing on practical legal rulings and spiritual duties.",
    divisionsName: "Chapter",
    divisionsCount: 4,
    featuredPortions: [
      { name: "Chapter 1: Ritual Purity", reference: "1", topicMessage: "Codes of physical cleanliness and readiness for spiritual ascension." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A high-precision marble dome with elegant motifs, symbolizing jurisprudence."
  },
  {
    key: "hadith_tahdhib",
    title: "Shia: Tahdhib al-Ahkam",
    originalTitle: "تهذيب الأحكام",
    religion: "islam",
    description: "An authoritative Shia Hadith collection compiled by Sheikh al-Tusi, serving as a core source of jurisprudence and ethics.",
    divisionsName: "Chapter",
    divisionsCount: 23,
    featuredPortions: [
      { name: "Chapter 1: Daily Prayers", reference: "1", topicMessage: "Detailed rules, times, and spiritual conditions of prayer." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Elegant lamps illuminating old stone walls, representing guiding wisdom."
  },
  {
    key: "hadith_istibsar",
    title: "Shia: Al-Istibsar",
    originalTitle: "الاستبصار",
    religion: "islam",
    description: "One of the Shia 'Four Books', compiled by Sheikh al-Tusi to reconcile seemingly conflicting narrations.",
    divisionsName: "Book",
    divisionsCount: 4,
    featuredPortions: [
      { name: "Book 1: Worship (Ibadat)", reference: "1", topicMessage: "Traditions detailing the core acts of Islamic worship and devotion." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1509021436665-8f37df706533?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Interlocking patterns on carved wooden screens, representing balance and reconciliation."
  },
  {
    key: "hadith_balagha",
    title: "Shia: Nahj al-Balagha",
    originalTitle: "نهج البلاغة",
    religion: "islam",
    description: "A highly revered compilation of sermons, letters, and wisdom sayings attributed to Imam Ali ibn Abi Talib, the first Shia Imam.",
    divisionsName: "Sub-book / Division",
    divisionsCount: 809,
    featuredPortions: [
      { name: "Sermon 1: Creation of Cosmos", reference: "1", topicMessage: "A sublime cosmological discourse on the creation of the heavens, earth, and angels." },
      { name: "Letter 53: Treaty to Malik al-Ashtar", reference: "294", topicMessage: "The legendary treatise on governance, justice, human rights, and political integrity (Letter 53)." },
      { name: "Aphorism 150: Light of Knowledge", reference: "470", topicMessage: "The famous discourse to Kumayl ibn Ziyad on the categories of scholars and the power of divine knowledge (Aphorism 150)." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Deep celestial starry sky over ancient mountains, reflecting the Peak of Eloquence."
  },
  {
    key: "hadith_sajjadiyya",
    title: "Shia: Al-Sahifa al-Sajjadiyya",
    originalTitle: "الصحيفة السجادية",
    religion: "islam",
    description: "The oldest prayer handbook in Islamic sources, containing the deeply moving emotional supplications of Imam Ali ibn al-Husayn (al-Sajjad).",
    divisionsName: "Supplication",
    divisionsCount: 54,
    featuredPortions: [
      { name: "Supplication 1: Praise of Allah", reference: "1", topicMessage: "A deeply lyrical and poetic praise of the Creator's beauty and transcendence." },
      { name: "Supplication 20: Noble Moral Character", reference: "20", topicMessage: "The famous 'Makarim al-Akhlaq' prayer begging for moral excellence, purity of heart, and humility." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Dusk falling over a silent desert sky, evoking spiritual intimacy and emotional supplication."
  },

  // --- CHRISTIANITY ---
  {
    key: "bible_nt",
    title: "New Testament (Bible)",
    originalTitle: "Novum Testamentum",
    religion: "christianity",
    description: "The second major division of the Christian biblical canon. It focuses on the life, teachings, death, and resurrection of Jesus Christ, alongside early church history, apostolical letters, and prophetic visions.",
    divisionsName: "Book (Matthew to Revelation)",
    divisionsCount: 27,
    featuredPortions: [
      { name: "Matthew (Ch 1-28)", reference: "1", topicMessage: "The Gospel account containing the revolutionary Sermon on the Mount, including the Beatitudes on humility, peace, and loving enemies." },
      { name: "John (Ch 1-21)", reference: "4", topicMessage: "A sublime prologue presenting Jesus as the Logos (Word) made flesh, bringing divine light and grace to humanity." },
      { name: "1 Corinthians (Ch 1-16)", reference: "7", topicMessage: "The historic discourse on love (agape) as the greatest spiritual gift, transcending all other virtues." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A majestic cross glowing brightly against the morning sun and clouds, representing the New Testament message of unconditional love."
  },
  {
    key: "bible_ot",
    title: "Old Testament (Bible)",
    originalTitle: "Vetus Testamentum",
    religion: "christianity",
    description: "The first part of Christian Bibles, based primarily on the Hebrew Bible (Tanakh). It chronicles the creation of the cosmos, the history of ancient Israel, moral covenants, and wisdom literature.",
    divisionsName: "Book (Genesis to Malachi)",
    divisionsCount: 39,
    featuredPortions: [
      { name: "Genesis (Ch 1-50)", reference: "1", topicMessage: "The creation of the heavens and the earth, expressing universal stewardship and moral origin." },
      { name: "Psalms (Ch 1-150)", reference: "19", topicMessage: "The shepherd's song of absolute guidance, hope, and protection in God." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80",
    imageCaption: "The craggy desert ridges of Mount Sinai under a vast sky, representing where the moral tables of the covenant were received by Moses."
  },
  {
    key: "the_epistles",
    title: "The Epistles",
    originalTitle: "Epistolae",
    religion: "christianity",
    description: "The apostolic letters written by early Christian leaders—primarily Paul, Peter, John, James, and Jude—to foundational church communities. These letters provide theological depth, moral guidelines, and practical instructions on love, faith, communal harmony, and spiritual discipline.",
    divisionsName: "Epistle (Romans to Jude)",
    divisionsCount: 21,
    featuredPortions: [
      { name: "Romans (Ch 1-16)", reference: "1", topicMessage: "A masterpiece on living sacrifice, mutual service, genuine love, and overcoming evil with good." },
      { name: "1 Corinthians (Ch 1-16)", reference: "2", topicMessage: "The beautiful hymn of love (agape) as the absolute pinnacle of spiritual maturity." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    imageCaption: "An open scripture manuscript with a classical ink quill, representing the apostolical letters of the Epistles."
  },

  // --- JUDAISM ---
  {
    key: "torah",
    title: "The Torah",
    originalTitle: "תּוֹרָה",
    religion: "judaism",
    description: "The core foundational text of the Jewish people, consisting of the Five Books of Moses: Genesis (Bereshit), Exodus (Shemot), Leviticus (Vayikra), Numbers (Bamidbar), and Deuteronomy (Devarim). Tells the covenant story of Abraham, liberation from Egypt, law-giving, and moral duties.",
    divisionsName: "Book (1 to 5)",
    divisionsCount: 5,
    featuredPortions: [
      { name: "Genesis (Bereshit)", reference: "1", topicMessage: "The creation of the universe, the early history of humanity, and the life stories of the patriarchs and matriarchs." },
      { name: "Exodus (Shemot)", reference: "2", topicMessage: "The enslavement in Egypt, the leadership of Moses, the miraculous plagues, the splitting of the sea, the assembly at Sinai, and the Ten Commandments." },
      { name: "Leviticus (Vayikra)", reference: "3", topicMessage: "Instructions on temple sacrifices, holiness, dietary purity (Kashrut), ritual cleanliness, and the famous 'Love thy neighbor' commandment." },
      { name: "Numbers (Bamidbar)", reference: "4", topicMessage: "The forty-year wandering of the Israelites in the wilderness, census counts, rebellions, and journeys toward the Promised Land." },
      { name: "Deuteronomy (Devarim)", reference: "5", topicMessage: "Moses' final discourses reviewing the law, the central declaration of oneness (Shema Yisrael), and the transition of leadership to Joshua." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1543728770-9d485141012f?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Ancient Hebrew scriptura rolls written in deep ink, representing the foundational ethical law and the covenant history of Jewish people."
  },
  {
    key: "tanakh",
    title: "The Tanakh",
    originalTitle: "תַּנַּ״ךְ",
    religion: "judaism",
    description: "The complete Hebrew Bible, traditionally organized into three divisions: Torah (Law of Moses), Nevi'im (Prophets), and Ketuvim (Writings). It contains 24 canonical books outlining 929 chapters that govern Jewish covenantal faith, history, poetry, and divine prophecies.",
    divisionsName: "Book (1 to 24)",
    divisionsCount: 24,
    featuredPortions: [
      { name: "Genesis (Bereshit)", reference: "1", topicMessage: "The creation of the world, early covenants, and the stories of Abraham, Sarah, Isaac, Jacob, and Joseph." },
      { name: "Psalms (Tehillim)", reference: "14", topicMessage: "The timeless book of sacred poetry, songs, and prayers expressing gratitude, sorrow, and ultimate trust in God." },
      { name: "Isaiah (Yeshayahu)", reference: "10", topicMessage: "Prophetic calls for social justice, moral transformation, peace among nations, and the ultimate restoration of Zion." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80",
    imageCaption: "An open sacred Tanakh Bible scroll showing clean Hebrew calligraphy under warm scholarly lighting."
  },
  {
    key: "talmud",
    title: "The Talmud",
    originalTitle: "תַּלְמוּד",
    religion: "judaism",
    description: "The monumental compendium of Rabbinic Judaism, consisting of the Mishnah (oral law) and the Gemara (comprehensive analytical discussions). Spanning 63 distinct tractates, it represents centuries of dialectic debates, ethics, folklore, and practical guidance for a holy life.",
    divisionsName: "Tractate (1 to 63)",
    divisionsCount: 63,
    featuredPortions: [
      { name: "Berakhot (Tractate 1)", reference: "1", topicMessage: "First tractate of Zeraim (Seeds), focusing on the Shema, daily prayers, and blessing formulas of gratitude." },
      { name: "Shabbat (Tractate 12)", reference: "12", topicMessage: "Central tractate of Moed (Festivals), defining the 39 creative melachot (prohibited activities) to fully sanctify Shabbat." },
      { name: "Pirkei Avot (Tractate 39)", reference: "39", topicMessage: "Cherished tractate of Nezikin (Damages), containing historical ethical maxims, moral principles, and rabbinic wisdom." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A scholarly study desk filled with stacked volumes and active analysis, representing centuries of Rabbinic dialogical debates and moral guidance."
  },

  // --- BUDDHISM ---
  {
    key: "dhammapada",
    title: "The Dhammapada",
    originalTitle: "धम्मपद",
    religion: "buddhism",
    description: "A treasured scripture of Theravada Buddhism, compiling 423 verses spoken by Gautama Buddha. Organized into 26 chapters, it outlines paths in mindfulness, mental mastery, non-violence, and the road to nirvana.",
    divisionsName: "Chapter",
    divisionsCount: 26,
    featuredPortions: [
      { name: "Chapter 1: The Twin Verses", reference: "1", topicMessage: "Buddha explains how our life is shaped by our mind, focusing on pure thoughts versus hostile ones." },
      { name: "Chapter 10: Violence (Danda)", reference: "10", topicMessage: "Exhortation to absolute non-injury, recognizing that all beings dread pain and love life." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A serene hand-carved golden Buddha statue meditating deeply in the woodland, representing mindfulness and the path to ending sorrow."
  },
  {
    key: "heart_sutra",
    title: "The Heart Sutra",
    originalTitle: "प्रज्ञापारमिताहृदयसूत्र",
    religion: "buddhism",
    description: "The most famous Mahayana Buddhist scripture. While very concise, it contains the core of Zen philosophy—the realization of non-dual emptiness (Shunyata) and the liberating wisdom of Avalokiteshvara.",
    divisionsName: "Sutra Core Section",
    divisionsCount: 1,
    featuredPortions: [
      { name: "Ultimate Wisdom Discourse", reference: "1", topicMessage: "Form is emptiness, emptiness is form. Unlocking freedom from absolute suffering by releasing attachments." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Still stones resting calmly in perfectly raked concentric sand ripples, representing Zen meditation on absolute emptiness (Shunyata)."
  },
  {
    key: "tripitaka_sutta",
    title: "Sutta Pitaka (Buddha's Discourses)",
    originalTitle: "सुत्तपिटक",
    religion: "buddhism",
    description: "The main basket of the Pali Canon, containing thousands of discourses (Suttas) delivered by Gautama Buddha and his chief disciples outlining the Four Noble Truths and the Eightfold Path.",
    divisionsName: "Nikaya (Collection)",
    divisionsCount: 5,
    featuredPortions: [
      { name: "Digha Nikaya (Long Discourses)", reference: "1", topicMessage: "Features detailed long suttas discussing statecraft, cosmology, and the Buddha's final days (Mahaparinibbana Sutta)." },
      { name: "Majjhima Nikaya (Middle-Length Discourses)", reference: "2", topicMessage: "Profound, descriptive discourses covering mindfulness, karma, and rebirth." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A calm woodland path framed by ancient trees, illustrating the walking meditation of the Suttas."
  },
  {
    key: "abhidhamma_pitaka",
    title: "Abhidhamma Pitaka",
    originalTitle: "अभिधम्मपिटक",
    religion: "buddhism",
    description: "The philosophical, scholastic, and psychological analysis of the Buddha's teachings, systematizing the nature of mind, matter, and mental factors.",
    divisionsName: "Book",
    divisionsCount: 7,
    featuredPortions: [
      { name: "Dhammasangani (Enumeration of Phenomena)", reference: "1", topicMessage: "A meticulous handbook defining and classifying various states of consciousness and ethical qualities." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Symmetrical geometric patterns reflecting absolute mathematical balance and precision."
  },

  // --- JAINISM ---
  {
    key: "tattvartha_sutra",
    title: "Tattvartha Sutra",
    originalTitle: "तत्त्वार्थसूत्र",
    religion: "jainism",
    description: "The 'Book of Reality' composed by Acharya Umaswami. Highly respected by all Jain sects, it lays out the cosmology of Jiva (soul) and Ajiva (non-soul), karma, right belief, right knowledge, and the paramount principle of non-injury (Ahimsa Paramo Dharmah).",
    divisionsName: "Chapter",
    divisionsCount: 10,
    featuredPortions: [
      { name: "Chapter 1: Paths to Soul Liberation", reference: "1", topicMessage: "Lays out the three jewels: Right Faith, Right Knowledge, and Right Conduct." },
      { name: "Chapter 5: Nature of the Living and Non-Living", reference: "5", topicMessage: "Explains how souls and matter serve each other's evolutionary journey ('Parasparopagraho Jivanama')." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Pure, untouched mountain valleys with flowing waterfalls, symbolizing Jain reverence for Jiva (all plant and forest soul life) and Ahimsa."
  },
  {
    key: "jain_agamas",
    title: "Jain Agamas (Canonical)",
    originalTitle: "जैन आगम",
    religion: "jainism",
    description: "The primary canonical texts of Svetambara Jainism, containing the direct spiritual sermons, codes of conduct, and teachings of Lord Mahavira.",
    divisionsName: "Anga (Chapter)",
    divisionsCount: 11,
    featuredPortions: [
      { name: "Acharanga Sutra (Rules of Conduct)", reference: "1", topicMessage: "Prescribes rigorous ascetic rules, daily discipline, and the absolute practice of non-injury (Ahimsa)." },
      { name: "Sutrakritanga (Philosophical Doctrines)", reference: "2", topicMessage: "Detailed discourses refuting rival philosophical systems and asserting Jain paths." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=600&q=80",
    imageCaption: "An ancient stone carving of a tranquil Tirthankara in deep meditation, embodying complete detachment (Vairagya)."
  },
  {
    key: "bhagavati_sutra",
    title: "Bhagavati Sutra",
    originalTitle: "भगवती सूत्र",
    religion: "jainism",
    description: "The largest of the Jain Agamas, presenting a vast, deep array of questions and answers covering cosmology, history, science, and spiritual paths.",
    divisionsName: "Chapter",
    divisionsCount: 41,
    featuredPortions: [
      { name: "Chapter 1: Salutations and Cosmos", reference: "1", topicMessage: "Opens with the sacred Navkar Mantra and moves into deep cosmological queries." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Sacred manuscripts preserved on handmade palm leaves, representing the preservation of wisdom."
  },

  // --- SIKHISM ---
  {
    key: "guru_granth",
    title: "Sri Guru Granth Sahib",
    originalTitle: "ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ",
    religion: "sikhism",
    description: "The supreme, eternal living Guru of Sikhism. It contains a collection of poetic divine praises (Gurbani) composed by Sikh Gurus and multi-faith saints of medieval India (including Hindu Bhagats and Muslim Sufis), promoting extreme monotheism, dignity, and interfaith oneness.",
    divisionsName: "Ang (Page)",
    divisionsCount: 1430,
    featuredPortions: [
      { name: "Ang 1: Japji Sahib (Universal Truth)", reference: "1", topicMessage: "The foundational composition of Guru Nanak declaring the One Uncreated Reality (Ik Onkar), truthfulness, and direct communion." },
      { name: "Ang 8: So Dar (The Divine Gate)", reference: "8", topicMessage: "Opening evening chants describing the cosmic gateway where all creation sings praises to the Creator." },
      { name: "Ang 12: Sohila (The Nocturnal Song)", reference: "12", topicMessage: "A serene bedtime prayer of peace, reflecting on the brevity of life and union with the Divine." },
      { name: "Ang 14: Sri Raag (Mellow Devotion)", reference: "14", topicMessage: "The 1st Raga, focusing on meditating upon the Divine Name (Naam) amid transient worldly riches." },
      { name: "Ang 94: Raag Maajh (Soul's Yearning)", reference: "94", topicMessage: "The 2nd Raga, expressing deep spiritual yearning for the vision of the Divine Friend." },
      { name: "Ang 151: Raag Gauri (Deep Contemplation)", reference: "151", topicMessage: "The 3rd Raga, featuring extensive meditations that calm the mind and guide it to absolute equilibrium." },
      { name: "Ang 347: Raag Aasa (Vibrant Hope)", reference: "347", topicMessage: "The 4th Raga, containing uplifting morning hymns that clear the mind's dark illusions." },
      { name: "Ang 489: Raag Gujri (Grace and Prayer)", reference: "489", topicMessage: "The 5th Raga, promoting deep surrender, peace, and release from anxious worldly desires." },
      { name: "Ang 527: Raag Devgandhari (Sublime Ecstasy)", reference: "527", topicMessage: "The 6th Raga, capturing the spontaneous joy and sweet surrender of the soul to its Beloved." },
      { name: "Ang 537: Raag Bihagara (Nostalgia & Devotion)", reference: "537", topicMessage: "The 7th Raga, comparing the seeker to a traveler seeking shelter in the home of divine love." },
      { name: "Ang 557: Raag Wadhans (Sorrow & Comfort)", reference: "557", topicMessage: "The 8th Raga, utilizing folk meters to channel human grief into spiritual longing and comfort." },
      { name: "Ang 595: Raag Sorath (Joyous Healing)", reference: "595", topicMessage: "The 9th Raga, celebrating ultimate divine protection, inner wellness, and relief from fear." },
      { name: "Ang 660: Raag Dhanasari (Aarti of Nature)", reference: "660", topicMessage: "The 10th Raga, including the Aarti where the sky is the platter, sun and moon are lamps, and forests are incense." },
      { name: "Ang 696: Raag Jaitsiri (Uplifting Solace)", reference: "696", topicMessage: "The 11th Raga, conveying profound prayer for mercy, guidance, and spiritual shelter." },
      { name: "Ang 711: Raag Todi (Extreme Humility)", reference: "711", topicMessage: "The 12th Raga, describing the soul's absolute dependency on the grace of the Creator." },
      { name: "Ang 719: Raag Bairari (Glorious Praise)", reference: "719", topicMessage: "The 13th Raga, meditating on the beautiful qualities and infinite names of the Creator." },
      { name: "Ang 721: Raag Tilang (Universal Devotion)", reference: "721", topicMessage: "The 14th Raga, blending Punjabi and Islamic Persian terms to declare that the Creator belongs to all." },
      { name: "Ang 728: Raag Suhi (Sincere Commitment)", reference: "728", topicMessage: "The 15th Raga, focusing on spiritual fidelity, moral purity, and deep emotional attachment to God." },
      { name: "Ang 795: Raag Bilaval (Spontaneous Bliss)", reference: "795", topicMessage: "The 16th Raga, celebrating the sheer happiness of finding the Guru and experiencing inner peace." },
      { name: "Ang 859: Raag Gond (Childlike Trust)", reference: "859", topicMessage: "The 17th Raga, illustrating unwavering trust and security under the protective hand of the Divine." },
      { name: "Ang 876: Raag Ramkali (Mindfulness & Dialog)", reference: "876", topicMessage: "The 18th Raga, containing Sidh Gosht—Guru Nanak's debate asserting family-life mindfulness over forest retreats." },
      { name: "Ang 975: Raag Nat Narayan (Innocence & Love)", reference: "975", topicMessage: "The 19th Raga, reflecting the sweet, innocent, and joyful devotion of a child-like heart." },
      { name: "Ang 984: Raag Mali Gaura (Divine Oneness)", reference: "984", topicMessage: "The 20th Raga, celebrating liberation from worldly anxiety by merging into the cosmic light." },
      { name: "Ang 989: Raag Maru (Courage & Call)", reference: "989", topicMessage: "The 21st Raga, utilizing epic meters to inspire inner warrior spirit and complete self-surrender." },
      { name: "Ang 1107: Raag Tukhari (Barah Maha - Seasons of Soul)", reference: "1107", topicMessage: "The 22nd Raga, depicting the twelve months of the year as a metaphor for the soul's cycle of yearning." },
      { name: "Ang 1118: Raag Kedara (Purifying Light)", reference: "1118", topicMessage: "The 23rd Raga, reminding the seeker to let go of slander, ego, and cultivate genuine love." },
      { name: "Ang 1125: Raag Bhairav (Fearlessness)", reference: "1125", topicMessage: "The 24th Raga, declaring that when the Divine resides in the heart, all worldly fear is permanently vanquished." },
      { name: "Ang 1168: Raag Basant (Spring of Awakening)", reference: "1168", topicMessage: "The 25th Raga, celebrating spiritual rebirth, where the dried soul blooms with divine love like spring flowers." },
      { name: "Ang 1197: Raag Sarang (Cool Rain of Grace)", reference: "1197", topicMessage: "The 26th Raga, quenching the spiritual thirst of the soul with the sweet nectar of the Divine Name." },
      { name: "Ang 1254: Raag Malhar (Thundering Devotion)", reference: "1254", topicMessage: "The 27th Raga, using the monsoon rains as a metaphor for the downpour of divine love over the earth." },
      { name: "Ang 1294: Raag Kanara (Divine Splendor)", reference: "1294", topicMessage: "The 28th Raga, praising the marvelous, magnificent, and limitless attributes of the Creator." },
      { name: "Ang 1319: Raag Kalyan (Ultimate Fulfillment)", reference: "1319", topicMessage: "The 29th Raga, expressing absolute contentment and complete fulfillment in the presence of the Guru." },
      { name: "Ang 1327: Raag Prabhati (Dawn of Consciousness)", reference: "1327", topicMessage: "The 30th Raga, capturing the serene hours of early dawn to focus on devotion and clean living." },
      { name: "Ang 1352: Raag Jaijavanti (Impermanence)", reference: "1352", topicMessage: "The 31st Raga, by Guru Tegh Bahadur, urging mindfulness of impermanence and detachment from material illusions." },
      { name: "Ang 1360: Slokas and Swayas (The Ultimate Seals)", reference: "1360", topicMessage: "The final portion comprising powerful, deep moral couplets, concluding with the cosmic harmony of Ragamala." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1601058268499-e52658bdfaf1?auto=format&fit=crop&w=600&q=80",
    imageCaption: "The majestic Golden Temple (Sri Harmandir Sahib) illuminated over reflecting waters, celebrating Sikh interfaith peace, truth, and devotion."
  },
  {
    key: "dasam_granth",
    title: "The Dasam Granth",
    originalTitle: "ਦਸਮ ਗ੍ਰੰਥ",
    religion: "sikhism",
    description: "A sacred scripture containing compositions attributed to the tenth Sikh Guru, Guru Gobind Singh, embodying warrior spirit, praise, and moral grit.",
    divisionsName: "Ang (Page)",
    divisionsCount: 1428,
    featuredPortions: [
      { name: "Jaap Sahib (Ang 1–10)", reference: "1", topicMessage: "A magnificent catalog of 950 non-anthropomorphic names of the formless, limitless Divine." },
      { name: "Akal Ustat (Ang 11–38)", reference: "11", topicMessage: "Praise of the Immortal Creator, declaring that all humanity is of the same single caste." },
      { name: "Bachitar Natak (Ang 39–114)", reference: "39", topicMessage: "An autobiographical composition outlining the tenth Guru's mission to establish righteousness and end tyranny." },
      { name: "Chandi Charitar I & II (Ang 115–174)", reference: "115", topicMessage: "A heroic narrative illustrating the triumph of moral righteousness and cosmic justice over dark forces." },
      { name: "Chandi di Var (Ang 175–186)", reference: "175", topicMessage: "A fierce, highly rhythmic martial ballad symbolizing the eternal struggle between moral good and evil." },
      { name: "Gyan Prabodh (Ang 187–311)", reference: "187", topicMessage: "The Awakening of True Wisdom, detailing ethical duty, charity, and spiritual enlightenment." },
      { name: "Chaubis Avtar (Ang 312–709)", reference: "312", topicMessage: "Detailed analysis of 24 classic avatars, illustrating that they are manifestations of the One Supreme power." },
      { name: "Brahm Avtar (Ang 710–817)", reference: "710", topicMessage: "Philosophical discourse on the manifestations of the intellect, emphasizing alignment with the supreme uncreated light." },
      { name: "Rudra Avtar (Ang 818–838)", reference: "818", topicMessage: "An epic martial poem recounting battles of cosmic figures, symbolizing the destruction of ego and pride." },
      { name: "Shastar Nam Mala (Ang 839–941)", reference: "839", topicMessage: "The Garland of Spiritual Weapons, praising divine power symbolized through protective cosmic weapons." },
      { name: "Charitropakhyan (Ang 942–1355)", reference: "942", topicMessage: "A massive compilation of 405 moral narratives detailing human psychology, temptations, and virtue." },
      { name: "Chaupai Sahib (Ang 1356–1384)", reference: "1356", topicMessage: "The highly beloved daily prayer seeking ultimate divine protection, inner strength, and victory of the soul." },
      { name: "Zafarnama & Hikayatan (Ang 1385–1428)", reference: "1385", topicMessage: "The famous 'Epistle of Victory' written in Persian poetry to Emperor Aurangzeb, asserting moral triumph over tyranny." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0612f1a?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Sacred metallic weaponry and manuscripts, representing the saint-soldier (Sant-Sipahi) ideal of the tenth Guru."
  },
  {
    key: "varan_bhai_gurdas",
    title: "Varan Bhai Gurdas",
    originalTitle: "ਵਾਰਾਂ ਭਾਈ ਗੁਰਦਾਸ",
    religion: "sikhism",
    description: "A highly revered collection of forty ballads written by Bhai Gurdas, serving as an essential key to understanding Guru Granth Sahib philosophy.",
    divisionsName: "Vaar (Ballad)",
    divisionsCount: 40,
    featuredPortions: [
      { name: "Vaar 1: Creation and Descent of Guru Nanak", reference: "1", topicMessage: "Describes the dark moral confusion of the medieval world and the spiritual light brought by Guru Nanak." },
      { name: "Vaar 2: True Guru is the True King", reference: "2", topicMessage: "Praises the divine mandate of the Gurus, establishing spiritual leadership based on truth and love." },
      { name: "Vaar 3: Description of a Gursikh", reference: "3", topicMessage: "Details the daily spiritual discipline, sweet speech, and humility of a true seeker." },
      { name: "Vaar 4: Glory of Satsangat", reference: "4", topicMessage: "Highlighting how the holy congregation acts as a ferry to cross the ocean of life." },
      { name: "Vaar 5: Spiritual Humility and Divine Name", reference: "5", topicMessage: "Explains how meditating upon the Divine Name with deep inner humility cleanses the soul." },
      { name: "Vaar 6: The Devoted Life of a Seeker", reference: "6", topicMessage: "Details the beauty of living in continuous remembrance of the Creator while fulfilling worldly roles." },
      { name: "Vaar 7: Cosmic Oneness and God's Play", reference: "7", topicMessage: "A deep philosophical view of the universe as a beautiful play orchestrated by the One Creator." },
      { name: "Vaar 8: Human Mind and Spiritual Practice", reference: "8", topicMessage: "Examines human nature and the practices required to tame the wandering mind." },
      { name: "Vaar 9: Moral Teachings and Virtuous Living", reference: "9", topicMessage: "Stresses honesty, charity, and righteous actions as the core pillars of true spirituality." },
      { name: "Vaar 10: Stories of Legendary Devotees", reference: "10", topicMessage: "Recounts the life and faith of historic saints like Dhruva and Prahlada, illustrating the power of devotion." },
      { name: "Vaar 11: Roll Call of Early Sikh Disciples", reference: "11", topicMessage: "A historic roll call of the direct disciples of the early Gurus and their dedicated service." },
      { name: "Vaar 12: Gurmukh vs Manmukh", reference: "12", topicMessage: "Contrasts the life of a Guru-oriented seeker (Gurmukh) with an ego-driven materialist (Manmukh)." },
      { name: "Vaar 13: Primacy of the Guru's Word", reference: "13", topicMessage: "Highlights how the teachings of the Guru act as an absolute guide in the dense dark forest of Maya." },
      { name: "Vaar 14: On False Rituals and Superstitions", reference: "14", topicMessage: "Dismantles reliance on omens, astrology, and hollow external rituals, promoting direct faith." },
      { name: "Vaar 15: The Path of True Devotion", reference: "15", topicMessage: "Examines the supreme nature of pure devotion (Bhakti) and how it transcends intellectual debates." },
      { name: "Vaar 16: Sikh Living and Ethical Conduct", reference: "16", topicMessage: "A guide to the ethical code, social responsibilities, and high moral character expected of a Sikh." },
      { name: "Vaar 17: Inner Character of a Gurmukh", reference: "17", topicMessage: "Describes the virtues of a mature seeker, including patience, forgiveness, and absolute contentment." },
      { name: "Vaar 18: Love for the Divine and Sangat", reference: "18", topicMessage: "Describes how the company of holy souls sparks the dormant light of divine love in the heart." },
      { name: "Vaar 19: Character of the Selfless Servant", reference: "19", topicMessage: "Focuses on 'Sewa' (selfless service) and how it purifies the ego and leads to spiritual liberation." },
      { name: "Vaar 20: Virtues of Humility and Tolerance", reference: "20", topicMessage: "Poetic comparisons showing how water flows to the lowest point, symbolizing the spiritual height of humility." },
      { name: "Vaar 21: Glory of the Guru-disciple Relationship", reference: "21", topicMessage: "Illustrates the mystical bond between the teacher and disciple, compared to metal turning to gold." },
      { name: "Vaar 22: The State of Spiritual Liberation", reference: "22", topicMessage: "Describes Jivan-Mukti—living in absolute freedom and peace while still performing worldly duties." },
      { name: "Vaar 23: Devotional Yearning and Prayer", reference: "23", topicMessage: "A collection of moving prayers seeking divine mercy, support, and protection in moments of weakness." },
      { name: "Vaar 24: Greatness of the Guru Lineage", reference: "24", topicMessage: "Traces the lineage of the Gurus, praising their divine mission to liberate humanity." },
      { name: "Vaar 25: Absolute Truth and True Living", reference: "25", topicMessage: "Declares that truth is the highest virtue, but higher still is truthful, honest living." },
      { name: "Vaar 26: Steadfastness in Spiritual Path", reference: "26", topicMessage: "Inspires seekers to remain unwavering on the spiritual path, unaffected by praise, slander, or hardships." },
      { name: "Vaar 27: Distinguishing Truth from Falsehood", reference: "27", topicMessage: "A philosophical discourse on how to recognize authentic spiritual paths amid widespread sectarianism." },
      { name: "Vaar 28: Householder Mindfulness and Liberation", reference: "28", topicMessage: "Affirms that true spiritual liberation is found inside honest family-life, rather than running to forest retreats." },
      { name: "Vaar 29: Divine Attributes and Human Soul", reference: "29", topicMessage: "Explains how the human soul shares the same nature and potential as the infinite, divine light." },
      { name: "Vaar 30: Detachment and Outer World", reference: "30", topicMessage: "Guides the mind on how to remain detached and pure in a world filled with material temptations." },
      { name: "Vaar 31: Inner Devotion over Ostentation", reference: "31", topicMessage: "Emphasizes that God reads the intentions of the heart, rendering grand external displays useless." },
      { name: "Vaar 32: Folly of Hypocrisy and Slander", reference: "32", topicMessage: "Warns against the destructive spiritual effects of speaking ill of others and harboring jealousy." },
      { name: "Vaar 33: Ultimate Submission to Divine Will", reference: "33", topicMessage: "Examines 'Bhama'—surrendering to the cosmic flow and finding deep joy in whatever the Creator sends." },
      { name: "Vaar 34: The Inscrutable Play of the Creator", reference: "34", topicMessage: "An awe-inspired song on the infinite variety and mysterious workings of the cosmos." },
      { name: "Vaar 35: Overcoming Moral Weakness", reference: "35", topicMessage: "Focuses on taming the five passions (lust, anger, greed, attachment, pride) through spiritual focus." },
      { name: "Vaar 36: Guidance on Virtuous Associations", reference: "36", topicMessage: "Stresses the immense impact of company, urging seekers to surround themselves with positive, moral minds." },
      { name: "Vaar 37: Compassion and Global Well-being", reference: "37", topicMessage: "Expresses prayers for the welfare, prosperity, and peace of all of humanity without exception." },
      { name: "Vaar 38: Realizing the Supreme Reality", reference: "38", topicMessage: "A beautiful depiction of the final stage of spiritual awakening where all division dissolves." },
      { name: "Vaar 39: Final Instructions and Essence", reference: "39", topicMessage: "Summarizes the entire philosophy of Gurmat (the Guru's path) into core actionable spiritual values." },
      { name: "Vaar 40: The Splendor of the Khalsa Path", reference: "40", topicMessage: "Celebrating the final consolidation of the path of righteousness and the brotherhood of the pure." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Morning light shining through arched pillars, symbolizing spiritual illumination."
  },

  // --- OTHER FAITHS ---
  {
    key: "tao_te_ching",
    title: "Tao Te Ching (Taoism)",
    originalTitle: "道德經",
    religion: "other",
    description: "The classic Chinese text composed by sage Lao Tzu. Using elegant, cryptic verses, it explains the flow of the universe (Tao/The Way), the virtue of effortless action (Wu Wei), humility, simplicity, and harmonious living with nature.",
    divisionsName: "Verse/Chapter",
    divisionsCount: 81,
    featuredPortions: [
      { name: "Chapter 1: Defining the Tao", reference: "1", topicMessage: "The Tao that can be spoken is not the eternal Tao. Discussing mystery and manifestation." },
      { name: "Chapter 8: Like Water", reference: "8", topicMessage: "Explains how the highest goodness is like water, benefitting all things without contending." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A majestic, misty mountain forest river flowing gently around boulders, tracing the classic Taoist virtue of effortless action (Wu Wei)."
  },
  {
    key: "poetic_edda",
    title: "The Poetic Edda",
    originalTitle: "Ljóða Edda",
    religion: "mythology",
    description: "The core manuscript of Old Norse mythological poetry. It details the accounts of Odin, Thor, Loki, Freya, and legendary heroes like Sigurd. It outlines Norse heroic character codes, wisdom, and the cosmic destruction and rebirth of Ragnarok.",
    divisionsName: "Lay / Poem",
    divisionsCount: 36,
    featuredPortions: [
      { name: "Völuspá (The Seeress's Prophecy)", reference: "1", topicMessage: "Mystical telling of the creation of the worlds, the origins of Norse gods, and the ultimate vision of Ragnarok." },
      { name: "Hávamál (The Sayings of the High One)", reference: "2", topicMessage: "Odin's personal rules of conduct, hospitality, courage, rune-magic, and moral character guidance." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Fierce storm skies and lightning bursting over deep Northern cliffs and oceans, embodying the cosmology of Odin, Thor, and Ragnarok."
  },
  {
    key: "prose_edda",
    title: "The Prose Edda",
    originalTitle: "Snorra Edda",
    religion: "mythology",
    description: "The primary source of Norse mythology and poetics, written by Icelandic scholar Snorri Sturluson in the 13th century, featuring tales of Odin, Thor, Loki, and Ragnarok.",
    divisionsName: "Section",
    divisionsCount: 4,
    featuredPortions: [
      { name: "Gylfaginning (The Beguiling of Gylfi)", reference: "1", topicMessage: "A fascinating narrative outlining the creation, geography, and destruction of the Norse cosmos." },
      { name: "Skáldskaparmál (The Language of Poetry)", reference: "2", topicMessage: "A dialogue between the god of the sea, Ægir, and Bragi, the god of poetry, on mythological metaphors." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A rustic medieval drinking horn resting on weathered slate, evoking the halls of Valhalla and poetic feasts."
  },
  {
    key: "heimskringla",
    title: "Heimskringla",
    originalTitle: "Heimskringla",
    religion: "mythology",
    description: "A magnificent collection of sagas about Norse kings, their conquests, journeys, and encounters with ancient deities, compiled by Snorri Sturluson.",
    divisionsName: "Saga",
    divisionsCount: 16,
    featuredPortions: [
      { name: "Ynglinga Saga", reference: "1", topicMessage: "The mythical origin of the Swedish royal dynasty traced directly back to the Norse gods Odin, Frey, and Njord." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A replica Viking longship carving through mist-filled fjords under cold Nordic skies."
  },
  {
    key: "hesiod_theogony",
    title: "Greek: Hesiod's Theogony",
    originalTitle: "Θεογονία",
    religion: "mythology",
    description: "Hesiod's classic Greek poem describing the origins and genealogies of the gods, titans, and the creation of the cosmos.",
    divisionsName: "Part",
    divisionsCount: 5,
    featuredPortions: [
      { name: "Creation of Cosmos", reference: "1", topicMessage: "How Chaos emerged first, followed by Gaia (Earth) and Uranus (Sky)." },
      { name: "Battle of Titans (Titanomachy)", reference: "4", topicMessage: "The epic clash between the Olympian gods led by Zeus and the ancient Titans." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1564399579883-451a5d44ff08?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Statue of Zeus holding lightning, standing proudly against white marble columns."
  },
  {
    key: "hesiod_works_days",
    title: "Greek: Works and Days",
    originalTitle: "Ἔργα καὶ Ἡμέραι",
    religion: "mythology",
    description: "A didactic poem by Hesiod offering wisdom, moral advice, agricultural instruction, and the classic myth of Pandora and the Five Ages of Man.",
    divisionsName: "Section",
    divisionsCount: 3,
    featuredPortions: [
      { name: "Myth of Pandora", reference: "1", topicMessage: "The opening of the forbidden box, releasing struggles into the world but leaving Hope behind." },
      { name: "The Five Ages of Man", reference: "2", topicMessage: "The spiritual decline of humanity from the Golden Age to the Iron Age." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Golden fields of wheat at dawn, symbolizing honest labor and the agricultural cycle."
  },
  {
    key: "homeric_hymns",
    title: "Greek: The Homeric Hymns",
    originalTitle: "Ὁμηρικοὶ Ὕμνοι",
    religion: "mythology",
    description: "A collection of thirty-three ancient anonymous Greek hymns celebrating individual Olympian deities, written in the epic style of Homer.",
    divisionsName: "Hymn",
    divisionsCount: 33,
    featuredPortions: [
      { name: "Hymn to Demeter", reference: "2", topicMessage: "The emotional search of Demeter for Persephone, establishing the Eleusinian Mysteries." },
      { name: "Hymn to Apollo", reference: "3", topicMessage: "The birth of Apollo on Delos and the founding of his prophetic oracle at Delphi." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    imageCaption: "An ancient sunlit amphitheater overlooking the Mediterranean Sea, dedicated to divine music and drama."
  },
  {
    key: "the_odyssey",
    title: "The Odyssey",
    originalTitle: "Ὀδύσσεια",
    religion: "mythology",
    description: "Homer's epic mythological poem following the ten-year journey of Odysseus, king of Ithaca, as he strives to return home after the Trojan War. Highlights cunning character (metis), hospitality (xenia), and encounters with gods, cyclopes, and sorceresses.",
    divisionsName: "Book",
    divisionsCount: 24,
    featuredPortions: [
      { name: "Book 9: The Cyclops Cave", reference: "9", topicMessage: "Odysseus uses his brilliant resourcefulness and cunning to outwit the giant Polyphemus." },
      { name: "Book 12: Scylla, Charybdis, and Sirens", reference: "12", topicMessage: "Facing the enchanting song of the Sirens and navigating deadly mythological monsters." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Glistening canvas sails guiding a classic ship across deep blue Hellenic seas, capturing Odysseus's fated wanderings."
  },
  {
    key: "shahnameh",
    title: "Shahnameh",
    originalTitle: "شاهنامه",
    religion: "mythology",
    description: "The national epic of Greater Iran composed by the poet Ferdowsi. It chronicles the mythical, heroic, and historical past of ancient Persia, depicting characters like Rostam, his unparalleled strength, and the tragic conflicts of duty and family.",
    divisionsName: "Seas / Reign",
    divisionsCount: 50,
    featuredPortions: [
      { name: "The Tragedy of Rostam and Sohrab", reference: "12", topicMessage: "A heart-wrenching battle between the greatest Persian hero Rostam and his unrecognized son Sohrab." },
      { name: "The Reign of Jamshid", reference: "4", topicMessage: "The golden age of legendary king Jamshid and the ultimate rise of human hubris." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1561361531-7e470c3d9a6c?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Equestrian warrior and kingly stone reliefs at Persepolis, evoking the Persian heroic ages of Rostam and the Shahnameh."
  },
  {
    key: "the_aeneid",
    title: "The Aeneid",
    originalTitle: "Aeneis",
    religion: "history",
    description: "Virgil's legendary Latin epic tracking Aeneas, a Trojan survivor who travels to Italy to establish the legendary character and destiny of Rome. Focuses on 'pietas'—devotion to duty, country, and family.",
    divisionsName: "Book",
    divisionsCount: 12,
    featuredPortions: [
      { name: "Book 6: Descent to Underworld", reference: "6", topicMessage: "Aeneas meets his father Anchises and receives the golden vision of future Roman history and heroes." },
      { name: "Book 4: The Tragedy of Dido", reference: "4", topicMessage: "The conflict between personal desires of love and cosmic epic duty to found Rome." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
    imageCaption: "The massive ancient columns and structural archways of the Roman Colosseum, symbolizing the founding epic of Rome by Aeneas."
  },
  {
    key: "nibelungenlied",
    title: "Nibelungenlied",
    originalTitle: "Der Nibelunge Liet",
    religion: "history",
    description: "An epic poem in Middle High German. It tells the heroic story of the dragon-slayer Siegfried, his marriage to Kriemhild, royal betrayals, the power-struggles of the Burgundians, and the fierce Germanic codes of honor, loyalty, and ultimate tragedy.",
    divisionsName: "Adventure",
    divisionsCount: 39,
    featuredPortions: [
      { name: "Adventure 1: Kriemhild's Dream", reference: "1", topicMessage: "A prophetic dream of a falcon foretells Siegfried's heroic life and tragic death." },
      { name: "Adventure 16: How Siegfried was Slain", reference: "16", topicMessage: "Siegfried gets betrayed by Hagen during a forest hunt, highlighting tragic heroic failure." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Deep mist settling over historical German pine mountains, evoking the layout of hunting betrayals and codes of honor."
  },
  {
    key: "mahabharata",
    title: "Mahabharata (महाभारतम्)",
    originalTitle: "महाभारतम्",
    religion: "hinduism",
    description: "One of the two major ancient Sanskrit epics of India. It details the massive struggle for sovereignty between the Pandavas and Kauravas, depicting legendary Indian characters of diverse natures like Bhishma, Karna, Yudhisthira, Draupadi, and Arjuna.",
    divisionsName: "Parva (Book)",
    divisionsCount: 18,
    featuredPortions: [
      { name: "Vana Parva: Story of Savitri", reference: "3", topicMessage: "Savitri rescues her husband Satyavan from Yama (Lord of Death) using sheer intellect, virtue, and character." },
      { name: "Adi Parva: The Roots of Conflict", reference: "1", topicMessage: "The miraculous origin of the Pandavas and Kauravas and the setup of the ultimate dharma war." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1601931163309-fa95b1dc06ae?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A classic traditional Indian brass instrument and historic artifacts, reflecting the epic moral struggle and the age of Kauravas and Pandavas."
  },
  {
    key: "zafarnama",
    title: "Zafarnama",
    originalTitle: "ਜ਼ਫ਼ਰਨਾਮਾ",
    religion: "history",
    description: "A famous letters-of-victory compilation written by the Tenth Sikh Guru, Guru Gobind Singh, in 1705 to the Mughal Emperor Aurangzeb. Written in Persian poetry, it displays the supreme, uncompromising moral character of the Sikh warriors and Guru, stating that when all peaceful means fail, taking up arms is righteous.",
    divisionsName: "Verse Section",
    divisionsCount: 11,
    featuredPortions: [
      { name: "Epistle of Sovereignty and Moral Truth", reference: "1", topicMessage: "An intense evaluation of spiritual integrity, warning the Emperor of cosmic accountability." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    imageCaption: "An open scripture manuscript with classical writing instruments, recalling Guru Gobind Singh's Persian letter on moral truth to the Emperor."
  },
  {
    key: "morte_arthur",
    title: "Le Morte d'Arthur",
    religion: "history",
    description: "Sir Thomas Malory's compilation of French and English Arthurian legends, forming the definitive text on King Arthur, Merlin, Guinevere, Sir Lancelot, and the chivalric characters of the Round Table.",
    divisionsName: "Book",
    divisionsCount: 21,
    featuredPortions: [
      { name: "Book 1: King Arthur and Excalibur", reference: "1", topicMessage: "Arthur pulls the sword from the stone, demonstrating his true kingship, and receives Excalibur." },
      { name: "Book 21: The Passing of Arthur", reference: "21", topicMessage: "The final battle, Arthur's fatal wounding, and his mystical departure to the isle of Avalon." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A pristine sword blade resting on calm, reflective river waters under a starry sky, representing Excalibur and Arthur's departure to Avalon."
  },
  {
    key: "gesta_danorum",
    title: "Gesta Danorum",
    religion: "history",
    description: "A monumental work of Danish history and legends compiled by Saxo Grammaticus. It traces early Danish characters, Viking exploits, mythical kings, and contains the original tale of Prince Amleth.",
    divisionsName: "Book",
    divisionsCount: 16,
    featuredPortions: [
      { name: "Book 3: The Story of Amleth", reference: "3", topicMessage: "The original historical drama of Amleth feigning madness to avenge his father's murder, inspiring Shakespeare." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1505440404026-c2bee07ff9f4?auto=format&fit=crop&w=600&q=80",
    imageCaption: "The brooding gray stone towers of a medieval Danish coastal fort, representing the origin of Amleth's historical tragedy."
  },
  {
    key: "anabasis_alexander",
    title: "Anabasis of Alexander",
    originalTitle: "Ἀλεξάνδρου Ἀνάβασις",
    religion: "history",
    description: "The definitive historical epic of Alexander the Great written by the Greek historian Arrian in the 2nd century AD. It chronicles Alexander's legendary campaigns, military genius, and philosophical encounters across Asia Minor, Egypt, and India.",
    divisionsName: "Book",
    divisionsCount: 7,
    featuredPortions: [
      { name: "Book 1: The Battle of Granicus", reference: "1", topicMessage: "Alexander's initial major victory against the Persian forces, displaying bold personal leadership." },
      { name: "Book 4: Encounter with Indian Sages", reference: "4", topicMessage: "Alexander's meetings with Indian gymnosophists analyzing the nature of mortality and empire." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "An ancient classical white marble bust of Alexander the Great of Macedon, capturing his strategic genius and legendary world campaigns."
  },
  {
    key: "siva_chhatrapati",
    title: "Siva Chhatrapati (Sabhasad Bakhar)",
    originalTitle: "सभासद बखर",
    religion: "history",
    description: "The foundational 17th-century contemporary chronicle of the legendary Maratha king Chhatrapati Shivaji Maharaj, authored by Krishnaji Anant Sabhasad. It documents Shivaji's indomitable spirit, strategic guerrilla warfare, religious tolerance, and establishing Swarajya.",
    divisionsName: "Kalam (Section)",
    divisionsCount: 20,
    featuredPortions: [
      { name: "The Escape from Agra", reference: "12", topicMessage: "Shivaji's brilliant and daring escape from Aurengzeb's imperial custody disguised inside sweet baskets." },
      { name: "The Coronation at Raigad", reference: "18", topicMessage: "The formal coronation establishing sovereign self-rule and absolute religious freedom for all faiths." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    imageCaption: "The rolling green mountains and ancient fort passes of the Western Ghats, representing Chhatrapati Shivaji Maharaj's Swarajya state."
  },
  {
    key: "mewar_annals_pratap",
    title: "Annals of Mewar (Maharana Pratap)",
    originalTitle: "प्रताप-चरित्र",
    religion: "history",
    description: "Historical records and bardic chronicles of Mewar compiling the heroic resistance of Maharana Pratap against Mughal hegemony. It immortalizes his uncompromising code of independence and the loyalty of his legendary horse Chetak.",
    divisionsName: "Chronicle / Canto",
    divisionsCount: 15,
    featuredPortions: [
      { name: "The Battle of Haldighati", reference: "6", topicMessage: "Pratap's ferocious stands against the imperial army, highlighted by personal duels and Chetak's survival." },
      { name: "The Vow in the Hills of Mewar", reference: "10", topicMessage: "Pratap's raw resilience, vowing to sleep on grass and eat wild bread until Mewar is liberated." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Sunrise over historical Rajput fortress walls and lake palaces, reflecting Maharana Pratap's unyielding vows of Mewar."
  },
  {
    key: "commentarii_bello_gallico",
    title: "Commentaries on the Gallic War",
    originalTitle: "Commentarii de Bello Gallico",
    religion: "history",
    description: "Julius Caesar's firsthand military and geopolitical memoirs detailing the Roman campaigns in Gaul. It showcases his remarkable strategic leadership, speed of build, and psychological maneuvers.",
    divisionsName: "Book",
    divisionsCount: 8,
    featuredPortions: [
      { name: "Book 1: Campaign Against the Helvetii", reference: "1", topicMessage: "Caesar outlines his initial strategic moves and rapid fortifications." },
      { name: "Book 5: Crossing the Rhine", reference: "5", topicMessage: "A daring psychological operation crossing the river boundary to project Roman engineering power." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Ancient Roman ruins and white pillars, representing Gaius Julius Caesar's campaigns and Roman administrative speed."
  },
  {
    key: "lalitavistara",
    title: "Lalitavistara Sutra",
    originalTitle: "ललितविस्तर सूत्र",
    religion: "buddhism",
    description: "An ancient Sanskrit biography of Gautama Buddha detailing his descent from heaven, miraculous early life at Kapilavastu, his divine characters, and eventual awakening, styled as a divine play (lalita).",
    divisionsName: "Chapter",
    divisionsCount: 27,
    featuredPortions: [
      { name: "Chapter 3: Descent of the Great One", reference: "3", topicMessage: "The celestial decision of the bodhisattva to incarnate in the human realm to deliver all beings." },
      { name: "Chapter 22: Universal Awakening", reference: "22", topicMessage: "The confrontation with Mara and Siddhartha's absolute attainment of the state of Buddha." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A serene hand-carved stone statue of Gautama Buddha meditating under the starry sky, illustrating the divine play of his enlightenment."
  },
  {
    key: "somnium",
    title: "Somnium / Celestial Dream",
    originalTitle: "Somnium",
    religion: "space",
    description: "Written in Latin by astronomer Johannes Kepler, often hailed as the first science fiction/space history work. It presents a fantasy of space travel to the Moon, mapping Kepler's Copernicus-centered physics in a dreamy cosmic narrative.",
    divisionsName: "Section",
    divisionsCount: 5,
    featuredPortions: [
      { name: "Section 2: The Lunar Ascent", reference: "2", topicMessage: "A visionary account of the extreme physical forces, weightlessness, and transition of leaving Earth atmosphere." },
      { name: "Section 4: The Moon and Outer Spheres", reference: "4", topicMessage: "Observing Earth's phases from the Moon's surface, demonstrating Copernican heliocentrism." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A striking cosmic view of blue planet Earth suspended in deep orbital space, reflecting Johannes Kepler's early lunar dream."
  },
  {
    key: "epic_gilgamesh",
    title: "The Epic of Gilgamesh",
    originalTitle: "Šūtur eli šarrī",
    religion: "history",
    description: "The world's oldest epic masterpiece, written on clay tablets in ancient cuneiform from Mesopotamia (modern Iraq). It details King Gilgamesh's early tyrannical rule, his profound brotherhood with Enkidu, and his subsequent devastating sorrow and existential journey to retrieve the secret of eternal life.",
    divisionsName: "Tablet",
    divisionsCount: 11,
    featuredPortions: [
      { name: "Tablet 1: The Coming of Enkidu", reference: "1", topicMessage: "Gilgamesh's strength is matched when the gods create Enkidu from wild clay to balance his spirit." },
      { name: "Tablet 11: The Story of the Great Flood", reference: "11", topicMessage: "Utnapishtim recounts the ancient flood and tests Gilgamesh with a trial of sleeplessness." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1608988220025-a74ef43d463e?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Sacred stone reliefs and ancient clay brick gates of Mesopotamia (Uruk), evoking King Gilgamesh's epic search for the secret of life."
  },
  {
    key: "homers_iliad",
    title: "The Iliad",
    originalTitle: "Ἰλιάς",
    religion: "history",
    description: "Homer's ultimate epic poem detailing the final weeks of the Trojan War. It explores the themes of pride, honor, wrath (primarily Achilles' rage), divine intervention, and the heavy moral price of martial glory.",
    divisionsName: "Book",
    divisionsCount: 24,
    featuredPortions: [
      { name: "Book 1: The Wrath of Achilles", reference: "1", topicMessage: "Agamemnon insults Achilles' honor, prompting him to withdraw his forces, turning the tide of the war." },
      { name: "Book 24: Achilles and Priam", reference: "24", topicMessage: "King Priam begs Achilles for the body of his slain son Hector, a beautiful summit of shared human grief." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1531572753726-0fd02dd4245c?auto=format&fit=crop&w=600&q=80",
    imageCaption: "An ancient classical Greek bronze armour detail, representing the peerless warrior Achilles and his heroic wrath under the walls of Troy."
  },
  {
    key: "journey_west",
    title: "Journey to the West",
    originalTitle: "西遊記",
    religion: "buddhism",
    description: "One of the Four Great Classical Novels of Chinese literature, attributed to Wu Cheng'en. It is a legendary, spiritual epic documenting Buddhist monk Tang Sanzang's journey to the Western Regions (India) to retrieve sacred scriptures, guided by his powerful disciples, including the mischievous monkey king, Sun Wukong.",
    divisionsName: "Chapter",
    divisionsCount: 100,
    featuredPortions: [
      { name: "Chapter 1: Birth of the Monkey King", reference: "1", topicMessage: "The miraculous stone egg bursts on the Mountain of Flowers and Fruit, giving birth to Sun Wukong." },
      { name: "Chapter 98: Reaching the Spirit Mountain", reference: "98", topicMessage: "The pilgrims cross the cloud-covered river to reach Shakyamuni Buddha and receive the true sutras." },
    ],
    imageUrl: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Misty, green-enveloped sacred Asian peaks of Mount Huaguo, tracing the pilgrimage of Sun Wukong (The Monkey King) protecting the holy monk."
  },
  {
    key: "gospel_of_jesus_christ",
    title: "Gospel of Jesus Christ",
    originalTitle: "Εὐαγγέλιον",
    religion: "christianity",
    description: "The complete, classical account of the life, radical teachings, parables, miracles, death, and resurrection of Jesus Christ. Centered on his message of unconditional love, forgiveness, social reconciliation, and ultimate victory over physical death.",
    divisionsName: "Chapter",
    divisionsCount: 28,
    featuredPortions: [
      { name: "Chapter 5: Sermon on the Mount", reference: "5", topicMessage: "The revolutionary Beatitudes prescribing humility, peace, and loving one's enemies." },
      { name: "Chapter 15: The Prodigal Grace", reference: "15", topicMessage: "A collection of parables demonstrating unconditional parental love and absolute forgiveness." },
      { name: "Chapter 28: Direct Resurrection", reference: "28", topicMessage: "Jesus overcomes mortal death and instructs his followers to spread healing to all nations." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A majestic cross glowing brightly against the morning sun and clouds, representing the Gospel message of light, healing, and grace."
  },
  {
    key: "saga_ragnar_lothbrok",
    title: "Saga of Ragnar Lothbrok",
    originalTitle: "Ragnars saga loðbrókar",
    religion: "mythology",
    description: "The 13th-century Icelandic masterpiece documenting the heroic life, daring sea raids, and ultimate demise of the legendary Norse King and Viking warrior, Ragnar Lothbrok. It chronicles the Norse warrior codes, his battles in Britain and France, and his sons' legendary conquests.",
    divisionsName: "Section",
    divisionsCount: 20,
    featuredPortions: [
      { name: "Section 3: Slaying the Serpent of Götaland", reference: "3", topicMessage: "Ragnar creates his legendary protective shaggy garments to slay the giant venomous serpent, winning his bride." },
      { name: "Section 15: The Pit of Vipers", reference: "15", topicMessage: "Ragnar's defiant final stands, singing his death-lay in King Ælla's venomous snake pit, laughing as he welcomes Valhalla." },
      { name: "Section 18: Revenge of the Great Heathen Army", reference: "18", topicMessage: "The legendary alliance of Norse warriors marching to avenge their father's death, carving out legendary history." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1506458959157-965f8c07b9bb?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A majestic Viking dragon-ship navigating cold Northern fjords under a blazing gold sunrise, representing Norse exploration and ultimate fate."
  },
  {
    key: "hindu_prayers",
    title: "Hindu Mantras, Slokas & Aartis",
    originalTitle: "हिन्दू मन्त्र और आरती",
    religion: "prayers",
    description: "A gorgeous collection of Hinduism's most sacred Vedic mantras, Upanishadic peace chants, devotional stotrams like the Hanuman Chalisa, the Maha Mrityunjaya mantra, and traditional temple aartis. Perfect for continuous serene recitation and deep spiritual tuning.",
    divisionsName: "Prayer / Verse",
    divisionsCount: 16,
    featuredPortions: [
      { name: "Prayer 1: Shanti Mantras & Gayatri", reference: "1", topicMessage: "Underpinning the highest Vedic prayer for intellectual light and cosmic peace." },
      { name: "Prayer 2: Sri Hanuman Chalisa", reference: "2", topicMessage: "Tulsidas's highly energetic verses on courage, strength, and complete devotion." },
      { name: "Prayer 3: Sri Bajrang Baan", reference: "3", topicMessage: "A powerful, protective invocation requesting Hanuman's swift shield of protection." },
      { name: "Prayer 4: Shiv Tandav Stotram", reference: "4", topicMessage: "Ravana's majestic rhythmic stotram describing Lord Shiva's cosmic dance of creation and release." },
      { name: "Prayer 5: Sri Ganesha Aarti", reference: "5", topicMessage: "The traditional invocation Ganesha's grace to remove life's negative obstacles." },
      { name: "Prayer 6: 9 Goddesses Aartis (Shakti)", reference: "6", topicMessage: "Devotional hymns honoring the Divine Mother in forms of Durga, Lakshmi, and Saraswati." },
      { name: "Prayer 7: Om Jai Jagdish Hare (Vishnu Aarti)", reference: "7", topicMessage: "The ultimate universal temple aarti of complete surrender and gratitude." },
      { name: "Prayer 8: Maha Mrityunjaya Shiva Mantra", reference: "8", topicMessage: "A cosmic mantra of release from fear, disease, and limitations to enter immortality." },
      { name: "Prayer 9: Shree Ganesh Mantra & Shlok", reference: "9", topicMessage: "Auspicious beginning chants from Puranic texts, removing obstacles in all life ventures." },
      { name: "Prayer 10: Shree Shiv Panchakshara Stotram", reference: "10", topicMessage: "Adi Shankaracharya's majestic stotram praising Shiva through five holy cosmic syllables." },
      { name: "Prayer 11: Shree Mahalaxmi Ashtakam", reference: "11", topicMessage: "Padma Purana's eight-verse hymn invoking Goddess Lakshmi for spiritual and earthly prosperity." },
      { name: "Prayer 12: Sankat Nashan Ganesh Stotram", reference: "12", topicMessage: "Sage Narada's twelve sacred names of Ganesha, dispelling hardships and anxiety." },
      { name: "Prayer 13: Sri Kanakadhara Stotram", reference: "13", topicMessage: "Adi Shankaracharya's compassionate hymn that showered golden gooseberries for a poor woman." },
      { name: "Prayer 14: Aditya Hrudaya Stotram", reference: "14", topicMessage: "Sage Agastya's solar anthem taught to fatigued Rama on the battlefield for absolute victory." },
      { name: "Prayer 15: Vrindavan Madhurashtakam", reference: "15", topicMessage: "Srimad Vallabhacharya's sweet octet celebrating Lord Krishna's sweet nectar-aspects." },
      { name: "Prayer 16: Lord Krishna Aarti (Kunj Bihari)", reference: "16", topicMessage: "Melodious North Indian temple chant invoking Krishna's supreme play and flute tunes." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1609137144813-91104e9c7081?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A brightly glowing traditional oil lamp with holy incense, representing Vedic fire, high focus, and the divine light of mantras."
  },
  {
    key: "islam_prayers",
    title: "Islamic Supplications (Duas)",
    originalTitle: "الأدعية والمناجاة",
    religion: "prayers",
    description: "Supplications and prayers compiled from the Quran and Prophetic traditions. Includes the beautiful opening Al-Fatiha, seeking safety, wellness, comprehensive growth, forgiveness, and absolute trust in the Divine (Tawakkul).",
    divisionsName: "Supplication",
    divisionsCount: 4,
    featuredPortions: [
      { name: "Supplication 1: Al-Fatiha & Ayat al-Kursi", reference: "1", topicMessage: "The ultimate opening prayer for daily guidance and the verse of divine protection." },
      { name: "Supplication 2: Rabbana (Quranic Lord Prayers)", reference: "2", topicMessage: "A gorgeous cluster of prayers seeking peace, wisdom, and safe harbor in difficult times." },
      { name: "Supplication 3: Dua of Light (Morning Supplication)", reference: "3", topicMessage: "The Prophet's beautiful morning prayer requesting light in the heart, eyes, ears, and path." },
      { name: "Supplication 4: Ayat al-Kursi (Throne Verse)", reference: "4", topicMessage: "The supreme verse of divine power, living vigilance, and protective shelter." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Soft morning light pouring through ancient arched windows, reflecting spiritual purity and the seeking of divine safe refuge."
  },
  {
    key: "christian_prayers",
    title: "Christian Sacred Prayers & Hymns",
    originalTitle: "Christian Holy Devotion",
    religion: "prayers",
    description: "A curation of time-honored prayers and hymns that have shaped Christian history, including the foundational Lord's Prayer (Our Father), Saint Francis of Assisi's prayer for peace, and the radiant Shepherd's Psalm.",
    divisionsName: "Prayer / Hymn",
    divisionsCount: 4,
    featuredPortions: [
      { name: "Prayer 1: The Lord's Prayer & Grace", reference: "1", topicMessage: "The master-model of prayer taught by Jesus Christ focusing on forgiveness and alignment." },
      { name: "Prayer 2: Peace Prayer of St. Francis", reference: "2", topicMessage: "The transformative cry to become a vessel of peace, love, light, and hope in dark places." },
      { name: "Prayer 3: Psalm 23 (The Lord is My Shepherd)", reference: "3", topicMessage: "The world's most beloved song of comfort, absolute confidence, and security in God." },
      { name: "Prayer 4: The Serenity Prayer", reference: "4", topicMessage: "A beloved request for stoic acceptance, courage, and discernment under adversity." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Golden beams of sunlight piercing through branches of an old forest, embodying comfort of the Shepherd's Psalm."
  },
  {
    key: "jewish_prayers",
    title: "Jewish Blessings & Songs",
    originalTitle: "תפילות וברכות",
    religion: "prayers",
    description: "Traditional blessings, morning declarations, and songs from the Jewish Siddur. Centered on the Shema Yisrael, daily gratitude, and the awesome ancient Priestly Blessing.",
    divisionsName: "Prayer / Blessing",
    divisionsCount: 13,
    featuredPortions: [
      { name: "Prayer 1: Shema Yisrael (Core Declaration)", reference: "1", topicMessage: "The monotheistic pinnacle confession of absolute divine unity and devotion." },
      { name: "Prayer 2: Modeh Ani (Morning Gratitude)", reference: "2", topicMessage: "The first words spoken upon waking, celebrating daily gratitude and return of the soul." },
      { name: "Prayer 3: Birkat Kohanim (Priestly Blessing)", reference: "3", topicMessage: "The ancient three-fold blessing invoking divine protection, grace, and ultimate peace (Shalom)." },
      { name: "Prayer 4: Hamotzi (Blessing over Bread)", reference: "4", topicMessage: "The traditional blessing recited before bread, thanking the Creator for physical sustenance." },
      { name: "Prayer 5: Borei Pri Hagafen (Blessing over Wine)", reference: "5", topicMessage: "The blessing recited over wine or grape juice, sanctifying celebrations and holy times." },
      { name: "Prayer 6: Tefilat Haderech (Traveler's Prayer)", reference: "6", topicMessage: "The protective prayer for journeys, seeking a safe transition and peaceful return." },
      { name: "Prayer 7: Baqashot: El Mistater (The Hidden God)", reference: "7", topicMessage: "The mystical Kabbalistic petition praising the concealed, transcendent Source of all light." },
      { name: "Prayer 8: Kol Nidrei (All Vows)", reference: "8", topicMessage: "The solemn Day of Atonement declaration absolving unintended vows and spiritual burdens." },
      { name: "Prayer 9: Psalm 23 (The Lord is My Shepherd - Hebrew)", reference: "9", topicMessage: "The beloved Davidic song of comfort, trust, and divine guidance sung in ancient Hebrew." },
      { name: "Prayer 10: Nigunim (Hasidic wordless melodies)", reference: "10", topicMessage: "Wordless spiritual tunes expressing deep ecstasy, yearning, and cleaving to the Divine." },
      { name: "Prayer 11: Yedid Nefesh (Beloved of the Soul)", reference: "11", topicMessage: "The exquisite liturgical poem expressing intense love and spiritual longing for God." },
      { name: "Prayer 12: Bere'shit (Genesis - Torah Cantillation)", reference: "12", topicMessage: "The primordial account of creation chanted in traditional biblical cantillation." },
      { name: "Prayer 13: Shir ha-shirim (Song of Songs)", reference: "13", topicMessage: "The sublime song of Solomon, allegorizing the passionate union of the soul and the Beloved." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1543728770-9d485141012f?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A detailed visual of beautiful Hebrew letters, reflecting the eternal covenant, truth, and blessings."
  },
  {
    key: "buddhist_prayers",
    title: "Buddhist Chants & Gathas",
    originalTitle: "बौद्ध मंत्र और गाथा",
    religion: "prayers",
    description: "Daily mindfulness gathas, protective sound vibrations, and prayers of boundless love (Metta). Includes the Heart Sutra mantra and calls to express absolute compassion to all sentient life.",
    divisionsName: "Chant / Mantra",
    divisionsCount: 4,
    featuredPortions: [
      { name: "Chant 1: Karaniya Metta Sutta", reference: "1", topicMessage: "The Buddha's discourse on boundless loving-kindness to be radiated to all beings." },
      { name: "Chant 2: Om Mani Padme Hum & Heart Sutra", reference: "2", topicMessage: "The powerful mantra evoking Avalokiteshvara's supreme compassion and emptiness." },
      { name: "Chant 3: Bodhisattva Vows of Compassion", reference: "3", topicMessage: "Four great vows to deliver and heal all beings from cycles of suffering." },
      { name: "Chant 4: The Three Refuges (Tisarana)", reference: "4", topicMessage: "The timeless Buddhist declaration of taking refuge in Buddha, Dhamma, and Sangha." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A serene golden Buddha statue's hand in the gesture of fearlessness, embodying loving-kindness and protection."
  },
  {
    key: "sikh_prayers",
    title: "Sikh Sacred Nitnem & Shabads",
    originalTitle: "ਸਿੱਖ ਨਿਤਨੇਮ ਅਤੇ ਸ਼ਬਦ",
    religion: "prayers",
    description: "Inspirational meditations from the Guru Granth Sahib, comprising the morning Nitnem and divine musical Sabads. Promotes absolute divine unity, moral character, and spiritual ecstasy.",
    divisionsName: "Prayer / Shabad",
    divisionsCount: 4,
    featuredPortions: [
      { name: "Prayer 1: Japji Sahib (Universal Praise)", reference: "1", topicMessage: "Guru Nanak's opening composition detailing the One Supreme Creator and the path of Truth." },
      { name: "Prayer 2: Tav-Prasad Saviye (Devine Love)", reference: "2", topicMessage: "Guru Gobind Singh's verses declaring that only those who path in love can realize the Divine." },
      { name: "Prayer 3: Ardas (Universal Praying)", reference: "3", topicMessage: "The community petition seeking high spirit, welfare of all, and remembering the martyrs." },
      { name: "Prayer 4: Chaupai Sahib (Protective Shield)", reference: "4", topicMessage: "Guru Gobind Singh's powerful protective petition invoking divine strength and inner grit." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0612f1a?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Intricately detailed architecture of the Golden Temple, reflecting the eternal praise of Naam and universal brotherhood."
  },
  {
    key: "jain_prayers",
    title: "Jain Sutras & Friendship Prayers",
    originalTitle: "जैन सूत्र और मैत्री प्रार्थना",
    religion: "prayers",
    description: "Devotional sacred hymns of Jainism focusing on spiritual clearing, praising the Tirthankaras, celebrating universal friendship (Maitri Bhavana), and the supreme non-sectarian Navkar Mantra.",
    divisionsName: "Sutra / Hymn",
    divisionsCount: 4,
    featuredPortions: [
      { name: "Sutra 1: Navkar Mantra (Ultimate Bow)", reference: "1", topicMessage: "The highest mantra of Jainism saluting the supreme spiritual teachers and liberated souls." },
      { name: "Sutra 2: Maitri Bhavana (Universal Harmony)", reference: "2", topicMessage: "The prayer for friendship with all living beings, wishing happiness and non-harm to all." },
      { name: "Sutra 3: Kshamapana (Forgiveness Chant)", reference: "3", topicMessage: "The soul-cleansing chant of MICCHAMI DUKKADAM, forgiving all and begging forgiveness of all." },
      { name: "Sutra 4: Logassa Sutra (Tirthankara Praise)", reference: "4", topicMessage: "The ancient prayer praising the twenty-four Tirthankaras for universal enlightenment." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Pristine white marble temple lines reflecting soft sunlight, symbolizing complete non-violence, purity of soul, and universal friendship."
  },
  {
    key: "kojiki",
    title: "Kojiki (Records of Ancient Matters)",
    originalTitle: "古事記",
    religion: "mythology",
    description: "The primary foundational sacred chronicle of Shintoism in Japan, compiled by O no Yasumaro. It preserves oral creation legends, the chronicles of the Kami (spirits), and myths detailing the beautiful balance of the natural and invisible worlds.",
    divisionsName: "Volume (Section)",
    divisionsCount: 3,
    featuredPortions: [
      { name: "Volume 1: Kamitsumaki (Age of the Kami)", reference: "1", topicMessage: "The creation of the cosmos, the birth of the deities Izanagi and Izanami, and the solar light of Amaterasu." },
      { name: "Volume 2: Nakatsumaki (Middle Chronicles)", reference: "2", topicMessage: "Legends of Emperor Jimmu's epic eastern expedition, divine crows, and legendary heroes." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Sacred Torii gate standing majestically in quiet morning waters under a soft pink sky, symbolizing Shinto harmony with all spirits of nature."
  },
  {
    key: "analects",
    title: "The Analects of Confucius",
    originalTitle: "論語",
    religion: "other",
    description: "An exceptional collection of sayings and ideas attributed to the classical philosopher Confucius and his contemporaries. Shaping East Asian civilization, it outlines the core virtues of benevolence (Ren), filial piety (Xiao), ritual propriety (Li), and the concept of the noble, self-cultivating person (Junzi).",
    divisionsName: "Book (Chapter)",
    divisionsCount: 20,
    featuredPortions: [
      { name: "Book 1: Xue Er (On Learning and Virtue)", reference: "1", topicMessage: "Foundational teachings on sincerity, family harmony, self-cultivation, and the joy of continuous study." },
      { name: "Book 2: Wei Zheng (On Governance)", reference: "2", topicMessage: "Governing through moral excellence and alignment with the North Star, and the stages of spiritual maturation." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A timeless ink painting scroll and scholarly calligraphy tools, representing Confucian self-cultivation, study, and social harmony."
  },
  {
    key: "avesta_gathas",
    title: "The Gathas of Zoroaster",
    originalTitle: "Gāthās (Avesta)",
    religion: "other",
    description: "The ancient sacred hymns composed by the prophet Zoroaster, representing the core of Zoroastrian scripture. Written in an archaic dialect, they explore the dualistic struggle between cosmic truth (Asha) and deception (Druj), praising Ahura Mazda as the Mindful Lord of Light and goodness.",
    divisionsName: "Yasna Chapter",
    divisionsCount: 17,
    featuredPortions: [
      { name: "Yasna 28: Prayer for Spiritual Strength", reference: "28", topicMessage: "Zoroaster's initial prayer begging Ahura Mazda for peace, wisdom, and moral clear mindedness to aid creation." },
      { name: "Yasna 30: The Principle of Free Choice", reference: "30", topicMessage: "Declaration of the dual cosmic paths of light and shadow, urging every soul to consciously choose truth." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A roaring fire glowing against twilight shadows, representing the sacred elements of truth (Asha) and Ahura Mazda."
  },
  {
    key: "hidden_words",
    title: "The Hidden Words of Bahá'u'lláh",
    originalTitle: "الكلمات المكنونة",
    religion: "other",
    description: "A collection of exquisite spiritual aphorisms revealed by Bahá'u'lláh in Baghdad around 1857. It summarizes the core mystical truth of all historical revelations, calling humanity to discover the light of divine love within their own hearts.",
    divisionsName: "Section",
    divisionsCount: 2,
    featuredPortions: [
      { name: "Section 1: From the Arabic", reference: "1", topicMessage: "Profound poetic quotes addressing the human soul, urging moral purity, inner richness, and mutual unity." },
      { name: "Section 2: From the Persian", reference: "2", topicMessage: "Mystical lessons on detachments, the briefness of worldly affairs, and soaring in the heavens of truth." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Peaceful soft sunset highlighting standard historic text manuscripts, representing divine light and love."
  },
  {
    key: "lotus_sutra",
    title: "The Lotus Sutra",
    originalTitle: "妙法蓮華經",
    religion: "buddhism",
    description: "One of the most revered and popular Mahayana Buddhist scriptures. It declares the eternal nature of the Buddha's life, the ultimate path of the Bodhisattva, and reveals that all paths gracefully synthesize into the Single Vehicle (Ekayana) of universal enlightenment.",
    divisionsName: "Chapter",
    divisionsCount: 28,
    featuredPortions: [
      { name: "Chapter 2: Expedient Means (Upaya)", reference: "2", topicMessage: "The Buddha's revelation that all teachings are compassionate methods adapted to help various minds awaken." },
      { name: "Chapter 25: The Universal Gate of Avalokiteshvara", reference: "25", topicMessage: "The glorious description of the Bodhisattva of Compassion, who answers cries of help throughout the cosmos." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A blooming white lotus resting gently on clear water under dawn mist, representing spotless enlightenment in the world."
  },
  {
    key: "masnavi_rumi",
    title: "The Masnavi of Jalaluddin Rumi",
    originalTitle: "مثنوي معنوي",
    religion: "other",
    description: "The monumental masterpiece of Persian Sufi poetry composed by Jalāl al-Dīn Muḥammad Rūmī. Often described as the Persian Quran, it comprises allegorical stories, mystical wisdom, and ecstatic poetry exploring the soul's yearning to return to its Divine Beloved.",
    divisionsName: "Book",
    divisionsCount: 6,
    featuredPortions: [
      { name: "Book 1: Song of the Reed", reference: "1", topicMessage: "The bittersweet complaint of the hollow reed cut from its home, symbolizing the soul seeking reunion." },
      { name: "Book 3: Intellectual and Heart Love", reference: "3", topicMessage: "Stories showcasing how human intellectual tools must dissolve into pure heart love to know God." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    imageCaption: "A beautiful spinning watercolor mandala, representing the starry rotations of Mevlevi Sema and infinite divine ecstasy."
  }
];
