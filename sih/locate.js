// Places data
    const places = [
      {id:1,name:"Betla National Park",category:"Wildlife",lat:23.9167,lng:84.1833,rating:4.6, 
       description:"One of the earliest national parks in India, famous for tigers, elephants, and diverse wildlife.",
       review:"Incredible wildlife experience! Saw tigers, elephants, and countless bird species.",
       image:"https://images.unsplash.com/photo-1549366021-9f761d040a94?w=500&h=300&fit=crop&crop=center"},
      {id:2,name:"Ranchi Hill Station",category:"Hill Station",lat:23.3441,lng:85.3096,rating:4.3,
       description:"Known for its pleasant climate, beautiful hills, and numerous waterfalls.",
       review:"Beautiful hill station with amazing weather.",
       image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop&crop=center"},
      {id:3,name:"Hundru Falls",category:"Waterfall",lat:23.2599,lng:85.5937,rating:4.7,
       description:"A spectacular 98-meter tall waterfall formed by the Subarnarekha River.",
       review:"Absolutely mesmerizing! The sound of cascading water is magical.",
       image:"https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500&h=300&fit=crop&crop=center"},
      {id:4,name:"Jamshedpur Steel City",category:"Industrial Heritage",lat:22.8046,lng:86.2029,rating:4.2,
       description:"India's first planned industrial city, known for Tata Steel and parks.",
       review:"Well-planned city with excellent infrastructure.",
       image:"https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=500&h=300&fit=crop&crop=center"},
      {id:5,name:"Deoghar Temple Town",category:"Religious",lat:24.4851,lng:86.6953,rating:4.8,
       description:"Famous pilgrimage site with the Baidyanath Temple, one of the 12 Jyotirlingas.",
       review:"Divine experience! The spiritual atmosphere is captivating.",
       image:"https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=300&fit=crop&crop=center"},
      {id:6,name:"Hazaribagh National Park",category:"Wildlife",lat:23.9833,lng:85.3667,rating:4.4,
       description:"Famous for its tiger reserve and diverse flora and fauna.",
       review:"Great place for wildlife enthusiasts. Night safari was amazing.",  
       image:"https://images.unsplash.com/photo-1549366021-9f761d040a94?w=500&h=300&fit=crop&crop=center"},
      {id:7,name:"Netarhat Hill Station",category:"Hill Station",lat:23.4669,lng:84.2606,rating:4.5,
       description:"Known as the 'Queen of Chotanagpur', famous for sunrise and sunset views.",
       review:"The sunrise view is breathtaking! Scenic beauty unforgettable.",
       image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop&crop=center"},
      {id:8,name:"Tribal Heritage Museum",category:"Culture",lat:23.3441,lng:85.3096,rating:4.3,
       description:"Showcases the rich tribal culture and heritage of Jharkhand.",
       review:"Fascinating insight into tribal culture! Exhibitions are well-curated.",
       image:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop&crop=center"}
    ];

    let map;
    let markers = {};
    let selectedMarkers = [];
    let routeControl = null;

    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        initializeMap();
        createSidebarItems();
        setupEventListeners();
        document.getElementById("loading").style.display = "none";
      }, 1500);
    });

    function initializeMap() {
      map = L.map("map").setView([23.6102, 85.2799], 8);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
      }).addTo(map);

      places.forEach(place => {
        const marker = L.marker([place.lat, place.lng])
          .addTo(map)
          .bindPopup(createPopupContent(place)); 
        markers[place.id] = marker;
        marker.on("click", () => highlightSidebarItem(place.id));
      });
    }

    function createPopupContent(place) {
      const stars = "★".repeat(Math.floor(place.rating)) + "☆".repeat(5 - Math.floor(place.rating));
      return `
        <div class="popup-content">
          <img src="${place.image}" class="popup-image" alt="${place.name}">
          <div class="popup-details">
            <div class="popup-header">
              <div class="popup-name">${place.name}</div>
              <span class="popup-category">${place.category}</span>
            </div>
            <div class="popup-rating">
              <span>${stars}</span>
              <span>${place.rating}</span>
            </div>
            <div class="popup-description">${place.description}</div>
            <div class="popup-actions">
              <button class="popup-btn route-from" onclick="setRoutePoint('from', ${place.id})"><i class="fas fa-play"></i> From Here</button>
              <button class="popup-btn route-to" onclick="setRoutePoint('to', ${place.id})"><i class="fas fa-stop"></i> To Here</button>
            </div>
          </div>
        </div>`;
    }

    function createSidebarItems() {
      const placesList = document.getElementById("placesList");
      places.forEach(place => {
        const stars = "★".repeat(Math.floor(place.rating)) + "☆".repeat(5 - Math.floor(place.rating));
        const div = document.createElement("div");
        div.className = "place-item";
        div.dataset.placeId = place.id;
        div.innerHTML = `
          <img src="${place.image}" class="place-image" alt="${place.name}">
          <div class="place-header">
            <div>
              <div class="place-name">${place.name}</div>
              <span class="place-category">${place.category}</span>
            </div>
            <div class="rating">
              <span>${stars}</span>
              <span>${place.rating}</span>
            </div>
          </div>
          <div class="place-review">${place.review}</div>`;
        div.addEventListener("click", () => {
          focusOnPlace(place.id);
          highlightSidebarItem(place.id);
        });
        placesList.appendChild(div);
      });
    }

    function focusOnPlace(placeId) {
      const place = places.find(p => p.id === placeId);
      if (place && markers[placeId]) {
        map.flyTo([place.lat, place.lng], 12, {duration: 1.5});
        setTimeout(() => markers[placeId].openPopup(), 1600);
      }
    }

    function highlightSidebarItem(placeId) {
      document.querySelectorAll(".place-item").forEach(el => el.classList.remove("selected"));
      const selected = document.querySelector(`.place-item[data-place-id="${placeId}"]`);
      if (selected) {
        selected.classList.add("selected");
        selected.scrollIntoView({behavior:"smooth", block:"center"});
      }
    }

    function setRoutePoint(type, placeId) {
      const place = places.find(p => p.id === placeId);
      if (!place) return;
      if (type === "from") selectedMarkers[0] = place;
      if (type === "to") selectedMarkers[1] = place;
      if (selectedMarkers[0] && selectedMarkers[1]) drawRoute(selectedMarkers[0], selectedMarkers[1]);
    }

    function drawRoute(fromPlace, toPlace) {
      if (routeControl) map.removeControl(routeControl);
      routeControl = L.Routing.control({
        waypoints: [
          L.latLng(fromPlace.lat, fromPlace.lng),
          L.latLng(toPlace.lat, toPlace.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        showAlternatives: false,
        lineOptions: {styles:[{color:"blue", weight:4}]}
      }).on("routesfound", e => {
        const r = e.routes[0];
        document.getElementById("routeDistance").innerText = (r.summary.totalDistance/1000).toFixed(1) + " km";
        document.getElementById("routeTime").innerText = Math.round(r.summary.totalTime/60) + " min";
        document.getElementById("routeControls").classList.add("active");
      }).addTo(map);
    }

    function setupEventListeners() {
      document.getElementById("sidebarToggle").addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("collapsed");
      });
      document.getElementById("clearRoute").addEventListener("click", () => {
        if (routeControl) {
          map.removeControl(routeControl);
          routeControl = null;
        }
        selectedMarkers = [];
        document.getElementById("routeControls").classList.remove("active");
      });
    }
 
