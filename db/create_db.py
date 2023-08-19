import sqlite3

DB_NAME = 'dotapick.db'


def create_tables():
    """Create basic tables for dotapick.db."""

    conn = sqlite3.connect(DB_NAME)

    curs = conn.cursor()

    table_hero_sql = """
        CREATE TABLE hero (
            id integer PRIMARY KEY,
            dotabuff_name TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL, 
            update_date TEXT NOT NULL,
            general_winrate REAL NOT NULL,
            image_path TEXT NOT NULL
        )
    """
    table_heroes_winrate_sql = """
        CREATE TABLE heroes_winrate (
            hero_id INTEGER,
            hero_id_enemy INTEGER,
            winrate REAL NOT NULL,
            update_date TEXT NOT NULL,
            FOREIGN KEY(hero_id) REFERENCES hero(id),
            FOREIGN KEY(hero_id_enemy) REFERENCES hero(id)
        )
    """
    table_role_sql = """
        CREATE TABLE role (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE
        )
    """
    table_hero_role_sql = """
        CREATE TABLE hero_role (
            hero_id INTEGER,
            role_id INTEGER,
            FOREIGN KEY(hero_id) REFERENCES hero(id),
            FOREIGN KEY(role_id) REFERENCES role(id)
        )
    """
    curs.execute(table_hero_sql)
    curs.execute(table_heroes_winrate_sql)
    curs.execute(table_role_sql)
    curs.execute(table_hero_role_sql)

    conn.close()


if __name__ == '__main__':
    create_tables()
