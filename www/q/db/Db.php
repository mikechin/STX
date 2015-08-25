<?php

defined('SYSPATH') or die('No direct script access.');

class Db {
	private $db;

	function __construct($user, $pass) {
		try {
			$this->db = new PDO( 'mysql:host=localhost; dbname=stx_core', $user, $pass );
			$this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
		catch(PDOException $e) {
			echo 'error: ' . $e->getMessage();
		}
	}

	public function getUserData($id) {
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
