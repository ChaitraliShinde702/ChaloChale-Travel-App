// ===== ChaloChale Travel App =====
// Vanilla JS + Bootstrap 5.3 + localStorage. No frameworks.

"use strict";

var $ = function (s, c) { return (c || document).querySelector(s); };
var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

// ---------- localStorage helpers ----------
var store = {
  get: function (key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  },
  set: function (key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
};
var LS_USER = "cc_user";
var LS_WISHLIST = "cc_wishlist";
var LS_BOOKINGS = "cc_bookings";

function getUser() { return store.get(LS_USER, null); }
function getWishlist() { return store.get(LS_WISHLIST, []); }
function getBookings() { return store.get(LS_BOOKINGS, []); }

// ---------- Trip data for Quick View ----------
var TRIPS = {
  kerala: {
    name: "Kerala Backwaters", image: "./images/kerala.jpg", category: "Nature",
    price: 12999, duration: "4N / 5D", rating: 4.8, bestTime: "September to March",
    inclusions: ["Deluxe houseboat stay", "Daily breakfast & dinner", "All sightseeing", "Airport transfers"],
    exclusions: ["Flights", "Personal expenses", "Tips and porterage"],
    itinerary: [
      ["Day 1", "Arrival in Kochi", "Airport pickup and transfer to your hotel. Evening Kathakali performance."],
      ["Day 2", "Munnar", "Drive to Munnar. Tea garden visit and spice plantation tour."],
      ["Day 3", "Alleppey Houseboat", "Board your private houseboat. Backwater cruise with village walk."],
      ["Day 4", "Kumarakom", "Lagoon cruise and bird sanctuary visit. Traditional Kathakali dinner."],
      ["Day 5", "Departure", "Leisure morning, then transfer to the airport for your flight home."]
    ]
  },
  ladakh: {
    name: "Ladakh Adventure", image: "./images/ladakh.jpg", category: "Mountains",
    price: 24999, duration: "7N / 8D", rating: 4.9, bestTime: "May to September",
    inclusions: ["Inner-line permits", "3-star stays + camping", "Oxygen-equipped vehicles", "Local guides"],
    exclusions: ["Flights to Leh", "Personal expenses", "Travel insurance"],
    itinerary: [
      ["Day 1", "Arrival in Leh", "Acclimatisation day. Light walk around Leh market."],
      ["Day 2", "Nubra Valley", "Cross Khardung La. Diskit monastery and sand dunes."],
      ["Day 3", "Hunder", "Bactrian camel safari and Shyok river picnic."],
      ["Day 4", "Pangong Lake", "Drive to Pangong Tso. Overnight camp near the lake."],
      ["Day 5", "Pangong to Leh", "Return via Chang La. Sunset at Magnetic Hill."],
      ["Day 6", "Thiksey & Hemis", "Monastery visits and Hemis festival (seasonal)."],
      ["Day 7", "Leh Sightseeing", "Leh Palace, Shanti Stupa and river raft briefing."],
      ["Day 8", "Departure", "Transfer to Leh airport for your onward journey."]
    ]
  },
  goa: {
    name: "Goa Beach Blast", image: "./images/goa.jpg", category: "Beach",
    price: 9999, duration: "3N / 4D", rating: 4.7, bestTime: "November to February",
    inclusions: ["Beachside 3-star hotel", "Water sports voucher", "Sunset cruise", "Airport transfers"],
    exclusions: ["Flights", "Alcohol and casino entry", "Personal expenses"],
    itinerary: [
      ["Day 1", "Arrival in Goa", "Check-in and free evening at Calangute beach."],
      ["Day 2", "North Goa", "Water sports morning, Anjuna flea market and evening cruise."],
      ["Day 3", "South Goa", "Old Goa churches, Basilica of Bom Jesus and spice farm."],
      ["Day 4", "Departure", "Beach morning, then airport transfer."]
    ]
  },
  rajasthan: {
    name: "Royal Rajasthan", image: "./images/jaipur.jpg", category: "Heritage",
    price: 17999, duration: "5N / 6D", rating: 4.6, bestTime: "October to March",
    inclusions: ["Heritage havelis", "All monument tickets", "Camel safari + dinner", "Private cab"],
    exclusions: ["Flights", "Personal shopping", "Tips"],
    itinerary: [
      ["Day 1", "Jaipur Arrival", "Amber Fort, City Palace and Hawa Mahal."],
      ["Day 2", "Jaipur", "Jantar Mantar, Nahargarh Fort and local bazaars."],
      ["Day 3", "Pushkar", "Brahma Temple, lake ghats and evening aarti."],
      ["Day 4", "Udaipur", "City Palace, Lake Pichola boat ride and City Walk."],
      ["Day 5", "Udaipur", "Jag Mandir, Sajjangarh Fort and royal dinner."],
      ["Day 6", "Departure", "Transfer to Udaipur airport or railway station."]
    ]
  },
  varanasi: {
    name: "Varanasi Spiritual Weekend", image: "./images/varanasi.jpg", category: "Heritage",
    price: 6999, duration: "2N / 3D", rating: 4.7, bestTime: "October to March",
    inclusions: ["Ghat-side hotel", "Dawn boat ride", "Local guide 2 days", "Breakfast"],
    exclusions: ["Flights / trains", "Personal expenses", "Boat ride extras"],
    itinerary: [
      ["Day 1", "Ghats Walk", "Evening Ganga aarti at Dashashwamedh Ghat and night market."],
      ["Day 2", "Sarnath & Temples", "Sunrise boat ride, Kashi Vishwanath and Sarnath stupa."],
      ["Day 3", "Departure", "Sunrise ghat walk and transfer out of Varanasi."]
    ]
  },
  himalayas: {
    name: "Himalayan Escape", image: "./images/mountains.jpg", category: "Mountains",
    price: 19999, duration: "6N / 7D", rating: 4.8, bestTime: "March to June, Sept–Nov",
    inclusions: ["Hill-view rooms", "Paragliding voucher", "All cab transfers", "2 breakfasts daily"],
    exclusions: ["Flights", "Adventure activity extras", "Personal expenses"],
    itinerary: [
      ["Day 1", "Delhi to Shimla", "Scenic drive through the hills. Mall Road evening."],
      ["Day 2", "Kufri & Jakhoo", "Kufri snow point, Jakhoo temple and ridge walk."],
      ["Day 3", "Manali", "Rohtang pass (seasonal) and Solang valley paragliding."],
      ["Day 4", "Manali", "Hadimba temple, old Manali cafes and river activities."],
      ["Day 5", "Leh Road Trip", "Over Rohtang to Leh with overnight halt."],
      ["Day 6", "Leh", "Pangong day trip or local monastery circuit."],
      ["Day 7", "Departure", "Leh airport or drive back to Manali."]
    ]
  },
  agra: {
    name: "Agra & Taj Mahal", image: "./images/agra.jpg", category: "Heritage",
    price: 8999, duration: "2N / 3D", rating: 4.8, bestTime: "October to March",
    inclusions: ["Taj Mahal entry", "Agra Fort ticket", "Hotel with breakfast", "City transfers"],
    exclusions: ["Flights / trains", "Monument guide (optional extra)", "Personal expenses"],
    itinerary: [
      ["Day 1", "Arrival & Agra Fort", "Check-in, then explore Agra Fort and Itimad-ud-Daulah."],
      ["Day 2", "Taj Mahal", "Sunrise Taj visit, Mehtab Bagh sunset and local crafts."],
      ["Day 3", "Departure", "Fatehpur Sikri visit (seasonal) and transfer out."]
    ]
  },
  beaches: {
    name: "Beach Getaways", image: "./images/beaches.jpg", category: "Beach",
    price: 10999, duration: "3N / 4D", rating: 4.5, bestTime: "November to February",
    inclusions: ["Beach resort stay", "Seafood dinner", "Water sports", "Transfers"],
    exclusions: ["Flights", "Water sports extras", "Personal expenses"],
    itinerary: [
      ["Day 1", "Arrival", "Check-in and beachside evening."],
      ["Day 2", "Water Sports", "Snorkelling, jet ski and banana boat session."],
      ["Day 3", "Island Hopping", "Boat trip to nearby islands and seafood lunch."],
      ["Day 4", "Departure", "Leisure morning and airport transfer."]
    ]
  },
  hills: {
    name: "Hill Stations", image: "./images/mountains.jpg", category: "Mountains",
    price: 10499, duration: "4N / 5D", rating: 4.8, bestTime: "March to June, Oct–Dec",
    inclusions: ["Pine-forest stays", "Trek guide", "All transfers", "Breakfast"],
    exclusions: ["Flights", "Trek permits (extra)", "Personal expenses"],
    itinerary: [
      ["Day 1", "Arrival", "Check-in and Mall Road evening."],
      ["Day 2", "Valley Views", "Trek to nearby viewpoint and cafe hopping."],
      ["Day 3", "Adventure Day", "Zip-lining and river rafting options."],
      ["Day 4", "Local Culture", "Temple visit and handicraft market."],
      ["Day 5", "Departure", "Scenic drive down and transfer out."]
    ]
  },
  nature: {
    name: "Nature & Wildlife", image: "./images/nature.webp", category: "Nature",
    price: 11999, duration: "3N / 4D", rating: 4.7, bestTime: "October to March",
    inclusions: ["Eco-resort stay", "Safari booking", "Naturalist guide", "All meals"],
    exclusions: ["Flights", "Camera fees", "Personal expenses"],
    itinerary: [
      ["Day 1", "Arrival", "Check-in and evening nature walk."],
      ["Day 2", "Safari Day", "Morning and afternoon wildlife safaris with naturalist."],
      ["Day 3", "Wetlands", "Boat safari and birdwatching session."],
      ["Day 4", "Departure", "Dawn walk and transfer to airport."]
    ]
  }
};

// ---------- Shared UI injection ----------
var SHARED_HTML =
  '<div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered">' +
      '<div class="modal-content">' +
        '<div class="modal-header border-0 pb-0">' +
          '<ul class="nav nav-tabs auth-tabs w-100" id="authTabs" role="tablist">' +
            '<li class="nav-item flex-fill"><button class="nav-link active w-100" data-bs-toggle="tab" data-bs-target="#tabSignin" type="button">Sign In</button></li>' +
            '<li class="nav-item flex-fill"><button class="nav-link w-100" data-bs-toggle="tab" data-bs-target="#tabRegister" type="button">Register</button></li>' +
          '</ul>' +
          '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
        '</div>' +
        '<div class="modal-body pt-3">' +
          '<div class="tab-content">' +
            '<div class="tab-pane fade show active" id="tabSignin">' +
              '<div class="alert alert-danger py-2 small d-none" id="siError" role="alert"></div>' +
              '<form id="signinForm" novalidate>' +
                '<div class="mb-3"><label class="form-label fw-semibold">Email</label><input type="email" class="form-control" id="siEmail" required><div class="invalid-feedback">Enter a valid email.</div></div>' +
                '<div class="mb-3"><label class="form-label fw-semibold">Password</label><input type="password" class="form-control" id="siPass" minlength="4" required><div class="invalid-feedback">Min 4 characters.</div></div>' +
                '<button class="btn btn-warning w-100 fw-semibold">Sign In</button>' +
              '</form>' +
            '</div>' +
            '<div class="tab-pane fade" id="tabRegister">' +
              '<form id="registerForm" novalidate>' +
                '<div class="mb-3"><label class="form-label fw-semibold">Full Name</label><input type="text" class="form-control" id="rgName" required><div class="invalid-feedback">Enter your name.</div></div>' +
                '<div class="mb-3"><label class="form-label fw-semibold">Email</label><input type="email" class="form-control" id="rgEmail" required><div class="invalid-feedback">Enter a valid email.</div></div>' +
                '<div class="mb-3"><label class="form-label fw-semibold">Password</label><input type="password" class="form-control" id="rgPass" minlength="4" required><div class="invalid-feedback">Min 4 characters.</div></div>' +
                '<button class="btn btn-warning w-100 fw-semibold">Create Account</button>' +
              '</form>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="offcanvas offcanvas-end" tabindex="-1" id="tripsOffcanvas" aria-labelledby="tripsOffcanvasLabel">' +
    '<div class="offcanvas-header">' +
      '<h5 class="offcanvas-title fw-bold" id="tripsOffcanvasLabel"><i class="fa-solid fa-suitcase-rolling me-2"></i>My Trips</h5>' +
      '<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>' +
    '</div>' +
    '<div class="offcanvas-body" id="tripsOffcanvasBody"></div>' +
  '</div>' +
  '<div class="modal fade" id="quickViewModal" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">' +
      '<div class="modal-content">' +
        '<div class="modal-header border-0">' +
          '<h5 class="modal-title fw-bold" id="qvTitle">Trip Details</h5>' +
          '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
        '</div>' +
        '<div class="modal-body" id="qvBody"></div>' +
        '<div class="modal-footer border-0 pt-0">' +
          '<a href="#" class="btn btn-warning fw-semibold" id="qvBookBtn">Book This Trip</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="toast-container position-fixed bottom-0 start-0 p-3" style="z-index:1055">' +
    '<div id="ccToast" class="toast align-items-center text-bg-dark border-0" role="status" aria-live="polite" aria-atomic="true">' +
      '<div class="d-flex">' +
        '<div class="toast-body" id="ccToastBody"></div>' +
        '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<button type="button" class="back-to-top" id="backToTop" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></button>';

function injectSharedUI() {
  if (!$("#authModal") && document.body) {
    var wrap = document.createElement("div");
    wrap.innerHTML = SHARED_HTML;
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }
}

function showToast(msg) {
  var el = $("#ccToast");
  var body = $("#ccToastBody");
  if (!el || !body || !window.bootstrap) return;
  body.textContent = msg;
  bootstrap.Toast.getOrCreateInstance(el, { delay: 2400 }).show();
}

// ---------- Navbar auth state ----------
function updateAuthUI() {
  var btn = $("#loginBtn");
  if (!btn) return;
  var user = getUser();

  if (user && user.name) {
    if (btn.isConnected && !btn.dataset.converted) {
      var dd = document.createElement("div");
      dd.className = "dropdown";
      dd.innerHTML =
        '<button class="btn btn-warning dropdown-toggle fw-semibold" type="button" data-bs-toggle="dropdown" aria-expanded="false">' +
          'Hi, ' + escapeHtml(user.name.split(" ")[0]) +
        '</button>' +
        '<ul class="dropdown-menu dropdown-menu-end">' +
          '<li><h6 class="dropdown-header">' + escapeHtml(user.email || "") + '</h6></li>' +
          '<li><hr class="dropdown-divider"></li>' +
          '<li><a class="dropdown-item" href="#" id="logoutLink"><i class="fa-solid fa-right-from-bracket me-2"></i>Logout</a></li>' +
        '</ul>';
      btn.parentNode.replaceChild(dd, btn);
      dd.dataset.converted = "1";
      var logout = $("#logoutLink", dd);
      if (logout) {
        logout.addEventListener("click", function (e) {
          e.preventDefault();
          store.set(LS_USER, null);
          location.reload();
        });
      }
    }
  } else {
    var ddEl = btn.parentNode && btn.parentNode.querySelector(".dropdown");
    if (ddEl && ddEl.dataset.converted === "1") {
      ddEl.parentNode.replaceChild(btn, ddEl);
    }
    var span = btn.querySelector("span");
    if (span) span.textContent = "Login";
  }

  updateTripsBadge();
}

function updateTripsBadge() {
  var badge = $("#tripsBadge");
  if (!badge) return;
  var count = getWishlist().length + getBookings().length;
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-block" : "none";
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

// ---------- Auth modal logic ----------
function bindAuth() {
  var loginBtn = $("#loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      var errEl = $("#siError");
      if (errEl) errEl.classList.add("d-none");
      var modalEl = $("#authModal");
      if (modalEl && window.bootstrap) bootstrap.Modal.getOrCreateInstance(modalEl).show();
    });
  }

  var signin = $("#signinForm");
  if (signin) {
    signin.addEventListener("submit", function (e) {
      e.preventDefault();
      var errEl = $("#siError");
      if (errEl) errEl.classList.add("d-none");
      if (!signin.checkValidity()) { signin.classList.add("was-validated"); return; }

      var email = $("#siEmail").value.trim().toLowerCase();
      var pass = $("#siPass").value;
      var users = store.get("cc_users", {});
      var user = users[email];

      if (!user) {
        if (errEl) {
          errEl.textContent = "No account found for this email. Please register first.";
          errEl.classList.remove("d-none");
        }
        return;
      }
      if (user.pass !== pass) {
        if (errEl) {
          errEl.textContent = "Incorrect password. Please try again.";
          errEl.classList.remove("d-none");
        }
        return;
      }

      store.set(LS_USER, { name: user.name, email: email });
      var m = $("#authModal");
      if (m && window.bootstrap) bootstrap.Modal.getOrCreateInstance(m).hide();
      location.reload();
    });
  }

  var register = $("#registerForm");
  if (register) {
    register.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!register.checkValidity()) { register.classList.add("was-validated"); return; }
      var name = $("#rgName").value.trim();
      var email = $("#rgEmail").value.trim().toLowerCase();
      var pass = $("#rgPass").value;
      var users = store.get("cc_users", {});
      users[email] = { name: name, pass: pass };
      store.set("cc_users", users);
      store.set(LS_USER, { name: name, email: email });
      var m2 = $("#authModal");
      if (m2 && window.bootstrap) bootstrap.Modal.getOrCreateInstance(m2).hide();
      location.reload();
    });
  }
}

