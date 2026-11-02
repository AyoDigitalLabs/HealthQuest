// HealthQuest - anatomy-data.js
// Diagrams are drawn with SVG shapes. Simplified schematics, not to scale.
// Each part has: id, name, system, where, job (no name inside the job text!), shapes.
// To add a part later, copy a block and change the text and shape.

var ANATOMY = [

  // ================= DIAGRAM 1: BODY ORGANS =================
  {
    id: "organs",
    title: "Body organs",
    note: "Front view of the trunk. The patient's right side is on your left. Simplified diagram, not to scale.",
    viewBox: "0 0 300 440",
    outline: "M80 28 Q150 8 220 28 Q248 40 252 90 L248 180 Q246 250 236 290 Q248 360 226 424 L74 424 Q52 360 64 290 Q54 250 52 180 L48 90 Q52 40 80 28 Z",
    parts: [
      {
        id: "kidneys", name: "Kidneys", system: "Urinary system",
        where: "They lie at the back of the abdomen, one on each side of the spine, behind the other abdominal organs.",
        job: "Filter the blood, remove waste and extra water as urine, and help balance the body's salts.",
        shapes: [
          { t: "ellipse", cx: 100, cy: 262, rx: 13, ry: 24 },
          { t: "ellipse", cx: 200, cy: 252, rx: 13, ry: 24 }
        ]
      },
      {
        id: "liver", name: "Liver", system: "Digestive system (accessory organ)",
        where: "It sits in the upper right of the abdomen, just below the diaphragm, and is the largest internal organ.",
        job: "Makes bile, processes nutrients absorbed from the gut, breaks down many drugs and toxins, and stores energy as glycogen.",
        shapes: [
          { t: "path", d: "M68 196 Q56 222 74 250 Q104 272 152 256 L178 222 Q140 204 108 198 Q86 190 68 196 Z" }
        ]
      },
      {
        id: "stomach", name: "Stomach", system: "Digestive system",
        where: "It lies in the upper left of the abdomen, below the diaphragm.",
        job: "A muscular bag that stores food, mixes it with acid and enzymes, and begins the digestion of protein.",
        shapes: [
          { t: "path", d: "M184 198 Q214 190 228 220 Q236 256 208 268 Q178 268 174 240 Q172 214 184 198 Z" }
        ]
      },
      {
        id: "large-intestine", name: "Large intestine", system: "Digestive system",
        where: "It forms a frame around the small intestine in the abdomen.",
        job: "Absorbs water from digestive waste and forms faeces.",
        shapes: [
          { t: "path", d: "M88 285 H212 V368 H190 V305 H110 V368 H88 Z" }
        ]
      },
      {
        id: "small-intestine", name: "Small intestine", system: "Digestive system",
        where: "It is a long, coiled tube in the centre of the abdomen, inside the frame of the large intestine.",
        job: "Where most digestion is completed and most nutrients are absorbed into the blood.",
        shapes: [
          { t: "rect", x: 114, y: 308, w: 72, h: 58, r: 14 },
          { t: "path", d: "M122 322 Q150 312 178 322", deco: true },
          { t: "path", d: "M122 336 Q150 326 178 336", deco: true },
          { t: "path", d: "M122 350 Q150 340 178 350", deco: true }
        ]
      },
      {
        id: "bladder", name: "Urinary bladder", system: "Urinary system",
        where: "It lies in the pelvis, behind the pubic bones.",
        job: "Stores urine until it is passed out of the body.",
        shapes: [
          { t: "ellipse", cx: 150, cy: 396, rx: 20, ry: 17 }
        ]
      },
      {
        id: "lungs", name: "Lungs", system: "Respiratory system",
        where: "They fill most of the chest on either side of the heart and are protected by the ribs. The right lung has three lobes and the left has two.",
        job: "Exchange oxygen and carbon dioxide between the air we breathe and the blood.",
        shapes: [
          { t: "path", d: "M84 52 Q58 76 64 152 Q70 186 112 186 L132 176 Q138 100 126 62 Q106 42 84 52 Z" },
          { t: "path", d: "M216 52 Q242 76 236 152 Q230 186 188 186 L168 176 Q162 100 174 62 Q194 42 216 52 Z" }
        ]
      },
      {
        id: "heart", name: "Heart", system: "Circulatory system",
        where: "It lies in the chest between the two lungs, tilted slightly to the left.",
        job: "A muscular pump that keeps blood moving around the body.",
        shapes: [
          { t: "path", d: "M146 112 C132 100 116 114 124 136 C130 158 160 172 176 190 C190 170 192 146 184 126 C178 106 158 100 146 112 Z" }
        ]
      }
    ]
  },

  // ================= DIAGRAM 2: HEART CHAMBERS =================
  {
    id: "heart",
    title: "Heart chambers",
    note: "Simplified four-chamber diagram. The patient's right side is on your left. Not to scale.",
    viewBox: "0 0 300 320",
    outline: "M44 88 H256 V262 Q256 296 150 304 Q44 296 44 262 Z",
    parts: [
      {
        id: "svc", name: "Superior vena cava", system: "Circulatory system",
        where: "It enters the top of the right atrium.",
        job: "A large vein that returns oxygen-poor blood from the upper body to the heart.",
        shapes: [{ t: "rect", x: 64, y: 24, w: 24, h: 72, r: 8 }]
      },
      {
        id: "pulmonary-artery", name: "Pulmonary artery", system: "Circulatory system",
        where: "It leaves the right ventricle and divides to supply each lung.",
        job: "Carries oxygen-poor blood from the heart to the lungs.",
        shapes: [{ t: "rect", x: 112, y: 24, w: 26, h: 72, r: 8 }]
      },
      {
        id: "aorta", name: "Aorta", system: "Circulatory system",
        where: "It leaves the left ventricle, arches over and runs down the body.",
        job: "The largest artery; carries oxygen-rich blood away from the heart to the rest of the body.",
        shapes: [{ t: "rect", x: 160, y: 24, w: 26, h: 72, r: 8 }]
      },
      {
        id: "ra", name: "Right atrium", system: "Circulatory system",
        where: "It is the upper right chamber (on your left in the diagram). The tricuspid valve lies between it and the right ventricle.",
        job: "Receives oxygen-poor blood returning from the body and passes it down to the ventricle below.",
        shapes: [{ t: "rect", x: 60, y: 96, w: 86, h: 66, r: 14 }]
      },
      {
        id: "la", name: "Left atrium", system: "Circulatory system",
        where: "It is the upper left chamber (on your right in the diagram). The mitral valve lies between it and the left ventricle.",
        job: "Receives oxygen-rich blood returning from the lungs through the pulmonary veins.",
        shapes: [{ t: "rect", x: 154, y: 96, w: 86, h: 66, r: 14 }]
      },
      {
        id: "rv", name: "Right ventricle", system: "Circulatory system",
        where: "It is the lower right chamber (on your left in the diagram).",
        job: "Pumps oxygen-poor blood out toward the lungs.",
        shapes: [{ t: "path", d: "M60 170 H146 V266 Q104 286 76 252 Q56 224 60 170 Z" }]
      },
      {
        id: "lv", name: "Left ventricle", system: "Circulatory system",
        where: "It is the lower left chamber (on your right in the diagram) and has the thickest muscular wall.",
        job: "Pumps oxygen-rich blood out to the whole body.",
        shapes: [{ t: "path", d: "M154 170 H240 Q252 232 222 266 Q186 288 154 266 Z" }]
      }
    ]
  }
];
