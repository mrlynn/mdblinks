<?php
$endpoint = "https://data.mongodb-api.com/app/redirector-odhgb/endpoint/getRoute";
$url = $endpoint."?route=".$_SERVER['REQUEST_URI'];
$contents = file_get_contents($url);
$route = json_decode($contents);

if (is_array($route)) {
?>
  <h1>Oops, that URL was not found</h1>
  <p>Did you mean to visit any of these sites?</p>
  <ul id="routeList">
    <?php
    for ($i = 0; $i < count($route); $i++) {
      echo "<li><a href='".$route[$i]->route."'>".$route[$i]->title."</a></li>";
    }
    ?>
  </ul>
  <p>If you were trying to reach one of the landing pages, you can check out the list at <a href="http://landing.mdb.link">landing.mdb.link</a></p>
<?php
} else {
  header('Location: '.$route->to);
}
?>