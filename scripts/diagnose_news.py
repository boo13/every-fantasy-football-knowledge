import hashlib
import urllib.request
import xml.etree.ElementTree as ET

from collect import NEWS

request = urllib.request.Request(NEWS, headers={"User-Agent": "every-fantasy-football-knowledge/1.0"})
with urllib.request.urlopen(request, timeout=30) as response:
    body = response.read(1_000_000)
    print("Public news response:", {key: response.headers.get(key) for key in ("Content-Type", "Content-Encoding", "Content-Length")})
    print("Bytes:", len(body), "SHA-256:", hashlib.sha256(body).hexdigest())
    try:
        ET.fromstring(body)
        print("XML parsing succeeded")
    except ET.ParseError as error:
        print("XML parse position:", error.position)
        lines = body.splitlines()
        row = lines[min(error.position[0] - 1, len(lines) - 1)] if lines else b""
        column = error.position[1]
        print("Public response excerpt:", repr(row[max(0, column - 40):column + 80]))
