#!/bin/bash
set -e

echo "🔄 Fetching latest branches..."
git fetch origin

echo "🔀 Checking out production branch..."
git checkout production

echo "💥 Resetting local changes on production..."
git reset --hard
git clean -fd

echo "⏳ Pulling latest production branch..."
git pull origin production

echo "🔀 Merging master into production..."
git merge origin/master --no-ff -m "Merge master into production for deploy"

echo "📤 Pushing production branch to origin..."
git push origin production

echo "✅ Production branch updated and pushed!"

echo "🔀 Switching back to master branch..."
git checkout master
