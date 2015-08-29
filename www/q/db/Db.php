<?php

defined('SYSPATH') or die('No direct script access.');

class Db {
	// **************************************************
	// private.
	//
	//
	// **************************************************
	private $db;

	private function send($data) {
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Headers: Content-Type");
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
		header("Access-Control-Allow-Credentials: true");
		header("Access-Control-Allow-Max-Age: 86400");
		header("Content-Type: application/json");

		echo json_encode($data);
	}

	function __construct($user, $pass) {
		try {
			$this->db = new PDO( "mysql:host=localhost; dbname=stx_core", $user, $pass );
			$this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
		catch(PDOException $e) {
			header("HTTP/1.1 401 Unauthorized");
			die();
		}
	}

	// **************************************************
	// public.
	//
	//
	// **************************************************
	public function addCustomer($data) {
		$firstname = $data->name['first'];
		$lastname = $data->name['last'];
		$address1 = $data->address1;
		$address2 = $data->address2;
		$city = $data->city;
		$state = $data->state;
		$zipcode = $data->zipcode;
		$phone = $data->phone;

		$q = $this->db->prepare("INSERT INTO customers (firstname, lastname, address1, address2, city, state, zipcode, phone) VALUES (:firstname, :lastname, :address1, :address2, :city, :state, :zipcode, :phone)");
		$q->bindParam(':firstname', $firstname);
		$q->bindParam(':lastname', $lastname);
		$q->bindParam(':address1', $address1);
		$q->bindParam(':address2', $address2);
		$q->bindParam(':city', $city);
		$q->bindParam(':state', $state);
		$q->bindParam(':zipcode', $zipcode);
		$q->bindParam(':phone', $phone);
		$q->execute();

		$cusId = $this->db->lastInsertId();

		if($cusId) {
			$this->send([
				'status' => true,
				'cusId' => $cusId
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function addCheck($data) {
		$cusId = $data->cusId;
		$issId = $data->issId;
		$bnkId = $data->bnkId;
		$doc = $data->doc;
		$MICR = $data->MICR;
		$image = $data->image;

		$q = $this->db->prepare("INSERT INTO checks (cusId, issId, bnkId, MICRAcct, MICRAmt, MICRAux, MICRBankNum, MICRChkType, MICRCountry, MICRDecode, MICREPC, MICRFont, MICROnUs, MICROut, MICRParseSts0, MICRParseSts1, MICRRaw, MICRSerNum, MICRTPC, MICRTransit, DocHeight, DocUnits, DocWidth, ImageSHA1Key1, ImageSHA1Key2, ImageSize1, ImageSize2, ImageURL1, ImageURL2) VALUES (:cusId, :issId, :bnkId, :MICRAcct, :MICRAmt, :MICRAux, :MICRBankNum, :MICRChkType, :MICRCountry, :MICRDecode, :MICREPC, :MICRFont, :MICROnUs, :MICROut, :MICRParseSts0, :MICRParseSts1, :MICRRaw, :MICRSerNum, :MICRTPC, :MICRTransit, :DocHeight, :DocUnits, :DocWidth, :ImageSHA1Key1, :ImageSHA1Key2, :ImageSize1, :ImageSize2, :ImageURL1, :ImageURL2)");
		$q->bindParam(':cusId', $cusId);
		$q->bindParam(':issId', $issId);
		$q->bindParam(':bnkId', $bnkId);
		$q->bindParam(':MICRAcct', $MICR['acct']);
		$q->bindParam(':MICRAmt', $MICR['amt']);
		$q->bindParam(':MICRAux', $MICR['aux']);
		$q->bindParam(':MICRBankNum', $MICR['bankNum']);
		$q->bindParam(':MICRChkType', $MICR['chkType']);
		$q->bindParam(':MICRCountry', $MICR['country']);
		$q->bindParam(':MICRDecode', $MICR['decode']);
		$q->bindParam(':MICREPC', $MICR['EPC']);
		$q->bindParam(':MICRFont', $MICR['font']);
		$q->bindParam(':MICROnUs', $MICR['onUs']);
		$q->bindParam(':MICROut', $MICR['out']);
		$q->bindParam(':MICRParseSts0', $MICR['parseSts0']);
		$q->bindParam(':MICRParseSts1', $MICR['parseSts1']);
		$q->bindParam(':MICRRaw', $MICR['raw']);
		$q->bindParam(':MICRSerNum', $MICR['serNum']);
		$q->bindParam(':MICRTPC', $MICR['TPC']);
		$q->bindParam(':MICRTransit', $MICR['transit']);
		$q->bindParam(':DocHeight', $doc['height']);
		$q->bindParam(':DocUnits', $doc['units']);
		$q->bindParam(':DocWidth', $doc['width']);
		$q->bindParam(':ImageSHA1Key1', $image['front']['SHAKey']);
		$q->bindParam(':ImageSHA1Key2', $image['back']['SHAKey']);
		$q->bindParam(':ImageSize1', $image['front']['size']);
		$q->bindParam(':ImageSize2', $image['back']['size']);
		$q->bindParam(':ImageURL1', $image['front']['url']);
		$q->bindParam(':ImageURL2', $image['back']['url']);
		$q->execute();

		$chkId = $this->db->lastInsertId();

		if($chkId) {
			$this->send([
				'status' => true,
				'chkId' => $chkId
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function addIssuer($data) {
		$account = $data->account;
		$routing = $data->routing;
		$name = $data->name;
		$address1 = $data->address1;
		$address2 = $data->address2;
		$city = $data->city;
		$state = $data->state;
		$zipcode = $data->zipcode;
		$phone = $data->phone;
		$email = $data->email;


		$q = $this->db->prepare("INSERT INTO issuers (account, routing, name, address1, address2, city, state, zipcode, phone, email) VALUES (:account, :routing, :name, :address1, :address2, :city, :state, :zipcode, :phone, :email)");
		$q->bindParam(':account', $account);
		$q->bindParam(':routing', $routing);
		$q->bindParam(':name', $name);
		$q->bindParam(':address1', $address1);
		$q->bindParam(':address2', $address2);
		$q->bindParam(':city', $city);
		$q->bindParam(':state', $state);
		$q->bindParam(':zipcode', $zipcode);
		$q->bindParam(':phone', $phone);
		$q->bindParam(':email', $email);
		$q->execute();

		$issId = $this->db->lastInsertId();

		if($issId) {
			$this->send([
				'status' => true,
				'issId' => $issId,
				'name' => $name
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function getBankById($id) {
		$q = $this->db->prepare("SELECT bnkId, account, name FROM banks WHERE account = :id LIMIT 1");
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':id', $id);
		$q->execute();

		$row = $q->fetch();
		if($row) {
			$this->send([
				'status' => true,
				'bnkId' => $row['bnkId'],
				'account' => $row['account'],
				'name' => $row['name']
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function getCustomerById($id) {
		$q = $this->db->prepare("SELECT firstname, lastname FROM customers WHERE cusId = :id LIMIT 1");
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':id', $id);
		$q->execute();

		$row = $q->fetch();
		if($row) {
			$this->send([
				'status' => true,
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname']
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function getCustomerByName($firstname, $lastname) {
		$q = $this->db->prepare("SELECT cusId, firstname, lastname FROM customers WHERE firstname = :firstname AND lastname = :lastname");
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':firstname', $firstname);
		$q->bindParam(':lastname', $lastname);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'cusId' => $row['cusId'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname']
			];
		}

		if(count($data) > 0) {
			$this->send([
				'status' => true,
				'customers' => $data
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function getIssuerByAccountRouting($account, $routing) {
		$q = $this->db->prepare("SELECT name FROM issuers WHERE account = :account AND routing = :routing LIMIT 1");
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':account', $account);
		$q->bindParam(':routing', $routing);
		$q->execute();

		$row = $q->fetch();
		if($row) {
			$this->send([
				'status' => true,
				'name' => $row['name']
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}
}

?>
