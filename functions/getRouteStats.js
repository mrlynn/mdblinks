exports = async function(route){
  let collection = context.services.get("mongodb-atlas").db("routes").collection("visitors");
  
  let time7DaysAgo = (new Date()).getTime() - 7*24*60*60*1000;
  
  let visitorsLast7Days = await collection.aggregate([
    {$match: {requestedRoute: "/cheers"}}, 
    {$match: {
      timestamp: {
        "$gt": new Date(time7DaysAgo),
        "$lt": new Date()
        }
      }
    }, 
    {$count: 'visits'}]
  ).toArray();

  
  return {
    route,
    stats: {
      visits: visitorsLast7Days[0].visits.toString()
    }
  };
};
  