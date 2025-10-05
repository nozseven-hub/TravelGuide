// Utility: Escape HTML for safe DOM rendering
function escapeHTML(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>'"`]/g, function (c) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
      '`': '&#96;'
    }[c];
  });
}
/* ===================== Tabs ===================== */
let currentPlan = 1,
  currentDay = "all",
  currentCat = "all",
  markers = [];
let routeLayer = null; // polyline
let dotLayer = null;   // small dots at each stop

// Initialize Leaflet map
let map;
let initialLat, initialLng;
if (typeof HOME !== 'undefined' && HOME.lat && HOME.lng) {
  initialLat = HOME.lat;
  initialLng = HOME.lng;
} else {
  // Fallback: first POI of first day of first plan
  const firstPlanKey = Object.keys(plans)[0];
  const firstPlan = plans[firstPlanKey];
  const firstDayKey = Object.keys(firstPlan)[0];
  const firstPOI = firstPlan[firstDayKey][0];
  initialLat = firstPOI.lat;
  initialLng = firstPOI.lng;
}
map = L.map('map').setView([initialLat, initialLng], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Colors & Icons (move to top)
// Use CONFIG.dayColors from data.js
const baseDayColors = CONFIG.dayColors;
function getDayColor(day) {
  // Get all days in current plan
  if (!day) return baseDayColors[0]; // fallback color for undefined/null day
  const plan = plans[currentPlan];
  if (!plan) return baseDayColors[0];
  const planDayKeys = Object.keys(plan);
  const idx = planDayKeys.indexOf(day);
  if (idx === -1) return baseDayColors[0];
  return CONFIG.dayColors[idx % CONFIG.dayColors.length];
}
const colorMap = {
  "#d9534f": "red",
  "#0275d8": "blue",
  "#5cb85c": "green",
  "#f0ad4e": "orange",
  "#613d7c": "purple"
};
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
    if (tab.dataset.tab === "mapTab") {
      setTimeout(() => map.invalidateSize(), 120);
    }
  });
});
// Legend toggle button: open legend, close filters
document.getElementById("legendToggle").onclick = function() {
  const legendPanel = document.getElementById("legendPanel");
  const filtersPanel = document.getElementById("filtersPanel");
  filtersPanel.classList.remove("open");
  legendPanel.classList.add("open");
  renderLegend();
};

