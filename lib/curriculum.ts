export type Language = "en" | "ar";
export type LessonType = string;
export type Domain = string;

export const DEFAULT_LESSON_TYPES = ["explanation", "exercise", "test", "remedial", "warmup", "free-typing"];
export const DEFAULT_DOMAINS = ["general", "medical", "legal", "coding"];

export interface Lesson {
  id: string;
  title: string;
  description: string;
  language: Language;
  level: number;
  unit: number;
  type: LessonType;
  domain: Domain;
  contentVariations: string[]; // Replaced single content with variations
  targetWpm: number;
  targetAccuracy: number;
  xpReward: number; // Base XP reward for completing the lesson
  explanation?: string;
  allowedErrors?: number;
  nextLessonId?: string; // ID of the next lesson in the curriculum
  remedialTriggers?: {
    weakKeys?: string[];
    minAccuracy?: number;
    minWpm?: number;
  };
}

export const curriculum: Lesson[] = [
  // English Level 1: Home Row
  {
    id: "en-l1-u1-1",
    title: "Home Row Basics: F and J",
    description: "Learn the anchor keys for your index fingers.",
    language: "en",
    level: 1,
    unit: 1,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "f j f j ff jj fj jf", // Light
      "f j f j ff jj fj jf fff jjj f j f j", // Standard
      "f j f j ff jj fj jf fff jjj f j f j fj jf fff jjj f j f j fj jf" // Intensive
    ],
    targetWpm: 10,
    targetAccuracy: 95,
    xpReward: 50,
    explanation:
      "Place your left index finger on F and right index finger on J. Feel the small bumps on these keys. Do not look at the keyboard.",
    nextLessonId: "en-l1-u1-2",
  },
  {
    id: "en-l1-u1-2",
    title: "Home Row: D and K",
    description: "Add the middle fingers.",
    language: "en",
    level: 1,
    unit: 1,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "d k d k dd kk dk kd", // Light
      "d k d k dd kk dk kd ddd kkk d k d k f d j k fd jk", // Standard
      "d k d k dd kk dk kd ddd kkk d k d k f d j k fd jk d k d k dd kk dk kd ddd kkk" // Intensive
    ],
    targetWpm: 12,
    targetAccuracy: 95,
    xpReward: 60,
    explanation:
      "Place your left middle finger on D and right middle finger on K.",
    nextLessonId: "en-l1-u1-3",
  },
  {
    id: "en-l1-u1-3",
    title: "Home Row: S and L",
    description: "Add the ring fingers.",
    language: "en",
    level: 1,
    unit: 1,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "s l s l ss ll sl ls sss lll s l s l d s k l ds kl",
      "l s l s ll ss ls sl lll sss l s l s k l d s kl ds"
    ],
    targetWpm: 14,
    targetAccuracy: 95,
    xpReward: 70,
    explanation: "Place your left ring finger on S and right ring finger on L.",
    nextLessonId: "en-l1-u1-4",
  },
  {
    id: "en-l1-u1-4",
    title: "Home Row: A and ;",
    description: "Add the pinky fingers.",
    language: "en",
    level: 1,
    unit: 1,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "a ; a ; aa ;; a; ;a aaa ;;; a ; a ; s a l ; sa l;",
      "; a ; a ;; aa ;a a; ;;; aaa ; a ; a l ; s a l; sa"
    ],
    targetWpm: 15,
    targetAccuracy: 95,
    xpReward: 80,
    explanation: "Place your left pinky on A and right pinky on ;.",
    nextLessonId: "en-l1-u1-5",
  },
  {
    id: "en-l1-u1-5",
    title: "Home Row Test",
    description: "Test your mastery of the home row.",
    language: "en",
    level: 1,
    unit: 1,
    type: "test",
    domain: "general",
    contentVariations: [
      "asdf jkl; asdf jkl; fdsa ;lkj a s d f j k l ; asdf jkl; fall sad dad add ask all fall flask",
      "jkl; asdf jkl; asdf ;lkj fdsa j k l ; a s d f jkl; asdf glad lass dash flash half salad"
    ],
    targetWpm: 20,
    targetAccuracy: 96,
    xpReward: 150,
    nextLessonId: "en-l2-u1-1",
  },
  // English Level 2: Top Row
  {
    id: "en-l2-u1-1",
    title: "Top Row: E and I",
    description: "Reach up to the E and I keys.",
    language: "en",
    level: 2,
    unit: 1,
    type: "explanation",
    domain: "general",
    contentVariations: [
      "de ki de ki ded kik ded kik see kid side like",
      "ed ik ed ik ede iki ede iki die lie slide desk"
    ],
    targetWpm: 20,
    targetAccuracy: 94,
    xpReward: 100,
    explanation: "Use your left middle finger for E and right middle finger for I. Always return to the home row.",
    nextLessonId: "en-l2-u1-2",
  },
  {
    id: "en-l2-u1-2",
    title: "Top Row: R and U",
    description: "Reach up to the R and U keys.",
    language: "en",
    level: 2,
    unit: 1,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "fr ju fr ju frf juj frf juj sure rule read rude",
      "rf uj rf uj rfr uju rfr uju user ride real rush"
    ],
    targetWpm: 22,
    targetAccuracy: 94,
    xpReward: 120,
    explanation: "Use your left index finger for R and right index finger for U.",
    nextLessonId: "en-l3-u1-1",
  },
  // English Level 3: Professional
  {
    id: "en-l3-u1-1",
    title: "Professional: Capitalization",
    description: "Master the Shift keys for capital letters.",
    language: "en",
    level: 3,
    unit: 1,
    type: "explanation",
    domain: "general",
    contentVariations: [
      "The Quick Brown Fox Jumps Over The Lazy Dog.",
      "Apples, Bananas, And Oranges Are Great Fruits.",
      "Hello World! This Is A Professional Typing Test."
    ],
    targetWpm: 30,
    targetAccuracy: 96,
    xpReward: 200,
    explanation: "Use the pinky of the opposite hand to hold the Shift key while typing the letter.",
    nextLessonId: "en-l3-u1-2",
  },
  {
    id: "en-l3-u1-2",
    title: "Professional: Numbers & Symbols",
    description: "Type numbers and common punctuation marks.",
    language: "en",
    level: 3,
    unit: 1,
    type: "test",
    domain: "general",
    contentVariations: [
      "Call me at 555-0198! Or email: test@example.com.",
      "The total price is $45.99 (including 10% tax).",
      "Wait, what? I thought it was 100% free! #amazing"
    ],
    targetWpm: 35,
    targetAccuracy: 98,
    xpReward: 300,
  },
  // Arabic Level 1: صف الارتكاز
  {
    id: "ar-l1-u1-1",
    title: "صف الارتكاز: ب و ت",
    description: "تعلم مفاتيح الارتكاز للسبابة.",
    language: "ar",
    level: 1,
    unit: 1,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "ب ت ب ت بب تت بت تب", // Light
      "ب ت ب ت بب تت بت تب ببب تتت ب ت ب ت", // Standard
      "ب ت ب ت بب تت بت تب ببب تتت ب ت ب ت بت تب ببب تتت ب ت ب ت بت تب" // Intensive
    ],
    targetWpm: 10,
    targetAccuracy: 95,
    xpReward: 50,
    explanation:
      "ضع سبابتك اليمنى على حرف (ت) واليسرى على حرف (ب). ستشعر ببروز صغير عليهما. لا تنظر للوحة المفاتيح.",
    nextLessonId: "ar-l1-u1-2",
  },
  {
    id: "ar-l1-u1-2",
    title: "صف الارتكاز: ي و ن",
    description: "إضافة الأصابع الوسطى.",
    language: "ar",
    level: 1,
    unit: 1,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "ي ن ي ن يي نن ين ني ييي ننن ي ن ي ن ب ي ت ن بي تن",
      "ن ي ن ي نن يي ني ين ننن ييي ن ي ن ي ت ن ب ي تن بي"
    ],
    targetWpm: 12,
    targetAccuracy: 95,
    xpReward: 60,
    explanation: "ضع إصبعك الأوسط الأيمن على (ن) والأيسر على (ي).",
    nextLessonId: "ar-l1-u1-3",
  },
  {
    id: "ar-l1-u1-3",
    title: "صف الارتكاز: س و م",
    description: "إضافة أصابع البنصر.",
    language: "ar",
    level: 1,
    unit: 1,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "س م س م سس مم سم مس سسس ممم س م س م ي س ن م يس نم",
      "م س م س مم سس مس سم ممم سسس م س م س ن م ي س نم يس"
    ],
    targetWpm: 14,
    targetAccuracy: 95,
    xpReward: 70,
    explanation: "ضع بنصرك الأيمن على (م) والأيسر على (س).",
    nextLessonId: "ar-l1-u1-4",
  },
  {
    id: "ar-l1-u1-4",
    title: "صف الارتكاز: ش و ك",
    description: "إضافة أصابع الخنصر.",
    language: "ar",
    level: 1,
    unit: 1,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "ش ك ش ك شش كك شك كش ششش ككك ش ك ش ك س ش م ك سش مك",
      "ك ش ك ش كك شش كش شك ككك ششش ك ش ك ش م ك س ش مك سش"
    ],
    targetWpm: 15,
    targetAccuracy: 95,
    xpReward: 80,
    explanation: "ضع خنصرك الأيمن على (ك) والأيسر على (ش).",
    nextLessonId: "ar-l1-u1-5",
  },
  {
    id: "ar-l1-u1-5",
    title: "اختبار صف الارتكاز",
    description: "اختبر إتقانك لصف الارتكاز.",
    language: "ar",
    level: 1,
    unit: 1,
    type: "test",
    domain: "general",
    contentVariations: [
      "شسيبلاتنمك شسيبلاتنمك كمنتالبسش ش س ي ب ل ا ت ن م ك شسيبلاتنمك كسب نسي تبسم شمس سمك",
      "كمنتالبسش كمنتالبسش شسيبلاتنمك ك م ن ت ا ل ب س ش كمنتالبسش سمك شمس تبسم نسي كسب"
    ],
    targetWpm: 20,
    targetAccuracy: 96,
    xpReward: 150,
    nextLessonId: "ar-l2-u1-1",
  },
  // Arabic Level 2: Top Row
  {
    id: "ar-l2-u1-1",
    title: "الصف العلوي: ع و غ",
    description: "الوصول إلى مفاتيح ع و غ.",
    language: "ar",
    level: 2,
    unit: 1,
    type: "explanation",
    domain: "general",
    contentVariations: [
      "ع غ ع غ عع غغ عغ غع ععع غغغ ع غ ع غ",
      "غ ع غ ع غغ عع غع عغ غغغ ععع غ ع غ ع"
    ],
    targetWpm: 20,
    targetAccuracy: 94,
    xpReward: 100,
    explanation: "استخدم السبابة للوصول إلى الصف العلوي مع العودة دائماً لصف الارتكاز.",
    nextLessonId: "ar-l2-u1-2",
  },
  {
    id: "ar-l2-u1-2",
    title: "الصف العلوي: ق و ف",
    description: "الوصول إلى مفاتيح ق و ف.",
    language: "ar",
    level: 2,
    unit: 1,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "ق ف ق ف قق فف قف فق ققق ففف ق ف ق ف",
      "ف ق ف ق فف قق فق قف ففف ققق ف ق ف ق"
    ],
    targetWpm: 22,
    targetAccuracy: 94,
    xpReward: 120,
    explanation: "استخدم السبابة للوصول إلى ق و ف.",
    nextLessonId: "ar-l2-u2-1",
  },
  // Arabic Level 2: Unit 2 - Bottom Row
  {
    id: "ar-l2-u2-1",
    title: "الصف السفلي: ر و ز",
    description: "الوصول إلى مفاتيح ر و ز.",
    language: "ar",
    level: 2,
    unit: 2,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "ر ز ر ز رر زز رز زر ررر ززز ر ز ر ز",
      "ز ر ز ر زز رر زر رز ززز ررر ز ر ز ر"
    ],
    targetWpm: 20,
    targetAccuracy: 94,
    xpReward: 130,
    explanation: "استخدم السبابة للوصول إلى الصف السفلي.",
    nextLessonId: "ar-l2-u2-2",
  },
  {
    id: "ar-l2-u2-2",
    title: "الصف السفلي: و و ة",
    description: "الوصول إلى مفاتيح و و ة.",
    language: "ar",
    level: 2,
    unit: 2,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "و ة و ة وو ةة وة ةو ووو ةةة و ة و ة",
      "ة و ة و ةة وو ةو وة ةةة ووو ة و ة و"
    ],
    targetWpm: 22,
    targetAccuracy: 94,
    xpReward: 140,
    explanation: "استخدم البنصر والخنصر للوصول إلى و و ة.",
    nextLessonId: "ar-l3-u1-1",
  },
  // Arabic Level 3: Professional
  {
    id: "ar-l3-u1-1",
    title: "مستوى احترافي: النصوص الكاملة",
    description: "تدرب على طباعة جمل كاملة مع التشكيل وعلامات الترقيم.",
    language: "ar",
    level: 3,
    unit: 1,
    type: "explanation",
    domain: "general",
    contentVariations: [
      "العلم نور، والجهل ظلام. هل توافق على ذلك؟",
      "في عام 2024، تطورت التكنولوجيا بشكل مذهل!",
      "قال الشاعر: ألا ليت الشباب يعود يوماً..."
    ],
    targetWpm: 30,
    targetAccuracy: 96,
    xpReward: 200,
    explanation: "تدرب على السرعة والدقة في كتابة نصوص حقيقية.",
    nextLessonId: "ar-l3-u1-2",
  },
  {
    id: "ar-l3-u1-2",
    title: "مستوى احترافي: التشكيل والأرقام",
    description: "استخدام الحركات والأرقام.",
    language: "ar",
    level: 3,
    unit: 1,
    type: "test",
    domain: "general",
    contentVariations: [
      "اتصل بي على الرقم 055-1234! أو عبر البريد.",
      "السعر الإجمالي هو 45.99$ (شاملاً 15% ضريبة).",
      "مَرْحَباً بِكُمْ فِي عَالَمِ الطِّبَاعَةِ الاحْتِرَافِيَّةِ!"
    ],
    targetWpm: 35,
    targetAccuracy: 98,
    xpReward: 300,
    nextLessonId: "ar-l3-u2-1",
  },
  {
    id: "ar-l3-u2-1",
    title: "نصوص متقدمة: الأدب العربي",
    description: "تدرب على نصوص أدبية كلاسيكية.",
    language: "ar",
    level: 3,
    unit: 2,
    type: "exercise",
    domain: "general",
    contentVariations: [
      "الخيل والليل والبيداء تعرفني والسيف والرمح والقرطاس والقلم",
      "أنا الذي نظر الأعمى إلى أدبي وأسمعت كلماتي من به صمم",
      "على قدر أهل العزم تأتي العزائم وتأتي على قدر الكرام المكارم"
    ],
    targetWpm: 40,
    targetAccuracy: 97,
    xpReward: 400,
    explanation: "هذه النصوص تحتوي على كلمات معقدة وتراكيب أدبية رصينة.",
  },
  // Legal Domain
  {
    id: "en-legal-1",
    title: "Legal: Contract Basics",
    description: "Practice typing common legal terminology found in contracts.",
    language: "en",
    level: 3,
    unit: 2,
    type: "exercise",
    domain: "legal",
    contentVariations: [
      "The parties hereby agree to the terms and conditions set forth in this agreement.",
      "This contract shall be governed by and construed in accordance with the laws of the state.",
      "Neither party shall be liable for any indirect, incidental, or consequential damages."
    ],
    targetWpm: 35,
    targetAccuracy: 98,
    xpReward: 400,
    explanation: "Legal typing requires extreme precision with punctuation and formal language.",
    nextLessonId: "en-legal-2",
  },
  {
    id: "en-legal-2",
    title: "Legal: Litigation Terms",
    description: "Practice typing terms used in court proceedings.",
    language: "en",
    level: 3,
    unit: 2,
    type: "test",
    domain: "legal",
    contentVariations: [
      "The plaintiff filed a motion for summary judgment against the defendant.",
      "The burden of proof lies with the prosecution in a criminal trial.",
      "The witness was subpoenaed to testify regarding the events of the incident."
    ],
    targetWpm: 40,
    targetAccuracy: 99,
    xpReward: 500,
  },
  // Arabic Legal
  {
    id: "ar-legal-1",
    title: "القانون: مصطلحات العقود",
    description: "تدرب على المصطلحات القانونية المستخدمة في العقود.",
    language: "ar",
    level: 3,
    unit: 2,
    type: "exercise",
    domain: "legal",
    contentVariations: [
      "يقر الطرفان بأهليتهما المعتبرة شرعاً وقانوناً للتعاقد والتصرف.",
      "تخضع هذه الاتفاقية وتفسر وفقاً للقوانين والأنظمة المعمول بها في الدولة.",
      "يعتبر التمهيد السابق جزءاً لا يتجزأ من هذا العقد ويقرأ معه."
    ],
    targetWpm: 30,
    targetAccuracy: 98,
    xpReward: 400,
    explanation: "تتطلب الطباعة القانونية دقة عالية في استخدام المصطلحات الرسمية.",
  },
  // Coding Domain
  {
    id: "en-coding-1",
    title: "Coding: JavaScript Basics",
    description: "Practice typing common JS syntax.",
    language: "en",
    level: 3,
    unit: 2,
    type: "exercise",
    domain: "coding",
    contentVariations: [
      "const greeting = 'Hello World'; console.log(greeting);",
      "function add(a, b) { return a + b; }",
      "if (isValid && user.id !== null) { return true; }"
    ],
    targetWpm: 40,
    targetAccuracy: 98,
    xpReward: 400,
    explanation: "Focus on brackets, semicolons, and camelCase naming conventions.",
  },
  {
    id: "en-coding-2",
    title: "Coding: React Components",
    description: "Practice typing React component syntax.",
    language: "en",
    level: 3,
    unit: 2,
    type: "exercise",
    domain: "coding",
    contentVariations: [
      "import React from 'react'; export const MyComponent = () => <div>Hello</div>;",
      "const [count, setCount] = useState(0); useEffect(() => { console.log(count); }, [count]);",
      "return <button onClick={() => setCount(count + 1)}>Increment</button>;"
    ],
    targetWpm: 45,
    targetAccuracy: 98,
    xpReward: 500,
    explanation: "Focus on JSX syntax and React hooks.",
  },
  // Medical Domain
  {
    id: "en-medical-1",
    title: "Medical: Terminology",
    description: "Practice typing complex medical terms.",
    language: "en",
    level: 3,
    unit: 2,
    type: "exercise",
    domain: "medical",
    contentVariations: [
      "The patient was diagnosed with acute myocardial infarction.",
      "Administer 50mg of intravenous antibiotics every 6 hours.",
      "The electrocardiogram showed sinus tachycardia."
    ],
    targetWpm: 35,
    targetAccuracy: 97,
    xpReward: 400,
    explanation: "Focus on accuracy with complex, multi-syllable medical terminology.",
  },
  {
    id: "en-medical-2",
    title: "Medical: Anatomy",
    description: "Practice typing anatomical structures.",
    language: "en",
    level: 3,
    unit: 2,
    type: "exercise",
    domain: "medical",
    contentVariations: [
      "The femur is the longest and strongest bone in the body.",
      "The humerus connects the shoulder to the elbow.",
      "The thoracic cavity contains the heart and lungs."
    ],
    targetWpm: 38,
    targetAccuracy: 97,
    xpReward: 450,
    explanation: "Focus on accuracy with anatomical terminology.",
  },
  // Free Typing Lessons
  {
    id: "free-typing-1",
    title: "Classic Literature: Pride and Prejudice",
    description: "Practice with a classic excerpt.",
    language: "en",
    level: 1,
    unit: 0,
    type: "free-typing",
    domain: "general",
    contentVariations: ["It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife."],
    targetWpm: 0,
    targetAccuracy: 0,
    xpReward: 0,
  },
  {
    id: "free-typing-2",
    title: "Tech News: The Future of AI",
    description: "Practice with modern tech content.",
    language: "en",
    level: 1,
    unit: 0,
    type: "free-typing",
    domain: "coding",
    contentVariations: ["Artificial intelligence is transforming industries by automating complex tasks and providing deeper insights into data."],
    targetWpm: 0,
    targetAccuracy: 0,
    xpReward: 0,
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return curriculum.find((l) => l.id === id);
}