// ---------- Wishlist ----------
function syncWishlistButton(btn, isSaved) {
  btn.classList.toggle("active", isSaved);
  btn.setAttribute("aria-pressed", isSaved ? "true" : "false");
  var icon = btn.querySelector("i");
  if (icon) {
    icon.classList.toggle("fa-solid", isSaved);
    icon.classList.toggle("fa-regular", !isSaved);
  }
}

function toggleWishlist(key) {
  var list = getWishlist();
  var idx = list.indexOf(key);
  var added = idx === -1;
  if (added) list.push(key); else list.splice(idx, 1);
  store.set(LS_WISHLIST, list);
  $$(".wishlist-btn[data-key='" + key + "']").forEach(function (b) {
    syncWishlistButton(b, added);
  });
  updateTripsBadge();
  var tripName = TRIPS[key] ? TRIPS[key].name : "Trip";
  showToast(added ? tripName + " saved to wishlist." : tripName + " removed from wishlist.");
}

function bindWishlist() {
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".wishlist-btn");
    if (!btn) return;
    e.preventDefault();
    toggleWishlist(btn.dataset.key);
    renderTripsDrawer();
  });
}

function initWishlistButtons() {
  var list = getWishlist();
  $$(".wishlist-btn").forEach(function (b) {
    syncWishlistButton(b, list.indexOf(b.dataset.key) !== -1);
  });
}

