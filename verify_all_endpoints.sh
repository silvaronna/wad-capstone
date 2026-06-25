#!/bin/bash
# Comprehensive API Verification Script - Alur 1 to 4
# Conforming to task requirements and verification list

BASE_URL="http://localhost:3000/api/v1"
HOST_URL="http://localhost:3000"

# Setup temporary colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== RUNNING COMPREHENSIVE ENDPOINT VERIFICATION ===${NC}\n"

# Helper to parse JSON using Node.js instead of jq
json_extract() {
  node -e "try { const obj = JSON.parse(process.argv[1]); console.log(eval('obj.' + process.argv[2])); } catch(e) { console.log(''); }" "$1" "$2"
}

# Seeding database to ensure a clean slate
echo -e "${YELLOW}Seeding database...${NC}"
npm run db:seed > /dev/null
echo -e "${GREEN}Database seeded successfully.${NC}\n"

# ----------------------------------------------------
# ALUR 1 — TESTING RBAC
# ----------------------------------------------------
echo -e "${YELLOW}=== ALUR 1 — Testing RBAC ===${NC}"

# 1. Login user biasa (budi@example.com)
LOGIN_BUDI_RES=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "budi@example.com", "password": "P@ssw0rd!"}')
BUDI_TOKEN=$(json_extract "$LOGIN_BUDI_RES" "accessToken")
BUDI_USER_ID=$(json_extract "$LOGIN_BUDI_RES" "data.id")

if [ "$BUDI_TOKEN" != "null" ] && [ -n "$BUDI_TOKEN" ]; then
    echo -e "  1. Login Budi (USER): ${GREEN}PASS (200 + token)${NC}"
else
    echo -e "  1. Login Budi (USER): ${RED}FAIL${NC}"
    echo "$LOGIN_BUDI_RES"
    exit 1
fi

# 2. Akses admin route as USER (budi@example.com)
BUDI_ADMIN_RES=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/admin/users" \
  -H "Authorization: Bearer $BUDI_TOKEN")

if [ "$BUDI_ADMIN_RES" -eq 403 ]; then
    echo -e "  2. Akses admin route as USER: ${GREEN}PASS (403 Forbidden)${NC}"
else
    echo -e "  2. Akses admin route as USER: ${RED}FAIL (Expected 403, got $BUDI_ADMIN_RES)${NC}"
fi

# 3. Login admin (admin@example.com)
LOGIN_ADMIN_RES=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "P@ssw0rd!"}')
ADMIN_TOKEN=$(json_extract "$LOGIN_ADMIN_RES" "accessToken")

if [ "$ADMIN_TOKEN" != "null" ] && [ -n "$ADMIN_TOKEN" ]; then
    echo -e "  3. Login Admin (ADMIN): ${GREEN}PASS (200 + token)${NC}"
else
    echo -e "  3. Login Admin (ADMIN): ${RED}FAIL${NC}"
    echo "$LOGIN_ADMIN_RES"
    exit 1
fi

# 4. Akses admin route as ADMIN
ADMIN_GET_RES=$(curl -s -X GET "$BASE_URL/admin/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
ADMIN_STATUS_CODE=$(json_extract "$ADMIN_GET_RES" "data.length")

if [ "$ADMIN_STATUS_CODE" != "null" ]; then
    echo -e "  4. Akses admin route as ADMIN: ${GREEN}PASS (200 + list of $ADMIN_STATUS_CODE users)${NC}"
else
    echo -e "  4. Akses admin route as ADMIN: ${RED}FAIL${NC}"
    echo "$ADMIN_GET_RES"
fi

# 5. Promote user to ADMIN
PROMOTE_RES=$(curl -s -X PATCH "$BASE_URL/admin/users/$BUDI_USER_ID/role" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "ADMIN"}')
BUDI_NEW_ROLE=$(json_extract "$PROMOTE_RES" "data.role")

if [ "$BUDI_NEW_ROLE" == "ADMIN" ]; then
    echo -e "  5. Promote Budi to ADMIN: ${GREEN}PASS (200 + role diubah to $BUDI_NEW_ROLE)${NC}"
else
    echo -e "  5. Promote Budi to ADMIN: ${RED}FAIL${NC}"
    echo "$PROMOTE_RES"
fi


# ----------------------------------------------------
# ALUR 2 — TESTING OWNERSHIP CHECK
# ----------------------------------------------------
echo -e "\n${YELLOW}=== ALUR 2 — Testing Ownership Check ===${NC}"

# Re-seed DB to reset Budi's role to USER
npm run db:seed > /dev/null

# 6. Login user Budi (budi@example.com)
LOGIN_BUDI_RES=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "budi@example.com", "password": "P@ssw0rd!"}')
BUDI_TOKEN=$(json_extract "$LOGIN_BUDI_RES" "accessToken")
BUDI_USER_ID=$(json_extract "$LOGIN_BUDI_RES" "data.id")

