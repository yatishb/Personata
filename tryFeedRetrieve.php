<?php
	require_once('backend.php');
	require_once('authentication.php');
	use Facebook\FacebookSession;
	use Facebook\FacebookRequest;
	use Facebook\GraphUser;
	use Facebook\FacebookRedirectLoginHelper;
	use Facebook\FacebookJavaScriptLoginHelper;
	use Facebook\FacebookRequestException;

	echo "Test";

	if(empty($session)) {
		echo "Session does not exist";
	} else {

		$allPosts = getAllPosts($session)->asArray();
		var_dump($allPosts);
		$numberPosts = count($allPosts["data"]);

		$postArray = array();
		foreach ($allPosts["data"] as $key => $value) {
			$array = json_decode(json_encode($value), true);
			$postArray[] = $array;
		}

		foreach ($postArray as $post) {
			echo $post["id"],' ', PHP_EOL;
			/*$bool = array_key_exists("likes", $post);
			if ($bool == TRUE) {
				$i +=1;
				echo $post["id"];
			}

			if ($post["id"] == "10152041822345382_10152092624525382") {
				echo "found";
			}*/
		}

		echo count($postArray);
	}
	echo "out";



	function getAllPosts($session) {
		$request = new FacebookRequest(
			$session,
			'GET',
			'/me/posts?fields=id,created_time,likes,comments');
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