import psycopg2


DATABASE_URL = "postgresql://postgresql_postgres_1234atdpg_xxxx_user:jFZk99yoCWn7gxM6orDFh0qyANu0HnXg@dpg-d7cc61gsfn5c73cdb7t0-a.virginia-postgres.render.com/postgresql_postgres_1234atdpg_xxxx"





def save_chat(user_input, bot_response):
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO chatbot_logs (user_input, bot_response) VALUES (%s, %s)",
        (user_input, bot_response)
    )

    conn.commit()
    conn.close()