import os

# Load the zip files from the text file into a list
with open('../ziplist_complete.txt', 'r') as f:
    ziplist = [line.split(' - ')[0] for line in f]

# Get the list of all zip files in the current directory
all_files = os.listdir(os.getcwd())
zip_files = [f for f in all_files if f.endswith('.zip')]

# Iterate over all zip files in the current directory
for zip_file in zip_files:
    # If the zip file is not in the list from the text file, delete it
    if zip_file not in ziplist:
        os.remove(zip_file)
        print(f'Deleted {zip_file}')

print('Done')
