
exports = async function(arg){
  let object = arg;
  object.owner = context.user.id;
  
  let collection = context.services.get("mongodb-atlas").db("routes").collection("routes");
  
  let results = await collection.insertOne(object);
  
  return results;
};