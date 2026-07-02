#!/bin/sh
set -e

# Wait for database
node wait-for-db.js

# Deploy Prisma migrations
npx prisma migrate deploy

# Check if seed is needed
set +e
node check-seed.js
STATUS=$?
set -e

if [ $STATUS -eq 2 ]; then
  npm run db:seed
elif [ $STATUS -eq 0 ]; then
  true
else
  echo "Check seed failed with exit code $STATUS"
  exit $STATUS
fi

# Start the application
npm start
