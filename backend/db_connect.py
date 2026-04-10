import psycopg2

# paste your External Database URL here

# DATABASE_URL = "postgresql://postgres:1234@dpg-xxxx.render.com:5432/logiq_gen_db"
DATABASE_URL = "postgresql://postgresql_postgres_1234atdpg_xxxx_user:jFZk99yoCWn7gxM6orDFh0qyANu0HnXg@dpg-d7cc61gsfn5c73cdb7t0-a.virginia-postgres.render.com/postgresql_postgres_1234atdpg_xxxx"



try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    print("✅ Connected successfully")

    # 1. Create table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chatbot_logs (
        id SERIAL PRIMARY KEY,
        user_input TEXT,
        bot_response TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()
    print("✅ Table ready")

    # 2. Insert data
    cursor.execute(
        "INSERT INTO chatbot_logs (user_input, bot_response) VALUES (%s, %s)",
        ("Hello", "Hi! How can I help you?")
    )
    conn.commit()
    print("✅ Data inserted")

    # 3. Read data
    cursor.execute("SELECT * FROM chatbot_logs;")
    rows = cursor.fetchall()

    print("📦 Data in table:")
    for row in rows:
        print(row)

    conn.close()

except Exception as e:
    print("❌ Error:", e)