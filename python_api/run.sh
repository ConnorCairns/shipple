gunicorn --worker-class gevent --workers 8 --bind 0.0.0.0:8080 main:app --max-requests 10000 --timeout 30 --keep-alive 5 --log-level info