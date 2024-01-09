echo "Starting the script..."

for c in {1..10}; do
  for d in {2..9}; do
    echo "Running with c=$c and d=$d"
    node ./psolver.js "$c" "$d" "$t"
  done
done

echo "Script completed."

# chmod +x my_script.sh