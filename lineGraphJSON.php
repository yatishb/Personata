<?php

	$data = array('fields' => array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'),
					'thisMonth' => array(1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233),
					'lastMonth' => array(21, 34, 55, 89, 144, 233, 1, 2, 3, 5, 8, 13));

	print json_encode($data);

?>