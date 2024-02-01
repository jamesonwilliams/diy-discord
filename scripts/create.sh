#!/bin/bash

curl -X POST -H "Content-Type: application/json" -d @- http://localhost:3000/api/add-band << EOF
{
    "name": "Red Sun",
    "city": "Oklahoma City",
    "state": "OK",
    "country": "USA",
    "lat": 35.4676,
    "long": -97.5164,
    "spotify": "https://open.spotify.com/artist/2EBOAZfR66SwpO9mGKsaul?si=lb88x9NxRCatyTIWdL80Tw",
    "twitter": "https://twitter.com/redsun405",
    "bandcamp": "https://redsun405.bandcamp.com",
    "instagram": "https://www.instagram.com/redsunok"
}
EOF

