import { Filter, X, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';

export const FilterSidebar = ({
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
  onReset,
  vehicleCount
}) => {
  const formatPrice = (value) => `${value.toLocaleString('fr-FR')} $`;

  return (
    <aside 
      className="lg:col-span-3 flex flex-col gap-6"
      data-testid="filter-sidebar"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-zinc-700" />
          <h2 className="font-heading text-lg font-bold text-zinc-950">Filtres</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-zinc-500 hover:text-zinc-700"
          data-testid="reset-filters-btn"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Réinitialiser
        </Button>
      </div>

      {/* Results count */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
        <p className="text-sm text-orange-700">
          <span className="font-bold text-orange-600">{vehicleCount}</span> véhicule{vehicleCount > 1 ? 's' : ''} trouvé{vehicleCount > 1 ? 's' : ''}
        </p>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <Label className="text-sm font-semibold text-zinc-700 mb-4 block">
          Fourchette de prix
        </Label>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={100000}
            step={1000}
            className="w-full"
            data-testid="price-slider"
          />
          <div className="flex items-center justify-between text-sm text-zinc-600">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="filter-section">
        <Label className="text-sm font-semibold text-zinc-700 mb-3 block">
          Localisation
        </Label>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger 
            className="w-full"
            data-testid="filter-location-select"
          >
            <SelectValue placeholder="Toutes les villes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type */}
      <div className="filter-section">
        <Label className="text-sm font-semibold text-zinc-700 mb-3 block">
          Carburant
        </Label>
        <Select value={selectedCarburant} onValueChange={setSelectedCarburant}>
          <SelectTrigger 
            className="w-full"
            data-testid="filter-carburant-select"
          >
            <SelectValue placeholder="Tous types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            <SelectItem value="Essence">Essence</SelectItem>
            <SelectItem value="Diesel">Diesel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div className="filter-section">
        <Label className="text-sm font-semibold text-zinc-700 mb-3 block">
          Transmission
        </Label>
        <Select value={selectedTransmission} onValueChange={setSelectedTransmission}>
          <SelectTrigger 
            className="w-full"
            data-testid="filter-transmission-select"
          >
            <SelectValue placeholder="Toutes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="Automatique">Automatique</SelectItem>
            <SelectItem value="Manuelle">Manuelle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="filter-section">
        <Label className="text-sm font-semibold text-zinc-700 mb-3 block">
          Statut
        </Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="available"
              checked={showAvailable}
              onCheckedChange={setShowAvailable}
              data-testid="filter-available-checkbox"
            />
            <label
              htmlFor="available"
              className="text-sm text-zinc-600 cursor-pointer flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              Disponible
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sold"
              checked={showSold}
              onCheckedChange={setShowSold}
              data-testid="filter-sold-checkbox"
            />
            <label
              htmlFor="sold"
              className="text-sm text-zinc-600 cursor-pointer flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-rose-500 rounded-full" />
              Vendu
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
};
