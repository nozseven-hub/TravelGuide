/* ===================== Home ===================== */
/* ===================== Config ===================== */
const CONFIG = {
  dayColors: [
    "#d9534f", // red
    "#0275d8", // blue
    "#5cb85c", // green
    "#f0ad4e", // orange
    "#613d7c", // purple
    "#e67e22", // extra orange
    "#16a085", // teal
    "#8e44ad", // violet
    "#c0392b", // dark red
    "#2c3e50"  // dark blue
  ],
  osmTagIcons: {
    amenity: "🏢",
    restaurant: "🍽️",
    cafe: "☕",
    bar: "🍷",
    pub: "🍺",
    fast_food: "🍔",
    hotel: "🏨",
    hostel: "�️",
    museum: "🖼️",
    church: "⛪",
    bank: "🏦",
    pharmacy: "💊",
    hospital: "🏥",
    supermarket: "🛒",
    marketplace: "🛍️",
    park: "🌳",
    attraction: "🗺️",
    shop: "🛍️",
    bus_station: "🚌",
    train_station: "🚆",
    airport: "✈️",
    home: "🏠",
    // Removed osmTagIcons from config
    // other: "❓"
  },
  labels: {
    allPlans: "All Plans",
    allDays: "All Days",
    allCategories: "All Categories",
    otherCategory: "Other"
  }
};
const HOME = { 
  lat: 45.77099, 
  lng: 4.83384, 
  name: "Home: 12 Rue Burdeau, 69001 Lyon", 
  //cat: "home" 
};

/* ===================== Helper ===================== */
function P(lat, lng, name, cat, opts = {}) {
  return Object.assign({ lat, lng, name, cat }, opts);
}

