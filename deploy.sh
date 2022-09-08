# echo "Deploying redirector service"
# realm-cli pull --local=realm --remote=redirector-odhgb --include-hosting -y
# rm -rf ./realm/hosting/files
# mkdir ./realm/hosting/files
# cd redirector
# cp -r . ../realm/hosting/files
# cd ..
# realm-cli push --local=realm --remote=redirector-odhgb --include-hosting -y
# rm -rf ./realm

# echo "Deploying admin interface"
# realm-cli pull --local=realm --remote=admin-toxzg --include-hosting -y
# rm -rf ./realm/hosting/files
# mkdir ./realm/hosting/files
# cd admin
# npm run build
# cp -r ./build/* ../realm/hosting/files
# rm -rf ./build
# cd ..
# realm-cli push --local=realm --remote=admin-toxzg --include-hosting -y
# rm -rf ./realm

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
