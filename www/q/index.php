<?php

define('SYSPATH', true);

require 'flight/Flight.php';
require '../../x/config.php';
require 'db/Db.php';

Flight::register('db', 'Db', [ $user, $pass ]);

Flight::route('/', function() {
});

Flight::route('GET /bank/@id', function($id) {
	$db = Flight::db();
	$db->getBankById($id);
});

Flight::route('POST /customer/add', function() {
	$db = Flight::db();
	$db->addCustomer(Flight::request()->data);
});

Flight::route('GET /customer/@id', function($id) {
	$db = Flight::db();
	$db->getCustomerById($id);
});

Flight::route('GET /customer/@firstname/@lastname', function($firstname, $lastname) {
	$db = Flight::db();
	$db->getCustomerByName($firstname, $lastname);
});

Flight::route('POST /check', function() {
	$data = Flight::request()->data;
	$db = Flight::db();
	$db->addCheck($data);
});

Flight::route('POST /issuer/add', function() {
	$account = Flight::request()->data->account;
	$routing = Flight::request()->data->routing;
	$name = Flight::request()->data->name;

	$db = Flight::db();
	$db->addIssuer($account, $routing, $name);
});

Flight::route('GET /issuer/@account/@routing', function($account, $routing) {
	$db = Flight::db();
	$db->getIssuerByAccountRouting($account, $routing);
});

Flight::start();

?>