// ---------- My Trips offcanvas ----------
function renderTripsDrawer() {
  var body = $("#tripsOffcanvasBody");
  if (!body) return;
  var html = "";
  var wishlist = getWishlist();
  var bookings = getBookings();

  html += '<h6 class="fw-bold text-uppercase text-secondary small">Wishlist (' + wishlist.length + ")</h6>";
  if (!wishlist.length) {
    html += '<p class="text-secondary small">No saved trips yet. Tap the heart on any destination.</p>';
  } else {
    wishlist.forEach(function (key) {
      var t = TRIPS[key];
      if (!t) return;
      html +=
        '<div class="offcanvas-trip-item d-flex align-items-center gap-2">' +
          '<img src="' + t.image + '" class="rounded" style="width:52px;height:52px;object-fit:cover" alt="' + escapeHtml(t.name) + '">' +
          '<div class="flex-grow-1"><div class="fw-semibold small"><a href="booking.html?dest=' + encodeURIComponent(key) + '" class="text-decoration-none text-dark">' + escapeHtml(t.name) + '</a></div>' +
          '<div class="text-secondary" style="font-size:.75rem">' + escapeHtml(t.duration) + ' &middot; &#8377;' + t.price.toLocaleString("en-IN") + "</div></div>" +
          '<button class="btn btn-sm btn-outline-danger" data-remove-wish="' + escapeHtml(key) + '" title="Remove"><i class="fa-solid fa-trash"></i></button>' +
        "</div>";
    });
  }

  html += '<h6 class="fw-bold text-uppercase text-secondary small mt-4">Bookings (' + bookings.length + ")</h6>";
  if (!bookings.length) {
    html += '<p class="text-secondary small">No bookings yet. <a href="booking.html">Book a trip</a>.</p>';
  } else {
    bookings.forEach(function (b) {
      html +=
        '<div class="offcanvas-trip-item">' +
          '<div class="d-flex justify-content-between align-items-start">' +
            '<div><span class="badge bg-warning text-dark">' + escapeHtml(b.id) + '</span>' +
            '<div class="fw-semibold small mt-1">' + escapeHtml(b.destName) + "</div>" +
            '<div class="text-secondary" style="font-size:.75rem">' + escapeHtml(b.dates) + " &middot; " + b.travelers + " traveller(s)</div></div>" +
            '<div class="text-end"><div class="fw-bold small">&#8377;' + b.total.toLocaleString("en-IN") + '</div>' +
            '<button class="btn btn-sm btn-outline-danger mt-1" data-remove-booking="' + escapeHtml(b.id) + '"><i class="fa-solid fa-xmark"></i> Cancel</button></div>' +
          "</div>" +
        "</div>";
    });
  }

  body.innerHTML = html;

  $$("[data-remove-wish]", body).forEach(function (b) {
    b.addEventListener("click", function () {
      toggleWishlist(b.dataset.removeWish);
      renderTripsDrawer();
    });
  });
  $$("[data-remove-booking]", body).forEach(function (b) {
    b.addEventListener("click", function () {
      store.set(LS_BOOKINGS, getBookings().filter(function (x) { return x.id !== b.dataset.removeBooking; }));
      updateTripsBadge();
      renderTripsDrawer();
      showToast("Booking cancelled.");
    });
  });
}

