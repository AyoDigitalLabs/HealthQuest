// HealthQuest - sim-data.js
// All patient cases live here (fictional patients, for education only).
// "type" is "clinic" or "emergency" (emergency cases are timed).
// In each step, "answer" is the position of the correct option, counting from 0.

var SIM_SCENARIOS = [

  // ================= CLINIC CASES =================
  {
    id: "sc-fever-child",
    type: "clinic",
    title: "Fever in a Young Child",
    difficulty: "easy",
    patient: { name: "Tunde", age: "4 years", sex: "Male", setting: "Primary health centre, Nigeria" },
    complaint: "His mother says he has had a fever for 3 days.",
    history: "He has had chills and vomited once today. He is still drinking and playing a little. There is no cough and no diarrhoea. The family does not use a mosquito net.",
    symptoms: ["Fever for 3 days", "Chills", "One episode of vomiting", "Reduced appetite"],
    vitals: [
      { label: "Temperature", value: "38.9 \u00B0C" },
      { label: "Pulse", value: "122 /min" },
      { label: "Breathing", value: "26 /min" },
      { label: "Alertness", value: "Alert" }
    ],
    steps: [
      {
        prompt: "What is the most appropriate first step?",
        options: [
          "Check for danger signs and do a malaria rapid diagnostic test",
          "Start antibiotics straight away without examining him",
          "Reassure his mother and send him home without assessment",
          "Admit him for intravenous fluids"
        ],
        answer: 0,
        explanation: "A feverish child in a malaria area needs a quick check for danger signs (such as convulsions, inability to drink, repeated vomiting, or being drowsy or unconscious) and a diagnostic test. WHO recommends confirming malaria with a test before treatment. He is alert and drinking, so admission for intravenous fluids is not the first step.",
        newInfo: "Result: no danger signs were found, and the malaria rapid diagnostic test is positive."
      },
      {
        prompt: "What is the most likely diagnosis?",
        options: [
          "Uncomplicated malaria",
          "Severe malaria",
          "Measles",
          "Bacterial meningitis"
        ],
        answer: 0,
        explanation: "He is alert, drinking and has no danger signs, so this is uncomplicated malaria. Severe malaria involves danger signs such as convulsions, prostration or impaired consciousness. Measles needs a rash with cough, runny nose or red eyes. Meningitis would usually show a stiff neck or altered consciousness."
      },
      {
        prompt: "What is the best next step in management?",
        options: [
          "Give an artemisinin-based combination therapy (ACT) according to national guidelines, and teach his mother the danger signs to return for",
          "Admit him and give intravenous artesunate, the treatment for severe malaria",
          "Give an antibiotic only",
          "Give chloroquine alone"
        ],
        answer: 0,
        explanation: "WHO recommends an ACT for uncomplicated falciparum malaria, with the dose chosen by a trained health worker following national guidelines. Intravenous artesunate is for severe malaria. Antibiotics do not treat malaria. His mother should know to return at once if he has convulsions, cannot drink, vomits repeatedly or becomes drowsy, and should be encouraged to use an insecticide-treated net."
      }
    ],
    summary: [
      "Check for danger signs and confirm malaria with a test before treating.",
      "Uncomplicated malaria is treated with an ACT following national guidelines.",
      "Teach caregivers the danger signs that need an urgent return, and the importance of insecticide-treated nets."
    ],
    source: "WHO guidelines for malaria; WHO/UNICEF Integrated Management of Childhood Illness (IMCI)."
  },

  {
    id: "sc-preeclampsia",
    type: "clinic",
    title: "Headache in Late Pregnancy",
    difficulty: "medium",
    patient: { name: "Amina", age: "28 years", sex: "Female", setting: "Primary health centre, Nigeria" },
    complaint: "She has had a severe headache for 2 days.",
    history: "She is 34 weeks pregnant with her first baby. Rest does not relieve the headache, and she sees blurred spots. She has noticed swelling of her face and hands.",
    symptoms: ["Severe headache", "Blurred vision", "Swollen face and hands", "Pain in the upper abdomen"],
    vitals: [
      { label: "Blood pressure", value: "165/112 mmHg" },
      { label: "Pulse", value: "96 /min" },
      { label: "Temperature", value: "36.8 \u00B0C" },
      { label: "Urine protein", value: "2+ (dipstick)" }
    ],
    steps: [
      {
        prompt: "What is the most likely diagnosis?",
        options: [
          "Severe pre-eclampsia",
          "Gestational diabetes",
          "Iron-deficiency anaemia",
          "Normal discomfort of late pregnancy"
        ],
        answer: 0,
        explanation: "A very high blood pressure (160 systolic or 110 diastolic, or above), protein in the urine, severe headache, visual disturbance and upper abdominal pain together point to severe pre-eclampsia. These are not normal discomforts of pregnancy."
      },
      {
        prompt: "What should the health worker do now?",
        options: [
          "Treat it as an emergency: keep her calm and under observation, and arrange urgent transfer to a hospital that can manage severe pre-eclampsia",
          "Reassure her and ask her to return at the next routine visit",
          "Give paracetamol and send her home to rest",
          "Wait a few hours to see whether the headache settles"
        ],
        answer: 0,
        explanation: "Severe pre-eclampsia can lead to seizures, stroke and death for the mother and baby. She needs urgent referral to a facility that can give the right treatment and, if needed, deliver the baby. Sending her home or waiting is dangerous.",
        newInfo: "While waiting for transport, she has a generalised seizure."
      },
      {
        prompt: "What is this seizure called, and which drug does WHO recommend to treat and prevent such seizures?",
        options: [
          "Eclampsia; magnesium sulfate",
          "Eclampsia; diazepam as the first choice",
          "Febrile convulsion; paracetamol",
          "Low blood sugar; no treatment is needed"
        ],
        answer: 0,
        explanation: "Seizures in a woman with pre-eclampsia are called eclampsia. WHO recommends magnesium sulfate as the preferred drug, given by trained staff following protocol. While waiting, protect her from injury, keep her airway clear and lay her on her left side."
      }
    ],
    summary: [
      "Severe headache with visual disturbance and high blood pressure in pregnancy is an emergency.",
      "Severe pre-eclampsia needs urgent referral, not reassurance.",
      "Eclampsia is treated with magnesium sulfate by trained staff, and the mother is protected from injury meanwhile."
    ],
    source: "WHO recommendations for the prevention and treatment of pre-eclampsia and eclampsia."
  },

  {
    id: "sc-diarrhoea",
    type: "clinic",
    title: "Diarrhoea in a Toddler",
    difficulty: "medium",
    patient: { name: "Chidi", age: "2 years", sex: "Male", setting: "Primary health centre, Nigeria" },
    complaint: "His mother says he has had watery diarrhoea for 2 days.",
    history: "He passes several watery stools a day and vomited once. He is still breastfed and takes a little food. He is very thirsty and drinks eagerly when offered a cup.",
    symptoms: ["Watery diarrhoea for 2 days", "One episode of vomiting", "Very thirsty", "Restless and irritable"],
    vitals: [
      { label: "Temperature", value: "37.6 \u00B0C" },
      { label: "Pulse", value: "124 /min" },
      { label: "Eyes", value: "Sunken" },
      { label: "Skin pinch", value: "Goes back slowly" }
    ],
    steps: [
      {
        prompt: "How would you classify his hydration status?",
        options: [
          "Some dehydration",
          "No dehydration",
          "Severe dehydration",
          "Overhydration"
        ],
        answer: 0,
        explanation: "In the IMCI approach, two or more of these signs mean some dehydration: restless or irritable, sunken eyes, drinks eagerly or is thirsty, and a skin pinch that goes back slowly. Chidi has all four. Severe dehydration would include being lethargic or unconscious, or not able to drink."
      },
      {
        prompt: "What is the best treatment?",
        options: [
          "Give oral rehydration solution (ORS) under supervision, keep breastfeeding and feeding him, and give zinc",
          "Stop all food and fluids for 24 hours",
          "Start intravenous fluids straight away for every child with diarrhoea",
          "Give an antibiotic to stop the diarrhoea"
        ],
        answer: 0,
        explanation: "Children with some dehydration who can drink are given ORS in the clinic, and feeding continues. WHO also recommends zinc supplements, which shorten diarrhoea and reduce its severity. Intravenous fluids are kept for severe dehydration or when a child cannot drink. Antibiotics are not routinely needed, except for conditions such as bloody diarrhoea or suspected cholera."
      },
      {
        prompt: "What should his mother be taught before going home?",
        options: [
          "Continue fluids and feeding, how to prepare and give ORS, wash hands with soap, and return at once if he cannot drink, becomes sicker, develops a fever or has blood in the stool",
          "Give less fluid so the diarrhoea stops",
          "Give only plain water and no ORS or food",
          "No advice is needed once he improves"
        ],
        answer: 0,
        explanation: "Caregiver teaching is part of treatment. Continuing fluids and feeding protects against dehydration and malnutrition, handwashing with soap helps stop the spread of infection, and knowing the warning signs allows an early return."
      }
    ],
    summary: [
      "Assess dehydration using simple clinical signs.",
      "ORS, continued feeding and zinc are the core of treating diarrhoea in children.",
      "Teaching the caregiver about warning signs and handwashing is part of the treatment."
    ],
    source: "WHO/UNICEF IMCI guidelines; WHO guidance on the treatment of diarrhoea in children."
  },

  // ================= EMERGENCY ROOM CASES (timed) =================
  {
    id: "sc-bleeding",
    type: "emergency",
    title: "Heavy Bleeding After an Accident",
    difficulty: "medium",
    patient: { name: "Emeka", age: "30 years", sex: "Male", setting: "Roadside after a motorcycle accident" },
    complaint: "A deep wound on his left thigh is bleeding heavily.",
    history: "You are the first person at the scene. He is awake but frightened, and blood is flowing steadily from the wound.",
    symptoms: ["Deep wound on the left thigh", "Heavy bleeding", "Feels dizzy and thirsty"],
    vitals: [
      { label: "Pulse", value: "130 /min, weak" },
      { label: "Breathing", value: "24 /min" },
      { label: "Skin", value: "Pale and cold" },
      { label: "Awareness", value: "Awake" }
    ],
    steps: [
      {
        prompt: "What do you do first?",
        options: [
          "Check that the scene is safe (traffic, fuel, other dangers) and call or send someone for emergency help",
          "Move him straight into a car without checking anything",
          "Wash the wound with water first",
          "Give him water to drink"
        ],
        answer: 0,
        explanation: "Always check for danger first, because you cannot help anyone if you become a casualty too. Calling for help early matters. Moving someone unnecessarily can worsen injuries, and people with serious injuries should not be given food or drink because they may need surgery."
      },
      {
        prompt: "How do you control the bleeding?",
        options: [
          "Press firmly and directly on the wound with a clean cloth",
          "Remove his clothing and leave the wound uncovered",
          "Pour alcohol on the wound",
          "Wait to see whether the bleeding stops by itself"
        ],
        answer: 0,
        explanation: "Firm, direct pressure with a clean cloth is the first-line way to control severe external bleeding. If life-threatening bleeding from a limb cannot be controlled this way, trained responders may use a tourniquet, which is taught in accredited first aid courses.",
        newInfo: "The cloth is soaking through with blood."
      },
      {
        prompt: "Blood is soaking through the cloth. What now?",
        options: [
          "Leave the first cloth in place, add more cloths on top and keep pressing firmly",
          "Remove the soaked cloth and start again with a clean one",
          "Stop pressing to check whether the bleeding has stopped",
          "Loosen the pressure so blood can circulate"
        ],
        answer: 0,
        explanation: "Removing the dressing can disturb the clot that is forming and make the bleeding worse. Add more material on top and maintain pressure until help arrives.",
        newInfo: "The bleeding is slowing. He is now pale, cold and sweaty, with a fast, weak pulse."
      },
      {
        prompt: "What do these signs suggest, and what should you do?",
        options: [
          "Shock from blood loss: lay him down, keep him warm and get him to hospital urgently",
          "Only fear: let him sit up and walk around",
          "Hunger: give him food",
          "Heat exhaustion: cool him with water"
        ],
        answer: 0,
        explanation: "A pale, cold, sweaty casualty with a fast, weak pulse after major bleeding is showing signs of shock. Lay him down, keep him warm, continue to control bleeding, give nothing to eat or drink and make sure emergency transport is on its way."
      }
    ],
    summary: [
      "Scene safety and calling for help come first.",
      "Firm direct pressure controls most severe bleeding. Do not remove soaked dressings.",
      "Recognise shock: pale, cold, sweaty skin and a fast, weak pulse need urgent transport."
    ],
    source: "International first aid guidelines (International Federation of Red Cross and Red Crescent Societies). Learn real first aid through accredited, hands-on training."
  },

  {
    id: "sc-cpr",
    type: "emergency",
    title: "Collapse in the Market",
    difficulty: "hard",
    patient: { name: "Mr. Bello", age: "58 years", sex: "Male", setting: "A busy market" },
    complaint: "He suddenly collapsed in front of you.",
    history: "Bystanders are crowding around. He does not answer when you shout or tap his shoulders.",
    symptoms: ["Sudden collapse", "Not responding", "Skin looks grey"],
    vitals: [
      { label: "Response", value: "None" },
      { label: "Scene", value: "Safe" }
    ],
    steps: [
      {
        prompt: "He is unresponsive. What is your first priority?",
        options: [
          "Shout for help, send someone to call emergency services and fetch a defibrillator if one is available, and check his breathing",
          "Give him water",
          "Lift his arms above his head",
          "Leave to look for a doctor yourself"
        ],
        answer: 0,
        explanation: "Get help early: send someone to call emergency services and bring an automated external defibrillator (AED) if available, while you check breathing. Do not leave the casualty.",
        newInfo: "He is not breathing normally. You see only occasional gasps."
      },
      {
        prompt: "What do you do now?",
        options: [
          "Start chest compressions immediately",
          "Wait to see whether he starts breathing normally",
          "Give two rescue breaths first and no compressions",
          "Give him a drink"
        ],
        answer: 0,
        explanation: "Occasional gasps (agonal breathing) are not normal breathing and are often seen in the first minutes of cardiac arrest. An unresponsive person who is not breathing normally needs CPR straight away."
      },
      {
        prompt: "Where and how do you give compressions?",
        options: [
          "Centre of the chest, about 5 to 6 cm deep, at 100 to 120 per minute, letting the chest recoil fully",
          "Upper abdomen, about 60 per minute",
          "Side of the ribs, very gently",
          "Centre of the chest, but only about 1 cm deep"
        ],
        answer: 0,
        explanation: "Current resuscitation guidelines advise pressing on the centre of the chest about 5 to 6 cm deep at 100 to 120 compressions per minute, allowing full recoil. Rescuers without training can give compressions only. Trained rescuers give 30 compressions followed by 2 breaths.",
        newInfo: "Someone arrives with an automated external defibrillator (AED)."
      },
      {
        prompt: "What do you do with the AED?",
        options: [
          "Switch it on, attach the pads as shown in the pictures and follow its voice instructions",
          "Ignore it and keep compressing until the ambulance arrives",
          "Use it only after he has been revived",
          "Wait for a doctor to approve it first"
        ],
        answer: 0,
        explanation: "AEDs are designed for use by the public. Switch it on, place the pads as shown and follow the spoken prompts. It analyses the heart rhythm and will only advise a shock when one is needed. Early defibrillation greatly improves survival."
      }
    ],
    summary: [
      "Unresponsive and not breathing normally means start CPR and get help.",
      "Occasional gasps are not normal breathing.",
      "Early compressions and early use of an AED give the best chance of survival."
    ],
    source: "European Resuscitation Council and American Heart Association guidelines. Learn CPR through accredited, hands-on training."
  }
];