if [ "$BUDI_TOKEN" != "null" ] && [ -n "$BUDI_TOKEN" ]; then
    echo -e "  6. Login Budi: ${GREEN}PASS (200 + token)${NC}"
else
    echo -e "  6. Login Budi: ${RED}FAIL${NC}"
fi

# 7. Lihat tasks Budi
BUDI_TASKS_RES=$(curl -s -X GET "$BASE_URL/tasks" \
  -H "Authorization: Bearer $BUDI_TOKEN")
BUDI_TASKS_COUNT=$(json_extract "$BUDI_TASKS_RES" "data.length")
BUDI_TASK_ID=$(json_extract "$BUDI_TASKS_RES" "data[0].id")

# Verify that all tasks returned belong to Budi (userId matches)
ALL_BUDI_TASKS=$(json_extract "$BUDI_TASKS_RES" "data.every(t => t.userId === $BUDI_USER_ID)")

if [ "$ALL_BUDI_TASKS" == "true" ] && [ "$BUDI_TASKS_COUNT" -gt 0 ]; then
    echo -e "  7. Lihat tasks Budi: ${GREEN}PASS (200 - only $BUDI_TASKS_COUNT tasks of Budi)${NC}"
else
    echo -e "  7. Lihat tasks Budi: ${RED}FAIL (Tasks returned contain other users' tasks or zero)${NC}"
fi

# 8. Edit task Budi sendiri
EDIT_BUDI_TASK=$(curl -s -X PATCH "$BASE_URL/tasks/$BUDI_TASK_ID" \
  -H "Authorization: Bearer $BUDI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title Budi", "status": "in_progress"}')
EDIT_STATUS=$(json_extract "$EDIT_BUDI_TASK" "data.status")

if [ "$EDIT_STATUS" == "IN_PROGRESS" ]; then
    echo -e "  8. Edit task Budi sendiri: ${GREEN}PASS (200 Updated)${NC}"
else
    echo -e "  8. Edit task Budi sendiri: ${RED}FAIL${NC}"
    echo "$EDIT_BUDI_TASK"
fi

