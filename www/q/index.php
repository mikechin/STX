<?php

define('SYSPATH', true);

require 'flight/Flight.php';
require '../../x/config.php';
require 'db/Db.php';

Flight::register('db', 'Db', array($user, $pass));

Flight::route('/', function() {
	$db = Flight::db();
	$db->getUserData();
});

Flight::start();

?>
