from MachineLearning.analyze_question import AnalysisQuestion
from KnowledgeGraph.get_answer import Get_answer


def get_answer(question):
    aq = AnalysisQuestion()
    ga = Get_answer()

    index, params = aq.analysis_question(question)
    answers = ga.get_data(index, params)

    result = ""
    for ans in answers:
        result += str(ans[0])
        result += "\n"

    return result
