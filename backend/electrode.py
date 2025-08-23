from scipy.io import loadmat
import h5py
import os

def patientid(file_path) -> str:
    """
    Extracts the patient ID from the file name.

    The file name is expected to follow the pattern: sub-patientid_desc-reconstruction.mat

    Returns:
        str: The extracted patient ID.
    """
    base_name = os.path.basename(file_path)
    patient_id = base_name.split("_")[0]
    return patient_id

def get_elmodels(file_path):
    print(f"Getting elmodels for file path: {file_path}")
    try: 
        elmodel = loadmat(file_path, simplify_cells=True)
        reco_data = elmodel['reco']
        print(f"Structure of 'reco': {type(reco_data)}")
        print(f"Contents of 'reco': {reco_data}")
        if isinstance(reco_data, dict):
            if 'props' in reco_data:
                elmodels = [item['elmodel'] for item in reco_data['props'] if 'elmodel' in item]
                return elmodels
            else:
                raise KeyError("'props' not found in 'reco'")
        elif isinstance(reco_data, list):
            # Assuming the list contains dictionaries
            elmodels = [item['props']['elmodel'] for item in reco_data if 'props' in item]
            return elmodels
        else:
            raise TypeError("Unexpected data structure for 'reco'")
    except Exception as e:
        print(f"Error loading .mat file: {e}")
        with h5py.File(file_path, 'r') as f:
            elmodel = f['reco']['props']['elmodel']
            return elmodel

def setup_app(file_path):
    elmodels = get_elmodels(file_path)
    patient_id = patientid(file_path)
    return elmodels, patient_id
