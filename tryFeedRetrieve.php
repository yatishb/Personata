<?php
	require_once('authentication.php');
	require_once('backend.php');
	use Facebook\FacebookSession;
	use Facebook\FacebookRequest;
	use Facebook\GraphUser;
	use Facebook\FacebookRedirectLoginHelper;
	use Facebook\FacebookJavaScriptLoginHelper;
	use Facebook\FacebookRequestException;

	if(empty($session)) {
		echo "Session does not exist";
	} else {
		echo "Session found";

		//$postarray now contains all the posts
		/*foreach ($postArray as $eachPost) {
			//Write to database
			echo $eachPost["likes"]["summary"]["total_count"];
			echo " ";
		}*/
		/*$currenttime = time();
		$lastmonth = $currenttime - (30*24*60*60);
		$con = setupdb();
		$posts = getAllPosts($session, 200, $lastmonth, $unixtime);
		writePostsToDatabase($postArray, $con);
		$data = getPostsCountTwoMonths($con);
		getTimeActivityDistribution($con);*/

		/*$facebook = new FacebookSession::setDefaultApplication('752376788138741', '8b7ebc139e08f42a6b1740d9a4a36c6c');
		getMe($session);
		$fql = 'SELECT name from user where uid = ' . $_SESSION['user_id'];
		$ret_obj = $facebook->api(array(
                                   'method' => 'fql.query',
                                   'query' => $fql,
                                 ));
		
*/		$con = setupdb();
		var_dump(getFeedTypeActivity($con));
		var_dump(getTimeActivityDistribution($con));
		echo "done";
	}
	//echo "out

?>










