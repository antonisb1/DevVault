import os
import socket
import sys
import time

from sqlalchemy.engine import make_url


def main() -> int:
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("DATABASE_URL is not set", file=sys.stderr)
        return 1

    url = make_url(database_url)
    host = url.host or "db"
    port = int(url.port or 5432)

    retries = int(os.environ.get("DB_WAIT_RETRIES", "60"))
    delay = float(os.environ.get("DB_WAIT_DELAY", "2"))

    for attempt in range(1, retries + 1):
        try:
            with socket.create_connection((host, port), timeout=2):
                print(f"Database is reachable at {host}:{port}")
                return 0
        except OSError as exc:
            print(f"Waiting for database ({attempt}/{retries}) at {host}:{port}: {exc}")
            time.sleep(delay)

    print("Database did not become reachable in time", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
