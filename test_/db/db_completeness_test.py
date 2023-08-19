import datetime
import unittest
import sqlite3

from test_.config import DB_COMPLETENESS_TEST_CONST
from utils.general import get_dotapick_db_file


@unittest.skipIf(DB_COMPLETENESS_TEST_CONST is False, "config settings")
class DBCompletenessTest(unittest.TestCase):
    def setUp(self) -> None:
        self.conn = sqlite3.connect(get_dotapick_db_file())
        self.curs = self.conn.cursor()

    def test_hero_table(self):
        # Check if data were updated within 1 hour
        take_update_date_sql = """SELECT update_date FROM hero"""

        self.curs.execute(take_update_date_sql)
        result = self.curs.fetchall()

        result = [datetime.datetime.fromisoformat(date[0]) for date in result]
        diff = max(result) - min(result)

        self.assertTrue(diff.seconds // 3600 < 1, "Data may not have been updated correctly.")

    def test_heroes_winrate_table(self):
        # Check if data were updated within 1 hour
        take_update_date_sql = """SELECT update_date FROM heroes_winrate"""

        self.curs.execute(take_update_date_sql)
        result = self.curs.fetchall()

        result = [datetime.datetime.fromisoformat(date[0]) for date in result]
        diff = max(result) - min(result)

        self.assertTrue(diff.seconds // 3600 < 1, "Data may not have been updated correctly.")

    def tearDown(self) -> None:
        self.conn.close()


if __name__ == '__main__':
    unittest.main()
