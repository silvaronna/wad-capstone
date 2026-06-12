#!/bin/bash
# Script to validate all endpoints

BASE_URL="http://localhost:3000/api/v1"
EMAIL="test_$(date +%s)@example.com"
PASSWORD="P@ssw0rd!"

echo "1. Registering new user..."
REGISTER_RES=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Test User\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")
echo $REGISTER_RES | jq .

echo -e "\n2. Logging in..."
LOGIN_RES=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")
TOKEN=$(echo $LOGIN_RES | jq -r .accessToken)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed!"
  echo $LOGIN_RES
  exit 1
fi
echo "Login success. Token obtained."

echo -e "\n3. Creating a Task..."
TASK_RES=$(curl -s -X POST "$BASE_URL/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Task from Script\", \"description\": \"Testing all endpoints\"}")
TASK_ID=$(echo $TASK_RES | jq -r .data.id)
echo "Task created with ID: $TASK_ID"

echo -e "\n4. Creating Media for the Task..."
MEDIA_RES=$(curl -s -X POST "$BASE_URL/media" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"fileName\": \"script_test.pdf\", \"fileUrl\": \"http://example.com/file.pdf\", \"fileSize\": 5000, \"mimeType\": \"application/pdf\", \"taskId\": $TASK_ID}")
echo $MEDIA_RES | jq .

echo -e "\n5. Fetching Tasks (to verify media is included)..."
LIST_RES=$(curl -s -X GET "$BASE_URL/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN")
echo "Attachments count in task: $(echo $LIST_RES | jq '.data.attachments | length')"

echo -e "\n6. Checking Public Health endpoint..."
curl -s -X GET "http://localhost:3000/health" | jq .

echo -e "\nVerification Complete!"
