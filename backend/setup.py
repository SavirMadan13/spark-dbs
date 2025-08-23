from setuptools import setup, find_packages

setup(
    name="spark-dbs-backend",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        # Add your Python dependencies here
        "fastapi",
        "uvicorn",
    ],
    python_requires=">=3.8",
) 