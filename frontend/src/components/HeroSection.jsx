import { Search, MapPin, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const HeroSection = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedLocation, 
  setSelectedLocation,
  priceRange,
  setPriceRange,
  onSearch,
  locations = [],
  stats
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section 
      className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
      data-testid="hero-section"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/17245109/pexels-photo-17245109.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div 
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in-up"
          data-testid="hero-badge"
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-white/90 text-sm font-medium">
            {stats?.disponibles || 0} véhicules disponibles
          </span>
        </div>

        {/* Title */}
        <h1 
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none mb-4 animate-fade-in-up animation-delay-100"
          data-testid="hero-title"
        >
          Trouvez votre<br />
          <span className="text-orange-500">véhicule idéal</span>
        </h1>

        {/* Subtitle */}
        <p 
          className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-200"
          data-testid="hero-subtitle"
        >
          La plateforme de référence pour l'achat de véhicules entre commissionnaires et acheteurs en RDC
        </p>

        {/* Search Box */}
        <form 
          onSubmit={handleSubmit}
          className="mt-8 w-full max-w-4xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl animate-fade-in-up animation-delay-300"
          data-testid="hero-search-form"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <Input
                type="text"
                placeholder="Marque ou modèle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-white border-0 rounded-xl text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-orange-500"
                data-testid="hero-search-input"
              />
            </div>

            {/* Location Select */}
            <div className="relative">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger 
                  className="h-12 bg-white border-0 rounded-xl text-zinc-900"
                  data-testid="hero-location-select"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <SelectValue placeholder="Localisation" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button 
              type="submit"
              className="h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl btn-primary"
              data-testid="hero-search-button"
            >
              <Search className="w-5 h-5 mr-2" />
              Rechercher
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <span className="font-semibold text-white">{stats?.total || 0}</span>
              <span>Véhicules au total</span>
            </div>
            <div className="w-px h-4 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <span className="font-semibold text-emerald-400">{stats?.disponibles || 0}</span>
              <span>Disponibles</span>
            </div>
            <div className="w-px h-4 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <span className="font-semibold text-rose-400">{stats?.vendus || 0}</span>
              <span>Vendus</span>
            </div>
          </div>
        </form>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};
