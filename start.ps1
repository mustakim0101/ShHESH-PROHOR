$Port = 8000
Start-Process "http://localhost:$Port"
python -m http.server $Port