function bindTripsDrawer() {
  var btn = $("#myTripsBtn");
  if (btn) {
    btn.addEventListener("click", function () {
      renderTripsDrawer();
      var el = $("#tripsOffcanvas");
      if (el && window.bootstrap) bootstrap.Offcanvas.getOrCreateInstance(el).show();
    });
  }
}

// ---------- Quick View modal ----------
function openQuickView(key) {
  var t = TRIPS[key];
  if (!t) return;
  $("#qvTitle").textContent = t.name;
  var body = $("#qvBody");
  var inc = t.inclusions.map(function (i) { return "<li>" + escapeHtml(i) + "</li>"; }).join("");
  var exc = t.exclusions.map(function (i) { return "<li>" + escapeHtml(i) + "</li>"; }).join("");
  var days = t.itinerary.map(function (d) {
    return '<div class="itinerary-day"><strong>' + escapeHtml(d[0]) + " — " + escapeHtml(d[1]) +
      '</strong><div class="text-secondary small">' + escapeHtml(d[2]) + "</div></div>";
  }).join("");
  body.innerHTML =
    '<img src="' + t.image + '" class="quick-view-img mb-3" alt="' + escapeHtml(t.name) + '">' +
    '<div class="d-flex flex-wrap gap-2 mb-3">' +
      '<span class="badge rounded-pill bg-info text-dark">' + escapeHtml(t.category) + "</span>" +
      '<span class="badge rounded-pill bg-warning text-dark"><i class="fa-solid fa-star"></i> ' + t.rating + "</span>" +
      '<span class="badge rounded-pill bg-secondary"><i class="fa-regular fa-clock"></i> ' + escapeHtml(t.duration) + "</span>" +
      '<span class="badge rounded-pill bg-success"><i class="fa-regular fa-calendar"></i> Best: ' + escapeHtml(t.bestTime) + "</span>" +
    "</div>" +
    '<h6 class="fw-bold">From &#8377;' + t.price.toLocaleString("en-IN") + " per person</h6>" +
    '<h6 class="fw-bold mt-3">Day-by-Day Itinerary</h6>' + days +
    '<div class="row mt-3"><div class="col-md-6"><h6 class="fw-bold">Inclusions</h6><ul class="small text-secondary">' + inc +
    '</ul></div><div class="col-md-6"><h6 class="fw-bold">Exclusions</h6><ul class="small text-secondary">' + exc + "</ul></div></div>";
  $("#qvBookBtn").href = "booking.html?dest=" + encodeURIComponent(key);
  var el = $("#quickViewModal");
  if (el && window.bootstrap) bootstrap.Modal.getOrCreateInstance(el).show();
}

