<?php

define('SYSPATH', true);

require 'flight/Flight.php';

Flight::route('/', function() {
	echo 'root';
});

Flight::start();

?>
