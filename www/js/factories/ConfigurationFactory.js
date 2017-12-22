stx.factory('configuration', ['$q', 'testData', function($q, testData) {
	'use strict';

	function Configuration() {
		this.testing   = true;
		this.testError = false;

		this.device = {
			url: this.testing ? testData.url : '192.168.1.101'
		};

		this.testData = this.testError ? testData.dataError : testData.data;

		this.usStates = [
			{ name: 'ALABAMA', abbreviation: 'AL' },
			{ name: 'ALASKA', abbreviation: 'AK' },
			{ name: 'ARIZONA', abbreviation: 'AZ' },
			{ name: 'ARKANSAS', abbreviation: 'AR' },
			{ name: 'CALIFORNIA', abbreviation: 'CA' },
			{ name: 'COLORADO', abbreviation: 'CO' },
			{ name: 'CONNECTICUT', abbreviation: 'CT' },
			{ name: 'DELAWARE', abbreviation: 'DE' },
			{ name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC' },
			{ name: 'FLORIDA', abbreviation: 'FL' },
			{ name: 'GEORGIA', abbreviation: 'GA' },
			{ name: 'HAWAII', abbreviation: 'HI' },
			{ name: 'IDAHO', abbreviation: 'ID' },
			{ name: 'ILLINOIS', abbreviation: 'IL' },
			{ name: 'INDIANA', abbreviation: 'IN' },
			{ name: 'IOWA', abbreviation: 'IA' },
			{ name: 'KANSAS', abbreviation: 'KS' },
			{ name: 'KENTUCKY', abbreviation: 'KY' },
			{ name: 'LOUISIANA', abbreviation: 'LA' },
			{ name: 'MAINE', abbreviation: 'ME' },
			{ name: 'MARYLAND', abbreviation: 'MD' },
			{ name: 'MASSACHUSETTS', abbreviation: 'MA' },
			{ name: 'MICHIGAN', abbreviation: 'MI' },
			{ name: 'MINNESOTA', abbreviation: 'MN' },
			{ name: 'MISSISSIPPI', abbreviation: 'MS' },
			{ name: 'MISSOURI', abbreviation: 'MO' },
			{ name: 'MONTANA', abbreviation: 'MT' },
			{ name: 'NEBRASKA', abbreviation: 'NE' },
			{ name: 'NEVADA', abbreviation: 'NV' },
			{ name: 'NEW HAMPSHIRE', abbreviation: 'NH' },
			{ name: 'NEW JERSEY', abbreviation: 'NJ' },
			{ name: 'NEW MEXICO', abbreviation: 'NM' },
			{ name: 'NEW YORK', abbreviation: 'NY' },
			{ name: 'NORTH CAROLINA', abbreviation: 'NC' },
			{ name: 'NORTH DAKOTA', abbreviation: 'ND' },
			{ name: 'OHIO', abbreviation: 'OH' },
			{ name: 'OKLAHOMA', abbreviation: 'OK' },
			{ name: 'OREGON', abbreviation: 'OR' },
			{ name: 'PENNSYLVANIA', abbreviation: 'PA' },
			{ name: 'RHODE ISLAND', abbreviation: 'RI' },
			{ name: 'SOUTH CAROLINA', abbreviation: 'SC' },
			{ name: 'SOUTH DAKOTA', abbreviation: 'SD' },
			{ name: 'TENNESSEE', abbreviation: 'TN' },
			{ name: 'TEXAS', abbreviation: 'TX' },
			{ name: 'UTAH', abbreviation: 'UT' },
			{ name: 'VERMONT', abbreviation: 'VT' },
			{ name: 'VIRGINIA', abbreviation: 'VA' },
			{ name: 'WASHINGTON', abbreviation: 'WA' },
			{ name: 'WEST VIRGINIA', abbreviation: 'WV' },
			{ name: 'WISCONSIN', abbreviation: 'WI' },
			{ name: 'WYOMING', abbreviation: 'WY' }
		];
	}

	return new Configuration();
}]);
