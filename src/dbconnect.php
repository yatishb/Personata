<?php
function setupdb()
{
	$con=mysqli_connect("localhost","root","CS3216@Group5","Personate");

	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	else
	{
		return $con;
	}
}
function closedb($conn)
{
	mysqli_close($conn);
}
?>
