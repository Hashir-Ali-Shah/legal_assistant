import subprocess
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def run_backend_tests():
    print("=" * 50)
    print("Running Backend Tests (Pytest)...")
    print("=" * 50)
    
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    
    try:
        # Run pytest via uv
        result = subprocess.run(
            ["uv", "run", "pytest", "../tests/backend", "-v"],
            cwd=backend_dir,
            text=True,
            capture_output=True,
            shell=True,
            encoding='utf-8',
            errors='replace'
        )
        print(result.stdout)
        if result.stderr:
            print(result.stderr)
            
        if result.returncode == 0:
            print("\n[PASS] Backend tests passed successfully!")
            return True
        else:
            print("\n[FAIL] Backend tests failed!")
            return False
    except Exception as e:
        print(f"Failed to run backend tests: {e}")
        return False

if __name__ == "__main__":
    print("Starting Lawbot Test Suite...")
    backend_success = run_backend_tests()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print(f"Backend: {'[PASS] Passed' if backend_success else '[FAIL] Failed'}")
    print("=" * 50)
    
    if backend_success:
        print("\nAll tests completed successfully!")
        sys.exit(0)
    else:
        print("\nSome tests failed. Check the logs above.")
        sys.exit(1)
