<?php
	require_once('authentication.php');
	use Facebook\FacebookSession;
	use Facebook\FacebookRequest;
	use Facebook\GraphUser;
	use Facebook\FacebookRedirectLoginHelper;
	use Facebook\FacebookJavaScriptLoginHelper;
	use Facebook\FacebookRequestException;

	if (isset($_GET['data'])) {
		switch ($_GET['data']) {
			case 'events':
				$start_time = date("Y")."-".(date("m")-1)."-01";
				$results = getEvents($session, $start_time, getEndTimeForLastMonth());
				
				print count($results);
			break;
			
			default:
				echo '<pre>'.print_r(getEvents($session, '2014-04-01', getEndTimeForLastMonth()),1).'</pre>';
				echo(getEndTimeForLastMonth());
			break;
		}
	}

	function getEndTimeForCurrentMonth() {
		$year = date("Y");
		$month = date("m");
		$endDate = cal_days_in_month(CAL_GREGORIAN, $month, $year);

		return "$year-$month-$endDate";
	}

	function getEndTimeForLastMonth() {
		$year = date("Y");
		$month = date("m");
		//if current month is Jan, then last month is Dec
		if ($month == 1) {
			$month == 12;
			$year--;
		}
		$endDate = cal_days_in_month(CAL_GREGORIAN, --$month, $year);

		return "$year-$month-$endDate";
	}

	function getStartTimeForLastMonth() {
		$year = date("Y");
		$month = date("m");
		//if current month is Jan, then last month is Dec
		if ($month == 1) {
			$month == 12;
			$year--;
		} else {
			$month --;
		}
		$startDate = 1;

		return "$year-$month-$startDate";
	}

	function getMe($session){
		if ($session) {
			$request = new FacebookRequest(
			  $session,
			  'GET',
			  '/me?fileds=id'
			);
			$response = $request->execute();
			$graphObject = $response->getGraphObject();
			$id = $graphObject->getId();

			//store user id to session for later api calls
			$_SESSION['user_id'] = $id;

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
			$graphObject = $response->getGraphObject()->getProperty('data');

			return $graphObject->asArray();
		}
	}

	function getMostPopularPosts()
	{
		///retrieve 10 most popular posts from database
		$query = "SELECT *, likes + comments AS popularity FROM feeds ORDER BY popularity DESC LIMIT 10";
		$results = mysql_query("connection", $query);
		
		//request content for each post
		while ($row = mysqli_fetch_array($results)) {
			$id = $row['id'];

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
		/* $request = new FacebookRequest(
			$session,
			'GET',
			'/me/posts?fields=id,created_time,likes.limit(1).summary(true),comments.limit(1).summary(true),type&
			since='.$starttime.'&until='.$endtime.'&limit='.$limit); */
		$request = new FacebookRequest(
			$session,
			'GET',
			'/me/posts?fields=id,created_time,type&since='.$starttime.'&until='.$endtime.'&limit='.$limit);
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

	function getTypeID($type, $con) {
		$query = "SELECT tid 
			FROM types 
			WHERE name = '".$type."';";
		$result = mysqli_query($con, $query);
		$row = mysqli_fetch_assoc($result);
		return $row["tid"];
	}

	function writePostsToDatabase($postArray, $con) {
		foreach ($postArray as $post) {
			$id = $post["id"];
			$allids = explode("_", $id);
			$fid = $allids[1];
			$uid = $allids[0];

			$time = $post["created_time"];
			$timearray = explode('T', $time);
			$postdate = $timearray[0];
			$posttime = $timearray[1];

			$type = $post["type"];
			$query = "SELECT count(*) 
				FROM types 
				WHERE name = '".$type."';";
			$result = mysqli_query($con, $query);
			$row = mysqli_fetch_row($result);
			if ($row[0] == 0) {
				$query = "INSERT INTO types(name) 
					VALUES('".$type."');";
				$result = mysqli_query($con, $query);
			}
			$tid = getTypeID($type, $con);

			$query = "SELECT count(*) 
				FROM users 
				WHERE uid = ".$uid.";";
			$result = mysqli_query($con, $query);
			$row = mysqli_fetch_row($result);
			if ($row[0] == 0) {
				$query = "INSERT INTO users(uid, modified) VALUES(".$uid.",now());";
				$result = mysqli_query($con, $query);
			} else {
				$query = "UPDATE users SET modified = now() WHERE uid =".$uid.";";
				$result = mysqli_query($con, $query);
			}
			
			$query = "INSERT INTO feeds(fid, uid, tid, postdate, time) 
				VALUES(".$fid.",".$uid.",".$tid.",('".$postdate."'),('".$posttime."'));";
			$result = mysqli_query($con, $query);
		}
	}

	function retrievePostsFromDbDate($date, $con) {
		$query = "SELECT fid, uid, tid, postdate, posttime 
			FROM feeds 
			WHERE time BETWEEN ('".$date."') AND ('".$date."');";
		$result = mysqli_query($con, $query);
		
		$counter = -1;
		$posts = array();

		while($row = mysqli_fetch_assoc($result))
		{
		    $counter++;
		    $posts[$counter]['fid']=$row['fid'];
		    $posts[$counter]['uid']=$row['uid'];
		    $posts[$counter]['tid']=$row['tid'];
		    $posts[$counter]['postdate']=$row['postdate'];
		    $posts[$counter]['posttime']=$row['posttime'];
		}
		
		return $posts;
	}

	function retrieveCountPostsFromDbDate($date, $con) {
		$query = "SELECT count(fid) 
			FROM feeds 
			WHERE time BETWEEN ('".$date." 00:00:00') AND ('".$date." 23:59:59');";
		$result = mysqli_query($con, $query);
		$row = mysqli_fetch_row($result);
		
		return $row;
	}

	//Returns Array with all dates in which there has been a post in the last 2 months along with the number of posts made
	function getPostsCountTwoMonths($con){
		$lastDateThisMonth = date('d');
		$thismonth = date('m');
		$year = date('y');
		$dateToday = $year . "-" . $thismonth . "-" . $lastDateThisMonth;
		$firstDateLastMonth = getStartTimeForLastMonth();

		$data = array();
		$fields = array();
		$lastmonthdata = array();
		$thismonthdata = array();
		$i = 1;
		while ($i <= 31) {
			$fields[$i] = $i;
			$lastmonthdata[$i] = 0;
			$thismonthdata[$i] = 0;
			$i ++;
		}

		$query = "SELECT postdate, count(*) 
			FROM feeds 
			WHERE postdate BETWEEN ('".$firstDateLastMonth." 00:00:00') AND ('".$dateToday." 23:59:59')
			GROUP BY postdate;";
		$result = mysqli_query($con, $query);
		while ($row = mysqli_fetch_assoc($result)) {
			$postdate = $row["postdate"];
			$dateelements = explode("-",$postdate);
			$date = intval($dateelements[2]);
			if ($dateelements[1] == $thismonth) {
				$thismonthdata[$date] = $row["count(*)"];
			} else {
				$lastmonthdata[$date] = $row["count(*)"];
			}
			
		}
		
		$data["fields"] = $fields;
		$data["lastmonth"] = $lastmonthdata;
		$data["thismonth"] = $thismonthdata;
		return $data;
	}
	
	//print_r(getMe($session));
?>