// Filters toggle button: open filters, close legend
document.getElementById("filtersToggle").onclick = function() {
  const legendPanel = document.getElementById("legendPanel");
  const filtersPanel = document.getElementById("filtersPanel");
  legendPanel.classList.remove("open");
  filtersPanel.classList.add("open");
};
function renderLegend() {
  // Declare all variables once at the top
  const legendSection = document.querySelector("#legendPanel .legend-section");
  legendSection.innerHTML = "";
  const plansTitleDiv = document.createElement("div");
  plansTitleDiv.className = "legend-section-title";
  plansTitleDiv.innerHTML = "<strong>Plans</strong>";
  legendSection.appendChild(plansTitleDiv);
  legendSection.appendChild(document.createElement("br")); // Add space after plans section
  const catSet = new Set();
  let planDiv;

  // Plans legend
  if (currentPlan === "all") {
    Object.keys(plans).forEach((planKey, idx) => {
      const color = baseDayColors[idx % baseDayColors.length];
      const planName = planTitles[planKey] || `Plan ${planKey}`;
      planDiv = document.createElement("div");
      planDiv.innerHTML = `<span class=\"dot\" style=\"background:${color}\"></span> ${escapeHTML(planName)}`;
      legendSection.appendChild(planDiv);
    });
  } else {
    const color = baseDayColors[0];
    const planName = planTitles[currentPlan] || `Plan ${currentPlan}`;
    planDiv = document.createElement("div");
    planDiv.innerHTML = `<span class=\"dot\" style=\"background:${color}\"></span> ${escapeHTML(planName)}`;
    legendSection.appendChild(planDiv);
  }

  // Collect categories from currently filtered POIs
  let filteredPOIs = [];
  if (currentPlan === "all") {
    Object.keys(plans).forEach(planKey => {
      const plan = plans[planKey];
      Object.keys(plan).forEach(dayKey => {
        if (currentDay !== "all" && currentDay !== dayKey) return;
        plan[dayKey].forEach(poi => {
          if (currentCat === "other") {
            if (osmTags.includes(poi.cat)) return;
          } else if (currentCat !== "all" && currentCat !== poi.cat) {
            return;
          }
          if (poi.cat !== "home") catSet.add(poi.cat);
          filteredPOIs.push(poi);
        });
      });
    });
  } else {
    const plan = plans[currentPlan];
    Object.keys(plan).forEach(dayKey => {
      if (currentDay !== "all" && currentDay !== dayKey) return;
      plan[dayKey].forEach(poi => {
        if (currentCat === "other") {
          if (osmTags.includes(poi.cat)) return;
        } else if (currentCat !== "all" && currentCat !== poi.cat) {
          return;
        }
        if (poi.cat !== "home") catSet.add(poi.cat);
        filteredPOIs.push(poi);
      });
    });
  }

  // POIs section
  const poisTitleDiv = document.createElement("div");
  poisTitleDiv.className = "legend-section-title";
  poisTitleDiv.innerHTML = "<strong>POIs</strong>";
  legendSection.appendChild(poisTitleDiv);

  const catLegendDiv = document.createElement("div");
  let catLegendHtml = "";
  // Count POIs per category for legend
  const catCounts = {};
  filteredPOIs.forEach(poi => {
    if (poi.cat !== "home") {
      catCounts[poi.cat] = (catCounts[poi.cat] || 0) + 1;
    }
  });
  Array.from(catSet).forEach(cat => {
    let icon = cat === "xxx" ? "❓" : getIcon(cat, "day1").options.html.replace(/<[^>]+>/g, "");
    let label = cat === "xxx" ? "Others" : cat.charAt(0).toUpperCase() + cat.slice(1);
    let count = catCounts[cat] || 0;
    catLegendHtml += `<span class=\"custom-emoji-marker\" style=\"display:inline-flex;vertical-align:middle;margin-right:8px;width:28px;height:28px;\"><span>${icon}</span></span> ${label} (${count})<br/>`;
  });
  catLegendDiv.innerHTML = catLegendHtml;
  legendSection.appendChild(catLegendDiv);
}
// OSM tag to Font Awesome icon mapping
const osmTags = [
  "amenity", "restaurant", "cafe", "bar", "fast_food", "pub", "hotel", "hostel", "museum", "church", "bank", "pharmacy", "hospital", "supermarket", "marketplace", "park", "attraction", "shop", "bus_station", "train_station", "airport"
];
// Use CONFIG.categoryIcons for emoji icons (for legend, etc.)

