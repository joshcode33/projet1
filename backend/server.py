"""
MySermon AI — Backend FastAPI
--------------------------------
Proxy sécurisé vers l'IA pour la génération de prédications, la suggestion de
versets et l'assistant IA. L'auth et la base de données passent directement
côté frontend via Supabase.

Deux voies d'appel IA possibles :
  1. OPENAI_API_KEY — clé OpenAI directe (SDK officiel)
  2. EMERGENT_LLM_KEY — clé universelle Emergent (via emergentintegrations)

Si la voie 1 échoue (quota, clé invalide…), on bascule automatiquement sur 2.
"""

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
from emergentintegrations.llm.chat import LlmChat, UserMessage
import os
import json
import uuid
import logging

# ──────────────────────────── Configuration ────────────────────────────
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("mysermon")

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
MODELE_OPENAI = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

client_openai = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
UTILISER_EMERGENT = bool(EMERGENT_LLM_KEY)

logger.info(
    "IA configurée — OpenAI direct: %s, Emergent: %s, modèle: %s",
    client_openai is not None,
    UTILISER_EMERGENT,
    MODELE_OPENAI,
)

app = FastAPI(title="MySermon AI — API")
routeur = APIRouter(prefix="/api")


# ──────────────────────────── Schémas ──────────────────────────────────
class DemandePredication(BaseModel):
    titre: str = Field(..., min_length=1)
    theme: Optional[str] = ""
    verset_principal: Optional[str] = ""
    objectif: Optional[str] = ""
    notes: Optional[str] = ""


class PointPredication(BaseModel):
    titre: str
    explication: str


class PredicationGeneree(BaseModel):
    introduction: str
    points: List[PointPredication]
    conclusion: str


class DemandeVersets(BaseModel):
    theme: str = Field(..., min_length=1)
    nombre: int = 5


class VersetSuggere(BaseModel):
    reference: str
    texte: str


class DemandeAssistant(BaseModel):
    action: Literal["reformuler", "corriger", "developper", "illustrer"]
    texte: str = Field(..., min_length=1)
    contexte: Optional[str] = ""


class ReponseAssistant(BaseModel):
    resultat: str


# ──────────────────────────── Helpers IA ───────────────────────────────
def _extraire_json(contenu: str) -> dict:
    """Extrait un objet JSON d'une réponse LLM, même encadrée de ```json."""
    contenu = (contenu or "").strip()
    if contenu.startswith("```"):
        contenu = contenu.strip("`").strip()
        if contenu.lower().startswith("json"):
            contenu = contenu[4:].strip()
    debut = contenu.find("{")
    fin = contenu.rfind("}")
    if debut != -1 and fin != -1 and fin > debut:
        contenu = contenu[debut : fin + 1]
    return json.loads(contenu)


async def _appeler_emergent_texte(systeme: str, utilisateur: str) -> str:
    """Appel IA via Emergent (clé universelle) — retourne du texte brut."""
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"mysermon-{uuid.uuid4()}",
        system_message=systeme,
    ).with_model("openai", MODELE_OPENAI)
    reponse = await chat.send_message(UserMessage(text=utilisateur))
    return reponse.strip() if isinstance(reponse, str) else str(reponse)


async def appeler_ia_json(systeme: str, utilisateur: str) -> dict:
    """Appel IA attendant un objet JSON. Essaie OpenAI direct, puis Emergent."""
    if client_openai is None and not UTILISER_EMERGENT:
        raise HTTPException(500, "Aucune clé IA configurée.")

    derniere_erreur = None

    # Voie 1 : OpenAI direct
    if client_openai is not None:
        try:
            reponse = client_openai.chat.completions.create(
                model=MODELE_OPENAI,
                messages=[
                    {"role": "system", "content": systeme},
                    {"role": "user", "content": utilisateur},
                ],
                response_format={"type": "json_object"},
                temperature=0.7,
            )
            return json.loads(reponse.choices[0].message.content)
        except Exception as err:
            derniere_erreur = err
            logger.warning("OpenAI direct JSON a échoué (%s).", err)

    # Voie 2 : Emergent
    if UTILISER_EMERGENT:
        consigne = (
            systeme
            + "\n\nIMPORTANT : Réponds STRICTEMENT avec un objet JSON valide. "
            + "Aucun texte autour, aucun bloc de code Markdown."
        )
        try:
            contenu = await _appeler_emergent_texte(consigne, utilisateur)
            return _extraire_json(contenu)
        except Exception as err:
            derniere_erreur = err
            logger.exception("Emergent JSON a échoué : %s", err)

    raise HTTPException(500, f"Erreur IA : {derniere_erreur}")


