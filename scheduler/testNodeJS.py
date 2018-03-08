import sys


def try_parameters(a, b):
	return int(a)+int(b)


print(sys.argv[1], sys.argv[2])
data_to_return = try_parameters(sys.argv[1], sys.argv[2])
print(data_to_return)
sys.stdout.flush()
