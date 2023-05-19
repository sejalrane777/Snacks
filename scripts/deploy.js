
const hre =require("hardhat");

async function getBalance(address){
  const balance = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balance);

}
async function consoleBalance(addresses){
  let counter =0;
  for(const address of addresses){
    console.log(`Address ${counter} balance:`, await getBalance(address));
    counter++;
  }
}

async function consoleMemo(memos){
  for(const memo of memos){
    const timestamp = memo.timestamp;
    const name = memo.name;
    const from = memo.from ;
    const message = memo.message;
    console.log(
      `At ${timestamp},name ${name},address ${from},Dish ${message}`
    );
  }
}

 
async function main() {
const [owner,from1,from2,from3] = await hre.ethers.getSigners();
const snack = await hre.ethers.getContractFactory("snack");
const contract = await snack.deploy();

await contract.deployed();
console.log("Address of contract:" , contract.address);

const addresses=[owner.address,from1.address,from2.address,from3.address];
console.log("Before");
await consoleBalance(addresses);

const amount = {value: hre.ethers.utils.parseEther("1")};
await contract.connect(from1).buySnacks("from1","chai",amount);
await contract.connect(from2).buySnacks("from2","samosa",amount);
await contract.connect(from3).buySnacks("from3","Idli",amount);

console.log("After");
await consoleBalance(addresses);

const memos = await contract.getMemo();
consoleMemo(memos);


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
