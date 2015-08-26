<?php

defined('SYSPATH') or die('No direct script access.');

class Db {
	private $db;

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

	public function getUserData($id) {
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Headers: Content-Type");
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
		header("Access-Control-Allow-Credentials: true");
		header("Access-Control-Allow-Max-Age: 86400");
		header("Content-Type: application/json");

		$q = $this->db->prepare("SELECT firstname, lastname FROM users WHERE usrId = :id");
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':id', $id);
		$q->execute();

		while($row = $q->fetch()) {
			echo json_encode(array(
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname']
			));
		}
	}
}

?>
