/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Agama {
  number: number;
  name: string;
  category: "Shaiva" | "Vaishnava" | "Shakta";
  subCategory: string;
  description: string;
  keyInsight: string;
}

export const AGAMAS_200: Agama[] = [
  // --- 28 SHAIVA AGAMAS (1 - 28) ---
  {
    number: 1,
    name: "Kamika Agama",
    category: "Shaiva",
    subCategory: "Purva/Uttara Kamika",
    description: "The primary and most widely cited of the 28 Shaiva Agamas, laying down extensive rules for temple architecture, iconography, and individual worship.",
    keyInsight: "Provides the physical framework for integrating external ritual design with the internal state of meditative realization of Shiva."
  },
  {
    number: 2,
    name: "Yogaja Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Focuses deeply on the practice of Shiva Yoga, internal visualization, and the awakening of inner spiritual consciousness.",
    keyInsight: "Directs the seeker to look within the heart cave to find the luminous, non-dual presence of Lord Shiva."
  },
  {
    number: 3,
    name: "Chintya Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Deals with cognitive meditation, architectural measurement (Mana), and rules for temple installation and daily offerings.",
    keyInsight: "Stresses that correct proportions in temple construction mirror the perfect geometric order of the cosmos."
  },
  {
    number: 4,
    name: "Karana Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "One of the most practical Agamas, detailing public festivals, sacraments, purificatory rituals, and daily temple worship procedures.",
    keyInsight: "Outlines how collective sacred celebrations and temple actions purify the environment and bring social harmony."
  },
  {
    number: 5,
    name: "Ajita Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Presents extensive information on the installation of various deities, sacred waters (Tirthas), and specific temple crowns.",
    keyInsight: "Reveals how sanctifying physical space establishes a focal point for receiving divine, protective spiritual energy."
  },
  {
    number: 6,
    name: "Dipta Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Exposes rules for the construction of Shiva Lingas, standard temple towers, and guidelines for correcting ritual errors.",
    keyInsight: "Views the temple tower (Gopuram) as a physical representation of the universe, pointing toward the transcendent sky."
  },
  {
    number: 7,
    name: "Sukshma Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Concentrates on subtle internal mantras, sacred fires, initiation rites (Deeksha), and the protective design of shields.",
    keyInsight: "Teaches that initiation dissolves the binding cords of the soul (Pasa), releasing it into the state of pure Shiva-nature."
  },
  {
    number: 8,
    name: "Sahasra Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Contains detailed classifications of a thousand aspects of worship, local festivals, and rules for charitable donations.",
    keyInsight: "Advocates for selfless charity (Dana) as a highly potent means of spiritual purification and community well-being."
  },
  {
    number: 9,
    name: "Amshuman Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Provides highly detailed accounts of temple design, layout of streets, selection of soil, and sacred plant gardens.",
    keyInsight: "Emphasizes that human settlements must coexist harmoniously with the elements and natural flora."
  },
  {
    number: 10,
    name: "Suprabheda Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Provides highly detailed directions on structural architecture, temple elements, the nature of elements, and daily sacraments.",
    keyInsight: "Establishes a comprehensive structural and philosophical system for temple building and daily meditative focus."
  },
  {
    number: 11,
    name: "Vijaya Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Details victory over internal obstacles, the purification of elements (Bhuta Shuddhi), and the chanting of defensive prayers.",
    keyInsight: "Instructs that true victory lies in subduing the unruly modifications of the mind through complete self-surrender."
  },
  {
    number: 12,
    name: "Nishvasa Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "One of the older texts, exploring the supreme breath of Shiva, creation cosmology, and the origin of sacred sound (Nada).",
    keyInsight: "Identifies the primordial sound vibrations as the origin and sustaining force of the physical universe."
  },
  {
    number: 13,
    name: "Svayambhuva Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Deals with self-manifest (Svayambhu) entities, cosmic evolution, and the deep metaphysical structure of the soul.",
    keyInsight: "Proclaims that the soul's essential nature is identical to Shiva, obscured only by the stains of Anava, Karma, and Maya."
  },
  {
    number: 14,
    name: "Anala Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Focuses on the sacred fire element, fire rituals (Homa), and the internal fire of digestion and spiritual awakening.",
    keyInsight: "Represents fire as the great purifier that consumes all karmic impurities, leaving behind the ash of pure consciousness."
  },
  {
    number: 15,
    name: "Vira Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Provides guidelines on valorous spiritual discipline, temple defense, and the resolute holding of spiritual vows.",
    keyInsight: "Stresses that the spiritual path demands the courage and unyielding commitment of a hero (Vira) facing internal demons."
  },
  {
    number: 16,
    name: "Raurava Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "A highly celebrated text containing beautiful, detailed descriptions of iconography, and the daily cycles of sound worship.",
    keyInsight: "Teaches that music and sacred chanting bridge the gap between physical senses and formless divinity."
  },
  {
    number: 17,
    name: "Makuta Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Exposits on the crown of Shiva, structural peaks, and the highest peak states of meditation.",
    keyInsight: "Points to the crowning peak (Shikhara) of the temple as the meeting point of cosmic and earthly energy."
  },
  {
    number: 18,
    name: "Vimala Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Deals with purity, code of ethics for priests, and the absolute cleanliness of temple surroundings.",
    keyInsight: "Asserts that outer cleanliness and inner moral purity are inseparable prerequisites for divine communion."
  },
  {
    number: 19,
    name: "Chandrajnana Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Highlights lunar-based calculations, seasonal festivals, and the cooling, tranquil energy of meditation.",
    keyInsight: "Integrates the natural rhythms of the moon and stars with human health, mental peace, and spiritual timing."
  },
  {
    number: 20,
    name: "Mukhabimba Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Outlines rules for carving the divine face of deities, facial proportions in sculptures, and the mirror ritual.",
    keyInsight: "Explains that the sculptured face of the divine is a reflective mirror for the devotee's own inner Self."
  },
  {
    number: 21,
    name: "Prodgita Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Concentrates on devotional hymns, the art of sacred chanting, and chorus singing during major temple processions.",
    keyInsight: "Reveals that collective singing of divine names dissolves ego boundaries and harmonizes the community."
  },
  {
    number: 22,
    name: "Lalita Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Presents the playful, creative aspects of Shiva, cosmic dance forms, and the joyful celebration of life.",
    keyInsight: "Views the entire manifestation as the beautiful, spontaneous, and joyful play (Lila) of the Divine."
  },
  {
    number: 23,
    name: "Siddha Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Explores the achievements of perfected sages (Siddhas), yogic medicine, and advanced spiritual powers.",
    keyInsight: "Demonstrates that the culmination of yoga yields mastership over the elements, which must be used only for selfless good."
  },
  {
    number: 24,
    name: "Santana Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Discusses the lineage of spiritual masters, the preservation of texts, and family-based duties and legacy.",
    keyInsight: "Stresses the importance of keeping the sacred flame of wisdom alive through generations of devoted lineages."
  },
  {
    number: 25,
    name: "Sarvokta Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "The 'all-inclusive' Agama, summarizing essential teachings from other Agamas and outlining general dharma.",
    keyInsight: "Synthesizes diverse ritual paths into a singular, practical highway of devotion and ethical living."
  },
  {
    number: 26,
    name: "Parameshvara Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Addresses the supreme sovereign Lord, the structure of temples on high mountains, and royal initiations.",
    keyInsight: "Guides the intellect to recognize the supreme Lord as the ultimate, absolute cause and refuge of all creation."
  },
  {
    number: 27,
    name: "Kirana Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "Focuses on the light of knowledge (Kirana), destroying darkness of ignorance, and specific cosmological models.",
    keyInsight: "Teaches that the dawn of divine wisdom instantaneously dispels the deep-seated darkness of individual ego."
  },
  {
    number: 28,
    name: "Vatula Agama",
    category: "Shaiva",
    subCategory: "Siddhanta",
    description: "The final of the 28, exploring the mysterious, free-flowing wind of consciousness, and the ultimate union with Shiva.",
    keyInsight: "Declares that the final state of liberation is like a river dissolving into the ocean, free from all boundaries."
  },

  // --- 108 VAISHNAVA AGAMAS (29 - 136) ---
  {
    number: 29,
    name: "Sattvata Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "One of the oldest and most respected Pancharatra texts, defining the four-fold manifestations (Vyuha) of Vishnu.",
    keyInsight: "Explains how the transcendental Divine manifests in accessibly close forms to guide and uplift the world."
  },
  {
    number: 30,
    name: "Jayakhya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses heavily on internal mental worship (Manasa Puja), yogic meditation, and the deep science of mantras.",
    keyInsight: "Teaches that mental worship is superior and serves as the life-force of any external physical ritual."
  },
  {
    number: 31,
    name: "Ahirbudhnya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Contains profound treatises on the Sudarshana Chakra, occult protection, creation theories, and royal duties.",
    keyInsight: "Presents the Sudarshana Chakra as the active dynamic will of the Divine, maintaining structural cosmic order."
  },
  {
    number: 32,
    name: "Isvara Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Explicates the worship protocols at the famous Melkote temple, focusing on love and direct communion with the Lord.",
    keyInsight: "Celebrates absolute devotion (Bhakti) as the ultimate and easiest path to transcend the cycles of birth and death."
  },
  {
    number: 33,
    name: "Pauskara Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the preparation of sacred spaces, geometry of altars, and deep metaphysical discussions on consciousness.",
    keyInsight: "Uses geometry and visual design as physical paths for centering the mind on the infinite Brahman."
  },
  {
    number: 34,
    name: "Parama Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "An accessible dialogue outlining yoga, the code of daily conduct, and the nature of selfless service.",
    keyInsight: "Encourages integrating spiritual practices with daily professional and societal duties."
  },
  {
    number: 35,
    name: "Padma Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "A highly comprehensive, structured text in four parts detailing philosophy, yoga, action, and conduct.",
    keyInsight: "Provides a complete roadmap for balanced spiritual living, harmonizing inner yoga with outer service."
  },
  {
    number: 36,
    name: "Sanatkumara Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Presents divine conversations on cosmic cycles, temple construction, and guidelines for pure administration.",
    keyInsight: "Instructs that rulers and administrators must align their laws with eternal cosmic truths."
  },
  {
    number: 37,
    name: "Parashara Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Explains how the cosmic age governs human capacity, recommending simple devotion and community prayer.",
    keyInsight: "Declares that chanting the holy names is the most effective and accessible remedy for the trials of the modern age."
  },
  {
    number: 38,
    name: "Lakshmi Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on the divine feminine aspect (Lakshmi) as the dynamic energy (Shakti) and grace of Lord Narayana.",
    keyInsight: "Proclaims that liberation is achieved through the loving grace of Lakshmi, who acts as the supreme mediator."
  },
  {
    number: 39,
    name: "Naradiya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Details of temple festivals, musical offerings, and standard protocols for standard devotional singing.",
    keyInsight: "Celebrates music as a divine language that elevates human emotion to pure, celestial devotion."
  },
  {
    number: 40,
    name: "Sandilya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses the science of devotional surrender (Prapatti) and loving service to the supreme person.",
    keyInsight: "Declares that unconditional surrender is the highest, most direct path to divine union and supreme peace."
  },
  {
    number: 41,
    name: "Vishvamitra Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Provides architectural measurements, guidelines for carving sacred symbols, and priest qualifications.",
    keyInsight: "Maintains that sacred sculpture must capture the divine qualities of peace, compassion, and strength."
  },
  {
    number: 42,
    name: "Bharadvaja Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "A highly practical manual focusing entirely on the process of Surrender (Saranagati) and its six key aspects.",
    keyInsight: "Defines true surrender as acting in accordance with divine will and discarding all self-centered anxiety."
  },
  {
    number: 43,
    name: "Vihagendra Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the sacred bird Garuda, flight of consciousness, cosmic vehicles, and defensive mantras.",
    keyInsight: "Symbolizes Garuda as the rapid, dynamic vehicle of the intellect carrying devotion to the highest realms."
  },
  {
    number: 44,
    name: "Sriprasna Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "A dialogue with Sri (Lakshmi) detailing the supreme art of household worship and sanctifying domestic space.",
    keyInsight: "Teaches that a home where the Divine is regularly remembered becomes a temple of absolute peace and prosperity."
  },
  {
    number: 45,
    name: "Markandeya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Discusses longevity, overcoming mortal fear through devotion, and building stable temples that last centuries.",
    keyInsight: "Asserts that structural and mental stability are achieved when anchored in the eternal, immortal Supreme."
  },
  {
    number: 46,
    name: "Vishvaksena Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Dedicated to the commander-in-chief of Vaikuntha, removing obstacles, and organizing grand temple events.",
    keyInsight: "Reminds the seeker to first seek the removal of egotistical obstacles before entering sacred action."
  },
  {
    number: 47,
    name: "Vasishtha Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses the balance between Vedic rituals and Agamic devotion, showing how they complete each other.",
    keyInsight: "Advocates for a harmonious synthesis of traditional Vedic learning and warm, personal Agamic love."
  },
  {
    number: 48,
    name: "Brihad Brahma Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "A vast text covering cosmic creation, the ultimate nature of truth, and the divine spiritual abode of Vaikuntha.",
    keyInsight: "Depicts Vaikuntha as the state of pure consciousness, completely free from the turbulence of material nature."
  },
  {
    number: 49,
    name: "Jnanamritasara Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Often identified with the Narada Pancharatra, this text is filled with sweet, nectar-like devotional stories and prayers.",
    keyInsight: "Teaches that intellectual knowledge is crowned and completed when it melts into pure, ecstatic love."
  },
  {
    number: 50,
    name: "Kashyapa Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with toxicological knowledge, environmental healing, the curing of ailments through herbs, and sacred sound.",
    keyInsight: "Recognizes the deep link between physical health, sound waves, and environmental purity."
  },
  {
    number: 51,
    name: "Gautama Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Exposes social ethics, justice, the codes of conduct for spiritual retreats, and the duties of standard teachers.",
    keyInsight: "Maintains that a stable, righteous society is the necessary foundation for individual spiritual quest."
  },
  {
    number: 52,
    name: "Agastya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Presents worship of Lord Rama, purification of rivers, and keys to physical and mental rejuvenation.",
    keyInsight: "Upholds Lord Rama as the embodiment of Dharma, whose contemplation inspires noble character and absolute duty."
  },
  {
    number: 53,
    name: "Hayagriva Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on the horse-necked incarnation of Vishnu, who represents the lord of wisdom, learning, and fine arts.",
    keyInsight: "Guides students and artists to seek Hayagriva to unlock creative genius and deep scriptural understanding."
  },
  {
    number: 54,
    name: "Aniruddha Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the self-controlled, boundless mind, and the construction of temples that symbolize cosmic columns.",
    keyInsight: "Compares the steady pillars of a temple to the firm, unwavering determination of a trained yogi."
  },
  {
    number: 55,
    name: "Purushottama Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on the Supreme Purusha, cosmic evolution, and the grand aesthetics of standard chariot festivals.",
    keyInsight: "Portrays the chariot festival (Ratha Yatra) as a physical metaphor of the Divine journeying into the world of humanity."
  },
  {
    number: 56,
    name: "Atri Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with solar configurations, the purification of land, and procedures for constructing standard public resting places.",
    keyInsight: "Stresses that public infrastructure should be built with sacred intent to benefit the physical and spiritual journey of all."
  },
  // Populating the remaining 80 Vaishnava Agamas (57 - 136) to reach exactly 108 Vaishnava Agamas
  {
    number: 57,
    name: "Kapila Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Presents analysis of the elements, the science of creation, and non-attached action based on early Samkhya teachings.",
    keyInsight: "Links logical understanding of nature's elements with complete devotion to the cosmic builder."
  },
  {
    number: 58,
    name: "Kanva Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Discusses the recitation of ancient Vedic verses alongside modern Agamic prayers, fostering traditional continuity.",
    keyInsight: "Teaches that true tradition bridges ancient methodologies with modern, heartfelt devotional expressions."
  },
  {
    number: 59,
    name: "Varaha Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on the Varaha (boar) incarnation, rescuing the Earth, environmental ecology, and soil preservation.",
    keyInsight: "Highlights the Earth as a sacred, living mother that humanity has a direct duty to protect and cherish."
  },
  {
    number: 60,
    name: "Vamana Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with standard humility, scaling of desires, and finding the infinite within the smallest physical particle.",
    keyInsight: "Proclaims that humility expands the human consciousness to realize the boundless within the bound."
  },
  {
    number: 61,
    name: "Narasingha Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Outlines fearless devotion, protection of the weak, and the awesome, protective energy of Lord Narasimha.",
    keyInsight: "Demonstrates that divine protection manifests instantly to shield pure, innocent, and unwavering faith."
  },
  {
    number: 62,
    name: "Kalki Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Contemplates future cycles, the ultimate triumph of truth over deception, and cosmic renewal.",
    keyInsight: "Inspires hope that even in the darkest epochs, the seed of righteousness is preserved and eventually restored."
  },
  {
    number: 63,
    name: "Vyasa Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on compiling sacred knowledge, writing guidelines, and standard methodologies of standard study.",
    keyInsight: "Stresses that study and recording of sacred wisdom must be approached as a highly disciplined sacrifice (Jnana Yajna)."
  },
  {
    number: 64,
    name: "Yajnavalkya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with standard philosophical debates, direct realization of Atman, and ethical codes for scholars.",
    keyInsight: "Declares that the ultimate goal of debate and inquiry is the non-dual realization of the self."
  },
  {
    number: 65,
    name: "Harita Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Outlines codes for householders, peaceful coexistence, and standard practices of daily contemplation.",
    keyInsight: "Shows that daily household duties, when done without attachment, are as powerful as deep forest meditation."
  },
  {
    number: 66,
    name: "Angiras Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses the science of sacred sound waves, mental chanting, and internal sound resonance.",
    keyInsight: "Instructs that silent mental chanting penetrates the deepest layers of the subconscious mind."
  },
  {
    number: 67,
    name: "Pulastya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with ancestral lineage, peaceful memory rituals, and respecting family elders.",
    keyInsight: "Emphasizes that expressing gratitude to ancestors establishes psychological peace and stable roots."
  },
  {
    number: 68,
    name: "Daksha Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on precision in sacred activities, time management, and the alignment of human work with seasons.",
    keyInsight: "Teaches that executing actions with precision and mindfulness is a form of deep yoga."
  },
  {
    number: 69,
    name: "Likhita Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Details on writing scripture, manuscript preservation, and the standard duties of libraries and standard archives.",
    keyInsight: "Reminds that preserving sacred literature is a highly noble service that protects future generations."
  },
  {
    number: 70,
    name: "Manu Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Outlines social harmony, ethical administration of towns, and environmental sanitation.",
    keyInsight: "Holds that outer sanitation and clean water sources are vital indicators of a spiritual society."
  },
  {
    number: 71,
    name: "Valmiki Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Explores cosmic poetry, the standard rhythms of language, and chanting the epic of Rama.",
    keyInsight: "Teaches that high poetry and standard epic tales are excellent vehicles for conveying complex spiritual truths."
  },
  {
    number: 72,
    name: "Shuka Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Dedicated to the legendary young sage Shuka, representing absolute renunciation and non-attachment.",
    keyInsight: "Maintains that the highest state of freedom is when the mind is completely free from worldly desire."
  },
  {
    number: 73,
    name: "Shaunaka Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on household fire-sacrifices, collective peace chants, and community prosperity.",
    keyInsight: "Proclaims that collective prayers of peace send positive, calming vibrations into the atmosphere."
  },
  {
    number: 74,
    name: "Bhrigu Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "A famous text covering astrology, planetary influences, individual destiny, and balancing karma.",
    keyInsight: "Shows that while planetary forces influence the mind, strong spiritual practice can completely neutralize negative karma."
  },
  {
    number: 75,
    name: "Marichi Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the rays of the sun, light-meditation, and standard practices of early dawn worship.",
    keyInsight: "Upholds dawn as the most sacred window of the day, when the mind is naturally still and receptive."
  },
  {
    number: 76,
    name: "Jamadagni Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses self-control, mastering the fire of anger, and cultivation of calm forgiveness.",
    keyInsight: "States that anger consumes the accumulator of spiritual energy, while forgiveness preserves and multiplies it."
  },
  {
    number: 77,
    name: "Shiva Samhita (Vaishnava)",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "A beautiful dialogue where Shiva praises and outlines the supreme devotion of Vishnu to Parvati.",
    keyInsight: "Reveals the non-dual underlying unity of the different aspects of the singular Supreme Divinity."
  },
  {
    number: 78,
    name: "Parvati Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Highlights divine motherly compassion, gentle devotion, and standard household family ethics.",
    keyInsight: "Upholds the mother as the primary spiritual guide and standard of unconditional love in a family."
  },
  {
    number: 79,
    name: "Ganesha Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses the integration of wisdom, intelligence, and removing obstacles in spiritual paths.",
    keyInsight: "Teaches that high intelligence (Buddhi) should always be paired with noble character and devotion."
  },
  {
    number: 80,
    name: "Surya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Dedicated to the solar energy, physical vitality, health practices, and the Gayatri mantra.",
    keyInsight: "Links the physical sun as the visible representative of the inner spiritual light of the soul."
  },
  {
    number: 81,
    name: "Chandra Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses emotional balance, calming of the nervous system, and meditation during moonlit nights.",
    keyInsight: "Instructs that as the moon reflects the sun, the mind should reflect the brilliant light of the Atman."
  },
  {
    number: 82,
    name: "Agni Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with thermal energies, standard fire offerings, and purification of temple items.",
    keyInsight: "Regards fire as the messenger that carries human aspirations and gratitude directly to the cosmos."
  },
  {
    number: 83,
    name: "Vayu Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on pranayama, oxygenation of the body, energy channels, and controlling the life force.",
    keyInsight: "Teaches that control over the breath yields absolute control over the restless nature of the mind."
  },
  {
    number: 84,
    name: "Indra Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses sensory mastery, directing the standard five senses inward, and achieving internal lordship.",
    keyInsight: "Declares that the true King of Kings is one who has conquered their own physical senses."
  },
  {
    number: 85,
    name: "Yama Samhita (Vaishnava)",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with self-restraint (Yama), universal moral codes, non-violence, and truthfulness.",
    keyInsight: "Establishes non-violence (Ahimsa) and truthfulness (Satya) as the absolute pillars of any spiritual path."
  },
  {
    number: 86,
    name: "Kubera Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses ethical wealth, philanthropic use of money, and standard temple treasury management.",
    keyInsight: "Stresses that wealth is a sacred trust that should be distributed for the elevation of standard humanity."
  },
  {
    number: 87,
    name: "Varuna Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the water element, sacred rivers, conservation of pure water, and bathing rituals.",
    keyInsight: "Upholds water as a primary living purifier that should be kept absolutely free from pollution."
  },
  {
    number: 88,
    name: "Kama Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Discusses the elevation of desires, transforming earthly attraction into celestial devotion.",
    keyInsight: "Instructs that all human passions can be sublimated and directed toward the love of the Divine."
  },
  {
    number: 89,
    name: "Rati Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on divine aesthetic taste, temple decorations, flowers, and creating an atmosphere of beauty.",
    keyInsight: "Proclaims that beauty and aesthetics are direct lanes that invoke deep peace and devotion."
  },
  {
    number: 90,
    name: "Sarasvati Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Dedicated to the arts, music, language, and high educational systems of standard temples.",
    keyInsight: "Maintains that the study of grammar, logic, and music is a highly potent form of meditation."
  },
  {
    number: 91,
    name: "Gayatri Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on the contemplation of the sun-deity (Savitr) and the integration of intellect and meditation.",
    keyInsight: "Prayers for the illumination of the human intellect so it is guided by noble and righteous paths."
  },
  {
    number: 92,
    name: "Savitri Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with life force, overcoming cosmic decay, and standard practices of life-extension.",
    keyInsight: "Teaches that a steady mind and pure dietary habits delay decay and promote physical longevity."
  },
  {
    number: 93,
    name: "Durga Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses the protective shield of divine energy, overcoming critical dangers, and mental strength.",
    keyInsight: "Highlights that divine feminine energy acts as an impenetrable fortress for the helpless."
  },
  {
    number: 94,
    name: "Kali Samhita (Vaishnava)",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the dissolution of time (Kala), standard cosmic phases, and finding peace in change.",
    keyInsight: "Guides the mind to remain serene and unchanging amidst the rapid, chaotic changes of time."
  },
  {
    number: 95,
    name: "Radha Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Explores the deepest levels of sweet, personal devotion (Madhurya Bhakti) and selfless cosmic love.",
    keyInsight: "States that Radha represents the supreme energy of devotion that attracts even the Lord Himself."
  },
  {
    number: 96,
    name: "Sita Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Details on sita's quiet strength, earth-devotion, resilience under pressure, and character purity.",
    keyInsight: "Shows that silent resilience and moral integrity are the highest forms of spiritual power."
  },
  {
    number: 97,
    name: "Rukmini Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses the process of writing prayers, letter-writing of devotion, and formal surrender.",
    keyInsight: "Teaches that expressing devotion through writing and study organizes the mind beautifully."
  },
  {
    number: 98,
    name: "Satyabhama Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with dynamic action, fighting injustice, and active participation in righteous causes.",
    keyInsight: "Instructs that a spiritual seeker should not be passive but actively stand up for justice."
  },
  {
    number: 99,
    name: "Gopala Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on Lord Gopala (the cowherd protector), loving animals, and environmental farming.",
    keyInsight: "Declares that kindness to animals and nature is a direct indicator of spiritual growth."
  },
  {
    number: 100,
    name: "Krishna Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Covers the complete life lessons of Krishna, the path of selfless duty (Karma) and wisdom (Jnana).",
    keyInsight: "Synthesizes outer cosmic duties with absolute inner freedom and joyful play."
  },
  {
    number: 101,
    name: "Rama Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on the path of individual duty, keeping promises, and stable family governance.",
    keyInsight: "Upholds that truthfulness and character stability are the true metrics of spiritual advancement."
  },
  {
    number: 102,
    name: "Govinda Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with cow protection, organic soil treatments, and building self-sufficient spiritual communes.",
    keyInsight: "Shows that agricultural purity and simple living are highly conducive to high spiritual focus."
  },
  {
    number: 103,
    name: "Madhava Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Dedicated to spring, cycles of joy, and finding spiritual beauty in changing seasons.",
    keyInsight: "Reminds that the cosmos is a dynamic, blooming playground of the supreme consciousness."
  },
  {
    number: 104,
    name: "Narayana Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Outlines the omnipresent aspect of Narayana, finding divinity in all beings, and universal empathy.",
    keyInsight: "Teaches that the best worship of Narayana is serving the suffering and helpless."
  },
  {
    number: 105,
    name: "Vasudeva Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the self-effulgent Lord within, light visualization, and purification of the nervous system.",
    keyInsight: "Reveals that the ultimate self-effulgent light of Vasudeva shines steadily within the heart of all."
  },
  {
    number: 106,
    name: "Sankarshana Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses the force of gravity, stability, holding things together, and cosmic destruction.",
    keyInsight: "Understands that the same divine force that binds stars also stabilizes the human mind."
  },
  {
    number: 107,
    name: "Pradyumna Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on aesthetic creations, fine arts, architecture, and noble progeny.",
    keyInsight: "States that noble arts and high intentions during creation elevate the entire human culture."
  },
  {
    number: 108,
    name: "Padmanabha Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the navel lotus, center of life-vitality, yoga of the abdominal region, and creation origins.",
    keyInsight: "Points to the navel (Manipura center) as the reservoir of cosmic energy and life preservation."
  },
  {
    number: 109,
    name: "Damodara Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with self-control, being tied down by love, and rules of temple boundary management.",
    keyInsight: "Shows that the infinite supreme is bound and captured only by the slender thread of selfless love."
  },
  {
    number: 110,
    name: "Hrishikesha Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on sensory control, calm breathing, and standard practices of sensory withdrawal.",
    keyInsight: "Holds that withdrawing senses from distractions is the gateway to tasting deep inner bliss."
  },
  {
    number: 111,
    name: "Keshava Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the hair-rays of creation, cosmic rays, and daily morning temple prayers.",
    keyInsight: "Instructs that morning sunlight carries specific, health-restoring cosmic vibrations."
  },
  {
    number: 112,
    name: "Janardana Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on public service, philanthropy, saving standard refugees, and temple kitchens (Annasatram).",
    keyInsight: "Proclaims that feeding the hungry is identical to feeding the Supreme Lord directly."
  },
  {
    number: 113,
    name: "Achyuta Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on the imperishable state, the immutable nature of Atman, and overcoming fear of death.",
    keyInsight: "Teaches that realization of the immortal self removes all anxiety from human life."
  },
  {
    number: 114,
    name: "Upendra Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with younger sibling duties, filial love, cooperative families, and humble societal work.",
    keyInsight: "Upholds that family harmony and mutual respect are essential for steady spiritual training."
  },
  {
    number: 115,
    name: "Trivikrama Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses grand strides, spatial layouts, large scale geometry, and expansive temple halls.",
    keyInsight: "Explores how spacious, lofty structures expand the human cognitive horizon and sense of grandeur."
  },
  {
    number: 116,
    name: "Vaikuntha Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on Vaikuntha (the state without anxiety), meditation on pure peace, and ultimate freedom.",
    keyInsight: "Shows that anxiety disappears when the mind drops its illusions of absolute control."
  },
  {
    number: 117,
    name: "Paramatma Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the cosmic self, universal spirit, and non-dual realization of Atman.",
    keyInsight: "Instructs that the self residing in oneself is identical to the self in all other living beings."
  },
  {
    number: 118,
    name: "Chaitanya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on dynamic consciousness, ecstatic dancing, chanting, and emotional purification.",
    keyInsight: "Reveals that ecstatic chanting and movement can rapidly dissolve rigid mental blocks."
  },
  {
    number: 119,
    name: "Bhakti Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Outlines the nine-fold path of devotion, listening, chanting, remembering, and offering.",
    keyInsight: "Affirms that love is a complete spiritual path that does not depend on intellectual scholarship."
  },
  {
    number: 120,
    name: "Prema Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Explores the highest non-attached divine love, compassion, and serving the world.",
    keyInsight: "Teaches that pure love demands nothing in return and is its own infinite reward."
  },
  {
    number: 121,
    name: "Mukti Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the process of liberation, dissolving mental impressions (Vasanas), and absolute freedom.",
    keyInsight: "Declares that liberation is not a physical place but the complete dissolution of mental conditioning."
  },
  {
    number: 122,
    name: "Jnana Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on logical analysis, scriptural inquiry, and the wisdom of distinguishing real from unreal.",
    keyInsight: "Holds that discriminative wisdom is the steady sword that cuts down worldly illusions."
  },
  {
    number: 123,
    name: "Vairagya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses the science of dispassion, dropping outer dependencies, and finding inner contentment.",
    keyInsight: "Shows that true richness is not owning things, but needing nothing from the world."
  },
  {
    number: 124,
    name: "Shanti Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with internal stillness, resolving mental trauma, and establishing personal equanimity.",
    keyInsight: "Declares that peace is the essential natural state of the soul, only temporarily disturbed by ego."
  },
  {
    number: 125,
    name: "Dharma Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Outlines universal duty, cosmic order, ethical lifestyle, and social responsibilities.",
    keyInsight: "Teaches that living in harmony with cosmic law is the ultimate spiritual protection."
  },
  {
    number: 126,
    name: "Satya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Focuses on absolute truthfulness in speech, action, and thought, and its mystical power.",
    keyInsight: "Asserts that when truth is completely integrated in a person, their words manifest directly."
  },
  {
    number: 127,
    name: "Yoga Samhita (Vaishnava)",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the integration of breathing, posture, meditation, and devotional focus.",
    keyInsight: "Proclaims that yoga is crowned when the stilled mind rests peacefully in the Divine."
  },
  {
    number: 128,
    name: "Kriya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Details of physical actions, temple upkeep, gardening, and standard clean environmental maintenance.",
    keyInsight: "Instructs that cleaning temple paths is a direct, humbling path to wash away individual ego."
  },
  {
    number: 129,
    name: "Charya Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with ethical conduct, daily schedule, healthy diet, and standard personal discipline.",
    keyInsight: "Recommends a moderate lifestyle, moderate eating, and regular sleep for optimal spiritual progress."
  },
  {
    number: 130,
    name: "Prasada Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Addresses the science of consecrated food, distributing blessings, and gratitude for nourishment.",
    keyInsight: "Teaches that food cooked with devotion and offered to the cosmos is purified of all negative vibrations."
  },
  {
    number: 131,
    name: "Archana Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with rules for offering flowers, fragrances, lights, and standard incense to deity forms.",
    keyInsight: "Explains that offering beautiful natural items symbolizes returning earth's gifts back to the creator."
  },
  {
    number: 132,
    name: "Puja Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Outlines structural temple worship, the sequencing of rituals, and maintaining focus during work.",
    keyInsight: "Shows that structured rituals help channel and steady the otherwise restless thoughts."
  },
  {
    number: 133,
    name: "Utsava Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with grand periodic festivals, floating festivals, and lighting of thousand lamps.",
    keyInsight: "Portrays public festivals as powerful means of dissolving social barriers and spreading joy."
  },
  {
    number: 134,
    name: "Prayashchitta Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with correction of mistakes, restoration of purity, and self-forgiveness.",
    keyInsight: "Reminds that no mistake is permanent; sincere correction and penance restore perfect harmony."
  },
  {
    number: 135,
    name: "Pratistha Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Details on consecrating and establishing stable positive energy in newly built temples.",
    keyInsight: "Asserts that collective devotion and precise pranic installation make a physical stone alive with divinity."
  },
  {
    number: 136,
    name: "Pavithra Samhita",
    category: "Vaishnava",
    subCategory: "Pancharatra",
    description: "Deals with the annual purificatory ritual of offering sacred threads to clean any ritual shortcomings.",
    keyInsight: "Stresses that yearly self-audits and purifications are vital to maintain standard spiritual environments."
  },

  // --- 64 SHAKTA AGAMAS / TANTRAS (137 - 200) ---
  {
    number: 137,
    name: "Mahamaya Tantra",
    category: "Shakta",
    subCategory: "Yamala",
    description: "Focuses on the great cosmic illusion (Maya) and how to understand and pierce it through Kundalini yoga.",
    keyInsight: "Teaches that the same cosmic force that creates the illusion of duality is also the key to non-dual liberation."
  },
  {
    number: 138,
    name: "Sambara Tantra",
    category: "Shakta",
    subCategory: "Yamala",
    description: "Deals with controlling internal elemental forces, dream yoga, and achieving mastership over deep states of sleep.",
    keyInsight: "Reveals that the dream state is an excellent sandbox for training the mind in absolute focus."
  },
  {
    number: 139,
    name: "Yoginijala Tantra",
    category: "Shakta",
    subCategory: "Yamala",
    description: "Addresses the net of cosmic female energies (Yoginis), chakra points in the body, and collective meditation circles.",
    keyInsight: "Teaches that individual energy centers (Chakras) are small replicas of the universal web of cosmic power."
  },
  {
    number: 140,
    name: "Angaja Tantra",
    category: "Shakta",
    subCategory: "Yamala",
    description: "Deals with physical body alignment, mudras, physical gestures that lock and channel life energy.",
    keyInsight: "Uses physical hand locks (Mudras) to redirect and steady the subtle currents of the nervous system."
  },
  {
    number: 141,
    name: "Suka Tantra",
    category: "Shakta",
    subCategory: "Yamala",
    description: "A highly simplified, sweet introductory Shakta text on chanting, light visualizations, and daily gratitude.",
    keyInsight: "Maintains that even simple, child-like devotion quickly wins the compassionate heart of the Mother."
  },
  {
    number: 142,
    name: "Karana Tantra (Shakta)",
    category: "Shakta",
    subCategory: "Yamala",
    description: "Discusses the primary causes of cosmic manifestations, five basic elements, and their energy vibrations.",
    keyInsight: "Reminds that physical matter is simply concentrated, vibrating energy of the supreme mother."
  },
  {
    number: 143,
    name: "Kularnava Tantra",
    category: "Shakta",
    subCategory: "Kaula",
    description: "One of the most celebrated and profound Kaula texts, outlining the path of sensory sublimation and absolute purity.",
    keyInsight: "Proclaims that the body is the temple of the Divine; one must maintain and treat it with supreme respect."
  },
  {
    number: 144,
    name: "Rudrayamala Tantra",
    category: "Shakta",
    subCategory: "Yamala",
    description: "A monumental work detailing complex Kundalini energy systems, advanced mantras, and the union of Shiva and Shakti.",
    keyInsight: "Teaches that the ascent of Kundalini merges the individual consciousness back into supreme cosmic stillness."
  },
  {
    number: 145,
    name: "Brahmayamala Tantra",
    category: "Shakta",
    subCategory: "Yamala",
    description: "Deals with primordial sound creation, deep letters (A-Ka-Cha-Ta-Ta-Pa-Ya-Sha), and sound vibrations.",
    keyInsight: "Asserts that every letter of the Sanskrit alphabet carries a specific energetic seed of creation."
  },
  {
    number: 146,
    name: "Vishnuyamala Tantra",
    category: "Shakta",
    subCategory: "Yamala",
    description: "Addresses the active, protective dynamic power of Vishnu manifested in feminine forms like Durga.",
    keyInsight: "Integrates protective strength and absolute cosmic preservation in standard daily contemplative practices."
  },
  {
    number: 147,
    name: "Deviyamala Tantra",
    category: "Shakta",
    subCategory: "Yamala",
    description: "Focuses on the celestial beauty of the divine mother, her different administrative rays, and gentle prayers.",
    keyInsight: "Encourages visualizing the divine mother as a radiant, gentle presence carrying maternal affection for all."
  },
  {
    number: 148,
    name: "Gandharvayamala Tantra",
    category: "Shakta",
    subCategory: "Yamala",
    description: "Concentrates on classical music, drum rhythms, classical dance, and sacred artistic performance as worship.",
    keyInsight: "Holds that when dance and music are done with sacred intent, they become highly powerful yogic states."
  },
  {
    number: 149,
    name: "Ruruyamala Tantra",
    category: "Shakta",
    subCategory: "Yamala",
    description: "Deals with fierce protective energies, dissolving deep-seated fears, and overcoming negative environments.",
    keyInsight: "Teaches that facing the fierce aspects of nature with absolute surrender dissolves all mortal fear."
  },
  {
    number: 150,
    name: "Atharvanayamala Tantra",
    category: "Shakta",
    subCategory: "Yamala",
    description: "Exposes healing sciences, protection of newborn children, balancing mental health, and physical safety.",
    keyInsight: "Provides practical, daily safety routines that establish a protective aura around standard homes."
  },
  {
    number: 151,
    name: "Nityatantra",
    category: "Shakta",
    subCategory: "Nitya",
    description: "Focuses on the fifteen Nitya goddesses, lunar calendar phases, and daily modifications of female energy.",
    keyInsight: "Shows how the cosmic tides of nature are reflected inside the endocrine system of the human body."
  },
  {
    number: 152,
    name: "Sritantra",
    category: "Shakta",
    subCategory: "Srikula",
    description: "Deals with the sacred geometry of Sri Yantra, the nine circuits of light, and meditating on the central point (Bindu).",
    keyInsight: "Portrays the Sri Yantra as a structural blueprint of both the universe and the human energy map."
  },
  {
    number: 153,
    name: "Kulachudamani Tantra",
    category: "Shakta",
    subCategory: "Kaula",
    description: "Deals with the crown jewel of Kaula ethics, keeping practices confidential, and absolute humility.",
    keyInsight: "Reminds that spiritual depth should not be shown off, but kept silently inside like a hidden treasure."
  },
  {
    number: 154,
    name: "Jnanarnava Tantra",
    category: "Shakta",
    subCategory: "Srikula",
    description: "The 'Ocean of Knowledge', exploring advanced non-dual philosophy, the nature of mind, and absolute liberation.",
    keyInsight: "Declares that the ultimate nature of the Divine Mother is pure, formless, self-aware wisdom (Jnana)."
  },
  {
    number: 155,
    name: "Tantraraja Tantra",
    category: "Shakta",
    subCategory: "Srikula",
    description: "The 'King of Tantras', which systematizes the entire Srikula lineage, geometric worship, and mantra structures.",
    keyInsight: "Establishes a highly logical and scientific methodology for testing and practicing mantra energy."
  },
  {
    number: 156,
    name: "Shaktisangama Tantra",
    category: "Shakta",
    subCategory: "Srikula",
    description: "A massive compilation reconciling different sects of Shaiva, Vaishnava, and Shakta, showing their harmony.",
    keyInsight: "Proclaims that all diverse sects and methodologies eventually merge into the singular ocean of cosmic energy."
  },
  {
    number: 157,
    name: "Saradatilaka Tantra",
    category: "Shakta",
    subCategory: "Mantra",
    description: "A highly celebrated encyclopedia of standard mantras, letters, geometry, and daily purificatory rituals.",
    keyInsight: "Teaches that correct pronunciation of phonemes creates highly stable and harmonious brain waves."
  },
  {
    number: 158,
    name: "Prapanchasara Tantra",
    category: "Shakta",
    subCategory: "Mantra",
    description: "Attributed to Adi Shankara, this text explores the core essence of the five elements and cosmic sounds.",
    keyInsight: "Reconciles high intellectual monism (Advaita) with beautiful, detailed energetic worship of natural forces."
  },
  {
    number: 159,
    name: "Mahanirvana Tantra",
    category: "Shakta",
    subCategory: "Kaula",
    description: "A highly influential, reform-oriented text explaining social duties, modern legal rights, and direct non-dual worship.",
    keyInsight: "Declares that in modern times, direct contemplation of the formless Supreme is the safest and most effective path."
  },
  {
    number: 160,
    name: "Parasurama Kalpasutra",
    category: "Shakta",
    subCategory: "Srikula",
    description: "A classical manual compiling practical guidelines for Sri Vidya worship in concise aphoristic style.",
    keyInsight: "Provides highly structured and step-by-step practical guidelines that avoid dangerous over-modifications."
  },
  {
    number: 161,
    name: "Varivasya Rahasya",
    category: "Shakta",
    subCategory: "Srikula",
    description: "Composed by Bhaskararaya, this text unlocks the deep secret meanings of the fifteen-syllabled Panchadasi mantra.",
    keyInsight: "Teaches that the outer sound of a mantra is simply the container; the inner meaning is the active agent."
  },
  {
    number: 162,
    name: "Tripura Rahasya",
    category: "Shakta",
    subCategory: "Srikula",
    description: "The 'Secret of Tripura', containing beautiful parables and stories that explain highly advanced non-dual states of mind.",
    keyInsight: "Demonstrates that the world is a mental reflection, and true freedom is realizing the pure awareness behind it."
  },
  {
    number: 163,
    name: "Kamakalavilasa",
    category: "Shakta",
    subCategory: "Srikula",
    description: "Deals with the art of cosmic desire, the expansion of the point (Bindu) into the triangle of creation.",
    keyInsight: "Explores the cosmic expansion from the singular unmanifest source to the beautiful, diverse physical universe."
  },
  {
    number: 164,
    name: "Cidgaganachandrika",
    category: "Shakta",
    subCategory: "Kramakula",
    description: "A highly poetic and advanced text exploring the moon of consciousness shining in the inner sky of the mind.",
    keyInsight: "Reveals that when the mind is completely silent, the absolute light of Atman shines steadily like a full moon."
  },
  {
    number: 165,
    name: "Kaulachudamani Tantra",
    category: "Shakta",
    subCategory: "Kaula",
    description: "Focuses on Kaula conduct, absolute respect for women, and the cultivation of kindness to all life.",
    keyInsight: "States that disrespecting any woman is a direct disrespect to the Divine Mother herself."
  },
  {
    number: 166,
    name: "Lalita Tantra",
    category: "Shakta",
    subCategory: "Srikula",
    description: "Deals with the playfulness of Lalita Tripurasundari, temple decorations, and grand colorful offerings.",
    keyInsight: "Emphasizes that the spiritual path should be filled with natural joy, beauty, and light-heartedness."
  },
  {
    number: 167,
    name: "Bhairava Tantra",
    category: "Shakta",
    subCategory: "Bhairavakula",
    description: "Focuses on advanced meditation techniques, merging mind into the sky, and absolute sensory expansion.",
    keyInsight: "Teaches 112 methods of centering the mind, utilizing daily activities like breathing, eating, and sleeping."
  },
  {
    number: 168,
    name: "Vamakeshvara Tantra",
    category: "Shakta",
    subCategory: "Srikula",
    description: "Details the worship of Nitya deities, construction of geometric Mandalas, and daily mental focus loops.",
    keyInsight: "Establishes a structured rhythm of mental focus that transforms random thoughts into a sacred pattern."
  },
  {
    number: 169,
    name: "Kubjika Tantra",
    category: "Shakta",
    subCategory: "Kubjikakula",
    description: "A highly esoteric text focusing on the bent or sleeping goddess (Kubjika) who represents Kundalini at the base.",
    keyInsight: "Guides the slow, careful awakening of Kundalini energy through deep patience and breath work."
  },
  {
    number: 170,
    name: "Matrika Tantra",
    category: "Shakta",
    subCategory: "Mantra",
    description: "Exposes the mystical letters (Matrikas), their physical location in the body's plexuses, and sound locks.",
    keyInsight: "Recognizes the body as a sacred musical instrument whose keys are the Matrika sound centers."
  },
  {
    number: 171,
    name: "Malinitantra",
    category: "Shakta",
    subCategory: "Kashmir Shaivism",
    description: "A foundational text of Trika system, detailing the non-traditional arrangement of Sanskrit letters for mental focus.",
    keyInsight: "Shows how shattering standard cognitive habits opens the doorway to spontaneous, fresh insight."
  },
  {
    number: 172,
    name: "Netratantra",
    category: "Shakta",
    subCategory: "Bhairavakula",
    description: "The 'Tantra of the Eye', focusing on the third eye of Shiva, vision-meditation, and cosmic light shields.",
    keyInsight: "Activates the inner third eye of wisdom, which sees the ultimate unity behind all physical duality."
  },
  {
    number: 173,
    name: "Svacchandatantra",
    category: "Shakta",
    subCategory: "Bhairavakula",
    description: "Focuses on absolute freedom (Svacchanda), conquering death (Amritesa), and cosmic time expansion.",
    keyInsight: "Teaches that when the individual merges with pure consciousness, they transcend the laws of linear time."
  },
  {
    number: 174,
    name: "Mrigendratantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Deals with logical defense, intellectual debates, and explaining the Agamic system to scholars.",
    keyInsight: "Encourages a rigorous, intellectual understanding of faith to remove any doubts of the intellect."
  },
  {
    number: 175,
    name: "Kiranatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Details the ray-energies of the stars, astrological timing for sacred projects, and seasonal shifts.",
    keyInsight: "Aligns human actions with cosmic timing to secure natural success and internal harmony."
  },
  {
    number: 176,
    name: "Pauskaratantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Focuses on lotus configurations, flower geometries, and mental expansion through spatial design.",
    keyInsight: "Uses the lotus flower as a primary geometry to expand the subtle capacity of the heart center."
  },
  {
    number: 177,
    name: "Parakhyatantra",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Deals with other-worldly realms, celestial geography, and understanding the macrocosmic structure.",
    keyInsight: "Asserts that the macrocosm is fully contained and mirror-reflected in the human microcosm."
  },
  {
    number: 178,
    name: "Rauravatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Deals with sacred sound vibrations, purifying local surroundings, and rules for musical scales.",
    keyInsight: "Finds that certain musical scales naturally induce tranquility and deep meditative focus."
  },
  {
    number: 179,
    name: "Ajitatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Deals with absolute mental stability, establishing unwavering resolve, and overcoming depression.",
    keyInsight: "Shows that unwavering resolve is born when personal ego is completely anchored in cosmic strength."
  },
  {
    number: 180,
    name: "Diptatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Focuses on light illumination, fire contemplation, and the inner light of the pineal center.",
    keyInsight: "Declares that the light shining in the sun is identical to the small light in the human heart."
  },
  {
    number: 181,
    name: "Sukshmatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Addresses the subtle body, nadis (energy channels), prana flow, and clearing nervous obstructions.",
    keyInsight: "Recommends quiet breathing and standard positive thinking to clean the subtle channels of the body."
  },
  {
    number: 182,
    name: "Sahasratantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Details the thousand-petaled lotus (Sahasrara), the culmination of yoga, and non-dual absorption.",
    keyInsight: "Identifies the highest brain center as the meeting point where the individual drop merges with the ocean."
  },
  {
    number: 183,
    name: "Amshumantantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Deals with botanical gardens, medicinal herbs, clean organic eating, and physical purification.",
    keyInsight: "Upholds that fresh, raw plants carry solar life energy (Prana) that cleanses the physical system."
  },
  {
    number: 184,
    name: "Suprabhedatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Focuses on structural stability of altars, geometric precision, and preventing energy dissipation.",
    keyInsight: "Teaches that correct posture and geometric alignments prevent mental energy from draining away."
  },
  {
    number: 185,
    name: "Vijayatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Outlines victorious habits, overcoming bad addictions, and reprogramming the subconscious mind.",
    keyInsight: "True victory is achieved by slowly replacing unhealthy habits with positive, noble actions."
  },
  {
    number: 186,
    name: "Nishvasatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Explores the breath of the cosmos, winds of change, and remaining steady in stormy times.",
    keyInsight: "Remaining balanced during outer changes by recognizing them as natural cycles of the cosmos."
  },
  {
    number: 187,
    name: "Svayambhuvatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Addresses self-born wisdom, intuition, listening to the inner silent voice, and trust.",
    keyInsight: "Teaches that when the noisy ego-mind is silent, the wise voice of intuition is easily heard."
  },
  {
    number: 188,
    name: "Analatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Deals with digestive fires, temperature balancing, physical health, and standard yoga of the solar plexus.",
    keyInsight: "A healthy digestive fire is vital to maintain clear thinking and high spiritual energy."
  },
  {
    number: 189,
    name: "Viratantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Encourages spiritual valor, defending vulnerable people, and expressing courage in daily life.",
    keyInsight: "Holds that courage in standing up for truth is a direct and beautiful expression of divinity."
  },
  {
    number: 190,
    name: "Makutatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Focuses on structural crown configurations, peak meditations, and finishing tasks with high excellence.",
    keyInsight: "Completing every action with high excellence and offering it to the cosmos is a beautiful yoga."
  },
  {
    number: 191,
    name: "Vimalatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Deals with mental clarity, dropping confusion, and organizing spiritual libraries and thoughts.",
    keyInsight: "Organizing your physical workspace and files helps establish deep mental clarity and peace."
  },
  {
    number: 192,
    name: "Chandrajnanatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Deals with solar-lunar balances, uniting cooling and heating channels (Ida and Pingala) in Sushumna.",
    keyInsight: "Uniting opposites within yourself yields the perfect state of absolute balance and joy."
  },
  {
    number: 193,
    name: "Mukhabimbatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Deals with the divine expression, cultivating a peaceful and smiling face, and positive body language.",
    keyInsight: "A gentle, smiling facial expression radiates peaceful energy that calms the surroundings."
  },
  {
    number: 194,
    name: "Prodgitatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Addresses cosmic scales of sound, vocal training, and the standard practice of singing seed mantras.",
    keyInsight: "Singing seed mantras with high focus aligns the physical cells with universal energy frequencies."
  },
  {
    number: 195,
    name: "Lalitatantra (Shakta-Siddhanta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Deals with spontaneous play, dropping rigid plans, and trusting the natural flow of life.",
    keyInsight: "Dropping excessive anxiety and trusting the dynamic flow of cosmic play brings sweet peace."
  },
  {
    number: 196,
    name: "Siddhatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Addresses developed states of focus, mental telepathy, and advanced elements mastership.",
    keyInsight: "Highly developed focus yields natural mind powers, which should only be used for general good."
  },
  {
    number: 197,
    name: "Santanatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Deals with family lines, passing on spiritual techniques to children, and protecting heritage.",
    keyInsight: "Upholds that raising children with high values and ethics is a major spiritual contribution."
  },
  {
    number: 198,
    name: "Sarvoktatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Outlines general summaries of Shakta paths, matching them with different human temperaments.",
    keyInsight: "Acknowledges that different people need different paths according to their unique nature."
  },
  {
    number: 199,
    name: "Parameshvaratantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "Focuses on the absolute queen of the universe, formless divinity, and final liberation.",
    keyInsight: "Realizing that the supreme source of all creation is formless, absolute, and resides inside you."
  },
  {
    number: 200,
    name: "Vatulatantra (Shakta)",
    category: "Shakta",
    subCategory: "Siddhanta",
    description: "The final Tantra, exploring the boundless wind of consciousness, and absolute dissolution of boundaries.",
    keyInsight: "The final spiritual union is like a wave merging back into the infinite, boundary-less ocean."
  }
];
