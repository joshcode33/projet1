// ========================================
// VEHICLE DATA
// ========================================
const vehicles = [
    {
        id: 1,
        marque: "Toyota",
        modele: "Harrier",
        prix: 15000,
        localisation: "Kinshasa",
        annee: 2019,
        carburant: "Essence",
        transmission: "Automatique",
        statut: "Disponible",
        images: [
            "https://images.unsplash.com/photo-1758216991743-110e7a093f29?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBsdXh1cnklMjBzdXYlMjBvbiUyMHJvYWR8ZW58MHx8fHwxNzc0ODEzNzQyfDA&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800"
        ],
        contact: "243975814951",
        kilometrage: 45000,
        description: "Toyota Harrier en excellent état, bien entretenu avec carnet de bord complet. Véhicule fiable et économique, parfait pour la ville et les longs trajets."
    },
    {
        id: 2,
        marque: "Mercedes-Benz",
        modele: "G-Wagon",
        prix: 85000,
        localisation: "Lubumbashi",
        annee: 2021,
        carburant: "Diesel",
        transmission: "Automatique",
        statut: "Disponible",
        images: [
            "https://images.unsplash.com/photo-1761757414353-44a9718106f7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBsdXh1cnklMjBzdXYlMjBvbiUyMHJvYWR8ZW58MHx8fHwxNzc0ODEzNzQyfDA&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800",
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
        ],
        contact: "243975814951",
        kilometrage: 12000,
        description: "Mercedes G-Wagon luxueux, intérieur cuir, toutes options incluses. Véhicule de prestige en parfait état."
    },
    {
        id: 3,
        marque: "Land Rover",
        modele: "Range Rover Sport",
        prix: 42000,
        localisation: "Kinshasa",
        annee: 2020,
        carburant: "Diesel",
        transmission: "Automatique",
        statut: "Vendu",
        images: [
            "https://images.pexels.com/photos/33390082/pexels-photo-33390082.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"
        ],
        contact: "243975814951",
        kilometrage: 38000,
        description: "Range Rover Sport en parfait état, jantes 22 pouces, toit panoramique. Un véhicule d'exception."
    },
    {
        id: 4,
        marque: "Toyota",
        modele: "Land Cruiser Prado",
        prix: 28000,
        localisation: "Goma",
        annee: 2018,
        carburant: "Diesel",
        transmission: "Automatique",
        statut: "Disponible",
        images: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"
        ],
        contact: "243975814951",
        kilometrage: 67000,
        description: "Land Cruiser Prado robuste, idéal pour tous terrains, 7 places. Parfait pour les familles et les aventuriers."
    },
    {
        id: 5,
        marque: "BMW",
        modele: "X5",
        prix: 35000,
        localisation: "Kinshasa",
        annee: 2019,
        carburant: "Essence",
        transmission: "Automatique",
        statut: "Disponible",
        images: [
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
            "https://images.unsplash.com/photo-1523983302122-a5b2f0feb40e?w=800",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"
        ],
        contact: "243975814951",
        kilometrage: 52000,
        description: "BMW X5 sportif et élégant, intérieur luxueux, système audio premium. Performance et confort réunis."
    },
    {
        id: 6,
        marque: "Lexus",
        modele: "RX 350",
        prix: 22000,
        localisation: "Lubumbashi",
        annee: 2017,
        carburant: "Essence",
        transmission: "Automatique",
        statut: "Disponible",
        images: [
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800"
        ],
        contact: "243975814951",
        kilometrage: 78000,
        description: "Lexus RX 350 confortable et fiable, parfait état mécanique. La qualité japonaise à son meilleur."
    },
    {
        id: 7,
        marque: "Audi",
        modele: "Q7",
        prix: 38000,
        localisation: "Kinshasa",
        annee: 2020,
        carburant: "Diesel",
        transmission: "Automatique",
        statut: "Disponible",
        images: [
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800"
        ],
        contact: "243975814951",
        kilometrage: 32000,
        description: "Audi Q7 quattro, technologie de pointe, 7 places familiales. L'élégance allemande au service du confort."
    },
    {
        id: 8,
        marque: "Nissan",
        modele: "Patrol",
        prix: 45000,
        localisation: "Goma",
        annee: 2021,
        carburant: "Essence",
        transmission: "Automatique",
        statut: "Vendu",
        images: [
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
            "https://images.unsplash.com/photo-1523983302122-a5b2f0feb40e?w=800"
        ],
        contact: "243975814951",
        kilometrage: 18000,
        description: "Nissan Patrol V8, puissance et confort, véhicule de luxe tout-terrain. Imposant et performant."
    },
    {
        id: 9,
        marque: "Honda",
        modele: "CR-V",
        prix: 18000,
        localisation: "Kinshasa",
        annee: 2018,
        carburant: "Essence",
        transmission: "Automatique",
        statut: "Disponible",
        images: [
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800"
        ],
        contact: "243975814951",
        kilometrage: 55000,
        description: "Honda CR-V économique et pratique, idéal pour la famille. Fiabilité légendaire Honda."
    }
];

