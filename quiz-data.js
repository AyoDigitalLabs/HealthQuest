// HealthQuest - quiz-data.js
// All quiz questions live here.
// "topic" must match a topic id from academy-data.js.
// "answer" is the position of the correct option, counting from 0.
// To add a question later, copy a block and change the text.

var QUIZ_QUESTIONS = [

  // ---------- ANATOMY AND PHYSIOLOGY ----------
  {
    id: "q-anat-1", topic: "anatomy", difficulty: "easy", type: "mcq",
    q: "Which chamber of the heart pumps oxygen-rich blood out to the body through the aorta?",
    options: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"],
    answer: 3,
    explanation: "The left ventricle pumps oxygen-rich blood into the aorta, which carries it to the whole body."
  },
  {
    id: "q-anat-2", topic: "anatomy", difficulty: "medium", type: "tf",
    q: "The pulmonary veins carry oxygen-rich blood from the lungs to the heart.",
    options: ["True", "False"],
    answer: 0,
    explanation: "True. The pulmonary veins are an exception to the rule that veins carry oxygen-poor blood. They bring oxygenated blood from the lungs to the left atrium."
  },
  {
    id: "q-anat-3", topic: "anatomy", difficulty: "hard", type: "mcq",
    q: "Which valve lies between the left atrium and the left ventricle?",
    options: ["Tricuspid valve", "Mitral valve", "Pulmonary valve", "Aortic valve"],
    answer: 1,
    explanation: "The mitral (bicuspid) valve separates the left atrium from the left ventricle. The tricuspid valve is on the right side."
  },

  // ---------- COMMUNITY AND PRIMARY HEALTHCARE ----------
  {
    id: "q-comm-1", topic: "community", difficulty: "easy", type: "mcq",
    q: "The 1978 Declaration of Alma-Ata is most closely linked to which goal?",
    options: ["Health for All through primary health care", "Eradicating smallpox", "Building more specialist hospitals", "Banning tobacco advertising"],
    answer: 0,
    explanation: "The Declaration of Alma-Ata made primary health care the key to achieving 'Health for All'."
  },
  {
    id: "q-comm-2", topic: "community", difficulty: "medium", type: "tf",
    q: "In the three-level health system, health centres and clinics are usually classified as the secondary level of care.",
    options: ["True", "False"],
    answer: 1,
    explanation: "False. Health centres and clinics are usually the primary level. Secondary care is usually provided by general hospitals, and tertiary care by specialist and teaching hospitals."
  },
  {
    id: "q-comm-3", topic: "community", difficulty: "hard", type: "mcq",
    q: "Which principle of primary health care means involving community members in planning and running their own health services?",
    options: ["Equity", "Community participation", "Appropriate technology", "Intersectoral collaboration"],
    answer: 1,
    explanation: "Community participation means people take part in decisions about their own health services. The other options are also PHC principles, but they describe different ideas."
  },

  // ---------- MATERNAL AND CHILD HEALTH ----------
  {
    id: "q-mat-1", topic: "maternal", difficulty: "easy", type: "mcq",
    q: "According to WHO's 2016 recommendations, what is the minimum number of antenatal care contacts for a positive pregnancy experience?",
    options: ["2", "4", "6", "8"],
    answer: 3,
    explanation: "WHO now recommends a minimum of eight contacts with a health worker during pregnancy, replacing the older four-visit model."
  },
  {
    id: "q-mat-2", topic: "maternal", difficulty: "medium", type: "mcq",
    q: "Which supplements does WHO recommend daily in pregnancy to help prevent maternal anaemia?",
    options: ["Iron and folic acid", "Vitamin K", "Vitamin E", "Zinc only"],
    answer: 0,
    explanation: "Daily oral iron and folic acid supplementation is recommended in pregnancy to help prevent anaemia."
  },
  {
    id: "q-mat-3", topic: "maternal", difficulty: "hard", type: "mcq",
    q: "A pregnant woman has a severe headache with blurred vision. Which condition should the health worker be most concerned about?",
    options: ["Pre-eclampsia", "Normal morning sickness", "Mild constipation", "A common cold"],
    answer: 0,
    explanation: "Severe headache with visual disturbance in pregnancy can be a sign of pre-eclampsia. She needs urgent assessment, including blood pressure measurement."
  },

  // ---------- PHARMACOLOGY ----------
  {
    id: "q-pharm-1", topic: "pharma", difficulty: "easy", type: "mcq",
    q: "In the pharmacokinetics memory aid ADME, what does the 'A' stand for?",
    options: ["Absorption", "Administration", "Allergy", "Activation"],
    answer: 0,
    explanation: "ADME stands for absorption, distribution, metabolism and excretion."
  },
  {
    id: "q-pharm-2", topic: "pharma", difficulty: "medium", type: "tf",
    q: "A drug given intravenously has 100% bioavailability.",
    options: ["True", "False"],
    answer: 0,
    explanation: "True. IV drugs go directly into the bloodstream, so the whole dose reaches the circulation."
  },
  {
    id: "q-pharm-3", topic: "pharma", difficulty: "hard", type: "mcq",
    q: "A drug's half-life is best described as the time taken for...",
    options: ["its blood concentration to fall by half", "the drug to start working", "the drug to be fully absorbed", "half of the dose to be swallowed"],
    answer: 0,
    explanation: "Half-life is the time it takes for the concentration of a drug in the blood to fall by half."
  },

  // ---------- COMMUNICABLE DISEASES ----------
  {
    id: "q-dis-1", topic: "communicable", difficulty: "easy", type: "mcq",
    q: "Which type of mosquito spreads malaria to humans?",
    options: ["Anopheles", "Aedes", "Culex", "Mansonia"],
    answer: 0,
    explanation: "Malaria parasites are spread by the bite of infected female Anopheles mosquitoes."
  },
  {
    id: "q-dis-2", topic: "communicable", difficulty: "medium", type: "tf",
    q: "WHO recommends confirming a malaria diagnosis with a test before treatment, wherever testing is available.",
    options: ["True", "False"],
    answer: 0,
    explanation: "True. A rapid diagnostic test or microscopy should confirm malaria before treatment, because other illnesses can cause fever too."
  },
  {
    id: "q-dis-3", topic: "communicable", difficulty: "hard", type: "mcq",
    q: "Which treatment does WHO recommend for uncomplicated Plasmodium falciparum malaria?",
    options: ["Artemisinin-based combination therapy", "Chloroquine alone", "Amoxicillin", "Paracetamol alone"],
    answer: 0,
    explanation: "Artemisinin-based combination therapies (ACTs) are the recommended treatment. Paracetamol may ease fever but does not treat the parasite."
  },

  // ---------- PUBLIC HEALTH ----------
  {
    id: "q-pub-1", topic: "public", difficulty: "easy", type: "mcq",
    q: "Childhood immunisation is an example of which level of prevention?",
    options: ["Primary prevention", "Secondary prevention", "Tertiary prevention", "Curative care"],
    answer: 0,
    explanation: "Immunisation stops disease before it starts, which is primary prevention."
  },
  {
    id: "q-pub-2", topic: "public", difficulty: "medium", type: "tf",
    q: "Prevalence counts only the new cases of a disease that occur over a period of time.",
    options: ["True", "False"],
    answer: 1,
    explanation: "False. That describes incidence. Prevalence counts all existing cases, both new and old, at a point or period of time."
  },
  {
    id: "q-pub-3", topic: "public", difficulty: "hard", type: "mcq",
    q: "A community screening programme that finds hypertension early is an example of...",
    options: ["Primary prevention", "Secondary prevention", "Tertiary prevention", "Health promotion only"],
    answer: 1,
    explanation: "Screening detects disease early so treatment can begin sooner. That is secondary prevention."
  },

  // ---------- NUTRITION ----------
  {
    id: "q-nut-1", topic: "nutrition", difficulty: "easy", type: "mcq",
    q: "Which macronutrient provides the most energy per gram?",
    options: ["Carbohydrate", "Protein", "Fat", "Water"],
    answer: 2,
    explanation: "Fat provides about 9 kilocalories per gram. Carbohydrate and protein provide about 4 each, and water provides none."
  },
  {
    id: "q-nut-2", topic: "nutrition", difficulty: "medium", type: "tf",
    q: "Vitamin A deficiency can cause night blindness.",
    options: ["True", "False"],
    answer: 0,
    explanation: "True. Vitamin A is needed for vision, and deficiency is a leading cause of preventable childhood blindness."
  },
  {
    id: "q-nut-3", topic: "nutrition", difficulty: "hard", type: "mcq",
    q: "In a child aged 6 to 59 months, which mid-upper arm circumference (MUAC) reading indicates severe acute malnutrition?",
    options: ["Below 115 mm", "Between 115 and 125 mm", "Above 125 mm", "Above 135 mm"],
    answer: 0,
    explanation: "A MUAC below 115 mm indicates severe acute malnutrition. A reading from 115 mm to below 125 mm indicates moderate acute malnutrition."
  },

  // ---------- FIRST AID ----------
  {
    id: "q-fa-1", topic: "firstaid", difficulty: "easy", type: "mcq",
    q: "What should you do first when you arrive at an emergency scene?",
    options: ["Check that the area is safe", "Move the casualty straight away", "Give the casualty water", "Start CPR on everyone"],
    answer: 0,
    explanation: "Check for danger first. If you become a casualty too, you cannot help anyone."
  },
  {
    id: "q-fa-2", topic: "firstaid", difficulty: "medium", type: "tf",
    q: "If blood soaks through a dressing on a severe wound, you should remove it and apply a fresh one.",
    options: ["True", "False"],
    answer: 1,
    explanation: "False. Removing the dressing can disturb the clot and increase bleeding. Add more dressings on top and keep pressing."
  },
  {
    id: "q-fa-3", topic: "firstaid", difficulty: "hard", type: "mcq",
    q: "A person is unresponsive but breathing normally. Which action is most appropriate while waiting for help?",
    options: ["Place them in the recovery position and keep checking their breathing", "Give them food and water", "Sit them upright and leave them", "Start chest compressions"],
    answer: 0,
    explanation: "The recovery position helps keep the airway open. Keep checking breathing, and start CPR only if they stop breathing normally and you are trained."
  },

  // ---------- PSYCHOLOGY ----------
  {
    id: "q-psy-1", topic: "psychology", difficulty: "easy", type: "mcq",
    q: "In WHO's psychological first aid, what are the three action principles?",
    options: ["Look, Listen, Link", "Learn, Laugh, Leave", "Lead, Locate, Label", "Live, Love, Learn"],
    answer: 0,
    explanation: "Look (check safety and urgent needs), Listen (without pressure) and Link (to information, services and support)."
  },
  {
    id: "q-psy-2", topic: "psychology", difficulty: "medium", type: "tf",
    q: "Good mental health simply means having no mental disorder.",
    options: ["True", "False"],
    answer: 1,
    explanation: "False. WHO describes mental health as a state of well-being in which a person can cope with normal stresses, work productively and contribute to their community."
  },
  {
    id: "q-psy-3", topic: "psychology", difficulty: "hard", type: "mcq",
    q: "Which of these is a sign that a person should seek professional mental health help?",
    options: ["Low mood and loss of interest lasting two weeks or more", "Feeling nervous before an exam", "Being tired after a long day", "Feeling sad for one afternoon"],
    answer: 0,
    explanation: "Low mood and loss of interest lasting two weeks or more can be signs of depression and should be assessed by a professional. Brief nervousness or tiredness is a normal part of life."
  }
];