export function getLessonsByLanguage(language: Language): Lesson[] {
  return curriculum.filter((l) => l.language === language);
}

/**
 * Curriculum Engine Logic: Generates a targeted remedial lesson based on weak keys.
 */
export function generateRemedialLesson(baseLesson: Lesson, errorKeys: Record<string, number>): Lesson {
  // Extract the top 3 most missed keys
  const weakKeys = Object.entries(errorKeys)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => key.toLowerCase());

  if (weakKeys.length === 0) return baseLesson;

  // Generate a string focusing heavily on the weak keys mixed with home row keys
  const homeRow = baseLesson.language === 'en' ? ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'] : ['ب', 'ت', 'ي', 'ن', 'س', 'م', 'ش', 'ك'];
  
  let remedialContent = '';
  for (let i = 0; i < 15; i++) {
    // Pick a random weak key
    const weakKey = weakKeys[Math.floor(Math.random() * weakKeys.length)];
    // Pick a random home row key
    const anchorKey = homeRow[Math.floor(Math.random() * homeRow.length)];
    
    remedialContent += `${weakKey}${anchorKey} ${anchorKey}${weakKey} ${weakKey}${weakKey}${anchorKey} `;
  }

  return {
    id: `remedial-${baseLesson.id}-${Date.now()}`,
    title: `Remedial: Focus on [ ${weakKeys.join(', ').toUpperCase()} ]`,
    description: 'Targeted practice to build muscle memory for your weakest keys.',
    language: baseLesson.language,
    level: baseLesson.level,
    unit: baseLesson.unit,
    type: 'remedial',
    domain: baseLesson.domain,
    contentVariations: [remedialContent.trim()],
    targetWpm: Math.max(10, baseLesson.targetWpm - 5), // Slightly lower WPM requirement for remedial
    targetAccuracy: 98, // Higher accuracy requirement to enforce precision
    xpReward: Math.floor(baseLesson.xpReward * 0.5), // Half XP for remedial
    explanation: `You missed the keys ${weakKeys.join(', ').toUpperCase()} frequently. Slow down and focus entirely on accuracy. Do not look at the keyboard.`,
    nextLessonId: baseLesson.id, // Return to the original lesson after passing remedial
  };
}

