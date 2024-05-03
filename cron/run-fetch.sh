delay=$((RANDOM % 10 + 1))
echo "Sleep $delay minutes for refresh data..."
sleep "${delay}m"
echo "Start fetch data..."
node ./fetchData.js
echo "Fetch data done."
