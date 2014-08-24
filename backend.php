<?php
	require_once('authentication.php');
	use Facebook\FacebookSession;
	use Facebook\FacebookRequest;
	use Facebook\GraphUser;
	use Facebook\FacebookRedirectLoginHelper;
	use Facebook\FacebookJavaScriptLoginHelper;
	use Facebook\FacebookRequestException;

	if ($session) {
		$request = new FacebookRequest(
		  $session,
		  'GET',
		  '/me'
		);
		$response = $request->execute();
		$graphObject = $response->getGraphObject();

		print_r($graphObject);
	}
?>