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

	private function saveImage($src, $des) {
		// cUrl way outperforms copy().
		$ch = curl_init($src);
		$fp = fopen($des, 'wb');
		curl_setopt($ch, CURLOPT_FILE, $fp);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_exec($ch);
		curl_close($ch);
		fclose($fp);
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
	public function addBank($data) {
		$account = $data->account;
		$name = $data->name;

		$q = $this->db->prepare("INSERT INTO banks (account, name) VALUES (:account, :name)");
		$q->bindParam(':account', $account);
		$q->bindParam(':name', $name);
		$q->execute();

		$bnkId = $this->db->lastInsertId();

		if($bnkId) {
			$this->send([
				'status' => true,
				'bnkId' => $bnkId,
				'name' => $name
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function addCustomer($data) {
		$columns = 'firstname, lastname';
		$values = ':firstname, :lastname';

		$firstname = $data->name['first'];
		$lastname = $data->name['last'];
		$address1 = NULL;
		$address2 = NULL;
		$city = NULL;
		$state = NULL;
		$zipcode = NULL;
		$phone = NULL;
		$photo = NULL;

		if($data->address1 !== '') {
			$address1 = $data->address1;
			$columns .= ', address1';
			$values .= ', :address1';
		}
		if($data->address2 !== '') {
			$address2 = $data->address2;
			$columns .= ', address2';
			$values .= ', :address2';
		}
		if($data->city !== '') {
			$city = $data->city;
			$columns .= ', city';
			$values .= ', :city';
		}
		if($data->state !== '') {
			$state = $data->state;
			$columns .= ', state';
			$values .= ', :state';
		}
		if($data->zipcode !== '') {
			$zipcode = $data->zipcode;
			$columns .= ', zipcode';
			$values .= ', :zipcode';
		}
		if($data->phone !== '') {
			$phone = $data->phone;
			$columns .= ', phone';
			$values .= ', :phone';
		}
		if($data->photo !== null) {
			$photo = $data->photo;
			$columns .= ', photo';
			$values .= ', :photo';
		}

		$q = $this->db->prepare("INSERT INTO customers ($columns) VALUES ($values)");
		$q->bindParam(':firstname', $firstname);
		$q->bindParam(':lastname', $lastname);
		if($address1)
			$q->bindParam(':address1', $address1);
		if($address2)
			$q->bindParam(':address2', $address2);
		if($city)
			$q->bindParam(':city', $city);
		if($state)
			$q->bindParam(':state', $state);
		if($zipcode)
			$q->bindParam(':zipcode', $zipcode);
		if($phone)
			$q->bindParam(':phone', $phone);
		if($photo)
			$q->bindParam(':photo', $photo);
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

		$q = $this->db->query("SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = 'checks' AND table_schema = DATABASE()");
		$nextId = $q->fetch()['AUTO_INCREMENT'];

		$chkImgPath = $_SERVER["DOCUMENT_ROOT"] . "/chkimg/$nextId";
		mkdir($chkImgPath, 0755, true);
		$this->saveImage($data->stxUrl . $image['front']['url'], $chkImgPath . "/front." . $image['FileType']);
		$this->saveImage($data->stxUrl . $image['back']['url'], $chkImgPath . "/back." . $image['FileType']);

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
		$columns = 'account, routing, name';
		$values = ':account, :routing, :name';

		$account = $data->account;
		$routing = $data->routing;
		$name = $data->name;
		$address1 = NULL;
		$address2 = NULL;
		$city = NULL;
		$state = NULL;
		$zipcode = NULL;
		$phone = NULL;
		$email = NULL;

		if($data->address1 !== '') {
			$address1 = $data->address1;
			$columns .= ', address1';
			$values .= ', :address1';
		}
		if($data->address2 !== '') {
			$address2 = $data->address2;
			$columns .= ', address2';
			$values .= ', :address2';
		}
		if($data->city !== '') {
			$city = $data->city;
			$columns .= ', city';
			$values .= ', :city';
		}
		if($data->state !== '') {
			$state = $data->state;
			$columns .= ', state';
			$values .= ', :state';
		}
		if($data->zipcode !== '') {
			$zipcode = $data->zipcode;
			$columns .= ', zipcode';
			$values .= ', :zipcode';
		}
		if($data->phone !== '') {
			$phone = $data->phone;
			$columns .= ', phone';
			$values .= ', :phone';
		}
		if($data->email !== '') {
			$email = $data->email;
			$columns .= ', email';
			$values .= ', :email';
		}

		$q = $this->db->prepare("INSERT INTO issuers ($columns) VALUES ($values)");
		$q->bindParam(':account', $account);
		$q->bindParam(':routing', $routing);
		$q->bindParam(':name', $name);
		if($address1)
			$q->bindParam(':address1', $address1);
		if($address2)
			$q->bindParam(':address2', $address2);
		if($city)
			$q->bindParam(':city', $city);
		if($state)
			$q->bindParam(':state', $state);
		if($zipcode)
			$q->bindParam(':zipcode', $zipcode);
		if($phone)
			$q->bindParam(':phone', $phone);
		if($email)
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

	public function getChecksByCustomerId($id) {
		$q = $this->db->prepare(
			"SELECT chkId, issId, bnkId, created_at, MICRAcct, MICRAmt, MICRTransit, MICRSerNum
			FROM checks
			WHERE cusId = :id"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':id', $id);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'status' => true,
				'chkId' => $row['chkId'],
				'issId' => $row['issId'],
				'bnkId' => $row['bnkId'],
				'created' => $row['created_at'],
				'acct' => $row['MICRAcct'],
				'amt' => $row['MICRAmt'],
				'transit' => $row['MICRTransit'],
				'serNum' => $row['MICRSerNum']
			];
		}

		if(count($data) > 0) {
			$this->send([
				'status' => true,
				'checks' => $data
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

	public function getCustomersByName($firstname, $lastname) {
		$q = $this->db->prepare(
			"SELECT cusId, firstname, lastname, photo, address1, address2, city, state, zipcode, phone
			FROM customers
			WHERE firstname = :firstname AND lastname = :lastname"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':firstname', $firstname);
		$q->bindParam(':lastname', $lastname);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'cusId' => $row['cusId'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname'],
				'photo' => $row['photo'],
				'address1' => $row['address1'],
				'address2' => $row['address2'],
				'city' => $row['city'],
				'state' => $row['state'],
				'zipcode' => $row['zipcode'],
				'phone' => $row['phone']
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

	public function getCustomersByIssuer($issId) {
		$q = $this->db->prepare(
			"SELECT DISTINCT checks.cusId, customers.firstname, customers.lastname, customers.photo
			FROM checks
			INNER JOIN customers ON checks.cusId = customers.cusId
			WHERE issId = :issId"
		);

		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':issId', $issId);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'cusId' => $row['cusId'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname'],
				'photo' => $row['photo']
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
		$q = $this->db->prepare("SELECT issId, name FROM issuers WHERE account = :account AND routing = :routing LIMIT 1");
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':account', $account);
		$q->bindParam(':routing', $routing);
		$q->execute();

		$row = $q->fetch();
		if($row) {
			$this->send([
				'status' => true,
				'issId' => $row['issId'],
				'name' => $row['name']
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function getReportByRange($start, $end) {
		$q = $this->db->prepare(
			"SELECT chkId, issId, bnkId, created_at, MICRAcct, MICRAmt, MICRTransit, MICRSerNum
			FROM checks
			WHERE created_at BETWEEN :start AND :end"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':start', $start);
		$q->bindParam(':end', $end);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'status' => true,
				'chkId' => $row['chkId'],
				'issId' => $row['issId'],
				'bnkId' => $row['bnkId'],
				'created' => $row['created_at'],
				'acct' => $row['MICRAcct'],
				'amt' => $row['MICRAmt'],
				'transit' => $row['MICRTransit'],
				'serNum' => $row['MICRSerNum']
			];
		}

		if(count($data) > 0) {
			$this->send([
				'status' => true,
				'checks' => $data
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
