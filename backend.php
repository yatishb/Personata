<?php
	require_once('authentication.php');
	use Facebook\FacebookSession;
	use Facebook\FacebookRequest;
	use Facebook\GraphUser;
	use Facebook\FacebookRedirectLoginHelper;
	use Facebook\FacebookJavaScriptLoginHelper;
	use Facebook\FacebookRequestException;

	function getEndTime() {
		$year = date("Y");
		$month = date("m");
		$endDate = cal_days_in_month(CAL_GREGORIAN, $month, $year);

		return "$year-$month-$endDate";
	}

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

	function getEvents($session, $starttime, $endtime) {
		if ($session) {
			$request = new FacebookRequest(
				$session,
				'GET',
				"/me/events?fileds=id,start_time,end_time&since=$starttime&until=$endtime"
			);
			$response = $request->execute();
			$graphObject = $response->getGraphObject();

			return $graphObject;
		}
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
		return $permissions;
	}
	
	print_r(getEndTime());
?>