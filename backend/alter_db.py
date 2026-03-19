import sqlalchemy
from database import engine

def run():
    queries = [
        "ALTER TABLE users ADD COLUMN cgpa FLOAT;",
        "ALTER TABLE progress ADD COLUMN readiness_history JSON;",
        "ALTER TABLE progress ADD COLUMN streak_days INT DEFAULT 0;",
        "ALTER TABLE progress ADD COLUMN last_test_date DATETIME;",
        "ALTER TABLE progress ADD COLUMN best_streak INT DEFAULT 0;"
    ]
    with engine.begin() as conn:
        for q in queries:
            try:
                conn.execute(sqlalchemy.text(q))
                print(f"Success: {q}")
            except Exception as e:
                print(f"Error for {q}:", e)

if __name__ == "__main__":
    run()
