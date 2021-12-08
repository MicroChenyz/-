import unittest
from algorithm import get_answer
import warnings


class MyTests(unittest.TestCase):


    '''
    测试异常输入数据
    '''
    def test_function1(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "   "
        result = get_answer(question)
        print(result)
        question = "123**2/'l"
        result = get_answer(question)
        print(result)


    '''
    测试功能1，输出电影评分，包括中文电影名和英文电影名
    '''
    def test_function2(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "霍元甲的电影评分是多少"
        result = get_answer(question)
        print(result)
        question = "Rush Hour 2的电影评分是多少"
        result = get_answer(question)
        print(result)


    '''
    测试功能2，输出电影上映时间，包括中文电影和英文电影名
    '''
    def test_function3(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "霍元甲是什么时候上映的"
        result = get_answer(question)
        print(result)
        question = "Rush Hour 2的上映时间是什么"
        result = get_answer(question)
        print(result)


    '''
    测试功能3，输出电影风格，包括中文电影和英文电影名
    '''
    def test_function4(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "霍元甲的电影风格是什么"
        result = get_answer(question)
        print(result)
        question = "Rush Hour 2是什么类型的电影"
        result = get_answer(question)
        print(result)


    '''
    测试功能4，输出电影的剧情，包括中文电影和英文电影名
    '''
    def test_function5(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "霍元甲讲了什么"
        result = get_answer(question)
        print(result)
        question = "Rush Hour 2剧情是什么"
        result = get_answer(question)
        print(result)


    '''
    测试功能5，输出电影的演员列表，包括中文电影和英文电影名
    '''
    def test_function6(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "霍元甲有哪些演员出演"
        result = get_answer(question)
        print(result)
        question = "Rush Hour 2是由那些人演的"
        result = get_answer(question)
        print(result)


    '''
    测试功能6，演员简介
    '''
    def test_function7(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "周润发"
        result = get_answer(question)
        print(result)


    '''
    测试功能7，演员出演过那些类型的电影
    '''
    def test_function8(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "周星驰出演过那些犯罪电影"
        result = get_answer(question)
        print(result)


    '''
    测试功能8，演员出演过那些电影
    '''
    def test_function9(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "周星驰出演过那些电影"
        result = get_answer(question)
        print(result)


    '''
    测试功能9，演员出演过的评分大于x的电影
    '''
    def test_function10(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "周星驰出演评分大于3.0的电影有哪些"
        result = get_answer(question)
        print(result)


    '''
    测试功能10，演员出演过的评分小于x的电影
    '''
    def test_function11(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "周星驰出演评分小于3.0的电影有哪些"
        result = get_answer(question)
        print(result)


    '''
    测试功能11，演员演过的电影都有哪些风格
    '''
    def test_function12(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "周星驰演过的电影都有哪些风格"
        result = get_answer(question)
        print(result)


    '''
    测试功能12，演员A和演员B合作了哪些电影
    '''
    def test_function13(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "周星驰和周润发一起演过哪些电影"
        result = get_answer(question)
        print(result)


    '''
    测试功能13，演员一共演过多少电影
    '''
    def test_function14(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "周星驰一共演过多少电影"
        result = get_answer(question)
        print(result)


    '''
    测试功能14，演员的出生日期
    '''
    def test_function15(self):
        warnings.simplefilter("ignore", ResourceWarning)
        question = "周星驰的出生日期"
        result = get_answer(question)
        print(result)



if __name__ == '__main__':
    unittest.main()
