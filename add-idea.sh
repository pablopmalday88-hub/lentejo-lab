#!/bin/bash
# Helper script para que Lentejo agregue ideas desde cualquier lado

CONTENT="$1"
CATEGORY="${2:-general}"
TITLE="$3"
INSPIRATION="$4"
PASSWORD="${LENTEJO_PASSWORD:-lentejo2026}"
API_URL="${LENTEJO_API_URL:-https://lentejo-lab-production.up.railway.app}"

if [ -z "$CONTENT" ]; then
  echo "Uso: ./add-idea.sh \"contenido\" [categoria] [titulo] [inspiracion]"
  exit 1
fi

curl -s -X POST "$API_URL/api/ideas" \
  -H "Content-Type: application/json" \
  -H "X-Access-Password: $PASSWORD" \
  -d "{
    \"content\": \"$CONTENT\",
    \"category\": \"$CATEGORY\",
    \"title\": \"$TITLE\",
    \"inspiration\": \"$INSPIRATION\"
  }" | jq -r '"✅ Idea guardada: " + .id'