// ========================================
// GLOBAL VARIABLES
// ========================================
let filteredVehicles = [...vehicles];
let currentImageIndex = 0;
let currentVehicleImages = [];

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initFilters();
    updateStats();
    renderVehicles();
    initPriceSliders();
});

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }
    
    // Mobile filter button
    const mobileFilterBtn = document.getElementById('mobileFilterBtn');
    const filtersSidebar = document.getElementById('filtersSidebar');
    const closeFilters = document.getElementById('closeFilters');
    
    if (mobileFilterBtn && filtersSidebar) {
        mobileFilterBtn.addEventListener('click', function() {
            filtersSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeFilters && filtersSidebar) {
        closeFilters.addEventListener('click', function() {
            filtersSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// ========================================
// FILTERS
// ========================================
function initFilters() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
    
    // Location select (hero)
    const locationSelect = document.getElementById('locationSelect');
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            const filterLocation = document.getElementById('filterLocation');
            if (filterLocation) {
                filterLocation.value = this.value;
            }
            applyFilters();
        });
    }
    
    // Filter selects
    const filterLocation = document.getElementById('filterLocation');
    const filterFuel = document.getElementById('filterFuel');
    const filterTransmission = document.getElementById('filterTransmission');
    const filterAvailable = document.getElementById('filterAvailable');
    const filterSold = document.getElementById('filterSold');
    
    if (filterLocation) filterLocation.addEventListener('change', applyFilters);
    if (filterFuel) filterFuel.addEventListener('change', applyFilters);
    if (filterTransmission) filterTransmission.addEventListener('change', applyFilters);
    if (filterAvailable) filterAvailable.addEventListener('change', applyFilters);
    if (filterSold) filterSold.addEventListener('change', applyFilters);
}

function initPriceSliders() {
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    
    if (priceMin && priceMax) {
        priceMin.addEventListener('input', function() {
            updatePriceDisplay();
            applyFilters();
        });
        
        priceMax.addEventListener('input', function() {
            updatePriceDisplay();
            applyFilters();
        });
    }
}

function updatePriceDisplay() {
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceMinValue = document.getElementById('priceMinValue');
    const priceMaxValue = document.getElementById('priceMaxValue');
    
    if (priceMin && priceMax && priceMinValue && priceMaxValue) {
        const min = parseInt(priceMin.value);
        const max = parseInt(priceMax.value);
        
        priceMinValue.textContent = formatPrice(min);
        priceMaxValue.textContent = formatPrice(max);
    }
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterLocation = document.getElementById('filterLocation');
    const filterFuel = document.getElementById('filterFuel');
    const filterTransmission = document.getElementById('filterTransmission');
    const filterAvailable = document.getElementById('filterAvailable');
    const filterSold = document.getElementById('filterSold');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    const location = filterLocation ? filterLocation.value : '';
    const fuel = filterFuel ? filterFuel.value : '';
    const transmission = filterTransmission ? filterTransmission.value : '';
    const showAvailable = filterAvailable ? filterAvailable.checked : true;
    const showSold = filterSold ? filterSold.checked : true;
    const minPrice = priceMin ? parseInt(priceMin.value) : 0;
    const maxPrice = priceMax ? parseInt(priceMax.value) : 100000;
    
    filteredVehicles = vehicles.filter(vehicle => {
        // Search filter
        if (search) {
            const matchesSearch = 
                vehicle.marque.toLowerCase().includes(search) ||
                vehicle.modele.toLowerCase().includes(search);
            if (!matchesSearch) return false;
        }
        
        // Price filter
        if (vehicle.prix < minPrice || vehicle.prix > maxPrice) return false;
        
        // Location filter
        if (location && vehicle.localisation !== location) return false;
        
        // Fuel filter
        if (fuel && vehicle.carburant !== fuel) return false;
        
        // Transmission filter
        if (transmission && vehicle.transmission !== transmission) return false;
        
        // Status filter
        if (!showAvailable && vehicle.statut === 'Disponible') return false;
        if (!showSold && vehicle.statut === 'Vendu') return false;
        
        return true;
    });
    
    updateFilteredCount();
    renderVehicles();
}

function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const locationSelect = document.getElementById('locationSelect');
    const filterLocation = document.getElementById('filterLocation');
    const filterFuel = document.getElementById('filterFuel');
    const filterTransmission = document.getElementById('filterTransmission');
    const filterAvailable = document.getElementById('filterAvailable');
    const filterSold = document.getElementById('filterSold');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    
    if (searchInput) searchInput.value = '';
    if (locationSelect) locationSelect.value = '';
    if (filterLocation) filterLocation.value = '';
    if (filterFuel) filterFuel.value = '';
    if (filterTransmission) filterTransmission.value = '';
    if (filterAvailable) filterAvailable.checked = true;
    if (filterSold) filterSold.checked = true;
    if (priceMin) priceMin.value = 0;
    if (priceMax) priceMax.value = 100000;
    
    updatePriceDisplay();
    filteredVehicles = [...vehicles];
    updateFilteredCount();
    renderVehicles();
}

