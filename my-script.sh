for c in {1..10}; do
  for d in {2..9}; do
    for t in {1..9}; do
      node psolver.js $c $d $t;
    done;
  done;
done;