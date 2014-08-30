<?php
	require_once('authentication.php');
	use Facebook\FacebookSession;
	use Facebook\FacebookRequest;
	use Facebook\GraphUser;
	use Facebook\FacebookRedirectLoginHelper;
	use Facebook\FacebookJavaScriptLoginHelper;
	use Facebook\FacebookRequestException;

	function getMe($session){
		if ($session) {
			$request = new FacebookRequest(
			  $session,
			  'GET',
			  '/me'
			);
			$response = $request->execute();
			$graphObject = $response->getGraphObject();

			return $graphObject;
		}
	}

	function getNumberFeedPostsLastMonth($session, $limit = 1000) {
		$currenttime = time();
		$lastmonth = $currenttime - (30*24*60*60);
		
		$postsInMonth = getAllPosts($session, $limit, $lastmonth, $currenttime);
		return count($postsInMonth);
	}


	function convertObjectToArray($object) {
		$array = array();
		foreach ($object["data"] as $key => $value) {
			$eachArray = json_decode(json_encode($value), true);
			$array[] = $eachArray;
		}

		return $array;
	}


	// Returns an array of all posts in a specified time limit
	function getAllPosts($session, $limit, $starttime, $endtime) {
		$request = new FacebookRequest(
			$session,
			'GET',
			'/me/posts?fields=id,created_time,likes.limit(1).summary(true),comments.limit(1).summary(true),type&since='.$starttime.'&until='.$endtime.'&limit='.$limit);
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
		return $permissions;
	}

	function writePostsToDatabase($postArray, $con) {
		foreach ($postArray as $post) {
			$id = $post["id"];
			$allids = explode("_", $id);
			$fid = $allids[1];
			$uid = $allids[0];

			$time = $post["created_time"];
			if(array_key_exists("likes", $post)){
				$likes = $post["likes"]["summary"]["total_count"];	
			} else {
				$likes = 0;
			}
			
			
			$tid =1;
			if(array_key_exists("comments", $post)){
				$comments = $post["comments"]["summary"]["total_count"];
			} else {
				$comments = 0;
			}
			
			$query = "INSERT INTO feeds(fid, uid, tid, time, likes, comments) VALUES(".$fid.",".$uid.",".$tid.",('".$time."'),".$likes.",".$comments.");";
			$result = mysqli_query($con, $query);
		}
	}

	function retrievePostsFromDbDate($date, $con) {
		$query = "SELECT fid, uid, tid, time, likes, comments FROM feeds WHERE time BETWEEN ('".$date." 00:00:00') AND ('".$date." 23:59:59');";
		$result = mysqli_query($con, $query);
		
		$counter = -1;
		$posts = array();

		while($row = mysqli_fetch_assoc($result))
		{
		    $counter++;

		    $posts[$counter]['fid']=$row['fid'];
		    $posts[$counter]['uid']=$row['uid'];
		    $posts[$counter]['tid']=$row['tid'];
		    $posts[$counter]['time']=$row['time'];
		    $posts[$counter]['likes']=$row['likes'];
		    $posts[$counter]['comments']=$row['comments'];

		}
		
		return $posts;
	}
	
	//print_r(getMe($session));
?>