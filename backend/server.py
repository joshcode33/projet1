from fastapi import FastAPI, APIRouter, Query, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Vehicle Model
class Vehicle(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    marque: str
    modele: str
    prix: int
    localisation: str
    annee: int
    carburant: str
    transmission: str
    statut: str  # "Disponible" ou "Vendu"
    images: List[str]
    contact: str
    kilometrage: Optional[int] = None
    description: Optional[str] = None

# Demo vehicles data
DEMO_VEHICLES: List[dict] = [
    {
        "id": "1",
        "marque": "Toyota",
        "modele": "Harrier",
        "prix": 15000,
        "localisation": "Kinshasa",
        "annee": 2019,
        "carburant": "Essence",
        "transmission": "Automatique",
        "statut": "Disponible",
        "images": [
            "https://images.unsplash.com/photo-1758216991743-110e7a093f29?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBsdXh1cnklMjBzdXYlMjBvbiUyMHJvYWR8ZW58MHx8fHwxNzc0ODEzNzQyfDA&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800"
        ],
        "contact": "243975814951",
        "kilometrage": 45000,
        "description": "Toyota Harrier en excellent état, bien entretenu avec carnet de bord complet."
    },
    {
        "id": "2",
        "marque": "Mercedes-Benz",
        "modele": "G-Wagon",
        "prix": 85000,
        "localisation": "Lubumbashi",
        "annee": 2021,
        "carburant": "Diesel",
        "transmission": "Automatique",
        "statut": "Disponible",
        "images": [
            "https://images.unsplash.com/photo-1761757414353-44a9718106f7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBsdXh1cnklMjBzdXYlMjBvbiUyMHJvYWR8ZW58MHx8fHwxNzc0ODEzNzQyfDA&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800",
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
        ],
        "contact": "243975814951",
        "kilometrage": 12000,
        "description": "Mercedes G-Wagon luxueux, intérieur cuir, toutes options incluses."
    },
    {
        "id": "3",
        "marque": "Land Rover",
        "modele": "Range Rover Sport",
        "prix": 42000,
        "localisation": "Kinshasa",
        "annee": 2020,
        "carburant": "Diesel",
        "transmission": "Automatique",
        "statut": "Vendu",
        "images": [
            "https://images.pexels.com/photos/33390082/pexels-photo-33390082.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"
        ],
        "contact": "243975814951",
        "kilometrage": 38000,
        "description": "Range Rover Sport en parfait état, jantes 22 pouces, toit panoramique."
    },
    {
        "id": "4",
        "marque": "Toyota",
        "modele": "Land Cruiser Prado",
        "prix": 28000,
        "localisation": "Goma",
        "annee": 2018,
        "carburant": "Diesel",
        "transmission": "Automatique",
        "statut": "Disponible",
        "images": [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"
        ],
        "contact": "243975814951",
        "kilometrage": 67000,
        "description": "Land Cruiser Prado robuste, idéal pour tous terrains, 7 places."
    },
    {
        "id": "5",
        "marque": "BMW",
        "modele": "X5",
        "prix": 35000,
        "localisation": "Kinshasa",
        "annee": 2019,
        "carburant": "Essence",
        "transmission": "Automatique",
        "statut": "Disponible",
        "images": [
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
            "https://images.unsplash.com/photo-1523983302122-a5b2f0feb40e?w=800",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"
        ],
        "contact": "243975814951",
        "kilometrage": 52000,
        "description": "BMW X5 sportif et élégant, intérieur luxueux, système audio premium."
    },
    {
        "id": "6",
        "marque": "Lexus",
        "modele": "RX 350",
        "prix": 22000,
        "localisation": "Lubumbashi",
        "annee": 2017,
        "carburant": "Essence",
        "transmission": "Automatique",
        "statut": "Disponible",
        "images": [
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800"
        ],
        "contact": "243975814951",
        "kilometrage": 78000,
        "description": "Lexus RX 350 confortable et fiable, parfait état mécanique."
    },
    {
        "id": "7",
        "marque": "Audi",
        "modele": "Q7",
        "prix": 38000,
        "localisation": "Kinshasa",
        "annee": 2020,
        "carburant": "Diesel",
        "transmission": "Automatique",
        "statut": "Disponible",
        "images": [
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800"
        ],
        "contact": "243975814951",
        "kilometrage": 32000,
        "description": "Audi Q7 quattro, technologie de pointe, 7 places familiales."
    },
    {
        "id": "8",
        "marque": "Nissan",
        "modele": "Patrol",
        "prix": 45000,
        "localisation": "Goma",
        "annee": 2021,
        "carburant": "Essence",
        "transmission": "Automatique",
        "statut": "Vendu",
        "images": [
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
            "https://images.unsplash.com/photo-1523983302122-a5b2f0feb40e?w=800"
        ],
        "contact": "243975814951",
        "kilometrage": 18000,
        "description": "Nissan Patrol V8, puissance et confort, véhicule de luxe tout-terrain."
    },
    {
        "id": "9",
        "marque": "Honda",
        "modele": "CR-V",
        "prix": 18000,
        "localisation": "Kinshasa",
        "annee": 2018,
        "carburant": "Essence",
        "transmission": "Automatique",
        "statut": "Disponible",
        "images": [
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800"
        ],
        "contact": "243975814951",
        "kilometrage": 55000,
        "description": "Honda CR-V économique et pratique, idéal pour la famille."
    }
]

# Routes
@api_router.get("/")
async def root():
    return {"message": "AutoCommission API - Bienvenue"}

@api_router.get("/vehicles", response_model=List[Vehicle])
async def get_vehicles(
    search: Optional[str] = Query(None, description="Recherche par marque ou modèle"),
    prix_min: Optional[int] = Query(None, description="Prix minimum"),
    prix_max: Optional[int] = Query(None, description="Prix maximum"),
    localisation: Optional[str] = Query(None, description="Filtrer par localisation"),
    carburant: Optional[str] = Query(None, description="Filtrer par type de carburant"),
    transmission: Optional[str] = Query(None, description="Filtrer par transmission"),
    statut: Optional[str] = Query(None, description="Filtrer par statut")
):
    """Récupérer la liste des véhicules avec filtres optionnels"""
    vehicles = DEMO_VEHICLES.copy()
    
    # Filter by search term (marque or modele)
    if search:
        search_lower = search.lower()
        vehicles = [v for v in vehicles if 
                   search_lower in v["marque"].lower() or 
                   search_lower in v["modele"].lower()]
    
    # Filter by price range
    if prix_min is not None:
        vehicles = [v for v in vehicles if v["prix"] >= prix_min]
    if prix_max is not None:
        vehicles = [v for v in vehicles if v["prix"] <= prix_max]
    
    # Filter by location
    if localisation:
        vehicles = [v for v in vehicles if v["localisation"].lower() == localisation.lower()]
    
    # Filter by fuel type
    if carburant:
        vehicles = [v for v in vehicles if v["carburant"].lower() == carburant.lower()]
    
    # Filter by transmission
    if transmission:
        vehicles = [v for v in vehicles if v["transmission"].lower() == transmission.lower()]
    
    # Filter by status
    if statut:
        vehicles = [v for v in vehicles if v["statut"].lower() == statut.lower()]
    
    return vehicles

@api_router.get("/vehicles/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: str):
    """Récupérer les détails d'un véhicule par son ID"""
    for vehicle in DEMO_VEHICLES:
        if vehicle["id"] == vehicle_id:
            return vehicle
    raise HTTPException(status_code=404, detail="Véhicule non trouvé")

@api_router.get("/locations")
async def get_locations():
    """Récupérer la liste des localisations disponibles"""
    locations = list(set(v["localisation"] for v in DEMO_VEHICLES))
    return sorted(locations)

@api_router.get("/stats")
async def get_stats():
    """Récupérer les statistiques du catalogue"""
    total = len(DEMO_VEHICLES)
    disponibles = len([v for v in DEMO_VEHICLES if v["statut"] == "Disponible"])
    vendus = len([v for v in DEMO_VEHICLES if v["statut"] == "Vendu"])
    return {
        "total": total,
        "disponibles": disponibles,
        "vendus": vendus
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
