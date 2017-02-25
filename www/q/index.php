<?php

define('SYSPATH', true);

require 'flight/Flight.php';
require '../../x/config.php';
require 'db/Db.php';

Flight::register('db', 'Db', [ $user, $pass ]);

Flight::route('/', function() {
});

// **************************************************
// get.
//
//
// **************************************************
Flight::route('GET /bank/@id', function($id) {
	$db = Flight::db();
	$db->getBankById($id);
});

Flight::route('GET /checks', function() {
	$db = Flight::db();
	$db->getChecks();
});

Flight::route('GET /checks/@type/@id', function($type, $id) {
	$db = Flight::db();
	if($type === 'customer') {
		$db->getChecksByCustomerId($id);
	}
	else if($type = 'issuer') {
		$db->getChecksByIssuerId($id);
	}
	else {
		header("HTTP/1.1 401 Unauthorized");
		die();
	}
});

Flight::route('GET /checks/@number', function($number) {
	$db = Flight::db();
	$db->getChecksByNumber($number);
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

Flight::route('GET /download/@start/@end', function($start, $end) {
	$db = Flight::db();
	$db->getDownloadByRange($start, $end);
});

Flight::route('GET /issuer/@account/@routing', function($account, $routing) {
	$db = Flight::db();
	$db->getIssuerByAccountRouting($account, $routing);
});

Flight::route('GET /issuers/@name', function($name) {
	$db = Flight::db();
	$db->getIssuersByName($name);
});

Flight::route('GET /issuers/acct/@account', function($account) {
	$db = Flight::db();
	$db->getIssuersByAccount($account);
});

Flight::route('GET /issuers/@name/@account', function($name, $account) {
	$db = Flight::db();
	$db->getIssuersByNameAccount($name, $account);
});

Flight::route('GET /report/recent', function() {
	$db = Flight::db();
	$db->getReportRecent();
});

Flight::route('GET /report/@start/@end', function($start, $end) {
	$db = Flight::db();
	$db->getReportByRange($start, $end);
});

// **************************************************
// delete.
//
//
// **************************************************
Flight::route('DELETE /report/delete/@rptId', function($rptId) {
	$db = Flight::db();
	$db->deleteReportById($rptId);
});

// **************************************************
// post.
//
//
// **************************************************
Flight::route('POST /bank/add', function() {
	$db = Flight::db();
	$db->addBank(Flight::request()->data);
});

Flight::route('POST /customer/add', function() {
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

// **************************************************
// put.
//
//
// **************************************************
Flight::route('PUT /customer/update/@id', function($id) {
	$db = Flight::db();
	$db->updateCustomer($id, Flight::request()->data);
});

Flight::start();

?>
