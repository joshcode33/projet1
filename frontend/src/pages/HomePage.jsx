import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { FilterSidebar } from '../components/FilterSidebar';
import { VehicleCard } from '../components/VehicleCard';
import { Footer } from '../components/Footer';
import { Skeleton } from '../components/ui/skeleton';
import { Filter, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const HomePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState({ total: 0, disponibles: 0, vendus: 0 });
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCarburant, setSelectedCarburant] = useState('all');
  const [selectedTransmission, setSelectedTransmission] = useState('all');
  const [showAvailable, setShowAvailable] = useState(true);
  const [showSold, setShowSold] = useState(true);

  // Mobile filter sheet
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vehiclesRes, locationsRes, statsRes] = await Promise.all([
          axios.get(`${API}/vehicles`),
          axios.get(`${API}/locations`),
          axios.get(`${API}/stats`)
        ]);
        setVehicles(vehiclesRes.data);
        setLocations(locationsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          vehicle.marque.toLowerCase().includes(search) ||
          vehicle.modele.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Price filter
      if (vehicle.prix < priceRange[0] || vehicle.prix > priceRange[1]) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'all' && vehicle.localisation !== selectedLocation) {
        return false;
      }

      // Fuel filter
      if (selectedCarburant !== 'all' && vehicle.carburant !== selectedCarburant) {
        return false;
      }

      // Transmission filter
      if (selectedTransmission !== 'all' && vehicle.transmission !== selectedTransmission) {
        return false;
      }

      // Status filter
      if (!showAvailable && vehicle.statut === 'Disponible') return false;
      if (!showSold && vehicle.statut === 'Vendu') return false;

      return true;
    });
  }, [vehicles, searchTerm, priceRange, selectedLocation, selectedCarburant, selectedTransmission, showAvailable, showSold]);

  const handleSearch = () => {
    // Scroll to catalogue
    const catalogue = document.getElementById('catalogue');
    if (catalogue) {
      catalogue.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 100000]);
    setSelectedLocation('all');
    setSelectedCarburant('all');
    setSelectedTransmission('all');
    setShowAvailable(true);
    setShowSold(true);
  };

  const filterProps = {
    priceRange,
    setPriceRange,
    selectedLocation,
    setSelectedLocation,
    selectedCarburant,
    setSelectedCarburant,
    selectedTransmission,
    setSelectedTransmission,
    showAvailable,
    setShowAvailable,
    showSold,
    setShowSold,
    locations,
    onReset: resetFilters,
    vehicleCount: filteredVehicles.length
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Header />
      
      {/* Hero Section */}
      <HeroSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        onSearch={handleSearch}
        locations={locations}
        stats={stats}
      />

      {/* Catalogue Section */}
      <section 
        id="catalogue" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        data-testid="catalogue-section"
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-950 tracking-tight">
              Notre Catalogue
            </h2>
            <p className="text-zinc-500 mt-1">
              {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''} disponible{filteredVehicles.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="lg:hidden"
                data-testid="mobile-filter-btn"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="font-heading">Filtres</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar {...filterProps} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar {...filterProps} />
          </div>

          {/* Vehicle Grid */}
          <div className="lg:col-span-9">
            {loading ? (
              // Loading Skeletons
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                data-testid="loading-skeletons"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <div className="grid grid-cols-2 gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 flex-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                data-testid="vehicle-grid"
              >
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              // No results
              <div 
                className="flex flex-col items-center justify-center py-16 text-center"
                data-testid="no-results"
              >
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                  <X className="w-10 h-10 text-zinc-400" />
                </div>
                <h3 className="font-heading text-xl font-bold text-zinc-900 mb-2">
                  Aucun véhicule trouvé
                </h3>
                <p className="text-zinc-500 max-w-md mb-6">
                  Aucun véhicule ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
                </p>
                <Button 
                  onClick={resetFilters}
                  className="bg-orange-500 hover:bg-orange-600"
                  data-testid="reset-filters-btn-empty"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
