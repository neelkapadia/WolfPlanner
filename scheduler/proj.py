import sys
import datetime

import os

def withinweek(infile):
    todo = []
    with open (infile, 'r') as fp:
        for f in fp :
            line = f
            f = f.replace("\n","")
            f = f.split(" ")
            f = f[2]
            f = f.split("-")
            dat = datetime.date(int(f[2]),int(f[0]),int(f[1]))
            x = datetime.datetime.now()
            x = x.date() + datetime.timedelta(days = 7)
            if (dat < x ) :
                todo.append(line)

    for i in range(todo.__len__()):
        #print i
        print todo[i]
    return todo



def main():
    dirname = os.path.dirname(__file__)
    f = sys.argv[1]
    filename = os.path.join(dirname, f)
    out = withinweek(filename)
    return out

if __name__ == "__main__":
    main()
