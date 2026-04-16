"""
MySermon AI — Backend API Tests
================================
Tests for all backend endpoints:
- GET /api/ — Health check and configuration
- POST /api/ia/generer-predication — Sermon generation
- POST /api/ia/suggerer-versets — Bible verse suggestions
- POST /api/ia/assistant — Text assistant (reformuler, corriger, developper, illustrer)
- Error handling (422 validation errors)
"""

import pytest
import requests
import os
import time

# Use the public URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://predication-ia.preview.emergentagent.com').rstrip('/')

# Longer timeout for AI calls (can take 10-30s)
AI_TIMEOUT = 90


@pytest.fixture(scope="module")
def api_client():
    """Shared requests session with appropriate headers"""
    session = requests.Session()
    session.headers.update({
        "Content-Type": "application/json",
        "Accept": "application/json"
    })
    return session


class TestHealthEndpoint:
    """Tests for GET /api/ — Health check and configuration"""
    
    def test_root_endpoint_returns_200(self, api_client):
        """Verify root endpoint returns 200 OK"""
        response = api_client.get(f"{BASE_URL}/api/", timeout=10)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"✓ Root endpoint returned 200 OK")
    
    def test_root_endpoint_json_structure(self, api_client):
        """Verify root endpoint returns correct JSON structure"""
        response = api_client.get(f"{BASE_URL}/api/", timeout=10)
        data = response.json()
        
        # Check required fields
        assert "application" in data, "Missing 'application' field"
        assert data["application"] == "MySermon AI", f"Expected 'MySermon AI', got '{data['application']}'"
        
        assert "statut" in data, "Missing 'statut' field"
        assert data["statut"] == "en ligne", f"Expected 'en ligne', got '{data['statut']}'"
        
        assert "openai_direct" in data, "Missing 'openai_direct' field"
        assert isinstance(data["openai_direct"], bool), "openai_direct should be boolean"
        
        assert "emergent_llm" in data, "Missing 'emergent_llm' field"
        assert isinstance(data["emergent_llm"], bool), "emergent_llm should be boolean"
        
        print(f"✓ Root endpoint JSON structure valid: {data}")


