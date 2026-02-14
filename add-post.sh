#!/bin/bash
# Helper script para que Lentejo guarde posts desde cualquier lado

URL="$1"
DESCRIPTION="$2"
PLATFORM="${3:-other}"
TITLE="$4"

if [ -z "$URL" ]; then
  echo "Uso: ./add-post.sh \"URL\" [descripcion] [plataforma] [titulo]"
  exit 1
fi

curl -s -X POST http://localhost:3100/api/posts \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"$URL\",
    \"description\": \"$DESCRIPTION\",
    \"platform\": \"$PLATFORM\",
    \"title\": \"$TITLE\"
  }" | jq -r '"✅ Post guardado: " + .id'
