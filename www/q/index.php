<?php

define('SYSPATH', true);

require 'flight/Flight.php';
require '../../x/config.php';
require 'db/Db.php';

Flight::register('db', 'Db', array($user, $pass));

Flight::route('/', function() {
});

Flight::route('/user/@id', function($id) {
	$db = Flight::db();
	$db->getUserData($id);
});

Flight::route('POST /check', function() {
	$doc = Flight::request()->data->doc;
	$MICR = Flight::request()->data->MICR;
	$image = Flight::request()->data->image;
});

Flight::start();

?>
