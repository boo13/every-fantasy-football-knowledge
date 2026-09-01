test:
    python3 -m unittest discover -s tests -v

validate:
    python3 scripts/validate.py

collect:
    python3 scripts/collect.py
    python3 scripts/validate.py --fresh

check:
    just test
    just validate
