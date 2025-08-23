// Centralized electrode models configuration
export const ELECTRODE_MODELS = [
    { displayName: 'Medtronic 3389', value: 'medtronic_3389' },
    { displayName: 'Medtronic 3387', value: 'medtronic_3387' },
    { displayName: 'Medtronic 3391', value: 'medtronic_3391' },
    { displayName: 'Medtronic B33005', value: 'medtronic_b33005' },
    { displayName: 'Medtronic B33015', value: 'medtronic_b33015' },
    { displayName: 'Boston Scientific Vercise', value: 'boston_vercise' },
    { displayName: 'Boston Scientific Vercise Directed', value: 'boston_vercise_directed' },
    { displayName: 'Abbott ActiveTip (6146-6149)', value: 'abbott_activetip_2mm' },
    { displayName: 'Abbott ActiveTip (6142-6145)', value: 'abbott_activetip_3mm' },
    { displayName: 'Abbott Directed 6172 (short)', value: 'abbott_directed_05' },
    { displayName: 'Abbott Directed 6173 (long)', value: 'abbott_directed_15' },
    { displayName: 'PINS Medical L301', value: 'pins_l301' },
    { displayName: 'PINS Medical L302', value: 'pins_l302' },
    { displayName: 'PINS Medical L303', value: 'pins_l303' },
    { displayName: 'SceneRay SR1200', value: 'sceneray_sr1200' },
    { displayName: 'SceneRay SR1210', value: 'sceneray_sr1210' },
    { displayName: 'SceneRay SR1211', value: 'sceneray_sr1211' },
    { displayName: 'SceneRay SR1242', value: 'sceneray_sr1242' },
    { displayName: 'SDE-08 S8 Legacy', value: 'sde_08_s8_legacy' },
    { displayName: 'SDE-08 S10 Legacy', value: 'sde_08_s10_legacy' },
    { displayName: 'SDE-08 S12 Legacy', value: 'sde_08_s12_legacy' },
    { displayName: 'SDE-08 S16 Legacy', value: 'sde_08_s16_legacy' },
    { displayName: 'SDE-08 S8', value: 'sde_08_s8' },
    { displayName: 'SDE-08 S10', value: 'sde_08_s10' },
    { displayName: 'SDE-08 S12', value: 'sde_08_s12' },
    { displayName: 'SDE-08 S14', value: 'sde_08_s14' },
    { displayName: 'SDE-08 S16', value: 'sde_08_s16' },
    { displayName: 'PMT 2102-04-091', value: 'pmt_2102_04_091' },
    { displayName: 'PMT 2102-06-091', value: 'pmt_2102_06_091' },
    { displayName: 'PMT 2102-08-091', value: 'pmt_2102_08_091' },
    { displayName: 'PMT 2102-10-091', value: 'pmt_2102_10_091' },
    { displayName: 'PMT 2102-12-091', value: 'pmt_2102_12_091' },
    { displayName: 'PMT 2102-14-091', value: 'pmt_2102_14_091' },
    { displayName: 'PMT 2102-16-091', value: 'pmt_2102_16_091' },
    { displayName: 'PMT 2102-16-092', value: 'pmt_2102_16_092' },
    { displayName: 'PMT 2102-16-093', value: 'pmt_2102_16_093' },
    { displayName: 'PMT 2102-16-131', value: 'pmt_2102_16_131' },
    { displayName: 'PMT 2102-16-142', value: 'pmt_2102_16_142' },
    { displayName: '2069-EPC-05C-35', value: 'epc_05c' },
    { displayName: '2069-EPC-15C-35', value: 'epc_15c' },
    { displayName: 'NeuroPace DL-344-3.5', value: 'neuropace_dl_344_35' },
    { displayName: 'NeuroPace DL-344-10', value: 'neuropace_dl_344_10' },
    { displayName: 'DIXI D08-05AM', value: 'dixi_d08_05am' },
    { displayName: 'DIXI D08-08AM', value: 'dixi_d08_08am' },
    { displayName: 'DIXI D08-10AM', value: 'dixi_d08_10am' },
    { displayName: 'DIXI D08-12AM', value: 'dixi_d08_12am' },
    { displayName: 'DIXI D08-15AM', value: 'dixi_d08_15am' },
    { displayName: 'DIXI D08-18AM', value: 'dixi_d08_18am' },
    { displayName: 'AdTech BF08R-SP05X', value: 'adtech_bf08r_sp05x' },
    { displayName: 'AdTech BF08R-SP21X', value: 'adtech_bf08r_sp21x' },
    { displayName: 'AdTech BF08R-SP61X', value: 'adtech_bf08r_sp61x' },
    { displayName: 'AdTech BF09R-SP61X-0BB', value: 'adtech_bf09r_sp61x_0bb' },
    { displayName: 'AdTech RD06R-SP05X', value: 'adtech_rd06r_sp05x' },
    { displayName: 'AdTech RD08R-SP05X', value: 'adtech_rd08r_sp05x' },
    { displayName: 'AdTech RD10R-SP03X', value: 'adtech_rd10r_sp03x' },
    { displayName: 'AdTech RD10R-SP05X', value: 'adtech_rd10r_sp05x' },
    { displayName: 'AdTech RD10R-SP06X', value: 'adtech_rd10r_sp06x' },
    { displayName: 'AdTech RD10R-SP07X', value: 'adtech_rd10r_sp07x' },
    { displayName: 'AdTech RD10R-SP08X', value: 'adtech_rd10r_sp08x' },
    { displayName: 'AdTech SD06R-SP26X', value: 'adtech_sd06r_sp26x' },
    { displayName: 'AdTech SD08R-SP05X', value: 'adtech_sd08r_sp05x' },
    { displayName: 'AdTech SD10R-SP05X', value: 'adtech_sd10r_sp05x' },
    { displayName: 'AdTech SD10R-SP05X Choi', value: 'adtech_sd10r_sp05x_choi' },
    { displayName: 'AdTech SD14R-SP05X', value: 'adtech_sd14r_sp05x' },
    { displayName: 'ELAINE Rat Electrode', value: 'elaine_rat_electrode' },
    { displayName: 'FHC WU Rat Electrode', value: 'fhc_wu_rat_electrode' },
    { displayName: 'NuMed Mini Lead', value: 'numed_minilead' },
    { displayName: 'Aleva directSTIM Directed', value: 'aleva_directstim_directed' },
    { displayName: 'Aleva directSTIM 11500', value: 'aleva_directstim_11500' },
    { displayName: 'SmartFlow Cannula NGS-NC-06', value: 'smartflow_ngs_nc_06' },
  ];
  
  export const IPG_OPTIONS = [
    { value: 'Abbott', label: 'Abbott (Infinity, Brio, Libra)' },
    { value: 'Boston', label: 'Boston Scientific (Vercise, Genus, Gevia)' },
    { value: 'Medtronic_Activa', label: 'Medtronic Activa' },
    { value: 'Medtronic_Percept', label: 'Medtronic Percept' },
    { value: 'Research', label: 'Research/Master' },
  ];
  
  export const VISUALIZATION_MODELS = [
    { value: '1', label: 'Dembek 2017' },
    { value: '2', label: 'Fastfield (Baniasadi 2020)' },
    { value: '3', label: 'SimBio/FieldTrip (see Horn 2017)' },
    { value: '4', label: 'Kuncel 2008' },
    { value: '5', label: 'Maedler 2012' },
    { value: '6', label: 'OSS-DBS (Butenko 2020)' },
  ];
  
  export const NAMING_CONVENTIONS = [
    { name: 'clinical', value: 'clinical' },
    { name: 'lead-dbs', value: 'lead-dbs' },
  ];
  
  // Utility functions
  export const getElectrodeDisplayName = (value) => {
    const electrode = ELECTRODE_MODELS.find(model => model.value === value);
    return electrode ? electrode.displayName : value;
  };
  
  export const getElectrodeValue = (displayName) => {
    const electrode = ELECTRODE_MODELS.find(model => model.displayName === displayName);
    return electrode ? electrode.value : displayName;
  };
  
  export const getIPGFromElectrode = (electrodeValue) => {
    if (electrodeValue.includes('boston')) return 'Boston';
    if (electrodeValue.includes('abbott')) return 'Abbott';
    if (['medtronic_3389', 'medtronic_3387', 'medtronic_3391'].includes(electrodeValue)) {
      return 'Medtronic_Activa';
    }
    if (electrodeValue.includes('medtronic')) return 'Medtronic_Percept';
    return 'Research';
  };
  
  export const getVisualizationModelLabel = (value) => {
    const model = VISUALIZATION_MODELS.find(model => model.value === value);
    return model ? model.label : 'SimBio/FieldTrip (see Horn 2017)';
  };