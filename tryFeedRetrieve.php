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

		$allPosts = getAllPosts($session, 200)->asArray();
		//var_dump($allPosts);
		$numberPosts = count($allPosts["data"]);

		$postArray = array();
		foreach ($allPosts["data"] as $key => $value) {
			$array = json_decode(json_encode($value), true);
			$postArray[] = $array;
		}

		//$postarray now contains all the posts
		foreach ($postArray as $eachPost) {
			//Write to database
		}
		//echo $postArray[0]["id"];
		//var_dump(getParticularPost($session, $postArray[0]["id"]));

		echo count($postArray);
	}
	//echo "out";



	function getAllPosts($session, $limit) {
		$request = new FacebookRequest(
			$session,
			'GET',
			'/me/posts?fields=id,created_time,likes,comments,message,story,type&limit='.$limit);
		$response = $request->execute();
		$allPostsGraphObject = $response->getGraphObject();
		return $allPostsGraphObject;
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
