#!/bin/bash
# Helper script para que Lentejo agregue ideas desde cualquier lado

CONTENT="$1"
CATEGORY="${2:-general}"
TITLE="$3"

if [ -z "$CONTENT" ]; then
  echo "Uso: ./add-idea.sh \"contenido de la idea\" [categoria] [titulo]"
  exit 1
fi

curl -s -X POST http://localhost:3100/api/ideas \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": \"$CONTENT\",
    \"category\": \"$CATEGORY\",
    \"title\": \"$TITLE\"
  }" | jq -r '"✅ Idea guardada: " + .id'
