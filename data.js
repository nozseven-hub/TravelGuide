/* ===================== Home ===================== */
const HOME = { 
  lat: 45.77099, 
  lng: 4.83384, 
  name: "Home: 12 Rue Burdeau, 69001 Lyon", 
  cat: "home" 
};

/* ===================== Helper ===================== */
function P(lat, lng, name, cat, opts = {}) {
  return Object.assign({ lat, lng, name, cat }, opts);
}

/* ===================== POIs ===================== */
const POI = {
  // --- Sights & areas ---
  vieuxLyon: P(45.7629,4.8270,"Vieux Lyon (Old Town)","sight",{dur:"1.5–2h",notes:"Renaissance alleys & traboules"}),
  traboules: P(45.7613,4.8347,"Traboules (self-guided)","sight",{dur:"45–60min",notes:"Historic covered passages"}),
  terreaux:  P(45.7678,4.8343,"Place des Terreaux & Hôtel de Ville","sight",{dur:"20min",notes:"Bartholdi Fountain"}),
  opera:     P(45.7670,4.8356,"Opéra de Lyon (exterior)","sight",{dur:"15–20min",website:"https://www.opera-lyon.com"}),
  bellecour: P(45.7570,4.8320,"Place Bellecour","sight",{dur:"20min"}),
  rueRepub:  P(45.7610,4.8355,"Rue de la République stroll","sight",{dur:"45min"}),
  merciere:  P(45.7628,4.8333,"Rue Mercière cafés","sight",{dur:"30–45min"}),
  murCanuts: P(45.7792,4.8278,"Mur des Canuts (trompe-l’œil)","sight",{dur:"20min"}),
  belvedere: P(45.7625,4.8228,"Fourvière belvedere (panorama)","sight",{dur:"15–20min"}),
  confluenceWalk: P(45.7336,4.8207,"Confluence waterfront walk","sight",{dur:"45–60min"}),
  saoneQuays: P(45.7632,4.8279,"Saône riverside walk","sight",{dur:"30–45min"}),
  teteDor:   P(45.7772,4.8520,"Parc de la Tête d’Or (lake & gardens)","sight",{dur:"1.5–2h",website:"https://www.lyon.fr/lieu/parc-de-la-tete-dor"}),

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
  halles:    P(45.7634,4.8597,"Les Halles de Lyon Paul Bocuse","market",{dur:"1.5h",website:"https://halles-de-lyon-paulbocuse.com"}),
  croixMarket: P(45.7761,4.8272,"Croix-Rousse Market","market",{dur:"1–1.5h"}),
  stAntoine: P(45.7606,4.8326,"Marché Saint-Antoine","market",{dur:"1h"}),

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
  anticWine:     P(45.7626,4.8274,"Antic Wine","wine",{website:"https://anticwine.fr"}),
  caveACote:     P(45.7613,4.8347,"La Cave d’à Côté","wine"),
  leBallon:      P(45.7744,4.8275,"Le Ballon","wine"),

  // --- Beaujolais ---
  pizay:         P(46.2030,4.7060,"Château de Pizay (Beaujolais)","wine",{website:"https://chateau-pizay.com"}),
  nugues:        P(46.2078,4.7139,"Domaine des Nugues","wine",{website:"https://domainedesnugues.com"}),
  jeanLoron:     P(46.2445,4.7472,"Maison Jean Loron","wine",{website:"https://www.jeanloron.com"})
};

/* ===================== Plans ===================== */
const PlanA = {
  day1:[POI.vieuxLyon,POI.traboules,POI.cathedral,POI.fourviere,POI.terreaux,POI.mba,POI.bouchonFilles],
  day2:[POI.croixMarket,POI.murCanuts,POI.halles,POI.anticWine,POI.brasserieGeorges],
  day3:[POI.lugdunum,POI.gadagne,POI.opera,POI.rueRepub,POI.prairial],
  day4:[POI.pizay,POI.nugues,POI.jeanLoron],
  day5:[Object.assign({},POI.teteDor,{notes:"Relaxing stroll"}),Object.assign({},POI.pignol,{name:"Pignol (early lunch)"})]
};

const PlanB = {
  day1:[POI.vieuxLyon,POI.traboules,POI.cathedral,POI.fourviere,POI.terreaux,POI.mba,POI.bouchonFilles],
  day2:[POI.croixMarket,POI.murCanuts,POI.halles,POI.anticWine,POI.brasserieGeorges],
  day3:[POI.lugdunum,POI.gadagne,POI.tissus,POI.confluences,POI.confluenceWalk,POI.brasserieBrotteaux],
  day4:[POI.bellecour,POI.rueRepub,POI.merciere,POI.opera,POI.lumiere,POI.neuviemeArt],
  day5:[Object.assign({},POI.teteDor,{notes:"Relaxing stroll"}),Object.assign({},POI.chezPaul,{name:"Chez Paul (early lunch)"})]
};

const plans = { A: PlanA, B: PlanB };

console.log("Plans loaded:", Object.keys(plans));
