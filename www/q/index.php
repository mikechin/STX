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

Flight::route('GET /checks/@type/@id', function($type, $id) {
	if($type === 'customer') {
		$db = Flight::db();
		$db->getChecksByCustomerId($id);
	}
	else {
		header("HTTP/1.1 401 Unauthorized");
		die();
	}
});

Flight::route('GET /customer/@id', function($id) {
	$db = Flight::db();
	$db->getCustomerById($id);
});

Flight::route('GET /customers/@firstname/@lastname', function($firstname, $lastname) {
	$db = Flight::db();
	$db->getCustomersByName($firstname, $lastname);
});

Flight::route('GET /customers/@issId', function($issId) {
	$db = Flight::db();
	$db->getCustomersByIssuer($issId);
});

Flight::route('GET /issuer/@account/@routing', function($account, $routing) {
	$db = Flight::db();
	$db->getIssuerByAccountRouting($account, $routing);
});

Flight::route('GET /report/@start/@end', function($start, $end) {
	$db = Flight::db();
	$db->getReportByRange($start, $end);
});

Flight::route('POST /bank/add', function() {
	$db = Flight::db();
	$db->addBank(Flight::request()->data);
});

Flight::route('POST /customer/add', function() {
	$db = Flight::db();
	$db->addCustomer(Flight::request()->data);
});

Flight::route('POST /customer/photo', function() {
	$db = Flight::db();
	$db->addCustomer(Flight::request()->data);
});

Flight::route('POST /check', function() {
	$db = Flight::db();
	$db->addCheck(Flight::request()->data);
});

Flight::route('POST /issuer/add', function() {
	$db = Flight::db();
	$db->addIssuer(Flight::request()->data);
});

Flight::start();

?>
