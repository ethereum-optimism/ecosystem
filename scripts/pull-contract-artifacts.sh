#!/usr/bin/env bash

set -euo pipefail

lib_dir=./lib
artifact_project="oplabs-tools-artifacts"
artifact_bucket="oplabs-contract-artifacts"
artifact_prefix="artifacts-v1-"

gcloud auth login
gcloud config set project $artifact_project

# Pulls latest v1 artifact bundle
latest_archive=$(gsutil ls -l gs://$artifact_bucket/$artifact_prefix* | sort -k 2 | tail -2 | head -1 | awk '{print $3}')
archive_name=$(basename $latest_archive)

cd $lib_dir

# Cleanup any existing artifacts
rm -rf forge-artifacts

# Download and extract the archive
echo "Attempting to download $latest_archive"
gsutil cp $latest_archive .
tar -xzvf $archive_name

# Cleanup
rm $archive_name
rm -rf artifacts
rm -rf cache

gcloud config unset project

echo "Done"
