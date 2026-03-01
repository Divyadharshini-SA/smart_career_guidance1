import sqlalchemy
from database import engine

def run():
    with engine.begin() as conn:
        try:
            conn.execute(sqlalchemy.text("ALTER TABLE progress ADD COLUMN completed_dsa_problems JSON;"))
            print("Column added successfully.")
        except Exception as e:
            print("Error or already exists:", e)

if __name__ == "__main__":
    run()
