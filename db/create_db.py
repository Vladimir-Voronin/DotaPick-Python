import sqlite3

DB_NAME = 'dotapick.db'


def create_tables():
    """Create basic tables for dotapick.db."""

    conn = sqlite3.connect(DB_NAME)

    curs = conn.cursor()

    table_1_sql = """
        CREATE TABLE hero (
            id integer PRIMARY KEY,
            dotabuff_name TEXT NOT NULL,
            name TEXT NOT NULL, 
            update_date TEXT NOT NULL,
            general_winrate REAL NOT NULL,
            strength_set TEXT NOT NULL,            
            position_set TEXT NOT NULL,
            image_path TEXT NOT NULL
        )
    """
    table_2_sql = """
        CREATE TABLE heroes_winrate (
            hero_id INTEGER,
            hero_id_enemy INTEGER,
            winrate REAL NOT NULL,
            FOREIGN KEY(hero_id) REFERENCES hero(id),
            FOREIGN KEY(hero_id_enemy) REFERENCES hero(id)
        )
    """
    curs.execute(table_1_sql)
    curs.execute(table_2_sql)

    conn.close()


if __name__ == '__main__':
    create_tables()
