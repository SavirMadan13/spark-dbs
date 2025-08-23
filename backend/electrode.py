import json

def retrieve_electrode_data(file_path):
    
    """
    Reads electrode data from a file and returns a structured dictionary.

    :param file_path: Path to the file containing electrode data.
    :return: A dictionary containing the structured electrode data.
    """

    name,
    allQuantities,
    quantities,
    setQuantities,
    selectedValues,
    setSelectedValues,
    IPG,
    totalAmplitude,
    setTotalAmplitude,
    parameters,
    setParameters,
    visModel,
    setVisModel,
    sessionTitle,
    togglePosition,
    setTogglePosition,
    percAmpToggle,
    setPercAmpToggle,
    volAmpToggle,
    setVolAmpToggle,
    contactNaming,
    adornment,
    historical,
    elspec,
    electrodeLabel,
    templateSpace,
    setTemplateSpace,
    showViewer,
    setShowViewer,

    # Initialize the data structure
    initial_state = {
        "IPG": "",
        "leftElectrode": "",
        "rightElectrode": "",
        "allQuantities": {},
        "allSelectedValues": {},
        "allTotalAmplitudes": {},
        "allStimulationParameters": {},
        "visModel": "3",
        "sessionTitle": "",
        "allTogglePositions": {},
        "allPercAmpToggles": {},
        "allVolAmpToggles": {},
        "importCount": 0,
        "importData": "",
        "masterImportData": "",
        "matImportFile": None,
        "newImportFiles": None,
        "showDropdown": True,
        "filePath": "",
        "stimChanged": True,
        "allTemplateSpaces": 0,
    }

    try:
        with open(file_path, 'r') as file:
            data = json.load(file)

            # Process the data to fill the initial_state structure
            initial_state["IPG"] = handle_ipg(data.get("importedElectrode", ""))
            initial_state["allQuantities"] = data.get("quantities", {})
            initial_state["allSelectedValues"] = data.get("selectedValues", {})
            initial_state["allTotalAmplitudes"] = data.get("totalAmplitudes", {})
            initial_state["allTogglePositions"] = data.get("togglePositions", {})
            initial_state["allVolAmpToggles"] = data.get("volAmpToggles", {})
            initial_state["visModel"] = determine_vis_model(data.get("model", ""))
            initial_state["filePath"] = file_path

    except Exception as e:
        print(f"Error reading file {file_path}: {e}")

    return initial_state

def handle_ipg(imported_electrode):
    if "Boston" in imported_electrode:
        return "Boston"
    if "Abbott" in imported_electrode:
        return "Abbott"
    if imported_electrode in ["Medtronic 3387", "Medtronic 3389", "Medtronic 3391"]:
        return "Medtronic_Activa"
    if "Medtronic" in imported_electrode:
        return "Medtronic_Percept"
    return "Research"

def determine_vis_model(model):
    model_mapping = {
        "Dembek 2017": "1",
        "Fastfield (Baniasadi 2020)": "2",
        "Kuncel 2008": "4",
        "Maedler 2012": "5",
        "OSS-DBS (Butenko 2020)": "6",
    }
    return model_mapping.get(model, "3")
