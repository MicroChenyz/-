import unittest
from database import Database

db = Database()


class TestMathFunc(unittest.TestCase):
    def test_insert_user(self):
        self.assertEqual(True, db.insert_user_data("shjshdks", 1))

    def test_select_user(self):
        self.assertEqual("1", db.select_user("oW1jb5C3vOtuDD2N2x5fKp9B0otE"))
        self.assertEqual("0", db.select_user("aaa"))

    def test_update_comment(self):
        self.assertEqual(True, db.update_comment_data("zwf", "2021-12-07 22:09:09", "hhh", "1", "2021-12-07 22:09:09"))

    def test_create_table(self):
        sql_comment_table = """CREATE TABLE Comment (
                     Comment_id INTEGER NOT NULL PRIMARY KEY auto_increment,
                     USERNAME VARCHAR(50),
                     Content TEXT,
                     time  Timestamp DEFAULT CURRENT_TIMESTAMP,
                     reply TEXT,
                     checked TINYINT,
                     reply_time Timestamp DEFAULT CURRENT_TIMESTAMP
                      )"""
        self.assertEqual(False, db.create_table(sql_comment_table))


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestMathFunc))
    with open('UnittestTextReport.txt', 'a') as f:
        runner = unittest.TextTestRunner(stream=f, verbosity=2)
        runner.run(suite)

