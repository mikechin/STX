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
	public function getUserById($id) {
		$q = $this->db->prepare("SELECT firstname, lastname FROM users WHERE usrId = :id");
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':id', $id);
		$q->execute();

		while($row = $q->fetch()) {
			$this->send(array(
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname']
			));
		}
	}

	public function getUserByName($firstname, $lastname) {
		$q = $this->db->prepare("SELECT usrId, firstname, lastname FROM users WHERE firstname = :firstname AND lastname = :lastname");
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':firstname', $firstname);
		$q->bindParam(':lastname', $lastname);
		$q->execute();

		while($row = $q->fetch()) {
			$this->send(array(
				'usrId' => $row['usrId'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname']
			));
		}
	}

	public function getIssuerByAccountRouting($account, $routing) {
		$q = $this->db->prepare("SELECT name FROM issuers WHERE account = :account AND routing = :routing");
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':account', $account);
		$q->bindParam(':routing', $routing);
		$q->execute();

		$row = $q->fetch();
		if($row) {
			$this->send(array(
				'status' => true,
				'name' => $row['name']
			));
		}
		else {
			$this->send(array(
				'status' => false
			));
		}
	}
}

?>
