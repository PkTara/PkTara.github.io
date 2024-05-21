import json

with open("attributes-list.txt") as attributes:
    for line in attributes.readlines()[16:]:
        line = line.strip("\n").split(":")
        print(f'''
        "{line[0].capitalize()}" : {{
            "points" : 0,
            "tooltip" : "{line[1]}"
        }},
        ''')