// ========================================
// STATS & COUNTS
// ========================================
function updateStats() {
    const total = vehicles.length;
    const available = vehicles.filter(v => v.statut === 'Disponible').length;
    const sold = vehicles.filter(v => v.statut === 'Vendu').length;
    
    const totalCount = document.getElementById('totalCount');
    const availableCount = document.getElementById('availableCount');
    const availableCountStat = document.getElementById('availableCountStat');
    const soldCount = document.getElementById('soldCount');
    
    if (totalCount) totalCount.textContent = total;
    if (availableCount) availableCount.textContent = available;
    if (availableCountStat) availableCountStat.textContent = available;
    if (soldCount) soldCount.textContent = sold;
    
    updateFilteredCount();
}

function updateFilteredCount() {
    const count = filteredVehicles.length;
    
    const filteredCount = document.getElementById('filteredCount');
    const filterResultCount = document.getElementById('filterResultCount');
    
    if (filteredCount) filteredCount.textContent = count;
    if (filterResultCount) filterResultCount.textContent = count;
}

// ========================================
// RENDER VEHICLES
// ========================================
function renderVehicles() {
    const grid = document.getElementById('vehiclesGrid');
    if (!grid) return;
    
    if (filteredVehicles.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-times"></i>
                </div>
                <h3>Aucun véhicule trouvé</h3>
                <p>Aucun véhicule ne correspond à vos critères de recherche. Essayez de modifier vos filtres.</p>
                <button class="btn btn-primary" onclick="resetFilters()">
                    Réinitialiser les filtres
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredVehicles.map(vehicle => createVehicleCard(vehicle)).join('');
}

function createVehicleCard(vehicle) {
    const isAvailable = vehicle.statut === 'Disponible';
    const whatsappMessage = encodeURIComponent(
        `Bonjour, je suis intéressé par ${vehicle.marque} ${vehicle.modele} (${vehicle.annee}) à ${formatPrice(vehicle.prix)}`
    );
    const whatsappUrl = `https://wa.me/${vehicle.contact}?text=${whatsappMessage}`;
    
    return `
        <div class="vehicle-card">
            <a href="detail.html?id=${vehicle.id}" class="card-image">
                <img src="${vehicle.images[0]}" alt="${vehicle.marque} ${vehicle.modele}" loading="lazy">
                <span class="card-badge ${isAvailable ? 'available' : 'sold'}">${vehicle.statut}</span>
                ${vehicle.images.length > 1 ? `<span class="card-photos">+${vehicle.images.length - 1} photos</span>` : ''}
                <span class="card-price">${formatPrice(vehicle.prix)}</span>
            </a>
            <div class="card-content">
                <a href="detail.html?id=${vehicle.id}" class="card-title">${vehicle.marque} ${vehicle.modele}</a>
                <div class="card-specs">
                    <div class="card-spec">
                        <i class="fas fa-calendar"></i>
                        <span>${vehicle.annee}</span>
                    </div>
                    <div class="card-spec">
                        <i class="fas fa-gas-pump"></i>
                        <span>${vehicle.carburant}</span>
                    </div>
                    <div class="card-spec">
                        <i class="fas fa-cog"></i>
                        <span>${vehicle.transmission}</span>
                    </div>
                    <div class="card-spec">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${vehicle.localisation}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <a href="detail.html?id=${vehicle.id}" class="btn btn-outline">Voir détails</a>
                    <a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp ${!isAvailable ? 'disabled' : ''}">
                        <i class="fab fa-whatsapp"></i>
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
}

// ========================================
// DETAIL PAGE
// ========================================
function initDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = parseInt(urlParams.get('id'));
    
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    if (!vehicle) {
        document.getElementById('vehicleDetail').innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <div class="no-results-icon">
                    <i class="fas fa-car"></i>
                </div>
                <h3>Véhicule non trouvé</h3>
                <p>Ce véhicule n'existe pas ou a été supprimé.</p>
                <a href="index.html" class="btn btn-primary">
                    <i class="fas fa-arrow-left"></i>
                    Retour au catalogue
                </a>
            </div>
        `;
        return;
    }
    
    currentVehicleImages = vehicle.images;
    currentImageIndex = 0;
    
    document.title = `${vehicle.marque} ${vehicle.modele} - AutoCommission`;
    
    renderVehicleDetail(vehicle);
}