function bindQuickView() {
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".quick-view-btn");
    if (!btn) return;
    e.preventDefault();
    openQuickView(btn.dataset.trip);
  });
}

// ---------- Back to top ----------
function bindBackToTop() {
  var btn = $("#backToTop");
  if (!btn) return;
  window.addEventListener("scroll", function () {
    btn.classList.toggle("show", window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ---------- Destination page: search + filter + sort + ?q= ----------
function initDestinationsPage() {
  var searchInput = $("#searchInput");
  var cards = $$("#destinationGrid > [data-category]");
  var pills = $$("#filterPills .btn");
  var noResults = $("#noResults");
  var sortSelect = $("#sortSelect");
  if (!searchInput || !cards.length) return;

  var currentFilter = "all";
  var currentSort = "recommended";

  var priceOf = function (card) {
    var m = (card.textContent.match(/From \u20B9([\d,]+)/) || [])[1];
    return m ? parseInt(m.replace(/,/g, ""), 10) : 0;
  };
  var ratingOf = function (card) {
    var m = card.textContent.match(/\d\.\d/);
    return m ? parseFloat(m[0]) : 0;
  };

  function sortCards() {
    var grid = $("#destinationGrid");
    var arr = cards.slice();
    arr.sort(function (a, b) {
      if (currentSort === "price-asc") return priceOf(a) - priceOf(b);
      if (currentSort === "price-desc") return priceOf(b) - priceOf(a);
      if (currentSort === "rating") return ratingOf(b) - ratingOf(a);
      return 0; // recommended = DOM order
    });
    arr.forEach(function (c) { grid.appendChild(c); });
  }

  window.applyDestFilters = function () {
    var query = searchInput.value.trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var okCat = currentFilter === "all" || card.dataset.category === currentFilter;
      var okQ = card.dataset.name.indexOf(query) !== -1;
      var show = okCat && okQ;
      card.classList.toggle("d-none", !show);
      if (show) visible++;
    });
    if (noResults) noResults.classList.toggle("d-none", visible > 0);
  };

  searchInput.addEventListener("input", window.applyDestFilters);

  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      pills.forEach(function (p) {
        p.classList.remove("active", "btn-dark");
        p.classList.add("btn-outline-dark");
      });
      pill.classList.add("active", "btn-dark");
      pill.classList.remove("btn-outline-dark");
      currentFilter = pill.dataset.filter;
      window.applyDestFilters();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      currentSort = sortSelect.value;
      sortCards();
      window.applyDestFilters();
    });
  }

  // ?q= search param from home page hero
  var params = new URLSearchParams(window.location.search);
  var q = params.get("q");
  if (q) {
    searchInput.value = q;
    window.applyDestFilters();
  }

  window.resetFilters = function () {
    searchInput.value = "";
    currentFilter = "all";
    currentSort = "recommended";
    if (sortSelect) sortSelect.value = "recommended";
    pills.forEach(function (p, i) {
      p.classList.toggle("active", i === 0);
      p.classList.toggle("btn-dark", i === 0);
      p.classList.toggle("btn-outline-dark", i !== 0);
    });
    sortCards();
    window.applyDestFilters();
  };
}

