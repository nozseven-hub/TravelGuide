/* ===================== Tabs ===================== */
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

/* ===================== Map ===================== */
const map = L.map("map", { center: [45.764, 4.8357], zoom: 13 });
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

/* Toggles (hidden by default) */
document.getElementById("filtersToggle").onclick = () =>
  document.getElementById("filtersPanel").classList.toggle("open");

document.getElementById("legendToggle").onclick = () =>
  document.getElementById("legendPanel").classList.toggle("open");

/* ===================== Colors & Icons ===================== */
const dayColors = {
  day1: "#d9534f",
  day2: "#0275d8",
  day3: "#5cb85c",
  day4: "#f0ad4e",
  day5: "#613d7c"
};
const colorMap = {
  "#d9534f": "red",
  "#0275d8": "blue",
  "#5cb85c": "green",
  "#f0ad4e": "orange",
  "#613d7c": "purple"
};
const catIconNames = {
  sight: "fa-eye",
  museum: "fa-university",
  church: "fa-institution",
  restaurant: "fa-cutlery",
  market: "fa-shopping-cart",
  wine: "fa-glass",
  home: "fa-home"
};

function getIcon(cat, day) {
  if (cat === "home") {
    return L.AwesomeMarkers.icon({
      icon: "fa-home",
      markerColor: "black",
      prefix: "fa",
      iconColor: "white"
    });
  }
  return L.AwesomeMarkers.icon({
    icon: catIconNames[cat] || "fa-map-marker",
    markerColor: colorMap[dayColors[day]] || "cadetblue",
    prefix: "fa",
    iconColor: "white"
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
let currentPlan = "A",
  currentDay = "all",
  currentCat = "all",
  markers = [];
let routeLayer = null; // polyline
let dotLayer = null;   // small dots at each stop

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
    .addTo(map)
    .bindPopup(popupHTML(HOME, ""));
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

  const plan = plans[currentPlan];
  const boundsPoints = [[HOME.lat, HOME.lng]];
  let routeCoords = [];

  for (const dayKey in plan) {
    if (currentDay !== "all" && currentDay !== dayKey) continue;

    plan[dayKey].forEach(p => {
      if (currentCat !== "all" && currentCat !== p.cat) return;
      const marker = L.marker([p.lat, p.lng], {
        icon: getIcon(p.cat, dayKey)
      })
        .addTo(map)
        .bindPopup(popupHTML(p, dayKey));
      markers.push(marker);
      boundsPoints.push([p.lat, p.lng]);

      // If a single day is selected, collect coords in order for route
      if (currentDay !== "all") {
        routeCoords.push([p.lat, p.lng]);
      }
    });
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
  const plan = plans[currentPlan];
  const c = document.getElementById("planDetails");
  c.innerHTML = "";
  for (const dayKey of ["day1", "day2", "day3", "day4", "day5"]) {
    if (!plan[dayKey]) continue;
    if (currentDay !== "all" && currentDay !== dayKey) continue;

    const dayDiv = document.createElement("div");
    dayDiv.className = "day-section";
    dayDiv.innerHTML = `<h4 class="day-title">Day ${dayKey.replace("day", "")}</h4>`;
    let prev = null;
    plan[dayKey].forEach(p => {
      if (currentCat !== "all" && currentCat !== p.cat) return;
      const n = navLinks(p.lat, p.lng);
      let walkHint = "";
      const isWineryDay = currentPlan === "A" && dayKey === "day4";
      if (prev && !isWineryDay) {
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

/* ===================== Filters ===================== */
document.getElementById("planSelect").onchange = e => {
  currentPlan = e.target.value;
  refreshMap();
};
document.getElementById("daySelect").onchange = e => {
  currentDay = e.target.value;
  refreshMap();
};
document.getElementById("catSelect").onchange = e => {
  currentCat = e.target.value;
  refreshMap();
};
document.getElementById("clearFilters").onclick = () => {
  currentPlan = "A";
  currentDay = "all";
  currentCat = "all";
  document.getElementById("planSelect").value = "A";
  document.getElementById("daySelect").value = "all";
  document.getElementById("catSelect").value = "all";
  refreshMap();
};

/* ===================== Init ===================== */
refreshMap();
