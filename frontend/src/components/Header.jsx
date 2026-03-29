import { Car, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-zinc-200 shadow-sm"
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
            data-testid="logo-link"
          >
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-zinc-950 hidden sm:block">
              AutoCommission
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            <Link 
              to="/"
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                isActive('/') ? 'text-orange-500' : 'text-zinc-600'
              }`}
              data-testid="nav-home"
            >
              Accueil
            </Link>
            <Link 
              to="/#catalogue"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-orange-500"
              data-testid="nav-catalogue"
            >
              Catalogue
            </Link>
            <a 
              href={`https://wa.me/243975814951?text=${encodeURIComponent('Bonjour, je souhaite vendre un véhicule')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-orange-500"
              data-testid="nav-sell"
            >
              Vendre
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-6"
              data-testid="header-cta"
            >
              <a 
                href={`https://wa.me/243975814951?text=${encodeURIComponent('Bonjour, je recherche un véhicule')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Contactez-nous
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-zinc-700" />
            ) : (
              <Menu className="w-6 h-6 text-zinc-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden py-4 border-t border-zinc-100"
            data-testid="mobile-menu"
          >
            <nav className="flex flex-col gap-4">
              <Link 
                to="/"
                className={`text-sm font-medium px-2 py-2 rounded-lg transition-colors ${
                  isActive('/') ? 'bg-orange-50 text-orange-500' : 'text-zinc-600 hover:bg-zinc-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/#catalogue"
                className="text-sm font-medium px-2 py-2 rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catalogue
              </Link>
              <a 
                href={`https://wa.me/243975814951?text=${encodeURIComponent('Bonjour, je souhaite vendre un véhicule')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium px-2 py-2 rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Vendre
              </a>
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg mt-2"
              >
                <a 
                  href={`https://wa.me/243975814951?text=${encodeURIComponent('Bonjour, je recherche un véhicule')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contactez-nous
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
