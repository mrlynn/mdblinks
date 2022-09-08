#!/bin/bash

POSITIONAL_ARGS=()

while [[ $# -gt 0 ]]; do
  case $1 in
    redirector)
      REDIRECTOR=true
      shift # past argument
      ;;
    admin)
      ADMIN=true
      shift # past argument
      ;;
    landing|landings)
      LANDING=true
      shift # past argument
      ;;
    *)
      POSITIONAL_ARGS+=("$1") # save positional arg
      shift # past argument
      ;;
  esac
done
set -- "${POSITIONAL_ARGS[@]}" # restore positional parameters

if [ "$REDIRECTOR" = true ]; then
  echo "Deploying redirector service"
  realm-cli pull --local=realm --remote=redirector-odhgb --include-hosting -y
  rm -rf ./realm/hosting/files
  mkdir ./realm/hosting/files
  cd redirector
  cp -r . ../realm/hosting/files
  cd ..
  realm-cli push --local=realm --remote=redirector-odhgb --include-hosting -y
  rm -rf ./realm
fi

if [ "$ADMIN" = true ]; then
  echo "Deploying admin interface"
  realm-cli pull --local=realm --remote=admin-toxzg --include-hosting -y
  rm -rf ./realm/hosting/files
  mkdir ./realm/hosting/files
  cd admin
  npm run build
  cp -r ./build/* ../realm/hosting/files
  rm -rf ./build
  cd ..
  realm-cli push --local=realm --remote=admin-toxzg --include-hosting -y
  rm -rf ./realm
fi

if [ "$LANDING" = true ]; then 
  echo "Deploying landing page service"
  realm-cli pull --local=realm --remote=landing-mgxlk --include-hosting -y
  rm -rf ./realm/hosting/files
  mkdir ./realm/hosting/files
  cd landing
  npm run build
  cp -r ./build/* ../realm/hosting/files
  rm -rf ./build
  cd ..
  realm-cli push --local=realm --remote=landing-mgxlk --include-hosting -y
  rm -rf ./realm
fi