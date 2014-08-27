<?php
	require_once('authentication.php');
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

		$postArray = getAllPosts($session, 200, 1391244171, 1398848971);
		//var_dump($allPosts);
		/*$numberPosts = count($allPosts["data"]);

		$postArray = array();
		foreach ($allPosts["data"] as $key => $value) {
			$array = json_decode(json_encode($value), true);
			$postArray[] = $array;
		}*/

		//$postarray now contains all the posts
		foreach ($postArray as $eachPost) {
			//Write to database
			echo $eachPost["likes"]["summary"]["total_count"];
			echo " ";
		}
		//echo $postArray[0]["id"];
		//var_dump(getParticularPost($session, $postArray[0]["id"]));

		//$now = new DateTime(null, new DateTimeZone('London'));
		//echo $now->getTimestamp();

		echo count($postArray);
	}
	//echo "out";



	function getAllPosts($session, $limit, $starttime, $endtime) {
		$request = new FacebookRequest(
			$session,
			'GET',
			'/me/posts?fields=id,created_time,likes.limit(1).summary(true),comments.limit(1).summary(true),type&
			since='.$starttime.'&until='.$endtime.'&limit='.$limit);
		$response = $request->execute();
		$allPostsGraphObject = $response->getGraphObject();
		$allPostsArray = $allPostsGraphObject->asArray();

		$postArray = array();
		foreach ($allPostsArray["data"] as $key => $value) {
			$array = json_decode(json_encode($value), true);
			$postArray[] = $array;
		}

		return $postArray;
	}

	function getParticularPost($session, $id){
		$request = new FacebookRequest(
			$session,
			'GET',
			'/'.$id);
		$response = $request->execute();
		$postGraphObject = $response->getGraphObject();
		return $postGraphObject;
	}

	function getPermissions($session) {
		$request = new FacebookRequest(
			$session,
			'GET',
			'/me/permissions');
		$response = $request->execute();
		$postsGraphObject = $response->getGraphObject();
		$permissions = $postsGraphObject->asArray();
	}
	
?>
