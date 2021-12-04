import pymysql
import redis


# 打开数据库连接

class database:
    def __init__(self):
        # 连接数据库
        self.db = pymysql.connect("localhost", "root", "", "movie_robot", charset='utf8')
        # 使用cursor()方法获取操作游标
        self.cursor = self.db.cursor()
        # 连接redis 分别管理不同的数据库表 处理不同的数据表
        self.re_user = redis.Redis(host='127.0.0.1', port=6379, db=0, password="")
        self.re_movie = redis.Redis(host='127.0.0.1', port=6379, db=0, password="")
        self.re_comment = redis.Redis(host='127.0.0.1', port=6379, db=0, password="")
        self.re_record = redis.Redis(host='127.0.0.1', port=6379, db=0, password="")
        self.comment_cnt = 0
        self.record_cnt = 0

    def create_database(self):
        self.cursor.execute("create database MOVIE_SYS;")
        self.cursor.execute("use database MOVIE_SYS;")

    def close_database(self):
        self.db.close()

    def create_table(self, sql):
        try:
            self.cursor.execute(sql)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            print("failed", e)

    def insert_user_data(self, username, admin_flag):
        insert_sql = "insert into user (USERNAME,ADMIN_Or_not) values('%s',%s)" % (username, admin_flag)
        try:
            self.cursor.execute(insert_sql)
            self.db.commit()
            # username为key 包含一个字段:admin_flag
            # 此时可以采用该方法，用户名是唯一的
            self.re_user.hset(username, "flag", admin_flag)
            return True
        except Exception as e:
            self.db.rollback()
            print("failed", e)

    def insert_movie_data(self, username, movie_intro, on_time, main_actors, movie_type, movie_name):
        insert_sql1 = "insert into movie (USERNAME,movie_intro,on_time,main_actors,movie_type,movie_name)"
        insert_sql2 = "values('%s', '%s', '%s','%s','%s','%s')" \
                      % (username, movie_intro, on_time, main_actors, movie_type, movie_name)
        insert_sql = insert_sql1 + insert_sql2
        try:
            self.cursor.execute(insert_sql)
            self.re_movie.hset(movie_name, "username", username)
            self.re_movie.hset(movie_name, "movie_intro", movie_intro)
            self.re_movie.hset(movie_name, "on_time", on_time)
            self.re_movie.hset(movie_name, "movie_type", movie_type)
            self.re_movie.hset(movie_name, "main_actors", main_actors)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            print("failed", e)

    def insert_comment_data(self, username, content, time, reply):
        insert_sql = "insert into comment(USERNAME,Content,time,reply) values('%s','%s','%s','%s')" \
                     % (username, content, time, reply)
        try:
            self.cursor.execute(insert_sql)
            # 以用户名和时间作为key来进行查询
            self.comment_cnt += 1
            self.re_comment.hset(str(self.comment_cnt) + '+' + username, "content", content)
            self.re_comment.hset(str(self.comment_cnt) + '+' + username, "time", time)
            self.re_comment.hset(str(self.comment_cnt) + '+' + username, "reply", reply)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            print("failed", e)

    def insert_record_data(self, username, robot_or_me, content, time):
        insert_sql = "insert into records(USERNAME,Robot_or_me,content,time) values ('%s','%s','%s','%s')" \
                     % (username, robot_or_me, content, time)
        try:
            self.cursor.execute(insert_sql)
            self.db.commit()
            # 以用户名和时间作为key来进行查询
            self.record_cnt += 1
            self.re_record.hset(str(self.record_cnt) + '+' + username, "Robot_or_me", robot_or_me)
            self.re_record.hset(str(self.record_cnt) + '+' + username, "content", content)
            self.re_record.hset(str(self.record_cnt) + '+' + username, "time", time)
            return True
        except Exception as e:
            self.db.rollback()
            print("failed", e)

    # 查询操作，若redis可以查询到相关信息，则直接返回，但是注意需要保证redis与mysql中数据的一致性
    # 前端需要获取 该用户是否是管理员
    def select_user(self, username):
        res = self.re_user.hget(username, "flag")
        if res:
            return res
        else:
            sel_sql = "select ADMIN_Or_not from User where username='%s'" % username
            try:
                self.cursor.execute(sel_sql)
                userinfo = self.cursor.fetchone()  # 每一个用户只对应一条数据，因此可以使用fetchone
                # 若此时再redis中无法查到，则将新的数据加入到redis中
                self.re_user.hset(username, "flag", userinfo[0])
                return userinfo[0]
            except Exception as e:
                self.db.rollback()
                print("failed", e)

    def select_comment(self, username):
        list_comment = []
        for i in self.comment_cnt:
            find = str(i) + "+" + username
            if self.re_comment.hget(find, "content"):
                list_comment.append((self.re_comment.get(find, "content"), self.re_comment.hget(find, "time"),
                                     self.re_comment.hget(find, "reply")))
        # 可能此时redis中存的不完整 最后选择返回数据更多的一类
        sel_sql = "select * from comment where username='%s'" % username
        try:
            list_comment1 = []
            self.cursor.execute(sel_sql)
            comment_info = self.cursor.fetchall()  # 返回该用户所有的评论
            for comment in comment_info:
                list_comment1.append((comment[2], comment[3], comment[4]))
            if len(list_comment) > len(list_comment1):
                return list_comment
            else:
                return list_comment1
        except Exception as e:
            self.db.rollback()
            print("failed", e)

    # 每条电影的数据只有一条
    def select_movie(self, movie_name):
        res_intro = self.re_movie.hget(movie_name, "movie_intro")
        res_time = self.re_movie.hget(movie_name, "on_time")
        res_type = self.re_movie.hget(movie_name, "movie_type")
        res_actors = self.re_movie.hget(movie_name, "main_actors")
        if res_intro:
            return res_intro, res_time, res_type, res_actors
        else:
            sel_sql = "select * from movie where Movie_name='%s'" % movie_name
            try:
                self.cursor.execute(sel_sql)
                movie_info = self.cursor.fetchone()  # 每一个用户只对应一条数据，因此可以使用fetchone
                # 若此时再redis中无法查到，则将新的数据加入到redis中
                movie_intro = str(movie_info[2])
                on_time = str(movie_info[3])
                main_actors = str(movie_info[4])
                m_type = str(movie_info[5])
                self.re_movie.hset(movie_name, "movie_intro", movie_intro)
                self.re_movie.hget(movie_name, "on_time", on_time)
                self.re_movie.hget(movie_name, "movie_type", m_type)
                self.re_movie.hget(movie_name, "main_actors", main_actors)
                return movie_intro, on_time, m_type, main_actors
            except Exception as e:
                self.db.rollback()
                print("failed", e)

    # 每个用户的聊天记录较多，且不会经常查询,可以直接用Mysql进行查询
    def select_record(self, username):
        sel_sql = "select * from records where username='%s'" % username
        try:
            self.cursor.execute(sel_sql)
            record = self.cursor.fetchall()
            list_record = []
            for each_re in record:
                list_record.append((each_re[2], each_re[3], each_re[4]))
            return  list_record
        except Exception as e:
            self.db.rollback()
            print("failed", e)

