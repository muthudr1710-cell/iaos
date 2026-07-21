import sys
import os

# Add backend folder to path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app
