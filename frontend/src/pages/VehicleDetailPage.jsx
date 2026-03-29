import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Fuel, 
  Settings, 
  Gauge, 
  MessageCircle,
  Share2,
  Heart,
  Check
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ImageGallery } from '../components/ImageGallery';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Separator } from '../components/ui/separator';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/vehicles/${id}`);
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setVehicle(response.data);
        }
      } catch (err) {
        setError('Impossible de charger les détails du véhicule');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${vehicle.marque} ${vehicle.modele}`,
          text: `Découvrez ce ${vehicle.marque} ${vehicle.modele} à ${vehicle.prix.toLocaleString('fr-FR')} $`,
          url
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Erreur lors du partage:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-12 w-1/2" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-4">
              {error || 'Véhicule non trouvé'}
            </h1>
            <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au catalogue
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isAvailable = vehicle.statut === 'Disponible';
  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis intéressé par ${vehicle.marque} ${vehicle.modele} (${vehicle.annee}) à ${vehicle.prix.toLocaleString('fr-FR')} USD. Réf: ${vehicle.id}`
  );
  const whatsappUrl = `https://wa.me/${vehicle.contact}?text=${whatsappMessage}`;

  const specs = [
    { icon: Calendar, label: 'Année', value: vehicle.annee },
    { icon: Fuel, label: 'Carburant', value: vehicle.carburant },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission },
    { icon: MapPin, label: 'Localisation', value: vehicle.localisation },
    { icon: Gauge, label: 'Kilométrage', value: vehicle.kilometrage ? `${vehicle.kilometrage.toLocaleString('fr-FR')} km` : 'N/A' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50" data-testid="vehicle-detail-page">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-orange-500 transition-colors mb-8"
          data-testid="back-link"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour au catalogue</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Gallery */}
          <div>
            <ImageGallery 
              images={vehicle.images} 
              vehicleName={`${vehicle.marque} ${vehicle.modele}`}
            />
          </div>

          {/* Right Column - Info */}
          <div className="flex flex-col gap-6" data-testid="vehicle-info-panel">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge 
                  className={`${
                    isAvailable 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                      : 'bg-rose-100 text-rose-800 border-rose-200'
                  } font-medium px-3 py-1`}
                  data-testid="detail-status-badge"
                >
                  {vehicle.statut}
                </Badge>
                <span className="text-zinc-400 text-sm">Réf: {vehicle.id}</span>
              </div>
              
              <h1 
                className="font-heading text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight"
                data-testid="detail-title"
              >
                {vehicle.marque} {vehicle.modele}
              </h1>
            </div>

            {/* Price */}
            <div 
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-6"
              data-testid="detail-price-card"
            >
              <p className="text-orange-100 text-sm font-medium mb-1">Prix</p>
              <p className="text-3xl sm:text-4xl font-bold">
                {vehicle.prix.toLocaleString('fr-FR')} $
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {specs.map((spec, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-4 border border-zinc-100"
                  data-testid={`spec-${spec.label.toLowerCase()}`}
                >
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <spec.icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{spec.label}</span>
                  </div>
                  <p className="font-semibold text-zinc-900">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="bg-white rounded-xl p-6 border border-zinc-100">
                <h3 className="font-heading font-bold text-lg text-zinc-900 mb-3">
                  Description
                </h3>
                <p className="text-zinc-600 leading-relaxed" data-testid="detail-description">
                  {vehicle.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className={`flex-1 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl h-14 text-lg font-semibold btn-whatsapp ${
                  !isAvailable ? 'opacity-50 pointer-events-none' : ''
                }`}
                disabled={!isAvailable}
                data-testid="detail-whatsapp-btn"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Contacter via WhatsApp
                </a>
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={handleShare}
                data-testid="share-btn"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-emerald-500" />
                    Lien copié !
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                data-testid="favorite-btn"
              >
                <Heart className="w-4 h-4 mr-2" />
                Favoris
              </Button>
            </div>

            {/* Contact Info */}
            <div className="bg-zinc-100 rounded-xl p-4 text-center">
              <p className="text-zinc-600 text-sm">
                Des questions ? Contactez-nous directement au{' '}
                <a 
                  href={`tel:+${vehicle.contact}`} 
                  className="font-semibold text-orange-500 hover:underline"
                >
                  +{vehicle.contact}
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
