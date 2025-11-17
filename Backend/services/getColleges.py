import requests
url = "https://colleges-api-india.fly.dev/colleges/district"
headers = {"District": "nagpur", "Offset": "0"}
resp = requests.post(url, headers=headers)
# Output the response in a readable format
import json
print(json.dumps(resp.json(), indent=4))