<?php
	require_once('authentication.php');

	global $session = isAuthenticated();

	function getMe()		
	{	
		$request = new FacebookRequest(
		  $session,
		  'GET',
		  '/me'
		);
		$response = $request->execute();
		$graphObject = $response->getGraphObject();

		return $graphObject;
	}

	print_r($graphObject);
?>