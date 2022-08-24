realm-cli pull --remote=admin-toxzg --include-hosting
# mv admin/* . && rm -r admin
cd frontend
npm run build
cd ..
rm -rf ./hosting/files
cp -r ./frontend/build ./hosting/files
git add .
git commit -am $1
git push origin main