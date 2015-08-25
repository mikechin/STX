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

	public function getUserData() {
		$firstname = 'Joe';

		$q = $this->db->prepare("SELECT * FROM users WHERE firstname = :firstname");
		$q->setFetchMode(PDO::FETCH_ASSOC);
		$q->bindParam(':firstname', $firstname);
		$q->execute();

		while($row = $q->fetch()) {
			var_dump($row);
		}
	}
}

?>