/* ====================== POIs ====================== */
const POI = {
  // --- Sights & areas ---
  vieuxLyon: P(45.7629,4.8270,"Vieux Lyon (Old Town)","attraction",{dur:"1.5–2h",notes:"Renaissance alleys & traboules"}),
  traboules: P(45.7613,4.8347,"Traboules (self-guided)","attraction",{dur:"45–60min",notes:"Historic covered passages"}),
  terreaux:  P(45.7678,4.8343,"Place des Terreaux & Hôtel de Ville","attraction",{dur:"20min",notes:"Bartholdi Fountain"}),
  opera:     P(45.7670,4.8356,"Opéra de Lyon (exterior)","attraction",{dur:"15–20min",website:"https://www.opera-lyon.com"}),
  bellecour: P(45.7570,4.8320,"Place Bellecour","attraction",{dur:"20min"}),
  rueRepub:  P(45.7610,4.8355,"Rue de la République stroll","attraction",{dur:"45min"}),
  merciere:  P(45.7628,4.8333,"Rue Mercière cafés","attraction",{dur:"30–45min"}),
  murCanuts: P(45.7792,4.8278,"Mur des Canuts (trompe-l’œil)","attraction",{dur:"20min"}),
  belvedere: P(45.7625,4.8228,"Fourvière belvedere (panorama)","attraction",{dur:"15–20min"}),
  confluenceWalk: P(45.7336,4.8207,"Confluence waterfront walk","attraction",{dur:"45–60min"}),
  saoneQuays: P(45.7632,4.8279,"Saône riverside walk","attraction",{dur:"30–45min"}),
  teteDor:   P(45.7772,4.8520,"Parc de la Tête d’Or (lake & gardens)","attraction",{dur:"1.5–2h",website:"https://www.lyon.fr/lieu/parc-de-la-tete-dor"}),

  // --- Churches ---
  fourviere: P(45.7622,4.8229,"Basilica of Notre-Dame de Fourvière","church",{dur:"1–1.5h",notes:"Free entry; panoramic view",website:"https://fourviere.org"}),
  cathedral: P(45.7576,4.8241,"Cathédrale Saint-Jean-Baptiste","church",{dur:"30–45min"}),

  // --- Museums ---
  mba:       P(45.7673,4.8346,"Musée des Beaux-Arts de Lyon","museum",{dur:"2h",notes:"Book tickets online",website:"https://mba-lyon.fr",phone:"+33 4 72 10 17 40"}),
  gadagne:   P(45.7625,4.8272,"Musées Gadagne (History & Puppetry)","museum",{dur:"1.5–2h",website:"https://musees-gadagne.fr"}),
  tissus:    P(45.7559,4.8322,"Musée des Tissus","museum",{dur:"1.5–2h",website:"https://www.museedestissus.fr"}),
  confluences: P(45.7331,4.8196,"Musée des Confluences","museum",{dur:"2–2.5h",website:"https://www.museedesconfluences.fr"}),
  lugdunum:  P(45.7584,4.8188,"Lugdunum (Roman Theatres & Museum)","museum",{dur:"1.5–2h",website:"https://lugdunum.grandlyon.com"}),
  lumiere:   P(45.7458,4.8725,"Institut Lumière","museum",{dur:"1.5h",website:"https://www.institut-lumiere.org"}),

  // --- Markets ---
  halles:    P(45.7634,4.8597,"Les Halles de Lyon Paul Bocuse","marketplace",{dur:"1.5h",website:"https://halles-de-lyon-paulbocuse.com"}),
  croixMarket: P(45.7761,4.8272,"Croix-Rousse Market","marketplace",{dur:"1–1.5h"}),
  stAntoine: P(45.7606,4.8326,"Marché Saint-Antoine","marketplace",{dur:"1h"}),

  // --- Restaurants ---
  bouchonFilles: P(45.7692,4.8344,"Le Bouchon des Filles","restaurant",{dur:"1.5–2h dinner",website:"https://bouchondesfilles.fr"}),
  comptoirAbel:  P(45.7477,4.8269,"Café Comptoir Abel","restaurant",{dur:"1.5–2h dinner"}),
  poelonDor:     P(45.7515,4.8288,"Le Poêlon d’Or","restaurant",{dur:"1.5–2h dinner",website:"https://lepoelondor.fr"}),
  lesAdrets:     P(45.7616,4.8265,"Les Adrets","restaurant",{dur:"1.5–2h",website:"http://www.lesadrets-lyon.fr"}),
  bouchonTupin:  P(45.7621,4.8336,"Bouchon Tupin","restaurant"),
  brasserieGeorges: P(45.7482,4.8258,"Brasserie Georges","restaurant",{website:"https://brasseriegeorges.com"}),
  brasserieBrotteaux: P(45.7646,4.8597,"Brasserie des Brotteaux","restaurant",{website:"https://brasseriedesbrotteaux.com"}),
  prairial:      P(45.7673,4.8346,"Prairial (Michelin ★)","restaurant",{website:"https://prairial-restaurant.com"}),
  neuviemeArt:   P(45.7701,4.8502,"Le Neuvième Art (Michelin ★★)","restaurant",{website:"https://www.leneuviemeart.com"}),
  chezPaul:      P(45.7685,4.8363,"Chez Paul","restaurant"),
  pignol:        P(45.7644,4.8367,"Pignol (lunch/pastry)","restaurant",{website:"https://www.pignol.fr"}),

  // --- Wine / cavistes ---
  anticWine:     P(45.7626,4.8274,"Antic Wine","bar",{website:"https://anticwine.fr", notes:"Wine bar/caviste"}),
  caveACote:     P(45.7613,4.8347,"La Cave d’à Côté","bar",{notes:"Wine bar/caviste"}),
  leBallon:      P(45.7744,4.8275,"Le Ballon","bar",{notes:"Wine bar/caviste"}),


//test
  testplace:      P(45.7744,4.8275,"Le Ballon","xxx"),
  testplace2:     P(45.7613,4.8347,"Le Ballon","bar",{notes:"Wine bar/caviste"}),
  villageOutlet: P(45.8081,4.9965,"The Village Outlet","shop",{website:"https://thevillageoutlet.com",dur:"half-to-full day"}),
leSud:         P(45.7549,4.8312,"Le Sud (Paul Bocuse Brasserie)","restaurant",{website:"https://brasseries-bocuse.com/le-sud"}),
airport:       P(45.7256,5.0811,"Lyon-Saint-Exupéry Airport","airport",{notes:"Departure"}),


  // --- Beaujolais ---
  pizay:         P(46.2030,4.7060,"Château de Pizay (Beaujolais)","bar",{website:"https://chateau-pizay.com", notes:"Wine bar/caviste"}),
  nugues:        P(46.2078,4.7139,"Domaine des Nugues","bar",{website:"https://domainedesnugues.com", notes:"Wine bar/caviste"}),
  jeanLoron:     P(46.2445,4.7472,"Maison Jean Loron","bar",{website:"https://www.jeanloron.com", notes:"Wine bar/caviste"})
};

/* ===================== Plans ===================== */

