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
		/*foreach ($postArray as $eachPost) {
			//Write to database
			echo $eachPost["likes"]["summary"]["total_count"];
			echo " ";
		}*/
		$id1 = $postArray[0]["id"];
		$post = getParticularPost($session, $postArray[0]["id"]);
		//var_dump($post);
		echo $post["id"];

		//$now = new DateTime(null, new DateTimeZone('London'));
		//echo $now->getTimestamp();

		echo "count: ";
		echo count($postArray);
	}
	//echo "out";

	function convertObjectToArray($object) {
		$array = array();
		foreach ($object["data"] as $key => $value) {
			$eachArray = json_decode(json_encode($value), true);
			$array[] = $eachArray;
		}

		return $array;
	}



	function getAllPosts($session, $limit, $starttime, $endtime) {
		$request = new FacebookRequest(
			$session,
			'GET',
			'/me/posts?fields=id,created_time,likes.limit(1).summary(true),comments.limit(1).summary(true),type&
			since='.$starttime.'&until='.$endtime.'&limit='.$limit);
		$response = $request->execute();
		$allPostsGraphObject = $response->getGraphObject();
		$allPostsArray = $allPostsGraphObject->asArray();

		return convertObjectToArray($allPostsArray);
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