// ---------- Booking page ----------
var DEST_PRICES = {
  kerala: 12999, ladakh: 24999, goa: 9999, rajasthan: 17999,
  varanasi: 6999, himalayas: 19999, agra: 8999, beaches: 10999,
  hills: 10499, nature: 11999, custom: 14999
};
var DEST_NIGHTS = {
  kerala: 5, ladakh: 8, goa: 4, rajasthan: 6, varanasi: 3,
  himalayas: 7, agra: 3, beaches: 4, hills: 5, nature: 4, custom: 5
};
var TIER_MULT = { Budget: 1.0, Standard: 1.15, Deluxe: 1.45, Luxury: 1.9 };

function initBookingPage() {
  var form = $("#bookingForm");
  if (!form) return;

  var destinationSelect = $("#destination");
  var packageSelect = $("#packageType");
  var checkIn = $("#checkIn");
  var checkOut = $("#checkOut");
  var travelersInput = $("#travelers");

  var sumDestination = $("#sumDestination");
  var sumPackage = $("#sumPackage");
  var sumDates = $("#sumDates");
  var sumTravelers = $("#sumTravelers");
  var sumNights = $("#sumNights");
  var sumTotal = $("#sumTotal");
  var sumPayable = $("#sumPayable");
  var sumRemaining = $("#sumRemaining");
  var sumDiscount = $("#sumDiscount");

  function fmt(n) { return "\u20B9" + Math.round(n).toLocaleString("en-IN"); }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function addDays(dateStr, days) {
    var d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  // Date validation
  checkIn.min = todayStr();
  checkIn.addEventListener("change", function () {
    if (!checkIn.value) { checkOut.min = ""; return; }
    checkOut.min = addDays(checkIn.value, 1);
    if (checkOut.value && checkOut.value <= checkIn.value) {
      checkOut.setCustomValidity("Check-out must be after check-in.");
    } else {
      checkOut.setCustomValidity("");
    }
    updateSummary();
  });
  checkOut.addEventListener("change", function () {
    if (checkIn.value && checkOut.value <= checkIn.value) {
      checkOut.setCustomValidity("Check-out must be after check-in.");
    } else {
      checkOut.setCustomValidity("");
    }
    updateSummary();
  });

  function getNights() {
    if (checkIn.value && checkOut.value) {
      var a = new Date(checkIn.value + "T00:00:00");
      var b = new Date(checkOut.value + "T00:00:00");
      var n = Math.round((b - a) / 86400000);
      if (n > 0) return n;
    }
    return DEST_NIGHTS[destinationSelect.value] || 5;
  }

  function updateSummary() {
    var destKey = destinationSelect.value || "";
    var pkgText = packageSelect.selectedIndex > 0 ? packageSelect.value : "";
    var travelers = parseInt(travelersInput.value, 10) || 0;
    var nights = getNights();

    var destLabel = destinationSelect.selectedIndex > 0
      ? destinationSelect.options[destinationSelect.selectedIndex].text : "\u2014";

    sumDestination.textContent = destLabel;
    sumPackage.textContent = pkgText || "\u2014";
    sumDates.textContent = (checkIn.value && checkOut.value)
      ? checkIn.value + " \u2192 " + checkOut.value : "\u2014";
    sumTravelers.textContent = travelers > 0 ? travelers : "\u2014";
    if (sumNights) sumNights.textContent = nights + " night(s)";

    var base = DEST_PRICES[destKey] || 0;
    var mult = TIER_MULT[pkgText] || 1;
    var defNights = DEST_NIGHTS[destKey] || 5;
    var perPerson = base * mult * (nights / defNights);
    var subtotal = perPerson * travelers;

    var payFull = $("#payFull").checked;
    var discount = payFull ? subtotal * 0.05 : 0;
    var total = subtotal - discount;

    sumDiscount.textContent = discount > 0 ? "- " + fmt(discount) : "\u2014";
    sumTotal.textContent = subtotal > 0 ? fmt(total) : "\u20B90";

    var advanceRow = $("#advanceRow");
    var balanceRow = $("#balanceRow");
    var isAdvance = !payFull;
    if (advanceRow) advanceRow.classList.toggle("d-none", !isAdvance);
    if (balanceRow) balanceRow.classList.toggle("d-none", !isAdvance);
    if (sumPayable) sumPayable.textContent = isAdvance && subtotal > 0 ? fmt(total * 0.2) : "\u2014";
    if (sumRemaining) sumRemaining.textContent = isAdvance && subtotal > 0 ? fmt(total * 0.8) : "\u2014";
  }

  [destinationSelect, packageSelect, travelersInput].forEach(function (el) {
    el.addEventListener("change", updateSummary);
    el.addEventListener("input", updateSummary);
  });
  [checkIn, checkOut].forEach(function (el) { el.addEventListener("change", updateSummary); });
  $$("input[name='payment']").forEach(function (r) { r.addEventListener("change", updateSummary); });

  // URL params: booking.html?dest=kerala&pkg=Deluxe
  var params = new URLSearchParams(window.location.search);
  var destParam = params.get("dest");
  var pkgParam = params.get("pkg");
  if (destParam) {
    for (var i = 0; i < destinationSelect.options.length; i++) {
      if (destinationSelect.options[i].value === destParam) {
        destinationSelect.selectedIndex = i; break;
      }
    }
  }
  if (pkgParam) {
    for (var j = 0; j < packageSelect.options.length; j++) {
      if (packageSelect.options[j].value === pkgParam ||
          packageSelect.options[j].text === pkgParam) {
        packageSelect.selectedIndex = j; break;
      }
    }
  }

  // Auto-fill from logged-in user
  var user = getUser();
  if (user) {
    if (user.name && $("#fullName")) $("#fullName").value = user.name;
    if (user.email && $("#email")) $("#email").value = user.email;
  }

  updateSummary();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    var destKey = destinationSelect.value;
    var pkgText = packageSelect.value;
    var travelers = parseInt(travelersInput.value, 10) || 1;
    var nights = getNights();
    var base = DEST_PRICES[destKey] || 0;
    var perPerson = base * (TIER_MULT[pkgText] || 1) * (nights / (DEST_NIGHTS[destKey] || 5));
    var subtotal = perPerson * travelers;
    var payFull = $("#payFull").checked;
    var discount = payFull ? subtotal * 0.05 : 0;
    var total = subtotal - discount;
    var bookingId = "CC-2026-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    var destName = destinationSelect.options[destinationSelect.selectedIndex].text;
    var dates = checkIn.value + " \u2192 " + checkOut.value;

    var booking = {
      id: bookingId,
      destKey: destKey,
      destName: destName,
      pkg: pkgText,
      dates: dates,
      nights: nights,
      travelers: travelers,
      subtotal: Math.round(subtotal),
      discount: Math.round(discount),
      total: Math.round(total),
      payableNow: payFull ? Math.round(total) : Math.round(total * 0.2),
      remaining: payFull ? 0 : Math.round(total * 0.8),
      payFull: payFull,
      name: $("#fullName").value.trim(),
      email: $("#email").value.trim(),
      phone: $("#phone").value.trim(),
      createdAt: new Date().toISOString()
    };

    var bookings = getBookings();
    bookings.push(booking);
    store.set(LS_BOOKINGS, bookings);
    updateTripsBadge();

    // Populate success modal cleanly
    var detail =
      '<div class="text-start small bg-light p-3 rounded mb-3">' +
        '<p class="mb-2"><span class="badge bg-warning text-dark fs-6">' + bookingId + "</span></p>" +
        "<p class='mb-1'><strong>Trip:</strong> " + escapeHtml(destName) + " (" + escapeHtml(pkgText) + ")</p>" +
        "<p class='mb-1'><strong>Dates:</strong> " + escapeHtml(dates) + " (" + nights + " nights)</p>" +
        "<p class='mb-1'><strong>Travellers:</strong> " + travelers + "</p>" +
        "<p class='mb-1'><strong>Name:</strong> " + escapeHtml(booking.name) + "</p>" +
        "<p class='mb-1'><strong>Email:</strong> " + escapeHtml(booking.email) + "</p>" +
        "<hr class='my-2'><p class='mb-1'><strong>Total:</strong> " + fmt(total) + "</p>" +
        (payFull
          ? "<p class='mb-0 text-success'><strong>Paid now:</strong> " + fmt(total) + "</p>"
          : "<p class='mb-0'><strong>Payable now (20%):</strong> " + fmt(total * 0.2) +
            "<br><strong>Remaining:</strong> " + fmt(total * 0.8) + "</p>") +
      "</div>";
    var detailsBox = $("#bookingModalDetails");
    if (detailsBox) {
      detailsBox.innerHTML = detail;
    }

    var modalEl = $("#bookingSuccessModal");
    if (modalEl && window.bootstrap) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }

    form.reset();
    form.classList.remove("was-validated");
    checkIn.min = todayStr();
    checkOut.min = "";
    if (user) {
      if (user.name && $("#fullName")) $("#fullName").value = user.name;
      if (user.email && $("#email")) $("#email").value = user.email;
    }
    updateSummary();
  });
}

// ---------- Contact page: validation + success modal ----------
function initContactPage() {
  var form = $("#contactForm");
  if (!form) return;

  var user = getUser();
  if (user) {
    if (user.name && $("#cName")) $("#cName").value = user.name;
    if (user.email && $("#cEmail")) $("#cEmail").value = user.email;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    var modalEl = $("#contactSuccessModal");
    if (modalEl && window.bootstrap) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    } else {
      alert("Message sent! We'll reply shortly.");
    }
    form.reset();
    form.classList.remove("was-validated");
    if (user) {
      if (user.name && $("#cName")) $("#cName").value = user.name;
      if (user.email && $("#cEmail")) $("#cEmail").value = user.email;
    }
  });
}

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded", function () {
  injectSharedUI();
  bindAuth();
  bindWishlist();
  bindTripsDrawer();
  bindQuickView();
  bindBackToTop();
  updateAuthUI();
  initWishlistButtons();
  initDestinationsPage();
  initBookingPage();
  initContactPage();
});