class TestGenererPredication:
    """Tests for POST /api/ia/generer-predication — Sermon generation"""
    
    def test_generer_predication_success(self, api_client):
        """Test successful sermon generation with valid input"""
        payload = {
            "titre": "L'amour de Dieu",
            "theme": "L'amour inconditionnel",
            "verset_principal": "Jean 3:16",
            "objectif": "Encourager les fidèles",
            "notes": "Prédication pour le dimanche de Pâques"
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/generer-predication",
            json=payload,
            timeout=AI_TIMEOUT
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        
        # Verify response structure matches PredicationGeneree model
        assert "introduction" in data, "Missing 'introduction' field"
        assert isinstance(data["introduction"], str), "introduction should be string"
        assert len(data["introduction"]) > 0, "introduction should not be empty"
        
        assert "points" in data, "Missing 'points' field"
        assert isinstance(data["points"], list), "points should be a list"
        assert len(data["points"]) >= 3, f"Expected at least 3 points, got {len(data['points'])}"
        
        # Verify each point has titre and explication
        for i, point in enumerate(data["points"]):
            assert "titre" in point, f"Point {i} missing 'titre'"
            assert "explication" in point, f"Point {i} missing 'explication'"
            assert isinstance(point["titre"], str), f"Point {i} titre should be string"
            assert isinstance(point["explication"], str), f"Point {i} explication should be string"
        
        assert "conclusion" in data, "Missing 'conclusion' field"
        assert isinstance(data["conclusion"], str), "conclusion should be string"
        assert len(data["conclusion"]) > 0, "conclusion should not be empty"
        
        print(f"✓ Sermon generation successful with {len(data['points'])} points")
    
    def test_generer_predication_minimal_input(self, api_client):
        """Test sermon generation with only required field (titre)"""
        payload = {
            "titre": "La foi qui déplace les montagnes"
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/generer-predication",
            json=payload,
            timeout=AI_TIMEOUT
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "introduction" in data
        assert "points" in data
        assert len(data["points"]) >= 3
        assert "conclusion" in data
        
        print(f"✓ Minimal input sermon generation successful")
    
    def test_generer_predication_missing_titre_returns_422(self, api_client):
        """Test that missing titre returns 422 validation error"""
        payload = {
            "theme": "L'amour",
            "verset_principal": "Jean 3:16"
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/generer-predication",
            json=payload,
            timeout=10
        )
        
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Missing titre correctly returns 422")
    
    def test_generer_predication_empty_body_returns_422(self, api_client):
        """Test that empty body returns 422 validation error"""
        response = api_client.post(
            f"{BASE_URL}/api/ia/generer-predication",
            json={},
            timeout=10
        )
        
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Empty body correctly returns 422")
    
    def test_generer_predication_empty_titre_returns_422(self, api_client):
        """Test that empty titre string returns 422 validation error"""
        payload = {
            "titre": ""
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/generer-predication",
            json=payload,
            timeout=10
        )
        
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Empty titre correctly returns 422")


class TestSuggererVersets:
    """Tests for POST /api/ia/suggerer-versets — Bible verse suggestions"""
    
    def test_suggerer_versets_success(self, api_client):
        """Test successful verse suggestion with valid input"""
        payload = {
            "theme": "l'espérance",
            "nombre": 5
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/suggerer-versets",
            json=payload,
            timeout=AI_TIMEOUT
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        
        # Response should be a list of VersetSuggere
        assert isinstance(data, list), "Response should be a list"
        assert len(data) > 0, "Should return at least one verse"
        
        # Verify each verse has reference and texte
        for i, verset in enumerate(data):
            assert "reference" in verset, f"Verse {i} missing 'reference'"
            assert "texte" in verset, f"Verse {i} missing 'texte'"
            assert isinstance(verset["reference"], str), f"Verse {i} reference should be string"
            assert isinstance(verset["texte"], str), f"Verse {i} texte should be string"
        
        print(f"✓ Verse suggestion successful, returned {len(data)} verses")
    
    def test_suggerer_versets_default_nombre(self, api_client):
        """Test verse suggestion with default nombre (5)"""
        payload = {
            "theme": "la paix"
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/suggerer-versets",
            json=payload,
            timeout=AI_TIMEOUT
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Default nombre verse suggestion successful, returned {len(data)} verses")
    
    def test_suggerer_versets_missing_theme_returns_422(self, api_client):
        """Test that missing theme returns 422 validation error"""
        payload = {
            "nombre": 5
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/suggerer-versets",
            json=payload,
            timeout=10
        )
        
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Missing theme correctly returns 422")
    
    def test_suggerer_versets_empty_theme_returns_422(self, api_client):
        """Test that empty theme returns 422 validation error"""
        payload = {
            "theme": "",
            "nombre": 5
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/suggerer-versets",
            json=payload,
            timeout=10
        )
        
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Empty theme correctly returns 422")


class TestAssistant:
    """Tests for POST /api/ia/assistant — Text assistant"""
    
    def test_assistant_reformuler_success(self, api_client):
        """Test assistant with 'reformuler' action"""
        payload = {
            "action": "reformuler",
            "texte": "Dieu nous aime beaucoup et il veut qu'on soit heureux.",
            "contexte": "Prédication sur l'amour de Dieu"
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/assistant",
            json=payload,
            timeout=AI_TIMEOUT
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "resultat" in data, "Missing 'resultat' field"
        assert isinstance(data["resultat"], str), "resultat should be string"
        assert len(data["resultat"]) > 0, "resultat should not be empty"
        
        print(f"✓ Assistant 'reformuler' successful")
    
    def test_assistant_corriger_success(self, api_client):
        """Test assistant with 'corriger' action"""
        payload = {
            "action": "corriger",
            "texte": "Dieu nous aime et il veux que nous soyons heureus.",
            "contexte": ""
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/assistant",
            json=payload,
            timeout=AI_TIMEOUT
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "resultat" in data
        assert isinstance(data["resultat"], str)
        
        print(f"✓ Assistant 'corriger' successful")
    
    def test_assistant_developper_success(self, api_client):
        """Test assistant with 'developper' action"""
        payload = {
            "action": "developper",
            "texte": "La foi est importante pour le chrétien.",
            "contexte": "Introduction d'une prédication"
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/assistant",
            json=payload,
            timeout=AI_TIMEOUT
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "resultat" in data
        assert isinstance(data["resultat"], str)
        # Developed text should be longer than original
        assert len(data["resultat"]) > len(payload["texte"]), "Developed text should be longer"
        
        print(f"✓ Assistant 'developper' successful")
    
    def test_assistant_illustrer_success(self, api_client):
        """Test assistant with 'illustrer' action"""
        payload = {
            "action": "illustrer",
            "texte": "Dieu est notre refuge et notre force.",
            "contexte": "Prédication sur le Psaume 46"
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/assistant",
            json=payload,
            timeout=AI_TIMEOUT
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "resultat" in data
        assert isinstance(data["resultat"], str)
        
        print(f"✓ Assistant 'illustrer' successful")
    
    def test_assistant_invalid_action_returns_422(self, api_client):
        """Test that invalid action returns 422 (Pydantic Literal validation)"""
        payload = {
            "action": "traduire",  # Invalid action
            "texte": "Test text",
            "contexte": ""
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/assistant",
            json=payload,
            timeout=10
        )
        
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Invalid action correctly returns 422")
    
    def test_assistant_missing_action_returns_422(self, api_client):
        """Test that missing action returns 422"""
        payload = {
            "texte": "Test text",
            "contexte": ""
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/assistant",
            json=payload,
            timeout=10
        )
        
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Missing action correctly returns 422")
    
    def test_assistant_missing_texte_returns_422(self, api_client):
        """Test that missing texte returns 422"""
        payload = {
            "action": "reformuler",
            "contexte": "Some context"
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/assistant",
            json=payload,
            timeout=10
        )
        
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Missing texte correctly returns 422")
    
    def test_assistant_empty_texte_returns_422(self, api_client):
        """Test that empty texte returns 422"""
        payload = {
            "action": "reformuler",
            "texte": "",
            "contexte": ""
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/ia/assistant",
            json=payload,
            timeout=10
        )
        
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Empty texte correctly returns 422")


class TestErrorHandling:
    """Additional error handling tests"""
    
    def test_invalid_json_returns_422(self, api_client):
        """Test that invalid JSON returns 422"""
        response = api_client.post(
            f"{BASE_URL}/api/ia/generer-predication",
            data="not valid json",
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Invalid JSON correctly returns 422")
    
    def test_nonexistent_endpoint_returns_404(self, api_client):
        """Test that nonexistent endpoint returns 404"""
        response = api_client.get(
            f"{BASE_URL}/api/nonexistent",
            timeout=10
        )
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print(f"✓ Nonexistent endpoint correctly returns 404")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