function renderVehicleDetail(vehicle) {
    const isAvailable = vehicle.statut === 'Disponible';
    const whatsappMessage = encodeURIComponent(
        `Bonjour, je suis intéressé par ${vehicle.marque} ${vehicle.modele} (${vehicle.annee}) à ${formatPrice(vehicle.prix)}. Réf: ${vehicle.id}`
    );
    const whatsappUrl = `https://wa.me/${vehicle.contact}?text=${whatsappMessage}`;
    
    const specs = [
        { icon: 'fa-calendar', label: 'Année', value: vehicle.annee },
        { icon: 'fa-gas-pump', label: 'Carburant', value: vehicle.carburant },
        { icon: 'fa-cog', label: 'Transmission', value: vehicle.transmission },
        { icon: 'fa-map-marker-alt', label: 'Localisation', value: vehicle.localisation },
        { icon: 'fa-tachometer-alt', label: 'Kilométrage', value: vehicle.kilometrage ? `${vehicle.kilometrage.toLocaleString('fr-FR')} km` : 'N/A' }
    ];
    
    document.getElementById('vehicleDetail').innerHTML = `
        <!-- Gallery -->
        <div class="detail-gallery">
            <div class="gallery-main">
                <img src="${vehicle.images[0]}" alt="${vehicle.marque} ${vehicle.modele}" id="mainImage">
                ${vehicle.images.length > 1 ? `
                    <button class="gallery-nav prev" onclick="changeImage(-1)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="gallery-nav next" onclick="changeImage(1)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                ` : ''}
                <div class="gallery-actions">
                    <button class="gallery-action-btn" onclick="openLightbox()">
                        <i class="fas fa-expand"></i>
                    </button>
                    <button class="gallery-action-btn" onclick="downloadImage()">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
                <div class="gallery-counter" id="galleryCounter">1 / ${vehicle.images.length}</div>
            </div>
            ${vehicle.images.length > 1 ? `
                <div class="gallery-thumbs">
                    ${vehicle.images.map((img, index) => `
                        <div class="gallery-thumb ${index === 0 ? 'active' : ''}" onclick="selectImage(${index})">
                            <img src="${img}" alt="Miniature ${index + 1}" loading="lazy">
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
        
        <!-- Info -->
        <div class="detail-info">
            <div class="detail-header">
                <div class="detail-badges">
                    <span class="card-badge ${isAvailable ? 'available' : 'sold'}">${vehicle.statut}</span>
                    <span class="detail-ref">Réf: ${vehicle.id}</span>
                </div>
                <h1 class="detail-title">${vehicle.marque} ${vehicle.modele}</h1>
            </div>
            
            <div class="detail-price-card">
                <p class="detail-price-label">Prix</p>
                <p class="detail-price-value">${formatPrice(vehicle.prix)}</p>
            </div>
            
            <div class="detail-specs">
                ${specs.map(spec => `
                    <div class="spec-card">
                        <div class="spec-icon">
                            <i class="fas ${spec.icon}"></i>
                            <span>${spec.label}</span>
                        </div>
                        <p class="spec-value">${spec.value}</p>
                    </div>
                `).join('')}
            </div>
            
            ${vehicle.description ? `
                <div class="detail-description">
                    <h3>Description</h3>
                    <p>${vehicle.description}</p>
                </div>
            ` : ''}
            
            <div class="detail-divider"></div>
            
            <div class="detail-actions">
                <a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp detail-whatsapp ${!isAvailable ? 'disabled' : ''}">
                    <i class="fab fa-whatsapp"></i>
                    Contacter via WhatsApp
                </a>
                <div class="detail-secondary-actions">
                    <button class="btn btn-outline" onclick="shareVehicle()">
                        <i class="fas fa-share-alt"></i>
                        Partager
                    </button>
                    <button class="btn btn-outline" onclick="addToFavorites()">
                        <i class="far fa-heart"></i>
                        Favoris
                    </button>
                </div>
            </div>
            
            <div class="detail-contact-info">
                Des questions ? Contactez-nous directement au 
                <a href="tel:+${vehicle.contact}">+${vehicle.contact}</a>
            </div>
        </div>
    `;
}

// ========================================
// GALLERY FUNCTIONS
// ========================================
function selectImage(index) {
    currentImageIndex = index;
    updateGalleryDisplay();
}

function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = currentVehicleImages.length - 1;
    if (currentImageIndex >= currentVehicleImages.length) currentImageIndex = 0;
    updateGalleryDisplay();
}

function updateGalleryDisplay() {
    const mainImage = document.getElementById('mainImage');
    const counter = document.getElementById('galleryCounter');
    const thumbs = document.querySelectorAll('.gallery-thumb');
    
    if (mainImage) {
        mainImage.src = currentVehicleImages[currentImageIndex];
    }
    
    if (counter) {
        counter.textContent = `${currentImageIndex + 1} / ${currentVehicleImages.length}`;
    }
    
    thumbs.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

// ========================================
// LIGHTBOX
// ========================================
function openLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    if (lightbox && lightboxImage) {
        lightboxImage.src = currentVehicleImages[currentImageIndex];
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentVehicleImages.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function lightboxPrev() {
    changeImage(-1);
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');
    if (lightboxImage) {
        lightboxImage.src = currentVehicleImages[currentImageIndex];
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentVehicleImages.length}`;
    }
}

function lightboxNext() {
    changeImage(1);
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');
    if (lightboxImage) {
        lightboxImage.src = currentVehicleImages[currentImageIndex];
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentVehicleImages.length}`;
    }
}

// Close lightbox on escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
});

// ========================================
// UTILITY FUNCTIONS
// ========================================
function formatPrice(price) {
    return price.toLocaleString('fr-FR') + ' $';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function scrollToCatalogue() {
    const catalogue = document.getElementById('catalogue');
    if (catalogue) {
        catalogue.scrollIntoView({ behavior: 'smooth' });
    }
}

function shareVehicle() {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: url
        });
    } else {
        navigator.clipboard.writeText(url).then(() => {
            alert('Lien copié dans le presse-papier !');
        });
    }
}

function addToFavorites() {
    alert('Fonctionnalité favoris à venir !');
}

function downloadImage() {
    const link = document.createElement('a');
    link.href = currentVehicleImages[currentImageIndex];
    link.download = `vehicle-image-${currentImageIndex + 1}.jpg`;
    link.click();
}
