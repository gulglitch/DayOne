"""
Quick test script for the Day One API
Run this after starting the server to verify it works
"""
import requests
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing /health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")
    return response.status_code == 200

def test_analyze():
    """Test analyze endpoint"""
    print("Testing /api/analyze endpoint...")
    
    idea = "AI-powered meal planning app for busy professionals"
    response = requests.post(
        f"{BASE_URL}/api/analyze",
        json={"idea": idea}
    )
    
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Session ID: {data.get('session_id')}")
    print(f"Status: {data.get('status')}\n")
    
    return data.get('session_id') if response.status_code == 200 else None

def test_result(session_id):
    """Test result endpoint"""
    print(f"Testing /api/result/{session_id} endpoint...")
    
    # Wait a bit for processing
    print("Waiting 5 seconds for analysis to start...")
    time.sleep(5)
    
    response = requests.get(f"{BASE_URL}/api/result/{session_id}")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Analysis Status: {data.get('status')}")
    print(f"Messages: {len(data.get('messages', []))} agent messages")
    
    if data.get('dossier'):
        print("\n✅ Analysis complete!")
        dossier = data['dossier']
        print(f"Elevator Pitch: {dossier.get('elevator_pitch')}")
    else:
        print(f"\n⏳ Still processing... (Status: {data.get('status')})")
    
    return data

if __name__ == "__main__":
    print("=" * 60)
    print("Day One API Test Script")
    print("=" * 60)
    print("\nMake sure the server is running:")
    print("  uvicorn app.main:app --reload\n")
    print("=" * 60 + "\n")
    
    try:
        # Test health
        if not test_health():
            print("❌ Health check failed. Is the server running?")
            exit(1)
        
        # Test analyze
        session_id = test_analyze()
        if not session_id:
            print("❌ Failed to start analysis")
            exit(1)
        
        # Test result
        result = test_result(session_id)
        
        print("\n" + "=" * 60)
        print("✅ Basic API tests complete!")
        print("=" * 60)
        print(f"\nTo check full results, visit:")
        print(f"  {BASE_URL}/api/result/{session_id}")
        print(f"\nAPI Docs: {BASE_URL}/docs")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server.")
        print("Make sure it's running: uvicorn app.main:app --reload")
    except Exception as e:
        print(f"❌ Error: {e}")
