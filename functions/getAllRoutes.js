exports = async function(arg){
  let collection = context.services.get("mongodb-atlas").db("routes").collection("routes");
  let results = await collection.find({}).toArray();
  return results;
};