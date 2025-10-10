# create_admin_user.py
# Usage (run from the same folder as app.py):
#   python create_admin_user.py admin your_password
#
# If you omit args, it defaults to: admin / admin123
# This script tries to handle both `password_hash` and `set_password()` patterns.

import sys
from getpass import getpass

try:
    from app import app, db, User  # ensure this matches your app.py exports
except Exception as e:
    print("Import error: make sure this file is next to app.py and that app.py defines app, db, and User.")
    raise

def set_user_password(user_obj, raw_password: str):
    # set via set_password() if available; else set password_hash using werkzeug
    if hasattr(user_obj, "set_password"):
        user_obj.set_password(raw_password)
        return
    # fallback: common attribute names
    from werkzeug.security import generate_password_hash
    for attr in ("password_hash", "password"):
        if hasattr(user_obj, attr):
            setattr(user_obj, attr, generate_password_hash(raw_password))
            return
    raise RuntimeError("User model has no set_password() or password_hash/password attribute.")

def main():
    username = sys.argv[1] if len(sys.argv) > 1 else "admin"
    password = sys.argv[2] if len(sys.argv) > 2 else None
    if not password:
        pw1 = getpass("Enter new admin password (hidden): ")
        pw2 = getpass("Confirm password: ")
        if pw1 != pw2:
            print("Passwords do not match.")
            sys.exit(1)
        password = pw1

    role_field = "role"  # adjust if your model uses a different field name
    with app.app_context():
        # does user already exist?
        u = None
        if hasattr(User, "username"):
            u = User.query.filter_by(username=username).first()
        elif hasattr(User, "email"):
            u = User.query.filter_by(email=username).first()
        else:
            print("User model must have 'username' or 'email' field.")
            sys.exit(1)

        if u:
            print(f"User '{username}' exists. Updating password…")
            set_user_password(u, password)
        else:
            # create new
            kwargs = {}
            if hasattr(User, "username"):
                kwargs["username"] = username
            if hasattr(User, "email") and "@" in username:
                kwargs["email"] = username
            # set a default role if present
            if hasattr(User, role_field):
                kwargs[role_field] = "admin"

            u = User(**kwargs)
            set_user_password(u, password)
            db.session.add(u)

        db.session.commit()
        print(f"✓ Admin user ready: {username}")

if __name__ == "__main__":
    main()
