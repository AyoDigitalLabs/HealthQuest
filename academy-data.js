// HealthQuest - academy-data.js
// All Health Academy content lives here.
// To add a lesson later, copy a lesson block inside a topic and change the text.

var ACADEMY = [
  {
    id: "anatomy",
    title: "Anatomy and Physiology",
    icon: "A",
    blurb: "How the body is built and how it works",
    lessons: [
      {
        id: "anat-1",
        title: "The Heart and Blood Flow",
        minutes: 3,
        paragraphs: [
          "The heart is a muscular pump with four chambers: the right atrium, right ventricle, left atrium and left ventricle. The atria receive blood, and the ventricles pump it out.",
          "The right side of the heart receives oxygen-poor blood from the body and sends it to the lungs through the pulmonary arteries. Blood picks up oxygen in the lungs and returns to the left side through the pulmonary veins. The left ventricle then pumps oxygen-rich blood to the whole body through the aorta.",
          "Four valves keep blood moving in one direction: the tricuspid, pulmonary, mitral and aortic valves. The familiar 'lub-dub' heart sounds come from these valves closing."
        ],
        points: [
          "Right heart: body to lungs. Left heart: lungs to body.",
          "Arteries carry blood away from the heart; veins carry blood toward it.",
          "The pulmonary artery carries oxygen-poor blood, and the pulmonary veins carry oxygen-rich blood. This is the exception to the usual pattern.",
          "A normal adult resting heart rate is usually about 60 to 100 beats per minute."
        ],
        source: "Standard anatomy and physiology references, e.g. Tortora and Derrickson, Principles of Anatomy and Physiology."
      }
    ]
  },
  {
    id: "community",
    title: "Community and Primary Healthcare",
    icon: "C",
    blurb: "Health care close to where people live",
    lessons: [
      {
        id: "comm-1",
        title: "What Is Primary Health Care?",
        minutes: 3,
        paragraphs: [
          "Primary health care (PHC) is the first level of contact between people and the health system. It focuses on keeping communities healthy, not only on treating illness.",
          "The 1978 Declaration of Alma-Ata set the goal of 'Health for All' through primary health care. In 2018 the Declaration of Astana renewed this commitment. Key principles include equity, community participation, working with other sectors, and a strong emphasis on prevention.",
          "Health systems are usually described in three levels: primary (for example health centres and clinics), secondary (general hospitals) and tertiary (specialist and teaching hospitals). In Nigeria, the National Primary Health Care Development Agency (NPHCDA) coordinates primary health care."
        ],
        points: [
          "PHC is the first point of contact and covers promotion, prevention, treatment and rehabilitation.",
          "Community participation is a core principle, not an optional extra.",
          "Primary, secondary and tertiary levels refer to levels of care, not to the importance of the care.",
          "Referral links the levels together so patients reach the care they need."
        ],
        source: "WHO and UNICEF, Declaration of Alma-Ata (1978) and Declaration of Astana (2018); NPHCDA, Nigeria."
      }
    ]
  },
  {
    id: "maternal",
    title: "Maternal and Child Health",
    icon: "M",
    blurb: "Care for mothers, newborns and children",
    lessons: [
      {
        id: "mat-1",
        title: "Antenatal Care and Danger Signs",
        minutes: 3,
        paragraphs: [
          "Antenatal care (ANC) is the care a woman receives during pregnancy. Its goals are to keep mother and baby healthy, find problems early and prepare for a safe birth.",
          "In 2016 the WHO recommended a minimum of eight contacts with a health worker during pregnancy, replacing the older four-visit model. WHO also recommends daily oral iron and folic acid supplements in pregnancy to help prevent anaemia.",
          "Some warning signs mean a woman should go to a health facility urgently. These include vaginal bleeding, convulsions, severe headache with blurred vision, severe abdominal pain, fever, reduced baby movements, and leaking of fluid before labour."
        ],
        points: [
          "WHO recommends at least eight ANC contacts for a positive pregnancy experience.",
          "Iron and folic acid supplements help prevent anaemia in pregnancy.",
          "Bleeding, convulsions, severe headache with blurred vision and reduced baby movements are danger signs.",
          "Danger signs need urgent assessment by a trained health worker."
        ],
        source: "WHO recommendations on antenatal care for a positive pregnancy experience (2016)."
      }
    ]
  },
  {
    id: "pharma",
    title: "Pharmacology",
    icon: "P",
    blurb: "How medicines move through and act on the body",
    lessons: [
      {
        id: "pharm-1",
        title: "How Drugs Move Through the Body",
        minutes: 3,
        paragraphs: [
          "Pharmacokinetics describes what the body does to a drug. It is often remembered as ADME: absorption, distribution, metabolism and excretion.",
          "The route of administration affects how quickly and how fully a drug reaches the blood. Common routes include oral, intravenous (IV), intramuscular (IM), subcutaneous, sublingual, inhaled, rectal and topical. IV drugs enter the blood directly, so their bioavailability is 100%.",
          "Many oral drugs pass through the liver before reaching the rest of the body, which is called first-pass metabolism. The liver is the main site of drug metabolism, and the kidneys are the main route of excretion. A drug's half-life is the time it takes for its blood concentration to fall by half."
        ],
        points: [
          "ADME: absorption, distribution, metabolism, excretion.",
          "IV administration bypasses absorption, so bioavailability is 100%.",
          "First-pass metabolism in the liver can reduce how much of an oral drug reaches the blood.",
          "Liver or kidney disease can change how a drug is handled, so prescribers adjust treatment."
        ],
        source: "Katzung, Basic and Clinical Pharmacology. For education only. Real prescribing follows the national formulary and a qualified prescriber."
      }
    ]
  },
  {
    id: "communicable",
    title: "Communicable Diseases",
    icon: "D",
    blurb: "Infections and how to prevent them",
    lessons: [
      {
        id: "comm-dis-1",
        title: "Malaria: Prevention and Recognition",
        minutes: 4,
        paragraphs: [
          "Malaria is caused by Plasmodium parasites and spread by the bite of infected female Anopheles mosquitoes. Nigeria is one of the countries with the highest malaria burden in the world.",
          "Common symptoms include fever, chills, headache, body aches and vomiting. Severe malaria can cause confusion, convulsions, severe anaemia and breathing difficulty, and needs urgent hospital care.",
          "WHO recommends confirming malaria with a diagnostic test, such as a rapid diagnostic test or microscopy, before treatment. Artemisinin-based combination therapies are the recommended treatment for uncomplicated falciparum malaria.",
          "Prevention includes insecticide-treated nets, indoor residual spraying, removing mosquito breeding sites, and preventive treatment for pregnant women. WHO also recommends malaria vaccines for children in areas of moderate to high transmission."
        ],
        points: [
          "Malaria is spread by infected female Anopheles mosquitoes.",
          "Test before treating whenever testing is available.",
          "Severe malaria is an emergency.",
          "Nets, vector control, preventive treatment in pregnancy and vaccines all help prevent malaria."
        ],
        source: "WHO malaria fact sheet and guidelines for malaria. Treatment decisions belong to trained health workers following national guidelines."
      }
    ]
  },
  {
    id: "public",
    title: "Public Health",
    icon: "H",
    blurb: "Protecting and improving the health of populations",
    lessons: [
      {
        id: "pub-1",
        title: "Levels of Prevention",
        minutes: 3,
        paragraphs: [
          "Public health tries to prevent disease before it happens. Prevention is often described in three levels.",
          "Primary prevention stops disease from starting, for example through immunisation, safe water, health education and using insecticide-treated nets. Secondary prevention finds disease early, for example through screening, so treatment can begin sooner. Tertiary prevention reduces complications and disability in people who already have a disease, for example through rehabilitation.",
          "Two terms are used often in epidemiology. Incidence is the number of new cases in a population over a period of time. Prevalence is the number of existing cases, both new and old, in a population at a point or period of time."
        ],
        points: [
          "Primary: prevent the disease from starting.",
          "Secondary: detect and treat early.",
          "Tertiary: limit complications and disability.",
          "Incidence counts new cases; prevalence counts all existing cases."
        ],
        source: "Standard public health and epidemiology texts, e.g. Park's Textbook of Preventive and Social Medicine; Gordis, Epidemiology."
      }
    ]
  },
  {
    id: "nutrition",
    title: "Nutrition",
    icon: "N",
    blurb: "Food, nutrients and malnutrition",
    lessons: [
      {
        id: "nut-1",
        title: "Nutrients and Malnutrition",
        minutes: 4,
        paragraphs: [
          "The body needs macronutrients (carbohydrates, proteins and fats) in large amounts and micronutrients (vitamins and minerals) in small amounts. Carbohydrates and proteins give about 4 kilocalories per gram, and fats give about 9 kilocalories per gram.",
          "Malnutrition includes undernutrition (wasting, stunting and underweight), micronutrient deficiencies, and overweight or obesity. Examples of deficiencies are iron deficiency causing anaemia, vitamin A deficiency causing night blindness, and iodine deficiency causing goitre.",
          "Mid-upper arm circumference (MUAC) is a simple tool used to screen children aged 6 to 59 months for acute malnutrition. According to WHO, a MUAC below 115 mm indicates severe acute malnutrition. Children identified this way should be referred for assessment and treatment."
        ],
        points: [
          "Macronutrients: carbohydrates, proteins and fats. Micronutrients: vitamins and minerals.",
          "Fat gives more energy per gram than carbohydrate or protein.",
          "Wasting is low weight for height; stunting is low height for age.",
          "MUAC below 115 mm in a child aged 6 to 59 months indicates severe acute malnutrition."
        ],
        source: "WHO guidance on malnutrition and on the management of severe acute malnutrition."
      }
    ]
  },
  {
    id: "firstaid",
    title: "First Aid",
    icon: "F",
    blurb: "Simple actions that can save lives",
    lessons: [
      {
        id: "fa-1",
        title: "Severe Bleeding and the Recovery Position",
        minutes: 3,
        paragraphs: [
          "In any emergency, first make sure the area is safe for you and the casualty, then call for emergency help or ask someone else to do so.",
          "For severe bleeding from a wound, apply firm, direct pressure with a clean cloth or dressing. If blood soaks through, do not remove the cloth. Add more on top and keep pressing until help arrives.",
          "A person who is unresponsive but breathing normally can be placed in the recovery position, which helps keep the airway open and lets fluid drain from the mouth. Keep checking their breathing. If they are not breathing normally, call for help and begin CPR if you are trained."
        ],
        points: [
          "Safety first: protect yourself, then call for help.",
          "Direct pressure is the first step for severe external bleeding.",
          "Do not remove a blood-soaked dressing; add another on top.",
          "Unresponsive and breathing normally: recovery position and keep checking."
        ],
        source: "International first aid guidelines (International Federation of Red Cross and Red Crescent Societies). Real first aid skills should be learned through accredited, hands-on training."
      }
    ]
  },
  {
    id: "psychology",
    title: "Psychology",
    icon: "Y",
    blurb: "Mind, behaviour and mental well-being",
    lessons: [
      {
        id: "psy-1",
        title: "Stress, Coping and Helping Others",
        minutes: 3,
        paragraphs: [
          "The WHO describes mental health as more than the absence of mental disorder. It is a state of well-being in which a person can realise their abilities, cope with the normal stresses of life, work productively and contribute to their community.",
          "Stress is a normal response to demands. Helpful coping includes talking to trusted people, regular sleep, physical activity and problem-solving. Persistent low mood, loss of interest lasting two weeks or more, or thoughts of harming oneself are signs that professional help is needed.",
          "WHO's psychological first aid uses three actions: Look (check for safety and for people with urgent needs), Listen (let the person talk without pressure) and Link (connect them with information, services and social support)."
        ],
        points: [
          "Mental health is a state of well-being, not only the absence of illness.",
          "Stress is normal, but long-lasting symptoms should be assessed by a professional.",
          "Listening without judging is a core helping skill.",
          "Look, Listen, Link: the three actions of psychological first aid."
        ],
        source: "WHO, Psychological First Aid: Guide for Field Workers (2011); WHO mental health fact sheets."
      }
    ]
  }
];