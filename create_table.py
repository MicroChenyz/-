import database

if __name__ == '__main__':
    sql_movie_create = """CREATE TABLE MOVIE (
             Movie_id INTEGER NOT NULL PRIMARY KEY auto_increment,
             USERNAME VARCHAR(50),
             Movie_intro TEXT,
             On_time  Timestamp DEFAULT CURRENT_TIMESTAMP,
             Main_actors  TEXT,
             Movie_type   VARCHAR(50),
             Movie_name   VARCHAR(50)
              )"""
    sql_comment_table = """CREATE TABLE Comment (
             Comment_id INTEGER NOT NULL PRIMARY KEY auto_increment,
             USERNAME VARCHAR(50),
             Content TEXT,
             time  Timestamp DEFAULT CURRENT_TIMESTAMP,
             reply TEXT
              )"""
    sql_record_table = """CREATE TABLE Records (
             record_id INTEGER NOT NULL PRIMARY KEY auto_increment,
             USERNAME VARCHAR(50),
             Robot_or_Me TINYINT,
             Content TEXT,
             time  Timestamp DEFAULT CURRENT_TIMESTAMP
              )"""
    bd = database.Database()
    bd.create_table(sql_movie_create)
    bd.create_table(sql_comment_table)
    bd.create_table(sql_record_table)


# create user table
# insert into user (USERNAME,ADMIN_Or_not) values("name",2)
# sql_user_create = """CREATE TABLE USER (
#          USERID INTEGER NOT NULL PRIMARY KEY auto_increment,
#          USERNAME VARCHAR(50),
#          ADMIN_Or_not  TINYINT
#           )"""


