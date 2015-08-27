<?php

define('SYSPATH', true);

require 'flight/Flight.php';
require '../../x/config.php';
require 'db/Db.php';

Flight::register('db', 'Db', [ $user, $pass ]);

Flight::route('/', function() {
});

Flight::route('GET /user/@id', function($id) {
	$db = Flight::db();
	$db->getUserById($id);
});

Flight::route('GET /user/@firstname/@lastname', function($firstname, $lastname) {
	$db = Flight::db();
	$db->getUserByName($firstname, $lastname);
});

Flight::route('POST /check', function() {
	$doc = Flight::request()->data->doc;
	$MICR = Flight::request()->data->MICR;
	$image = Flight::request()->data->image;
});

Flight::route('GET /issuers/@account/@routing', function($account, $routing) {
	$db = Flight::db();
	$db->getIssuerByAccountRouting($account, $routing);
});

Flight::start();

?>