const planDefinitions = [
  {
    key: 1,
  title: "Lyon + Beaujolais (25–30 Oct)",
  days: {
    // 🗓️ Oct 25 (Fri) – Start ~11:00 • Dinner 20:00 at Le Neuvième Art
    day1: [
      { poi: "vieuxLyon",   override: { notes: "Start ~11:00 • Explore Old Town alleys" } },
      { poi: "traboules",   override: { notes: "Historic traboules (self-guided)" } },
      { poi: "cathedral",   override: { notes: "Short visit before heading uphill" } },
      { poi: "fourviere",   override: { notes: "Basilica & panoramic view" } },
      { poi: "terreaux",    override: { notes: "Evening stroll before dinner" } },
      { poi: "neuviemeArt", override: { notes: "Dinner reservation 20:00" } }
    ],

    // 🗓️ Oct 26 (Sat) – The Village Outlet Day (Full Day)
    day2: [
      { poi: "pignol",         override: { notes: "Breakfast or coffee before departure" } },
      { poi: "villageOutlet",  override: { name: "The Village Outlet (Lyon)", notes: "Shopping & lunch • Full-day visit" } },
      { poi: "anticWine",      override: { notes: "Optional stop for wine tasting on return to Lyon" } },
      { poi: "brasserieBrotteaux", override: { notes: "Casual dinner near Part-Dieu area" } }
    ],

    // 🗓️ Oct 27 (Sun) – Beaujolais 09–17 • Maison Molly 20:00
    day3: [
      { poi: "pizay",     override: { notes: "Beaujolais wine tour 09:00–17:00" } },
      { poi: "nugues",    override: { notes: "Continue vineyard route" } },
      { poi: "jeanLoron", override: { notes: "Final stop • Return ~17:00" } },
      { poi: "brasserieGeorges", override: { name: "Maison Molly", notes: "Dinner reservation 20:00" } }
    ],

    // 🗓️ Oct 28 (Mon) – Leisure Day + Le Sud 20:00
day4: [
  { poi: "lugdunum",        override: { notes: "Morning visit • Roman theatres & museum (~1.5–2h)" } },
  { poi: "confluences",     override: { notes: "Musée des Confluences • modern science & culture (~2 h)" } },
  { poi: "confluenceWalk",  override: { notes: "Waterfront walk along Saône • cafés & architecture" } },
  { poi: "saoneQuays",      override: { notes: "Return stroll north • late-afternoon relaxation" } },
  { poi: "leSud",           override: { name: "Le Sud (Paul Bocuse Brasserie)", notes: "Dinner reservation at 20:00 • Mediterranean menu" } }
],

    // 🗓️ Oct 29 (Tue) – Market Day & Halles visit
      day5: [
      { poi: "croixMarket", override: { notes: "Morning market visit in Croix-Rousse • local food & crafts" } },
      { poi: "murCanuts",   override: { notes: "Famous mural nearby • quick photo stop" } },
      { poi: "terreaux",    override: { notes: "Walk down to Hôtel de Ville area • coffee or pastry break" } },
      { poi: "opera",       override: { notes: "Optional stop • admire architecture" } },
      { poi: "rueRepub",    override: { notes: "Main shopping street • window shopping or souvenirs" } },
      { poi: "halles",      override: { notes: "Halles de Lyon Paul Bocuse • Lunch or tasting session" } },
      { poi: "merciere",    override: { notes: "Evening drink or dessert spot before heading home" } }
    ],

    // 🗓️ Oct 30 (Wed) – Last Day • End ~13:00 → Airport
    day6: [
      { poi: "teteDor", override: { notes: "Relaxing stroll • Finish ~13:00" } },
      { poi: "airport", override: { notes: "Depart for flight" } }
    ]
  }
  },
  {
    key: 2,
    title: "Lyon only",
    days: {
      day1: ["vieuxLyon", "traboules", "cathedral", "fourviere", "terreaux", "mba", "bouchonFilles"],
      day2: ["croixMarket", "murCanuts", "halles", "anticWine", "brasserieGeorges"],
      day3: ["lugdunum", "gadagne", "tissus", "confluences", "confluenceWalk", "brasserieBrotteaux"],
      day4: ["bellecour", "rueRepub", "merciere", "opera", "lumiere", "neuviemeArt"],
      day5: [
        { poi: "teteDor", override: { notes: "Relaxing stroll" } },
        { poi: "chezPaul", override: { name: "Chez Paul (early lunch)" } }
      ]
    }
  }
  ,
  {
    key: 3,
    title: "Test",
    days: {
      gameday: ["vieuxLyon", "traboules", "cathedral", "fourviere", "terreaux", "mba", "bouchonFilles"],
      funday: ["croixMarket", "murCanuts", "halles", "anticWine", "brasserieGeorges"],
      lastday: [
        { poi: "teteDor", override: { notes: "Relaxing stroll" } },
        { poi: "testplace", override: { notes: "deneme 12" } },
        { poi: "testplace2", override: { notes: "deneme 34" } },
        { poi: "chezPaul", override: { name: "Chez Paul (early lunch)" } }
      ]
    }
  }
];

const plans = {};
const planTitles = {};
planDefinitions.forEach(def => {
  const plan = {};
  Object.entries(def.days).forEach(([day, pois]) => {
    plan[day] = pois.map(item => {
      if (typeof item === "string") {
        return POI[item];
      } else {
        // item is { poi, override }
        return Object.assign({}, POI[item.poi], item.override);
      }
    });
  });
  plans[def.key] = plan;
  planTitles[def.key] = def.title;
});


// Dynamic selector data
const planList = Object.keys(plans).filter(k => plans[k]); // Only valid numeric keys
const categorySet = new Set();
Object.values(POI).forEach(poi => categorySet.add(poi.cat));
//categorySet.add("home"); // Ensure 'home' is included
const categoryList = Array.from(categorySet); // ["sight", "church", ...]

//console.log("Plans loaded:", planList);
//console.log("Categories loaded:", categoryList);
