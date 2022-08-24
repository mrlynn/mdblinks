exports = async function(id){
  let collection = context.services.get("mongodb-atlas").db("routes").collection("routes");

  let result = await collection.deleteOne({_id: BSON.ObjectId(id)});
  return result;
};