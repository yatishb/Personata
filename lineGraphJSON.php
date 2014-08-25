<?php

	$data = array('fields' => array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'),
					'data' => array(1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233));

	print json_encode($data);

?>