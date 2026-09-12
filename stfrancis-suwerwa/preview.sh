#!/usr/bin/env bash
# Local preview for the St. Francis website (macOS / Linux).
echo
echo "  Website           >  http://localhost:8000"
echo "  Content manager   >  http://localhost:8000/admin/"
echo "  Offline dashboard >  http://localhost:8000/dashboard/"
echo "  Ctrl+C to stop."
echo
python3 -m http.server 8000
