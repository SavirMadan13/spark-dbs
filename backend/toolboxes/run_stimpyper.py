
import stim_pyper
from stim_pyper.processing_utils.run_optimizer import OptimizerProcessor
import sys

def run_stimpyper(electrode_data_path, nifti_path, output_path):
    print(f"Running StimPyPer with electrode_data_path: {electrode_data_path}, nifti_path: {nifti_path}, output_path: {output_path}")
    processor = OptimizerProcessor(
        electrode_data_path=electrode_data_path,
        nifti_path=nifti_path,
        output_path=output_path
    )
    processor.multistart()

