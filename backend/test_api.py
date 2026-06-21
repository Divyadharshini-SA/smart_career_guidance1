import urllib.request
import json
import urllib.error

key = 'AIzaSyBdM_0dZyRWiBsC0AzkZdHpQLTMLbmNPhY'
req = urllib.request.Request(
    f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={key}',
    data=json.dumps({'contents':[{'parts':[{'text':'hi'}]}]}).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    print(urllib.request.urlopen(req).read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f'HTTPError: {e.code} - {e.read().decode("utf-8")}')
except Exception as e:
    print(f'Error: {e}')
