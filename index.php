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
	
	
	<link href="style/bootstrap.min.css" rel="stylesheet" type="text/css">
	<link href="style/style.css" rel="stylesheet" type="text/css">
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
	<script>
  		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		
  		ga('create', 'UA-54318266-1', 'auto');
  		ga('send', 'pageview');
	</script>
	
</head>
<body>
	<div id="background" ></div>
	<div id='dev'>This app is still under development.</div>
	<div class='container-fluid'>
		<div class='row' id='main'>
			<div id="logo">
			      <a href="."><img src="img/logo.png" ></a>
			</div>
			<!-- LHS of page -->
			<div class='col-sm-9 col-md-7 col-lg-6 col-lg-offset-1'>	
				<!-- meaning for normal display is nine of 12, for middle size is 7 out of 8? -->
				

			    <!-- front page -->
				<div class='front-page view'>
					<div class='title'>
						Choose Your Data Type:
					</div>

					<!-- menu -->
					<div id="menu">
						<div class='row'>
							<div class='col-sm-5'>
								<div class="ObjectContainer">
                                    <div class="Object">
                                        <img src="img/monthata.png">
                                    </div>
                                    <a class='ignore-default' onclick="switchView('.monthly-data'); updateDataType('monthly-post'); renderMonthPostGraph('me', 'Me', 'Monthly Posts');" href="#" >See from here your monthly data usage, how many posts, comments and likes?</br>
                                        Have you been more social for the past month?
                                    </a>
                                </div>
							</div>
							<!-- Monthly -->
							<div class='col-sm-5 col-sm-offset-1'>
								<div class="ObjectContainer">
                                    <div class="Object">
                                        <img src="img/percenta.png">
                                    </div>
								<a class='ignore-default ObjectContainer' onclick="switchView('.daily-data'); updateDataType('post-type'); renderDailyDataGraph('me', 'Me', 'Post Type Composition');" href="">
									See how active are you in the duration of a day! Which type of post you like to post the most?
								</a>
								</div>
							</div>
							<!-- Percenta -->
						</div>
						<!-- First Row -->

						<div class='row'>
							<div class='col-sm-5'>
								<div class="ObjectContainer">
                                    <div class="Object">
                                        <img src="img/eventa.png">
                                    </div>
									<a class='ignore-default ObjectContainer' onclick="switchView('.events-data'); updateDataType('event'); processEventGraph('me', 'Me', 'Events For Past 30 Days');" href="">
										Having a busy schedule or loose track of your daily routine? See your event calendar.
									 </a>
								</div>
							</div>
							<!-- Eventa -->
							<div class='col-sm-5 col-sm-offset-1'>
								<div class="ObjectContainer">
									<div class="Object">
                                        <img src="img/ranka.png">
                                    </div>
								<a class='ignore-default ObjectContainer' onclick="switchView('.ranking-data'); updateDataType('ranking'); getRankingData('me', 'Me', 'Top Liked Posts');" href="">
								See what is your most popular post that your friends like the most!</a>
								</div>
							</div>
							<!-- Ranking -->
						</div>
						<!-- Second Row -->
					</div>
					<!-- Menu -->
				</div>
				<!-- front page -->

				<!-- subpage 1 monthly data -->
				<div class='row'>
					<div class='monthly-data center-div view col-sm-12'>
						
						<div class="title sub-page-title">The Monthly Usage</div>
						<div class="row">
							<div class="submenu col-sm-4 col-xs-2">
								<a href="" class="ignore-default" onclick="updateDataType('monthly-post');renderMonthPostGraph('me', 'Me', 'Monthly Posts');">&#9734</br>Post</a>
							</div>

							<div class="submenu col-sm-4 col-xs-2">
								<a href="" class="ignore-default" onclick="updateDataType('monthly-like');renderMonthLikeGraph('me', 'Me', 'Monthly Likes');">&#9825</br>Like</a>
							</div>
							<div class="submenu col-sm-4 col-xs-2">

								<a href="" class="ignore-default" onclick="updateDataType('monthly-comment');renderMonthCommentGraph('me', 'Me', 'Monthly Comments');">&#9731</br>Comment</a>
							</div>
						</div>
						
						<div id="monthly-container" class='col-sm-12'></div>
						
					</div>
				</div>
				<!-- subpage 1 -->

				<!-- subpage 2 percentage data -->
				<div class='row'>
					<div class='daily-data center-div view col-sm-12'>
						<p class='title sub-page-title'>Percentage Data</p>
						<div class="row">
							<div class="submenu col-sm-4 col-xs-3">
								<a href="" class="ignore-default" onclick="updateDataType('post-type');renderDailyDataGraph('me', 'Me', 'Post Type Composition');">Post Type</a>
							</div>
							<div class="submenu col-sm-4 col-xs-3">
								<a href="" class="ignore-default" onclick="updateDataType('active-time');renderActiveDistribution('me', 'Me', 'Daily Active Time');"> Activity</br> Level</a>
							</div>
						</div>
						<div id="daily-container" class='col-sm-12'></div>
					</div>
				</div>
				<!-- subpage 2 -->

				<!-- subpage 3 events data-->
				<div class='row'>
					<div class='events-data center-div view col-sm-12'>
						<p class='title sub-page-title'>Events HeatMap</p>
						<div id="events-container" class="col-sm-12"></div>
					</div>
				</div>
				<!-- PP3 -->

				<!-- subpage 4 ranking data-->
				<div class='row'>
					<div class='ranking-data center-div view col-sm-12'>
						<p class='title sub-page-title'>Most Popular Posts</p>
						<p id='ranking-title'></p>
						<ul class="timeline">
							<li id="0">
								<div class="rightarrow arrow">
									<p>1st <span id='like-ranking-0'></span></p>
								</div>
								<div class="display rightarrow">
									<p class='message'></p>
									<a href="" id="read-more-0">Read More</a>
								</div>
							</li>
							<li id="1">
								<div class="rightarrow arrow">
									<p>2nd <span id='like-ranking-1'></span></p>
								</div>
								<div class="display rightarrow">
									<p class='message'></p>
									<a href="" id="read-more-1">Read More</a>
								</div>
							</li>
							<li id="2">
								<div class="leftarrow arrow">
									<p>3rd <span id='like-ranking-2'></span></p>
								</div>
								<div class="display leftarrow">
									<p class='message'></p>
									<a href="" id="read-more-2">Read More</a>
								</div>
							</li>
							<li id="3">
								<div class="rightarrow arrow">
									<p>4th <span id='like-ranking-3'></span></p>
								</div>
								<div class="display rightarrow">
									<p class='message'></p>
									<a href="" id="read-more-3">Read More</a>
								</div>
							</li>
							<li id="4">
								<div class="rightarrow arrow">
									<p>5th <span id='like-ranking-4'></span></p>
								</div>
								<div class="display rightarrow">
									<p class='message'></p>
									<a href="" id="read-more-4">Read More</a>
								</div>
							</li>
							<li id="5">
								<div class="leftarrow arrow">
									<p>6th <span id='like-ranking-5'></span></p>
								</div>
								<div class="display leftarrow">
									<p class='message'></p>
									<a href="" id="read-more-5">Read More</a>
								</div>
							</li>
							<li id="6">
								<div class="rightarrow arrow">
									<p>7th <span id='like-ranking-6'></span></p>
								</div>
								<div class="display rightarrow">
									<p class='message'></p>
									<a href="" id="read-more-6">Read More</a>
								</div>
							</li>
							<li id="7">
								<div class="rightarrow arrow">
									<p>8th <span id='like-ranking-7'></span></p>
								</div>
								<div class="display rightarrow">
									<p class='message'></p>
									<a href="" id="read-more-7">Read More</a>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<!-- subpage 4 ranking -->
			</div>



			<!-- RHS of page -->
			<div class='col-sm-2 col-sm-offset-1 col-md-1 hidden-xs'>	
				<div class='row'>
					<div id='user'>
							<img id="photo" src="" alt="">
							<div id="name"></div>
					</div>
				</div>
				<div class='row'>
					<div class="iconlist front-page view">
                        <a href="" class='ignore-default' onclick="FBInvite()">
                            <div class="imgWrap">
                                <img class="icon" src="img/invite.png">
                                    <p class="imgDescription"> INVITE friends!</p>
                            </div>
                        </a>
                        <a href="#">
                            <div class="imgWrap">
                                <img class="icon" src="img/logout.png" id='logout'>
                                    <p class="imgDescription"> Logout</p>
                            </div>
                        </a>
                	</div>	
				</div>
				<div class='row'>
					<div class="iconlist monthly-data events-data daily-data ranking-data view">
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
                                <img class="icon" src="img/view.png" id='view-friends-button'>
                                    <p class="imgDescription">VIEW friends!</p>
                            </div>
                        </a>
                        <a href="#" class='ignore-default' onclick="FBInvite()">
                            <div class="imgWrap">
                                <img class="icon" src="img/invite.png">
                                    <p class="imgDescription"> INVITE friends!</p>
                            </div>
                        </a>
                        <a href="" id='logout'>
                            <div class="imgWrap">
                                <img class="icon" src="img/logout.png">
                                    <p class="imgDescription"> Logout</p>
                            </div>
                        </a>
                	</div>	
				</div>
			</div>

			<div class="col-md-1 hidden-sm hidden-xs">
			    <div class='row'>
			    	<div class="col-md-1">
			    		<div class="sidebar">
			    			<!-- <div class="intro"> -->
						        <img src="img/logo-black.png">
						        </br></br>
						         <div id="default-info">
						            is an app created for you to view and evaluate your facebook usage.    
						            You could know your monthly comments, likes and posts, view your     
						            friends as well as share and invite them to use the app.
						        </div>
						    </div>
						    <div class="fb-like" data-href="http://54.254.165.1/dev/" data-layout="standard" data-action="like" data-show-faces="true"></div>
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
		<div id='view-friends-title' style='display:none;'>View Your Friends</div>
		<div id='view-friends-content' style='display:none;'>
			<a class="ignore-default template" onclick="renderFriendsGraph(this);" href="#">
				<img class='profile' src="" alt="">
			</a>
		</div>
	</div>
</body>
</html>
