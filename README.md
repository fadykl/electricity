
# Invoice App (Flask + SQLite)

## Features
- Add, edit, view invoices
- Auto-calculates:
  - kWh used = current - previous
  - Energy cost = kWh used × unit price
  - Month cost = Energy cost + subscription fee
  - Total due = Month cost + previous balance
- Stores all data in **SQLite** (`invoices.db`)

## Run locally
```bash
python -m venv .venv
source .venv/bin/activate  # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Open: http://localhost:5000

## Deploy free
- Render.com / Railway.app: use `python app.py` as start command.
