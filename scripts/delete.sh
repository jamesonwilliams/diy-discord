#!/bin/bash

curl -X POST -H "Content-Type: application/json" -d @- http://localhost:3000/api/delete-band << EOF
{
    "name": "Red Sun"
}
EOF

