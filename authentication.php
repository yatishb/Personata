<?php
	
require_once 'php-sdk/autoload.php';
require_once 'credentials.php';
use Facebook\FacebookSession;
use Facebook\FacebookRequest;
use Facebook\GraphUser;
use Facebook\FacebookRedirectLoginHelper;
use Facebook\FacebookJavaScriptLoginHelper;
use Facebook\FacebookRequestException;

FacebookSession::setDefaultApplication('752376788138741', '8b7ebc139e08f42a6b1740d9a4a36c6c');

//enable session to store token
session_start();

//url for later redirection
$base_url = sprintf('%s://%s%s', empty($_SERVER['HTTPS']) ? 'http' : 'https',$_SERVER['HTTP_HOST'], $_SERVER['SCRIPT_NAME']);

//check if user has been authenticated.
if (!empty($_SESSION['fb_access_token'])) {
  $session = new FacebookSession($_SESSION['fb_access_token']);
} else {
	//check if user has been authenticated by javascript sdk
	$helper = new FacebookJavaScriptLoginHelper();
	$session = null;
	try {
		$session = $helper->getSession();
	} catch (Facebook\FacebookAuthorizationException $e) {
		// Can't do anything about it. Fallback.
		printf($e);
	}

	if ($session) {
		//app token for later api calls
		$app_token = $session->getAccessToken()->extend();
	    $_SESSION['fb_access_token'] = (string)$app_token;

	    // Redirect out of the current page so that if the user reloads the page, we will
	    // not attempt to reuse the now-expired token.
	    header('location: ' . $base_url);
	    exit;
	}
}

?>