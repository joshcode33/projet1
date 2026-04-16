"""
Pytest configuration for MySermon AI backend tests
"""
import pytest
import os

# Ensure REACT_APP_BACKEND_URL is available
def pytest_configure(config):
    """Set up test environment"""
    if not os.environ.get('REACT_APP_BACKEND_URL'):
        os.environ['REACT_APP_BACKEND_URL'] = 'https://predication-ia.preview.emergentagent.com'