function getIcon(cat, day) {
  // Use OSM tag emoji mapping for map markers
  let iconEmoji = CONFIG.osmTagIcons[cat] || CONFIG.osmTagIcons.other;
  return L.divIcon({
    className: 'custom-emoji-marker',
    html: `<span>${iconEmoji}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
}

/* ===================== Helpers ===================== */
function navLinks(lat, lng) {
  return {
    g: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    a: `http://maps.apple.com/?daddr=${lat},${lng}`
  };
}

function popupHTML(p, day) {
  const n = navLinks(p.lat, p.lng);
  return `<b>${p.name}</b>${
    day && day.startsWith("day") ? `<br>Day ${day.replace("day", "")}` : ""
  }
          ${p.dur ? `<br>⏱ ${p.dur}` : ""}
          ${p.notes ? `<br>${p.notes}` : ""}
          ${p.phone ? `<br>☎ <a href="tel:${p.phone}">${p.phone}</a>` : ""}
          ${p.website ? `<br>🌐 <a href="${p.website}" target="_blank">Website</a>` : ""}
          ${p.instagram ? `<br>📸 <a href="${p.instagram}" target="_blank">Instagram</a>` : ""}
          <br>🧭 <a href="${n.g}" target="_blank">Google Maps</a> | <a href="${n.a}" target="_blank">Apple Maps</a>`;
}

/* ===================== Routes Layer ===================== */

function clearOverlays() {
  if (routeLayer) {
    map.removeLayer(routeLayer);
    routeLayer = null;
  }
  if (dotLayer) {
    map.removeLayer(dotLayer);
    dotLayer = null;
  }
}

function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

function addHome() {
  const hm = L.marker([HOME.lat, HOME.lng], { icon: getIcon("home", "day1") })
    .addTo(map);
  hm.bindPopup(popupHTML(HOME, ""));
  markers.push(hm);
}

function drawRouteForDay(coords) {
  if (coords.length < 2) return;
  // Polyline (dashed red)
  routeLayer = L.polyline(coords, {
    color: "red",
    weight: 3,
    opacity: 0.9,
    dashArray: "6,6",
    lineCap: "round",
    lineJoin: "round"
  }).addTo(map);

  // Dots at each stop
  dotLayer = L.layerGroup(
    coords.map(c =>
      L.circleMarker(c, {
        radius: 4,
        color: "red",
        fillColor: "red",
        fillOpacity: 0.9,
        weight: 1
      })
    )
  ).addTo(map);
}

/* ===================== Render ===================== */
function refreshMap() {
  clearMarkers();
  clearOverlays();
  addHome();

  const boundsPoints = [[HOME.lat, HOME.lng]];
  let routeCoords = [];

  if (currentPlan === "all") {
    // Aggregate all POIs from all plans and days
    Object.keys(plans).forEach(planKey => {
      const plan = plans[planKey];
      Object.keys(plan).forEach(dayKey => {
        if (currentDay !== "all" && currentDay !== dayKey) return;
        plan[dayKey].forEach(p => {
          if (currentCat === "other") {
            if (osmTags.includes(p.cat)) return;
          } else if (currentCat !== "all" && currentCat !== p.cat) {
            return;
          }
          const marker = L.marker([p.lat, p.lng], {
            icon: getIcon(p.cat, dayKey)
          })
            .addTo(map)
            .bindPopup(popupHTML(p, dayKey));
          markers.push(marker);
          boundsPoints.push([p.lat, p.lng]);
          if (currentDay !== "all") {
            routeCoords.push([p.lat, p.lng]);
          }
        });
      });
    });
  } else {
    const plan = plans[currentPlan];
    for (const dayKey in plan) {
      if (currentDay !== "all" && currentDay !== dayKey) continue;
      plan[dayKey].forEach(p => {
        if (currentCat === "other") {
          if (osmTags.includes(p.cat)) return;
        } else if (currentCat !== "all" && currentCat !== p.cat) {
          return;
        }
        const marker = L.marker([p.lat, p.lng], {
          icon: getIcon(p.cat, dayKey)
        })
          .addTo(map)
          .bindPopup(popupHTML(p, dayKey));
        markers.push(marker);
        boundsPoints.push([p.lat, p.lng]);
        if (currentDay !== "all") {
          routeCoords.push([p.lat, p.lng]);
        }
      });
    }
  }

  if (boundsPoints.length > 1) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.2));
  }

  // Draw route only when a single day is selected
  if (currentDay !== "all" && routeCoords.length > 0) {
    // Always begin at Home
    routeCoords = [[HOME.lat, HOME.lng], ...routeCoords];
    if (routeCoords.length > 1) {
      drawRouteForDay(routeCoords);
    }
  }

  renderPlanText();
}