/**
 * Generates a daily warm-up lesson based on the user's weakest keys.
 */
export function generateWarmupLesson(language: Language, weakKeys: string[]): Lesson {
  const homeRow = language === 'en' ? ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'] : ['ب', 'ت', 'ي', 'ن', 'س', 'م', 'ش', 'ك'];
  const commonWordsEn = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'];
  const commonWordsAr = ['في', 'من', 'على', 'إلى', 'أن', 'لا', 'ما', 'هذا', 'كان', 'مع', 'كل', 'ذلك', 'هو', 'عن', 'الذي', 'لم', 'هذه', 'بين', 'أو', 'قد'];

  let warmupContent = '';
  const words = language === 'en' ? commonWordsEn : commonWordsAr;
  
  // If we have weak keys, build targeted practice
  if (weakKeys.length > 0) {
    for (let i = 0; i < 20; i++) {
      // 1. Practice weak key with home row anchor
      const weakKey = weakKeys[Math.floor(Math.random() * weakKeys.length)];
      const anchorKey = homeRow[Math.floor(Math.random() * homeRow.length)];
      warmupContent += `${weakKey}${anchorKey} ${anchorKey}${weakKey} `;
      
      // 2. Add a common word to maintain flow
      const word = words[Math.floor(Math.random() * words.length)];
      warmupContent += `${word} `;
    }
  } else {
    // Generic warm-up if no weak keys data
    for (let i = 0; i < 20; i++) {
      const word1 = words[Math.floor(Math.random() * words.length)];
      const word2 = words[Math.floor(Math.random() * words.length)];
      warmupContent += `${word1} ${word2} `;
    }
  }

  return {
    id: `warmup-${Date.now()}`,
    title: `Daily Warm-up`,
    description: 'A quick 1-minute exercise to get your fingers ready.',
    language: language,
    level: 1,
    unit: 0,
    type: 'warmup',
    domain: 'general',
    contentVariations: [warmupContent.trim()],
    targetWpm: 15,
    targetAccuracy: 95,
    xpReward: 20,
    explanation: weakKeys.length > 0 
      ? `This warm-up focuses on your weakest keys: ${weakKeys.join(', ').toUpperCase()}. Take it slow and focus on accuracy.`
      : `Welcome back! Let's get your fingers warmed up with some common words.`,
  };
}
