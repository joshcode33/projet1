import requests
import sys
from datetime import datetime

class AutoCommissionAPITester:
    def __init__(self, base_url="https://drive-marketplace-6.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=params, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    data = response.json()
                    if isinstance(data, list):
                        print(f"   Response: List with {len(data)} items")
                    elif isinstance(data, dict):
                        print(f"   Response: Dict with keys: {list(data.keys())}")
                    return True, data
                except:
                    print(f"   Response: Non-JSON content")
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_get_vehicles(self):
        """Test get all vehicles"""
        success, data = self.run_test("Get All Vehicles", "GET", "vehicles", 200)
        if success and isinstance(data, list):
            print(f"   Found {len(data)} vehicles")
            if len(data) > 0:
                vehicle = data[0]
                required_fields = ['id', 'marque', 'modele', 'prix', 'localisation', 'annee', 'carburant', 'transmission', 'statut', 'images', 'contact']
                missing_fields = [field for field in required_fields if field not in vehicle]
                if missing_fields:
                    print(f"   ⚠️  Missing fields in vehicle: {missing_fields}")
                else:
                    print(f"   ✅ Vehicle structure is complete")
                    print(f"   Sample vehicle: {vehicle['marque']} {vehicle['modele']} - {vehicle['prix']} $ - {vehicle['statut']}")
        return success, data

    def test_get_vehicle_by_id(self, vehicle_id="1"):
        """Test get vehicle by ID"""
        success, data = self.run_test(f"Get Vehicle by ID ({vehicle_id})", "GET", f"vehicles/{vehicle_id}", 200)
        if success and isinstance(data, dict):
            if 'error' in data:
                print(f"   ⚠️  API returned error: {data['error']}")
                return False, data
            else:
                print(f"   Vehicle: {data.get('marque', 'N/A')} {data.get('modele', 'N/A')}")
                print(f"   Contact: {data.get('contact', 'N/A')}")
        return success, data

    def test_get_locations(self):
        """Test get locations"""
        success, data = self.run_test("Get Locations", "GET", "locations", 200)
        if success and isinstance(data, list):
            print(f"   Found {len(data)} locations: {data}")
        return success, data

    def test_get_stats(self):
        """Test get statistics"""
        success, data = self.run_test("Get Statistics", "GET", "stats", 200)
        if success and isinstance(data, dict):
            print(f"   Stats: Total={data.get('total', 0)}, Disponibles={data.get('disponibles', 0)}, Vendus={data.get('vendus', 0)}")
        return success, data

    def test_vehicle_filters(self):
        """Test vehicle filtering"""
        print(f"\n🔍 Testing Vehicle Filters...")
        
        # Test search filter
        success, data = self.run_test("Search Filter (Toyota)", "GET", "vehicles", 200, {"search": "Toyota"})
        if success:
            toyota_count = len([v for v in data if 'toyota' in v.get('marque', '').lower()])
            print(f"   Found {len(data)} vehicles with Toyota search, {toyota_count} actual Toyota vehicles")

        # Test price filter
        success, data = self.run_test("Price Filter (max 30000)", "GET", "vehicles", 200, {"prix_max": 30000})
        if success:
            over_price = [v for v in data if v.get('prix', 0) > 30000]
            if over_price:
                print(f"   ⚠️  Found {len(over_price)} vehicles over price limit")
            else:
                print(f"   ✅ Price filter working correctly")

        # Test location filter
        success, data = self.run_test("Location Filter (Kinshasa)", "GET", "vehicles", 200, {"localisation": "Kinshasa"})
        if success:
            non_kinshasa = [v for v in data if v.get('localisation', '').lower() != 'kinshasa']
            if non_kinshasa:
                print(f"   ⚠️  Found {len(non_kinshasa)} vehicles not in Kinshasa")
            else:
                print(f"   ✅ Location filter working correctly")

        # Test status filter
        success, data = self.run_test("Status Filter (Disponible)", "GET", "vehicles", 200, {"statut": "Disponible"})
        if success:
            non_available = [v for v in data if v.get('statut', '').lower() != 'disponible']
            if non_available:
                print(f"   ⚠️  Found {len(non_available)} vehicles not available")
            else:
                print(f"   ✅ Status filter working correctly")

    def test_invalid_vehicle_id(self):
        """Test invalid vehicle ID"""
        success, data = self.run_test("Invalid Vehicle ID", "GET", "vehicles/999", 200)
        if success and isinstance(data, dict) and 'error' in data:
            print(f"   ✅ Correctly returns error for invalid ID")
            return True, data
        else:
            print(f"   ⚠️  Should return error for invalid vehicle ID")
            return False, data

def main():
    print("🚗 AutoCommission API Testing Started")
    print("=" * 50)
    
    tester = AutoCommissionAPITester()
    
    # Test all endpoints
    tester.test_root_endpoint()
    
    vehicles_success, vehicles_data = tester.test_get_vehicles()
    
    if vehicles_success and vehicles_data:
        # Test with first vehicle ID
        first_vehicle_id = vehicles_data[0].get('id', '1')
        tester.test_get_vehicle_by_id(first_vehicle_id)
    
    tester.test_get_locations()
    tester.test_get_stats()
    tester.test_vehicle_filters()
    tester.test_invalid_vehicle_id()

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())