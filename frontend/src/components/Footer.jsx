import { Car, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading text-xl font-bold">AutoCommission</span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed">
              La plateforme de référence pour l'achat et la vente de véhicules entre commissionnaires et acheteurs en RDC.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-zinc-400 hover:text-orange-500 transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/#catalogue" className="text-zinc-400 hover:text-orange-500 transition-colors text-sm">
                  Catalogue
                </Link>
              </li>
              <li>
                <a 
                  href="https://wa.me/243975814951?text=Bonjour, je souhaite vendre un véhicule" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-orange-500 transition-colors text-sm"
                >
                  Vendre un véhicule
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>Kinshasa, RDC</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>+243 975 814 951</span>
              </li>
              <li>
                <a 
                  href="https://wa.me/243975814951"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-zinc-400 hover:text-[#25D366] transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Besoin d'aide ?</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Contactez-nous directement via WhatsApp pour toute question.
            </p>
            <a
              href="https://wa.me/243975814951?text=Bonjour, j'ai une question"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              data-testid="footer-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4" />
              Discuter sur WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {currentYear} AutoCommission. Tous droits réservés.
          </p>
          <p className="text-zinc-600 text-xs">
            Fait avec passion en RDC
          </p>
        </div>
      </div>
    </footer>
  );
};
