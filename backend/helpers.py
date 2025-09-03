import os
import json

def get_stimparams(folder_path):
    """
    Searches for all files named stimparams_elec_#.json in the given folder,
    reads them, and creates a structure to output of #: contents.

    Args:
        folder_path (str): The path to the folder to search in.

    Returns:
        dict: A dictionary where the keys are the numbers extracted from the filenames
              and the values are the contents of the JSON files.
    """
    stimparams_data = {}

    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.startswith("stimparams_elec_") and file.endswith(".json"):
                try:
                    # Extract the number from the filename
                    number = file.split("_")[2].split(".")[0]
                    file_path = os.path.join(root, file)
                    
                    # Read the JSON file
                    with open(file_path, 'r') as f:
                        contents = json.load(f)
                    
                    # Store the contents in the dictionary
                    stimparams_data[number] = contents
                except Exception as e:
                    print(f"Error reading {file}: {e}")
    return stimparams_data


def build_S(right_v, left_v, S):
    S['Rs1']['amp'] = sum(right_v)
    S['Ls1']['amp'] = sum(left_v)
    S['Rs1']['va'] = 2
    S['Ls1']['va'] = 2
    S['Rs1']['case']['perc'] = 100
    S['Ls1']['case']['perc'] = 100
    S['Rs1']['case']['pol'] = 2
    S['Ls1']['case']['pol'] = 2
    S['label'] = 'gs_StimPyPerGait'
    # S['activecontacts'] = [[1 if v != 0 else 0 for v in right_v], [1 if v != 0 else 0 for v in left_v]]
    S['activecontacts'][0] = [1 if v != 0 else 0 for v in right_v]
    S['activecontacts'][1] = [1 if v != 0 else 0 for v in left_v]
    S['amplitude'][0] = [sum(right_v), 0, 0, 0]
    S['amplitude'][1] = [sum(left_v), 0, 0, 0]
    right_elec = S['Rs1']
    right_amp = right_elec['amp']
    for i, value in enumerate(right_v):
        key = f'k{i+1}'
        if value != 0:
            perc = (value / right_amp) * 100
            right_elec[key] = {'perc': perc, 'pol': 1}
        else:
            right_elec[key] = {'perc': 0, 'pol': 0}

    left_elec = S['Ls1']
    left_amp = left_elec['amp']
    for i, value in enumerate(left_v):
        key = f'k{i+1}'
        if value != 0:
            perc = (value / left_amp) * 100
            left_elec[key] = {'perc': perc, 'pol': 1}
        else:
            left_elec[key] = {'perc': 0, 'pol': 0}

    return S