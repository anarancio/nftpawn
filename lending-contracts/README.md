# Infuy Hardhat project boilerplate 

The project is a template to create a smart contract project using hardhat. 
The project already includes the required plugins for all smart contracts projects at Infuy

Node version required: 18.13.0

## Steps:

1. If you don't have already clone the boilerplate project (let's call this location $TEMPLATE_FOLDER)
2. Clone your destination repo in another location (let's call this location $TARGET_FOLDER)
3. Go to the target repo (the new project repo not the boilerplate)
```script
cd $TARGET_FOLDER
```
4. Copy all the boilerplate files from the teamplate folder to the project we want to create
```script
cp -R $TEMPLATE_FOLDER/* .
```
5. If you had node_modules in the template repo you should delete and regenerate this folder
6. Run npm install
```script
npm install
```
7. Test the project running:
```script
npx hardhat coverage
```
8. Push your repo changes:
```script
git add .
git commit -m "First commit"
git push origin main
```


Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

*To run the test coverage tool:*
```shell
npx hardhat coverage
```