function renderPlanText() {
  const c = document.getElementById("planDetails");
  c.innerHTML = "";
  if (currentPlan === "all") {
    // Show all plans and their days
    Object.keys(plans).forEach(planKey => {
      const plan = plans[planKey];
      const planDayKeys = Object.keys(plan);
      planDayKeys.forEach(dayKey => {
        if (!plan[dayKey]) return;
        if (currentDay !== "all" && currentDay !== dayKey) return;
        const dayDiv = document.createElement("div");
        dayDiv.className = "day-section";
  dayDiv.innerHTML = `<h4 class="day-title">Plan ${escapeHTML(planKey)}: ${escapeHTML(dayKey)}</h4>`;
        let prev = null;
        plan[dayKey].forEach(p => {
          if (currentCat !== "all" && currentCat !== p.cat) return;
          const n = navLinks(p.lat, p.lng);
          let walkHint = "";
          if (prev) {
            walkHint = " • 🚶 10–20 min walk (est.)";
          }
          const item = document.createElement("div");
          item.className = "poi";
          item.innerHTML = `
            <div class="name">${escapeHTML(p.name)}
              <span style="display:flex;gap:8px;align-items:center;">
                <span class="badge">${escapeHTML(p.cat)}</span>
                <a class="openmaps" href="${escapeHTML(n.g)}" target="_blank">🧭 Open</a>
              </span>
            </div>
            <div class="meta">
              ${p.dur ? `⏱ ${escapeHTML(p.dur)}` : ""} ${p.notes ? `• ${escapeHTML(p.notes)}` : ""}${walkHint}
            </div>
            <div class="links">
              ${p.phone ? `☎ <a href="tel:${escapeHTML(p.phone)}">${escapeHTML(p.phone)}</a>` : ""}
              ${p.website ? `🌐 <a href="${escapeHTML(p.website)}" target="_blank">Website</a>` : ""}
              ${p.instagram ? `📸 <a href="${escapeHTML(p.instagram)}" target="_blank">Instagram</a>` : ""}
              🧭 <a href="${escapeHTML(n.g)}" target="_blank">Google Maps</a> | <a href="${escapeHTML(n.a)}" target="_blank">Apple Maps</a>
            </div>`;
          dayDiv.appendChild(item);
          prev = p;
        });
        c.appendChild(dayDiv);
      });
    });
  } else {
    // Show only the selected plan
    const plan = plans[currentPlan];
    const planDayKeys = Object.keys(plan);
    for (const dayKey of planDayKeys) {
      if (!plan[dayKey]) continue;
      if (currentDay !== "all" && currentDay !== dayKey) continue;
      const dayDiv = document.createElement("div");
      dayDiv.className = "day-section";
      dayDiv.innerHTML = `<h4 class="day-title">${dayKey}</h4>`;
      let prev = null;
      plan[dayKey].forEach(p => {
        if (currentCat !== "all" && currentCat !== p.cat) return;
        const n = navLinks(p.lat, p.lng);
        let walkHint = "";
        if (prev) {
          walkHint = " • 🚶 10–20 min walk (est.)";
        }
        const item = document.createElement("div");
        item.className = "poi";
        item.innerHTML = `
          <div class="name">${p.name}
            <span style="display:flex;gap:8px;align-items:center;">
              <span class="badge">${p.cat}</span>
              <a class="openmaps" href="${n.g}" target="_blank">🧭 Open</a>
            </span>
          </div>
          <div class="meta">
            ${p.dur ? `⏱ ${p.dur}` : ""} ${p.notes ? `• ${p.notes}` : ""}${walkHint}
          </div>
          <div class="links">
            ${p.phone ? `☎ <a href="tel:${p.phone}">${p.phone}</a>` : ""}
            ${p.website ? `🌐 <a href="${p.website}" target="_blank">Website</a>` : ""}
            ${p.instagram ? `📸 <a href="${p.instagram}" target="_blank">Instagram</a>` : ""}
            🧭 <a href="${n.g}" target="_blank">Google Maps</a> | <a href="${n.a}" target="_blank">Apple Maps</a>
          </div>`;
        dayDiv.appendChild(item);
        prev = p;
      });
      c.appendChild(dayDiv);
    }
  }
}

/* ===================== Filters ===================== */
document.getElementById("planSelect").onchange = e => {
  currentPlan = Number(e.target.value);
  populateSelectors("plan");
  refreshMap();
};
document.getElementById("daySelect").onchange = e => {
  currentDay = e.target.value;
  populateSelectors("day");
  refreshMap();
};
document.getElementById("catSelect").onchange = e => {
  currentCat = e.target.value;
  populateSelectors("category");
  refreshMap();
};
document.getElementById("clearFilters").onclick = () => {
  currentPlan = 1;
  currentDay = "all";
  currentCat = "all";
  document.getElementById("planSelect").value = 1;
  document.getElementById("daySelect").value = "all";
  document.getElementById("catSelect").value = "all";
  refreshMap();
};

/* ===================== Init ===================== */

