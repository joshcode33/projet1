import { MapPin, Calendar, Fuel, Settings, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export const VehicleCard = ({ vehicle }) => {
  const {
    id,
    marque,
    modele,
    prix,
    localisation,
    annee,
    carburant,
    transmission,
    statut,
    images,
    contact
  } = vehicle;

  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis intéressé par ${marque} ${modele} (${annee}) à ${prix.toLocaleString('fr-FR')} USD`
  );
  const whatsappUrl = `https://wa.me/${contact}?text=${whatsappMessage}`;

  const isAvailable = statut === 'Disponible';

  return (
    <div 
      className="vehicle-card bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-zinc-100 overflow-hidden group flex flex-col"
      data-testid={`vehicle-card-${id}`}
    >
      {/* Image Container */}
      <Link to={`/vehicle/${id}`} className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <img
          src={images[0]}
          alt={`${marque} ${modele}`}
          className="vehicle-image w-full h-full object-cover"
          loading="lazy"
          data-testid={`vehicle-image-${id}`}
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            className={`${
              isAvailable 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200 status-available' 
                : 'bg-rose-100 text-rose-800 border-rose-200'
            } font-medium px-3 py-1`}
            data-testid={`vehicle-status-${id}`}
          >
            {statut}
          </Badge>
        </div>

        {/* Image count badge */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg">
            +{images.length - 1} photos
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <div 
            className="price-tag text-white font-bold px-4 py-2 rounded-lg text-lg"
            data-testid={`vehicle-price-${id}`}
          >
            {prix.toLocaleString('fr-FR')} $
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Title */}
        <Link to={`/vehicle/${id}`}>
          <h3 
            className="font-heading text-xl font-bold text-zinc-950 hover:text-orange-500 transition-colors line-clamp-1"
            data-testid={`vehicle-title-${id}`}
          >
            {marque} {modele}
          </h3>
        </Link>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span>{annee}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-zinc-400" />
            <span>{carburant}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-zinc-400" />
            <span>{transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zinc-400" />
            <span>{localisation}</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 rounded-lg border-zinc-200 hover:bg-zinc-50"
            data-testid={`vehicle-details-btn-${id}`}
          >
            <Link to={`/vehicle/${id}`}>
              Voir détails
            </Link>
          </Button>
          
          <Button
            asChild
            className="flex-1 bg-[#25D366] hover:bg-[#1da851] text-white rounded-lg btn-whatsapp"
            disabled={!isAvailable}
            data-testid={`vehicle-whatsapp-btn-${id}`}
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={!isAvailable ? 'pointer-events-none opacity-50' : ''}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