# Find a task belonging to Siti
ADMIN_TASKS_RES=$(curl -s -X GET "$BASE_URL/admin/tasks" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
SITI_TASK_ID=$(json_extract "$ADMIN_TASKS_RES" "data.find(t => t.userId !== $BUDI_USER_ID).id")

# 9. Edit task Siti (bukan milik Budi)
EDIT_SITI_RES=$(curl -s -X PATCH "$BASE_URL/tasks/$SITI_TASK_ID" \
  -H "Authorization: Bearer $BUDI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Budi Hack Task", "status": "done"}')
EDIT_SITI_CODE=$(json_extract "$EDIT_SITI_RES" "error.code")

if [ "$EDIT_SITI_CODE" == "FORBIDDEN" ]; then
    echo -e "  9. Edit task Siti (bukan milik Budi): ${GREEN}PASS (403 Forbidden)${NC}"
else
    echo -e "  9. Edit task Siti (bukan milik Budi): ${RED}FAIL (Expected 403 Forbidden, got error code: $EDIT_SITI_CODE)${NC}"
    echo "$EDIT_SITI_RES"
fi

# 10. Admin edit task siapapun
ADMIN_EDIT_SITI=$(curl -s -X PATCH "$BASE_URL/tasks/$SITI_TASK_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Admin Fixed Title", "status": "done"}')
ADMIN_EDIT_STATUS=$(json_extract "$ADMIN_EDIT_SITI" "data.status")

if [ "$ADMIN_EDIT_STATUS" == "DONE" ]; then
    echo -e "  10. Admin edit task siapapun: ${GREEN}PASS (200 Updated)${NC}"
else
    echo -e "  10. Admin edit task siapapun: ${RED}FAIL${NC}"
    echo "$ADMIN_EDIT_SITI"
fi


# ----------------------------------------------------
# ALUR 3 — TESTING RATE LIMITING
# ----------------------------------------------------
echo -e "\n${YELLOW}=== ALUR 3 — Testing Rate Limiting ===${NC}"

# 11 & 12. Brute force login & headers check
RATE_LIMIT_SUCCESS=false
RATE_LIMIT_HEADER_SUCCESS=false

for i in {1..6}; do
  HTTP_RES=$(curl -s -i -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "budi@example.com", "password": "wrongpassword"}')
  
  HTTP_CODE=$(echo "$HTTP_RES" | grep "HTTP/" | awk '{print $2}' | tail -n 1)
  
  if [ "$i" -eq 6 ]; then
      if [ "$HTTP_CODE" -eq 429 ]; then
          RATE_LIMIT_SUCCESS=true
      fi
  fi
  
  # Check for X-RateLimit-Remaining header
  if echo "$HTTP_RES" | grep -qi "X-RateLimit-Remaining"; then
      RATE_LIMIT_HEADER_SUCCESS=true
  fi
done

if [ "$RATE_LIMIT_SUCCESS" == "true" ]; then
    echo -e "  11. Brute force login (6 attempts): ${GREEN}PASS (Request ke-6: 429 Too Many Requests)${NC}"
else
    echo -e "  11. Brute force login (6 attempts): ${RED}FAIL (Expected 429, got status code $HTTP_CODE)${NC}"
fi

if [ "$RATE_LIMIT_HEADER_SUCCESS" == "true" ]; then
    echo -e "  12. Cek header RateLimit: ${GREEN}PASS (Ada header X-RateLimit-Remaining)${NC}"
else
    echo -e "  12. Cek header RateLimit: ${RED}FAIL (Header X-RateLimit-Remaining tidak ditemukan)${NC}"
fi


# ----------------------------------------------------
# ALUR 4 — TESTING SECURITY HEADERS (HELMET)
# ----------------------------------------------------
echo -e "\n${YELLOW}=== ALUR 4 — Testing Security Headers (Helmet) ===${NC}"

HELMET_HEADERS=$(curl -s -I "$HOST_URL/health")

HAS_CSP=false
HAS_XCTO=false
HAS_XFO=false
HAS_HSTS=false
HAS_RP=false

if echo "$HELMET_HEADERS" | grep -qi "Content-Security-Policy"; then HAS_CSP=true; fi
if echo "$HELMET_HEADERS" | grep -qi "X-Content-Type-Options"; then HAS_XCTO=true; fi
if echo "$HELMET_HEADERS" | grep -qi "X-Frame-Options"; then HAS_XFO=true; fi
if echo "$HELMET_HEADERS" | grep -qi "Strict-Transport-Security"; then HAS_HSTS=true; fi
if echo "$HELMET_HEADERS" | grep -qi "Referrer-Policy"; then HAS_RP=true; fi

if [ "$HAS_CSP" == "true" ] && [ "$HAS_XCTO" == "true" ] && [ "$HAS_XFO" == "true" ] && [ "$HAS_HSTS" == "true" ] && [ "$HAS_RP" == "true" ]; then
    echo -e "  - Security Headers: ${GREEN}PASS (Helmet active with CSP, nosniff, SAMEORIGIN, HSTS, Referrer-Policy)${NC}"
else
    echo -e "  - Security Headers: ${RED}FAIL${NC}"
    echo "$HELMET_HEADERS"
fi

# ----------------------------------------------------
# ALUR 5 — TESTING SOCKET.IO HEALTHCHECK
# ----------------------------------------------------
echo -e "\n${YELLOW}=== ALUR 5 — Testing Socket.IO Healthcheck ===${NC}"
SOCKET_IO_RES=$(curl -s "$HOST_URL/socket.io/?EIO=4&transport=polling")
if [[ "$SOCKET_IO_RES" == *"sid"* ]]; then
    echo -e "  - Socket.IO Polling Check: ${GREEN}PASS (Handshake returned valid JSON containing sid)${NC}"
else
    echo -e "  - Socket.IO Polling Check: ${RED}FAIL (Expected response with 'sid', got: $SOCKET_IO_RES)${NC}"
    exit 1
fi

echo -e "\n${BLUE}=== ALL TESTS COMPLETE ===${NC}"

