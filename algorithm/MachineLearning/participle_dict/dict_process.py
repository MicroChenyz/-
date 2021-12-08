with open("actor.txt", 'r', encoding='utf-8') as f, \
        open("actor_.txt", 'w', encoding='utf-8') as f_:
    lines = f.readlines()
    for line in lines:
        actor = line
        actor = actor.strip()
        f_.write(actor + " 1 nr\n")

with open("genreDict.txt", 'r', encoding='utf-8') as f, \
        open("genreDict_.txt", 'w', encoding='utf-8') as f_:
    lines = f.readlines()
    for line in lines:
        genre = line
        genre = genre.strip()
        f_.write(genre + " 1 ng\n")

with open("scoreDict.txt", 'r', encoding='utf-8') as f, \
        open("scoreDict_.txt", 'w', encoding='utf-8') as f_:
    lines = f.readlines()
    for line in lines:
        score = line
        score = score.strip()
        f_.write(score + " 1 x\n")
