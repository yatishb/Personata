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
		<div class='row' id='main'>
			<div class='col-lg-7 col-md-8'>	
				<div id="logo">
			      <a href="."><img src="img/logo.png" ></a>
			    </div>
				<div id='front-page' class='view'>
					<div id='title'>
						Choose Your Data Type:
					</div>
					
					<div id="menu">
						<div class='row'>
							<div class='col-sm-5'>
								<div class="ObjectContainer">
                                    <div class="Object" onclick="switchView('.monthly-data'); renderMonthPostGraph();">
                                        <img src="img/monthly_data.png">
                                    </div>
                                    <a class='ignore-default' onclick="switchView('.monthly-data'); renderMonthPostGraph();" href="#" >See from here your monthly data usage, how many posts, comments and likes?</br>
                                        Have you been more social for the past month?
                                    </a>
                                </div>
							</div>
							<div class='col-sm-5 col-sm-offset-1'>
								<a class='ignore-default ObjectContainer' onclick="switchView('.daily-data'); renderDailyDataGraph();" href="">
									<img src="img/daily_data.png" alt="">
								</a>
							</div>
						</div>
						<div class='row'>
							<div class='col-sm-5'>
								<a class='ignore-default ObjectContainer' onclick="switchView('.events-data'); processEventGraph();" href=""><img src="img/event.png" alt=""></a>
							</div>
							<div class='col-sm-5 col-sm-offset-1'>
								<a class='ignore-default ObjectContainer' href=""><img src="img/ranking.png" alt=""></a>
							</div>
						</div>		
					</div>
				</div>
				<div class='row'>
					<div class='monthly-data center-div view col-sm-12'>
						<a href="" class="ignore-default" onclick="renderMonthPostGraph();">Posts</a>
						<a href="" class="ignore-default" onclick="renderMonthLikeGraph();">Likes</a>
						<a href="" class="ignore-default" onclick="renderMonthCommentGraph();">Comments</a>
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
				<div class='row'>
					<div class="fb-like" data-href="http://54.254.165.1/dev/" data-layout="standard" data-action="like" data-show-faces="true"></div>
				</div>
			</div>
			<div class='col-lg-2 hidden-xs'>	
				<div class='row'>
					<div id='user'>
							<img id="photo" src="" alt="">
					</div>
				</div>
				<div class='row'>
					<div class="iconlist monthly-data events-data daily-data view">
                        <a href="">
                            <div class="imgWrap">
                                <img class="icon" src="img/home.png">
                                    <p class="imgDescription">HOME</p>
                            </div>
                        </a>
                        <a href="#" id="share" class='ignore-default'>
                            <div class="imgWrap">
                                <img class="icon" src="img/share.png">
                                    <p class="imgDescription"> SHARE it! </p>
                            </div>
                        </a>
                        <a href="#">
                            <div class="imgWrap">
                                <img class="icon" src="img/view.png">
                                    <p class="imgDescription">VIEW friends!</p>
                            </div>
                        </a>
                        <a href="#" class='ignore-default' onclick="FBInvite()">
                            <div class="imgWrap">
                                <img class="icon" src="img/invite.png">
                                    <p class="imgDescription"> INVITE friends!</p>
                            </div>
                        </a>
                        <a href="#">
                            <div class="imgWrap">
                                <img class="icon" src="img/logout.png">
                                    <p class="imgDescription"> Logout</p>
                            </div>
                        </a>
                	</div>	
				</div>
			</div>

			<div class="col-lg-3 hidden-md hidden-sm hidden-xs">
			    <div class='row'>
			    	<div class="col-md-1">
			    		<div class="sidebar">
			    			<div class="intro">
						        <img src="img/logo.png">
						        </br></br>
						            is an app created for you to view and evaluate your facebook usage.     You could know your monthly comments, likes and posts, view your     friends as well as share and invite them to use the app.
						    </div>
						    <div class="footer">
						        Copyright 2014 &#169Personata
						    </div>
			    		</div>
			    	</div>
			    </div>
			</div>	
		</div>
		<div id="fb-root"></div>
		<div class="modal"><!-- Place at bottom of page --></div>
	</div>
</body>
</html>