async def appeler_ia_texte(systeme: str, utilisateur: str) -> str:
    """Appel IA attendant du texte libre."""
    if client_openai is None and not UTILISER_EMERGENT:
        raise HTTPException(500, "Aucune clé IA configurée.")

    derniere_erreur = None

    if client_openai is not None:
        try:
            reponse = client_openai.chat.completions.create(
                model=MODELE_OPENAI,
                messages=[
                    {"role": "system", "content": systeme},
                    {"role": "user", "content": utilisateur},
                ],
                temperature=0.7,
            )
            return reponse.choices[0].message.content.strip()
        except Exception as err:
            derniere_erreur = err
            logger.warning("OpenAI direct texte a échoué (%s).", err)

    if UTILISER_EMERGENT:
        try:
            return await _appeler_emergent_texte(systeme, utilisateur)
        except Exception as err:
            derniere_erreur = err
            logger.exception("Emergent texte a échoué : %s", err)

    raise HTTPException(500, f"Erreur IA : {derniere_erreur}")


# ──────────────────────────── Routes ───────────────────────────────────
@routeur.get("/")
async def racine():
    return {
        "application": "MySermon AI",
        "statut": "en ligne",
        "modele_ia": MODELE_OPENAI,
        "openai_direct": client_openai is not None,
        "emergent_llm": UTILISER_EMERGENT,
    }


@routeur.post("/ia/generer-predication", response_model=PredicationGeneree)
async def generer_predication(demande: DemandePredication):
    systeme = (
        "Tu es un assistant théologique chrétien évangélique qui aide les pasteurs "
        "à préparer leurs prédications. Tu écris en français soutenu, chaleureux et "
        "accessible. Tu fondes toujours tes propos sur l'Écriture."
    )
    utilisateur = f"""Prépare une prédication complète à partir des éléments suivants :

Titre : {demande.titre}
Thème : {demande.theme or "(non précisé)"}
Verset principal : {demande.verset_principal or "(à proposer librement)"}
Objectif pastoral : {demande.objectif or "(édifier l'auditoire)"}
Notes du pasteur : {demande.notes or "(aucune)"}

Réponds STRICTEMENT en JSON avec ce format exact :
{{
  "introduction": "paragraphe de 4 à 6 phrases",
  "points": [
    {{"titre": "Titre du point 1", "explication": "4 à 8 phrases avec au moins une référence biblique"}},
    {{"titre": "Titre du point 2", "explication": "4 à 8 phrases avec au moins une référence biblique"}},
    {{"titre": "Titre du point 3", "explication": "4 à 8 phrases avec au moins une référence biblique"}}
  ],
  "conclusion": "3 à 5 phrases avec un appel personnel"
}}"""
    donnees = await appeler_ia_json(systeme, utilisateur)
    try:
        return PredicationGeneree(**donnees)
    except Exception as err:
        logger.error("Structure IA invalide : %s", donnees)
        raise HTTPException(500, "L'IA a renvoyé une structure inattendue.") from err


@routeur.post("/ia/suggerer-versets", response_model=List[VersetSuggere])
async def suggerer_versets(demande: DemandeVersets):
    systeme = (
        "Tu es un assistant biblique. Tu proposes des versets pertinents en français "
        "(traduction Louis Segond 1910 ou Segond 21) avec leur référence exacte."
    )
    utilisateur = f"""Propose {demande.nombre} versets bibliques pertinents sur le thème : "{demande.theme}".
Réponds STRICTEMENT en JSON :
{{
  "versets": [
    {{"reference": "Jean 3:16", "texte": "Car Dieu a tant aimé le monde..."}}
  ]
}}"""
    donnees = await appeler_ia_json(systeme, utilisateur)
    versets_bruts = donnees.get("versets", [])
    return [VersetSuggere(**v) for v in versets_bruts if "reference" in v and "texte" in v]


@routeur.post("/ia/assistant", response_model=ReponseAssistant)
async def assistant(demande: DemandeAssistant):
    consignes = {
        "reformuler": "Reformule le texte ci-dessous en conservant le sens, dans un style soutenu et chaleureux adapté à une prédication. Rends uniquement le texte reformulé.",
        "corriger": "Corrige les fautes d'orthographe, de grammaire et de conjugaison du texte ci-dessous. Rends uniquement le texte corrigé.",
        "developper": "Développe et enrichis le texte ci-dessous en ajoutant des exemples, des références bibliques et des illustrations pertinentes. Rends le texte enrichi.",
        "illustrer": "Propose 2 ou 3 illustrations concrètes (histoires courtes, analogies du quotidien) qui pourraient accompagner le texte ci-dessous lors d'une prédication. Présente-les sous forme de liste.",
    }
    systeme = (
        "Tu es l'assistant de rédaction d'un pasteur francophone. Tu produis du texte "
        "clair, vivant, biblique et respectueux."
    )
    utilisateur = f"""{consignes[demande.action]}

Contexte de la prédication : {demande.contexte or "(non précisé)"}

Texte :
---
{demande.texte}
---"""
    resultat = await appeler_ia_texte(systeme, utilisateur)
    return ReponseAssistant(resultat=resultat)


# ──────────────────────────── Montage ──────────────────────────────────
app.include_router(routeur)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
