<?php
	session_start();
	if (!isset($_SESSION['fb_access_token'])) {
		header('Location:login.html');
		exit();
	}
?>
<!DOCTYPE html>
<html lang='en'>
<head>
	<title>Personata</title>
	
	<link href="style/style.css" rel="stylesheet" type="text/css">
	<link href="style/bootstrap.min.css" rel="stylesheet" type="text/css">
	<script src="js/jquery-2.1.1.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/highcharts.js"></script>
	<script src="js/highcharts-more.js"></script>
	<script src="js/exporting.js"></script>
	<script src="js/heatmap.js"></script>
	<script src="//connect.facebook.net/en_US/sdk.js"></script>
	<script src="//connect.facebook.net/en_US/all.js"></script> 
	<script src="js/core.js"></script>
	<script src="js/social.js"></script>
	<script src="js/graph.js"></script>
	
</head>
<body>
	<div id='dev'>This app is still under development.</div>
	<div class='container-fluid'>
		<div id="logo">
	      <a href="http://54.254.165.1/dev/"><img src="img/logo.png" ></a>
	    </div>
		<div class='row' id='main'>
			<div class='col-md-7 col-md-offset-1'>	
				<div id='front-page' class='view'>
					<div id='title'>
						<img src="img/title.png" alt="">
					</div>
					
					<div id="menu">
						<div class='row'>
							<div class='col-sm-5'>
								<a class='ignore-default' onclick="switchView('.monthly-data'); renderMonthDataGraph();" href=""><img src="img/monthly_data.png" alt=""></a>
							</div>
							<div class='col-sm-5 col-sm-offset-1'>
								<a class='ignore-default' onclick="switchView('.daily-data'); renderDailyDataGraph();" href=""><img src="img/daily_data.png" alt=""></a>
							</div>
						</div>
						<div class='row'>
							<div class='col-sm-5'>
								<a class='ignore-default' onclick="switchView('.events-data'); processEventGraph();" href=""><img src="img/event.png" alt=""></a>
							</div>
							<div class='col-sm-5 col-sm-offset-1'>
								<a href=""><img src="img/ranking.png" alt=""></a>
							</div>
						</div>		
					</div>
				</div>
				<div class='row'>
					<div class='monthly-data center-div view col-sm-12'>
						<div id="monthly-container" class='col-sm-12'></div>
					</div>
				</div>
				<div class='row'>
					<div class='daily-data center-div view col-sm-12'>
						<div id="daily-container" class='col-sm-12'></div>
					</div>
				</div>
				<div class='row'>
					<div class='events-data center-div view col-sm-12'>
						<div id="events-container" class="col-sm-12"></div>
					</div>
				</div>
			</div>
			<div class='col-md-3 col-md-offset-1 hidden-sm hidden-xs'>	
				<div class='row'>
					<div id='user'>
							<img id="photo" src="" alt="">
					</div>
				</div>
				<div class='row'>	
					<div class='monthly-data events-data daily-data view menu-buttons'>
						<a href=""><img src="img/choose_again_button.png" alt=""></a><br>
						<a class='ignore-default' id="share" href="#" styl="display:block"><img src="img/share_button.png" alt=""></a><br>
						<a class='ignore-default' href="" onclick="FBInvite()"><img src="img/view_friends_button.png" alt=""></a><br>
					</div>	
				</div>
			</div>
		</div>
		<div class='row'>
			<div class="fb-like col-md-offset-1" data-href="http://54.254.165.1/dev/" data-layout="standard" data-action="like" data-show-faces="true"></div>
		</div>
	</div>
	<div id="fb-root">
		<footer>Copyright&copy;Personata 2014-2014</footer>
	</div>
	<div class="modal"><!-- Place at bottom of page --></div>
</body>
</html>