function populateSelectors(filterDirection) {
  // Plan selector
  const planSelect = document.getElementById("planSelect");
  const daySelect = document.getElementById("daySelect");
  const catSelect = document.getElementById("catSelect");
  let filteredPlans = Object.keys(planTitles);
  let filteredDays = [];

  // If filtering by category, restrict plans/days
  if (filterDirection === "category" && currentCat !== "all") {
    filteredPlans = filteredPlans.filter(planKey => {
      const plan = plans[planKey];
      return Object.values(plan).some(dayPois => dayPois.some(poi => poi.cat === currentCat));
    });
    // If no plans match, set to 'all' and skip day/category population
    if (filteredPlans.length === 0) {
      currentPlan = "all";
      filteredDays = [];
    } else {
      // If currentPlan is not in filteredPlans, reset to first
      if (!filteredPlans.includes(String(currentPlan))) {
        currentPlan = filteredPlans[0];
      }
      if (plans[currentPlan]) {
        filteredDays = Object.keys(plans[currentPlan]).filter(dayKey => {
          return plans[currentPlan][dayKey].some(poi => poi.cat === currentCat);
        });
      } else {
        filteredDays = [];
      }
    }
    // If currentDay is not in filteredDays, reset to "all"
    if (currentDay !== "all" && !filteredDays.includes(currentDay)) {
      currentDay = "all";
    }
  }

  // Populate plan selector
  planSelect.innerHTML = "";
  const allPlansOpt = document.createElement("option");
  allPlansOpt.value = "all";
  allPlansOpt.textContent = CONFIG.labels.allPlans;
  planSelect.appendChild(allPlansOpt);
  filteredPlans.forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = planTitles[key];
    planSelect.appendChild(opt);
  });
  if (currentPlan !== "all" && !filteredPlans.includes(String(currentPlan))) {
    currentPlan = "all";
  }
  planSelect.value = currentPlan;

  // Populate day selector
  daySelect.innerHTML = "";
  const allOpt = document.createElement("option");
  allOpt.value = "all";
  allOpt.textContent = CONFIG.labels.allDays;
  daySelect.appendChild(allOpt);
  let planDays;
  if (currentPlan === "all") {
    const allDaysSet = new Set();
    filteredPlans.forEach(planKey => {
      Object.keys(plans[planKey]).forEach(day => allDaysSet.add(day));
    });
    planDays = Array.from(allDaysSet);
  } else {
    planDays = Object.keys(plans[currentPlan]);
  }
  if (filterDirection === "category" && currentCat !== "all") {
    if (currentPlan === "all") {
      planDays = planDays.filter(day => {
        return filteredPlans.some(planKey =>
          plans[planKey][day] && plans[planKey][day].some(poi => poi.cat === currentCat)
        );
      });
    } else {
      planDays = planDays.filter(day => {
        return plans[currentPlan][day].some(poi => poi.cat === currentCat);
      });
    }
  }
  planDays.forEach(day => {
    const opt = document.createElement("option");
    opt.value = day;
    opt.textContent = day;
    daySelect.appendChild(opt);
  });
  if (currentDay !== "all" && !planDays.includes(currentDay)) {
    currentDay = "all";
  }
  daySelect.value = currentDay;

  // Populate category selector
  catSelect.innerHTML = "";
  const allCatOpt = document.createElement("option");
  allCatOpt.value = "all";
  allCatOpt.textContent = "All Categories";
  catSelect.appendChild(allCatOpt);

  // Get POIs for selected plan and day
  let pois = [];
  if (currentPlan === "all") {
    filteredPlans.forEach(planKey => {
      const plan = plans[planKey];
      if (currentDay === "all") {
        Object.values(plan).forEach(dayPois => {
          pois = pois.concat(dayPois);
        });
      } else if (plan[currentDay]) {
        pois = pois.concat(plan[currentDay]);
      }
    });
  } else {
    const plan = plans[currentPlan];
    if (currentDay === "all") {
      Object.values(plan).forEach(dayPois => {
        pois = pois.concat(dayPois);
      });
    } else if (plan[currentDay]) {
      pois = plan[currentDay];
    }
  }
  // Count POIs per category
  const catCounts = {};
  let hasOther = false;
  pois.forEach(poi => {
    if (poi.cat !== "home") {
      if (osmTags.includes(poi.cat)) {
        catCounts[poi.cat] = (catCounts[poi.cat] || 0) + 1;
      } else {
        hasOther = true;
        catCounts["other"] = (catCounts["other"] || 0) + 1;
      }
    }
  });
  Object.keys(catCounts).forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    let label = (cat === "bar" || cat === "pub") ? "Wine/Caviste" : (cat === "other" ? "Other" : cat.charAt(0).toUpperCase() + cat.slice(1));
    opt.textContent = `${label} (${catCounts[cat]})`;
    catSelect.appendChild(opt);
  });
  if (currentCat !== "all" && !catCounts[currentCat]) {
    currentCat = "all";
  }
  catSelect.value = currentCat;
  if (currentCat !== "all" && !catSet.has(currentCat)) {
    currentCat = "all";
  }
  catSelect.value = currentCat;

}

currentPlan = "all";
populateSelectors();
refreshMap();
