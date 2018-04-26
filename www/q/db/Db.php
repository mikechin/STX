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
		$values  = ':firstname, :lastname';

		$firstname = $data->name['first'];
		$lastname  = $data->name['last'];
		$address1  = NULL;
		$address2  = NULL;
		$city      = NULL;
		$state     = NULL;
		$zipcode   = NULL;
		$phone     = NULL;
		$photo     = NULL;
		$comment   = NULL;

		if(!empty($data->address1)) {
			$address1 = $data->address1;
			$columns .= ', address1';
			$values .= ', :address1';
		}
		if(!empty($data->address2)) {
			$address2 = $data->address2;
			$columns .= ', address2';
			$values .= ', :address2';
		}
		if(!empty($data->city)) {
			$city = $data->city;
			$columns .= ', city';
			$values .= ', :city';
		}
		if(!empty($data->state)) {
			$state = $data->state;
			$columns .= ', state';
			$values .= ', :state';
		}
		if(!empty($data->zipcode)) {
			$zipcode = $data->zipcode;
			$columns .= ', zipcode';
			$values .= ', :zipcode';
		}
		if(!empty($data->phone)) {
			$phone = $data->phone;
			$columns .= ', phone';
			$values .= ', :phone';
		}
		if(!empty($data->notes)) {
			$comment = $data->notes;
			$columns .= ', comment';
			$values .= ', :comment';
		}
		if(!empty($data->photo)) {
			$photo = true;
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
		if($comment)
			$q->bindParam(':comment', $comment);
		if($photo)
			$q->bindParam(':photo', $photo);
		$q->execute();

		$cusId = $this->db->lastInsertId();

		if($cusId) {
			if($photo) {
				// save photo.
				$save = explode(',', $data->photo);
				$decoded = '';
				// for larger images need to break up the base64 string.
				for ($i = 0; $i < ceil(strlen($save[1])/256); $i++) {
					$decoded = $decoded . base64_decode(substr($save[1], $i*256, 256));
				}
				// save the file.
				file_put_contents($_SERVER['DOCUMENT_ROOT'] . "/cusimg/$cusId.jpg", $decoded);
			}

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
		$error = $data->error ? '2' : '0';
		$cusId = $data->cusId;
		$issId = $data->issId;
		$bnkId = $data->bnkId;
		$doc   = $data->doc;
		$MICR  = $data->MICR;
		$image = $data->image;
		$notes = $data->notes;

		$q = $this->db->query("SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = 'checks' AND table_schema = DATABASE()");
		$nextId = $q->fetch()['AUTO_INCREMENT'];

		$chkImgPath = $_SERVER["DOCUMENT_ROOT"] . "/chkimg/$nextId";
		mkdir($chkImgPath, 0755, true);
		$frontImgPath = $chkImgPath . "/front." . $image['FileType'];
		$backImgPath = $chkImgPath . "/back." . $image['FileType'];
		$this->saveImage($data->stxUrl . $image['front']['url'], $frontImgPath);
		$this->saveImage($data->stxUrl . $image['back']['url'], $backImgPath);

		$filename = $chkImgPath . '/imgs.zip';
		$zip = new ZipArchive();
		if($zip->open($filename, ZipArchive::CREATE)!==TRUE) {
			exit("cannot open <$filename>\n");
		}
		$zip->addFile($frontImgPath, 'front.' . $image['FileType']);
		$zip->addFile($backImgPath , 'back.'  . $image['FileType']);
		$zip->close();

		$q = $this->db->prepare("INSERT INTO checks (cusId, issId, bnkId, MICRAcct, MICRAmt, MICRAux, MICRBankNum, MICRChkType, MICRCountry, MICRDecode, MICREPC, MICRFont, MICROnUs, MICROut, MICRParseSts0, MICRParseSts1, MICRRaw, MICRSerNum, MICRTPC, MICRTransit, DocHeight, DocUnits, DocWidth, ImageSHA1Key1, ImageSHA1Key2, ImageSize1, ImageSize2, ImageURL1, ImageURL2, comment, alert) VALUES (:cusId, :issId, :bnkId, :MICRAcct, :MICRAmt, :MICRAux, :MICRBankNum, :MICRChkType, :MICRCountry, :MICRDecode, :MICREPC, :MICRFont, :MICROnUs, :MICROut, :MICRParseSts0, :MICRParseSts1, :MICRRaw, :MICRSerNum, :MICRTPC, :MICRTransit, :DocHeight, :DocUnits, :DocWidth, :ImageSHA1Key1, :ImageSHA1Key2, :ImageSize1, :ImageSize2, :ImageURL1, :ImageURL2, :comment, :alert)");
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
		$q->bindParam(':comment', $notes);
		$q->bindParam(':alert', $error);
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
		$values =  ':account, :routing, :name';

		$account  = $data->account;
		$routing  = $data->routing;
		$name     = $data->name;
		$address1 = NULL;
		$address2 = NULL;
		$city     = NULL;
		$state    = NULL;
		$zipcode  = NULL;
		$phone    = NULL;
		$email    = NULL;
		$comment  = NULL;

		if(!empty($data->address1)) {
			$address1 = $data->address1;
			$columns .= ', address1';
			$values  .= ', :address1';
		}
		if(!empty($data->address2)) {
			$address2 = $data->address2;
			$columns .= ', address2';
			$values  .= ', :address2';
		}
		if(!empty($data->city)) {
			$city     = $data->city;
			$columns .= ', city';
			$values  .= ', :city';
		}
		if(!empty($data->state)) {
			$state    = $data->state;
			$columns .= ', state';
			$values  .= ', :state';
		}
		if(!empty($data->zipcode)) {
			$zipcode  = $data->zipcode;
			$columns .= ', zipcode';
			$values  .= ', :zipcode';
		}
		if(!empty($data->phone)) {
			$phone    = $data->phone;
			$columns .= ', phone';
			$values  .= ', :phone';
		}
		if(!empty($data->email)) {
			$email    = $data->email;
			$columns .= ', email';
			$values  .= ', :email';
		}
		if(!empty($data->notes)) {
			$comment  = $data->notes;
			$columns .= ', comment';
			$values  .= ', :comment';
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
		if($comment)
			$q->bindParam(':comment', $comment);
		$q->execute();

		$issId = $this->db->lastInsertId();

		if($issId) {
			$this->send([
				'status' => true,
				'issId' => $issId,
				'name' => $name,
			]);
		}
		else {
			$this->send([
				'status' => false,
			]);
		}
	}

	public function alertCustomer($id, $level) {
		$q = $this->db->prepare("UPDATE customers SET alert = :level WHERE cusId = :id");
		$q->bindParam(':id', $id);
		$q->bindParam(':level', $level);
		$q->execute();

		if($q->rowCount() > 0) {
			$this->send([
				'status' => true,
				'cusId' => $id,
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function alertIssuer($id, $level) {
		$q = $this->db->prepare(
			"UPDATE issuers
			SET alert = $level
			WHERE issId = :id"
		);
		$q->bindParam(':id', $id);
		$q->execute();

		if($q->rowCount() > 0) {
			$this->send([
				'status' => true,
				'issId' => $id,
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function deleteCheckById($id) {
		$q = $this->db->prepare("UPDATE checks SET deleted = 1 WHERE chkId = :id LIMIT 1");
		$q->bindParam(':id', $id);
		$q->execute();

		$this->send([
			'status' => true
		]);
	}

	public function deleteReportById($rptId) {
		$q = $this->db->prepare("DELETE FROM reports WHERE rptId = :id LIMIT 1");
		$q->bindParam(':id', $rptId);
		$q->execute();

		// delete report zip.
		$filename = $_SERVER["DOCUMENT_ROOT"] . '/reports/' . $rptId . '.zip';
		unlink($filename);

		$this->send([
			'status' => true
		]);
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

	public function getChecks() {
		$q = $this->db->prepare(
			"SELECT chkId, checks.issId, bnkId, created_at, MICRAcct, MICRAmt, MICRTransit, MICRSerNum, checks.comment, issuers.name
			FROM checks
			LEFT JOIN issuers ON checks.issId = issuers.issId
			WHERE checks.deleted = 0
			ORDER BY chkId DESC
			LIMIT 20"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'status'  => true,
				'chkId'   => $row['chkId'],
				'issId'   => $row['issId'],
				'issuer'  => $row['name'],
				'bnkId'   => $row['bnkId'],
				'created' => $row['created_at'],
				'acct'    => $row['MICRAcct'],
				'amt'     => $row['MICRAmt'],
				'notes'   => $row['comment'],
				'transit' => $row['MICRTransit'],
				'serNum'  => $row['MICRSerNum']
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

	public function getChecksByCustomerId($id) {
		$q = $this->db->prepare(
			"SELECT chkId, checks.issId, bnkId, created_at, MICRAcct, MICRAmt, MICRTransit, MICRSerNum, checks.comment, issuers.name
			FROM checks
			LEFT JOIN issuers ON checks.issId = issuers.issId
			WHERE cusId = :id AND checks.deleted = 0
			ORDER BY chkId DESC"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':id', $id);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'status'  => true,
				'chkId'   => $row['chkId'],
				'issId'   => $row['issId'],
				'issuer'  => $row['name'],
				'bnkId'   => $row['bnkId'],
				'created' => $row['created_at'],
				'acct'    => $row['MICRAcct'],
				'amt'     => $row['MICRAmt'],
				'notes'   => $row['comment'],
				'transit' => $row['MICRTransit'],
				'serNum'  => $row['MICRSerNum']
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

	public function getChecksByIssuerId($id) {
		$q = $this->db->prepare(
			"SELECT chkId, checks.issId, bnkId, created_at, MICRAcct, MICRAmt, MICRTransit, MICRSerNum, checks.comment, issuers.name
			FROM checks
			LEFT JOIN issuers ON checks.issId = issuers.issId
			WHERE checks.issId = :id AND checks.deleted = 0
			ORDER BY chkId DESC"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':id', $id);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'status'  => true,
				'chkId'   => $row['chkId'],
				'issId'   => $row['issId'],
				'issuer'  => $row['name'],
				'bnkId'   => $row['bnkId'],
				'created' => $row['created_at'],
				'acct'    => $row['MICRAcct'],
				'amt'     => $row['MICRAmt'],
				'notes'   => $row['comment'],
				'transit' => $row['MICRTransit'],
				'serNum'  => $row['MICRSerNum']
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

	public function getChecksByNumber($number) {
		$q = $this->db->prepare(
			"SELECT chkId, checks.issId, bnkId, created_at, MICRAcct, MICRAmt, MICRTransit, MICRSerNum, checks.comment, issuers.name
			FROM checks
			LEFT JOIN issuers ON checks.issId = issuers.issId
			WHERE MICRSerNum = :number AND checks.deleted = 0
			ORDER BY chkId DESC
			LIMIT 20"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':number', $number);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'status'  => true,
				'chkId'   => $row['chkId'],
				'issId'   => $row['issId'],
				'issuer'  => $row['name'],
				'bnkId'   => $row['bnkId'],
				'created' => $row['created_at'],
				'acct'    => $row['MICRAcct'],
				'amt'     => $row['MICRAmt'],
				'notes'   => $row['comment'],
				'transit' => $row['MICRTransit'],
				'serNum'  => $row['MICRSerNum']
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
		$where = '';
		if(!empty($firstname)) {
			$where .= 'firstname = :firstname';
		}
		if(!empty($lastname)) {
			if(!empty($where)) {
				$where .= ' AND ';
			}
			$where .= 'lastname = :lastname';
		}
		$q = $this->db->prepare(
			"SELECT cusId, firstname, lastname, photo, address1, address2, city, state, zipcode, phone, comment, alert
			FROM customers
			WHERE $where"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		if(!empty($firstname)) {
			$q->bindParam(':firstname', $firstname);
		}
		if(!empty($lastname)) {
			$q->bindParam(':lastname', $lastname);
		}
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'cusId'     => $row['cusId'],
				'firstname' => $row['firstname'],
				'lastname'  => $row['lastname'],
				'photo'     => $row['photo'],
				'address1'  => $row['address1'],
				'address2'  => $row['address2'],
				'city'      => $row['city'],
				'state'     => $row['state'],
				'zipcode'   => $row['zipcode'],
				'phone'     => $row['phone'],
				'comment'   => $row['comment'],
				'warn'      => (int)$row['alert'] === 1 ? true : false,
				'danger'    => (int)$row['alert'] === 2 ? true : false
			];
		}

		if(count($data) > 0) {
			$this->send([
				'status'    => true,
				'q'         => $q,
				'customers' => $data,
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
			"SELECT DISTINCT checks.cusId, customers.firstname, customers.lastname, customers.photo, customers.comment, customers.alert
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
				'photo' => $row['photo'],
				'comment' => $row['comment'],
				'warn' => (int)$row['alert'] === 1 ? true : false,
				'danger' => (int)$row['alert'] === 2 ? true : false
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

	public function getDownloadByRange($start, $end) {
		$q = $this->db->prepare(
			"SELECT chkId, ImageURL1, ImageURL2
			FROM checks
			WHERE deleted = 0 AND created_at BETWEEN :start AND :end"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':start', $start);
		$q->bindParam(':end', $end);
		$q->execute();

		if($q->rowCount() > 0) {
			$r = $this->db->prepare("INSERT INTO reports (start, end) VALUES (:start, :end)");
			$r->bindParam(':start', $start);
			$r->bindParam(':end', $end);
			$r->execute();

			$rptId = $this->db->lastInsertId();

			$filename = $_SERVER["DOCUMENT_ROOT"] . '/reports/' . $rptId . '.zip';
			$zip = new ZipArchive();
			if($zip->open($filename, ZipArchive::CREATE)!==TRUE) {
				exit("cannot open <$filename>\n");
			}
			while($row = $q->fetch()) {
				$chkImgFront = $_SERVER["DOCUMENT_ROOT"] . '/chkimg/' . $row['chkId'] . '/front.JPG';
				$chkImgBack  = $_SERVER["DOCUMENT_ROOT"] . '/chkimg/' . $row['chkId'] . '/back.JPG';
				$zip->addFile($chkImgFront, $row['chkId'] . '-F.JPG');
				$zip->addFile($chkImgBack , $row['chkId'] . '-B.JPG');
			}
			$zip->close();

			if(file_exists($filename)) {
				$this->send([
					'status' => true,
					'dl' => $rptId . '.zip'
				]);
			}
			else {
				$this->send([
					'status' => false
				]);
			}
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function getIssuerByAccountRouting($account, $routing) {
		$q = $this->db->prepare(
			"SELECT issId, name, comment, alert
			FROM issuers
			WHERE account = :account AND routing = :routing"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':account', $account);
		$q->bindParam(':routing', $routing);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'status'  => true,
				'issId'   => $row['issId'],
				'name'    => $row['name'],
				'comment' => $row['comment'],
				'warn'    => (int)$row['alert'] === 1 ? true : false,
				'danger'  => (int)$row['alert'] === 2 ? true : false,
			];
		}

		if(count($data) > 0) {
			$this->send([
				'status'  => true,
				'issuers' => $data,
			]);
		}
		else {
			$this->send([
				'status' => false,
			]);
		}
	}

	public function getIssuersByName($name) {
		$search = "%$name%";
		$q = $this->db->prepare(
			"SELECT issId, account, routing, name, address1, address2, city, state, zipcode, comment, alert
			FROM issuers
			WHERE name LIKE :name"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':name', $search);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'issId'    => $row['issId'],
				'account'  => $row['account'],
				'routing'  => $row['routing'],
				'name'     => $row['name'],
				'address1' => $row['address1'],
				'address2' => $row['address2'],
				'city'     => $row['city'],
				'state'    => $row['state'],
				'zipcode'  => $row['zipcode'],
				'comment'  => $row['comment'],
				'warn'     => (int)$row['alert'] === 1 ? true : false,
				'danger'   => (int)$row['alert'] === 2 ? true : false,
			];
		}

		if(count($data) > 0) {
			$this->send([
				'status' => true,
				'issuers' => $data
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function getIssuersByAccount($account) {
		$q = $this->db->prepare(
			"SELECT issId, account, routing, name, address1, address2, city, state, zipcode, comment, alert
			FROM issuers
			WHERE account = :account"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':account', $account);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'issId'    => $row['issId'],
				'account'  => $row['account'],
				'routing'  => $row['routing'],
				'name'     => $row['name'],
				'address1' => $row['address1'],
				'address2' => $row['address2'],
				'city'     => $row['city'],
				'state'    => $row['state'],
				'zipcode'  => $row['zipcode'],
				'comment'  => $row['comment'],
				'warn'     => (int)$row['alert'] === 1 ? true : false,
				'danger'   => (int)$row['alert'] === 2 ? true : false,
			];
		}

		if(count($data) > 0) {
			$this->send([
				'status' => true,
				'issuers' => $data
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function getIssuersByNameAccount($name, $account) {
		$search = "%$name%";
		$q = $this->db->prepare(
			"SELECT issId, account, routing, name, address1, address2, city, state, zipcode, comment, alert
			FROM issuers
			WHERE account = :account AND name LIKE :name"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':account', $account);
		$q->bindParam(':name', $search);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'issId'    => $row['issId'],
				'account'  => $row['account'],
				'routing'  => $row['routing'],
				'name'     => $row['name'],
				'address1' => $row['address1'],
				'address2' => $row['address2'],
				'city'     => $row['city'],
				'state'    => $row['state'],
				'zipcode'  => $row['zipcode'],
				'comment'  => $row['comment'],
				'warn'     => (int)$row['alert'] === 1 ? true : false,
				'danger'   => (int)$row['alert'] === 2 ? true : false,
			];
		}

		if(count($data) > 0) {
			$this->send([
				'status' => true,
				'issuers' => $data
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
			WHERE deleted = 0 AND created_at BETWEEN :start AND :end"
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

	public function getReportRecent() {
		$q = $this->db->prepare(
			"SELECT rptId, created_at, start, end
			FROM reports
			ORDER BY rptId DESC
			LIMIT 10"
		);
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->execute();

		$data = [];
		while($row = $q->fetch()) {
			$data[] = [
				'status' => true,
				'rptId' => $row['rptId'],
				'created' => $row['created_at'],
				'start' => date('M d, Y', strtotime($row['start'])),
				'end' => date('M d, Y', strtotime($row['end']))
			];
		}

		if(count($data) > 0) {
			$this->send([
				'status' => true,
				'reports' => $data
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function updateCheck($id, $data) {
		$values = 'cusId = :cusId, issId = :issId, bnkId = :bnkId, MICRAcct = :MICRAcct, MICRAmt = :MICRAmt, MICRBankNum = :MICRBankNum, MICRSerNum = :MICRSerNum, MICRTransit = :MICRTransit';

		$cusId   = $data->cusId;
		$issId   = $data->issId;
		$bnkId   = $data->bnkId;
		$acct    = $data->MICR['acct'];
		$amt     = $data->MICR['amt'];
		$bankNum = $data->MICR['bankNum'];
		$serNum  = $data->MICR['serNum'];
		$transit = $data->MICR['transit'];
		$notes   = NULL;

		if(!empty($data->notes)) {
			$notes   = $data->notes;
			$values .= ', comment = :comment';
		}

		$q = $this->db->prepare("UPDATE checks SET $values WHERE chkId = :id");
		$q->bindParam(':id',          $id);
		$q->bindParam(':cusId',       $cusId);
		$q->bindParam(':issId',       $issId);
		$q->bindParam(':bnkId',       $bnkId);
		$q->bindParam(':MICRAcct',    $acct);
		$q->bindParam(':MICRAmt',     $amt);
		$q->bindParam(':MICRBankNum', $bankNum);
		$q->bindParam(':MICRSerNum',  $serNum);
		$q->bindParam(':MICRTransit', $transit);
		if($notes)
			$q->bindParam(':comment',   $notes);
		$q->execute();

		if($q->rowCount() > 0) {
			$this->send([
				'status' => true,
				'chkId' => $id,
			]);
		}
		else {
			$this->send([
				'status' => false
			]);
		}
	}

	public function updateCustomer($id, $data) {
		$values = 'firstname = :firstname, lastname = :lastname';

		$firstname = $data->name['first'];
		$lastname  = $data->name['last'];
		$address1  = NULL;
		$address2  = NULL;
		$city      = NULL;
		$state     = NULL;
		$zipcode   = NULL;
		$phone     = NULL;
		$comment   = NULL;
		$photo     = NULL;

		if(!empty($data->address1)) {
			$address1 = $data->address1;
			$values .= ', address1 = :address1';
		}
		if(!empty($data->address2)) {
			$address2 = $data->address2;
			$values .= ', address2 = :address2';
		}
		if(!empty($data->city)) {
			$city = $data->city;
			$values .= ', city = :city';
		}
		if(!empty($data->state)) {
			$state = $data->state;
			$values .= ', state = :state';
		}
		if(!empty($data->zipcode)) {
			$zipcode = $data->zipcode;
			$values .= ', zipcode = :zipcode';
		}
		if(!empty($data->phone)) {
			$phone = $data->phone;
			$values .= ', phone = :phone';
		}
		if(!empty($data->notes)) {
			$comment = $data->notes;
			$values .= ', comment = :comment';
		}
		if(!empty($data->photo)) {
			$photo = true;
			$values .= ', photo = :photo';

			// save photo.
			$save = explode(',', $data->photo);
			$decoded = '';
			// for larger images need to break up the base64 string.
			for ($i = 0; $i < ceil(strlen($save[1])/256); $i++) {
				$decoded = $decoded . base64_decode(substr($save[1], $i*256, 256));
			}
			// save the file.
			file_put_contents($_SERVER['DOCUMENT_ROOT'] . "/cusimg/$id.jpg", $decoded);
		}

		$q = $this->db->prepare("UPDATE customers SET $values WHERE cusId = :id");
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
		if($comment)
			$q->bindParam(':comment', $comment);
		if($photo)
			$q->bindParam(':photo', $photo);
		$q->bindParam(':id', $id);
		$q->execute();

		if($q->rowCount() > 0) {
			$this->send([
				'status' => true,
				'cusId' => $id,
			]);
		}
		else {
			$this->send([
				'status' => false,
			]);
		}
	}

	public function updateIssuer($id, $data) {
		$values = 'name = :name';

		$name     = $data->name;
		$address1 = NULL;
		$address2 = NULL;
		$city     = NULL;
		$state    = NULL;
		$zipcode  = NULL;
		$phone    = NULL;
		$email    = NULL;
		$comment  = NULL;

		if(!empty($data->address1)) {
			$address1 = $data->address1;
			$values .= ', address1 = :address1';
		}
		if(!empty($data->address2)) {
			$address2 = $data->address2;
			$values .= ', address2 = :address2';
		}
		if(!empty($data->city)) {
			$city = $data->city;
			$values .= ', city = :city';
		}
		if(!empty($data->state)) {
			$state = $data->state;
			$values .= ', state = :state';
		}
		if(!empty($data->zipcode)) {
			$zipcode = $data->zipcode;
			$values .= ', zipcode = :zipcode';
		}
		if(!empty($data->phone)) {
			$phone = $data->phone;
			$values .= ', phone = :phone';
		}
		if(!empty($data->email)) {
			$email = $data->email;
			$values .= ', email = :email';
		}
		if(!empty($data->notes)) {
			$comment = $data->notes;
			$values .= ', comment = :comment';
		}

		$q = $this->db->prepare("UPDATE issuers SET $values WHERE issId = :id");
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
		if($comment)
			$q->bindParam(':comment', $comment);
		$q->bindParam(':id', $id);
		$q->execute();

		if($q->rowCount() > 0) {
			$this->send([
				'status' => true,
				'issId'  => $id,
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