# create user table
# insert into user (USERNAME,ADMIN_Or_not) values("name",2)
# sql_user_create = """CREATE TABLE USER (
#          USERID INTEGER NOT NULL PRIMARY KEY auto_increment,
#          USERNAME VARCHAR(50),
#          ADMIN_Or_not  TINYINT
#           )"""

# create movie table
# insert into movie (USERNAME,movie_intro,on_time,main_actors,movie_type,movie_name)
# values("name","good","2021-02-12","汤奇瑞","comedy","happy");
# sql_movie_create = """CREATE TABLE MOVIE (
#          Movie_id INTEGER NOT NULL PRIMARY KEY auto_increment,
#          USERNAME VARCHAR(50),
#          Movie_intro TEXT,
#          On_time  Timestamp DEFAULT CURRENT_TIMESTAMP,
#          Main_actors  TEXT,
#          Movie_type   VARCHAR(50),
#          Movie_name   VARCHAR(50)
#           )"""

# create comment table
# insert into comment(USERNAME,Content,time,reply) values("tqr","great","2021-02-03","good comment")
# sql_comment_table = """CREATE TABLE Comment (
#          Comment_id INTEGER NOT NULL PRIMARY KEY auto_increment,
#          USERNAME VARCHAR(50),
#          Content TEXT,
#          time  Timestamp DEFAULT CURRENT_TIMESTAMP,
#          reply TEXT
#           )"""

# create records table
# insert into records(USERNAME,Robot_or_me,content,time) values ("name",1,"hello","2021-02-01")
# sql_record_table = """CREATE TABLE Records (
#          record_id INTEGER NOT NULL PRIMARY KEY auto_increment,
#          USERNAME VARCHAR(50),
#          Robot_or_Me TINYINT,
#          Content TEXT,
#          time  Timestamp DEFAULT CURRENT_TIMESTAMP
#           )"""
