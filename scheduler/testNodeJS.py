import sys
import ast

import bisect
from collections import defaultdict
from datetime import datetime
from pprint import pprint
import pickle
# import db_scripts

def try_parameters(a, b, c):
	# print(c["1"])
	return int(a)+int(b)


# print(sys.argv[1], sys.argv[2], sys.argv[3])
# print(type(sys.argv[3]))
dict_data = ast.literal_eval(sys.argv[3])
data_to_return = try_parameters(sys.argv[1], sys.argv[2], dict_data)
print(data_to_return)
sys.stdout.flush()


# # compute_input.py
#
# import sys, json, numpy as np
#
#
# # Read data from stdin
# def read_in():
# 	lines = sys.stdin.readlines()
# 	print(lines)
# 	# Since our input would only be having one line, parse our JSON data from that
# 	return json.loads(lines[0])
#
#
# def main():
# 	# get our data as an array from read_in()
# 	lines = read_in()
#
# 	# create a numpy array
# 	np_lines = np.array(lines)
#
# 	# use numpys sum method to find sum of all elements in the array
# 	lines_sum = np.sum(np_lines)
#
# 	# return the sum to the output stream
# 	print(lines_sum)
#
#
# # start process
# if __name__ == '__main__':
# 	main()
