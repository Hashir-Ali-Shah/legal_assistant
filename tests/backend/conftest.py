import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Add this directory so test_settings can be imported
current_dir = os.path.abspath(os.path.dirname(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
