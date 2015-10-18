stx.controller('ScanController', ['$scope', '$http', '$q', 'process', 'configuration', function($scope, $http, $q, process, configuration) {
	'use strict';

	// **************************************************
	// private.
	//
	//
	// **************************************************
	var _x2js = new X2JS();

	var _options = {
		'DeviceSettings': {
			'Application': {
				'DocUnits': 'ENGLISH',
				'Transfer': 'HTTP'
			}
		}
	};

	function cleanup() {
		$scope.customers = [];
		$scope.scannedData = null;
		$scope.showOptions = false;

		$scope.bank = {
			id: '',
			name: '',
			invalid: false
		};

		$scope.newBank = {
			add: false,
			name: ''
		};

		initCustomer();
		initNewCustomer();

		$scope.issuer = {
			id: '',
			name: '',
			invalid: false
		};

		$scope.newIssuer = {
			add: false,
			name: '',
			address1: '',
			address2: '',
			city: '',
			state: '',
			zipcode: '',
			phone: '',
			email: ''
		};

		$scope.panes = {
			scan: true,
			info: false
		};

		$scope.scanImages = {
			front: '',
			back: ''
		};
	}

	function initCustomer() {
		$scope.customer = {
			id: '',
			name: {
				first: '',
				last: ''
			},
			photo: null,
			search: false,
			selected: false,
			invalid: false
		};
	}

	function initNewCustomer() {
		$scope.customerForm.firstname.$invalid = false;
		$scope.customerForm.firstname.$dirty = false;
		$scope.customerForm.lastname.$invalid = false;
		$scope.customerForm.lastname.$dirty = false;

		$scope.newCustomer = {
			add: false,
			name: {
				first: '',
				last: ''
			},
			address1: '',
			address2: '',
			city: '',
			state: '',
			zipcode: '',
			phone: '',
			comment: '',
			photo: null
		};
	}

	function processScan(data) {
		var promises = [];

		process.start(data);
		$scope.scannedData = process;

		var url = 'http://stx.localhost:8888/q/issuer/' + process.MICR.acct + '/' + process.MICR.transit;
		var getIssuers = $q.defer();
		promises.push(getIssuers.promise);
		$http({
			method: 'GET',
			url: url,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).
		success(function(data, status, headers, config) {
			console.log('success.');
			if(data.status) {
				$scope.issuer.id = data.issId;
				$scope.issuer.name = data.name;
			}
			else {
				$scope.newIssuer.add = true;
			}

			getIssuers.resolve();
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
			getIssuers.reject();
		});

		var url = 'http://stx.localhost:8888/q/bank/' + process.MICR.bankNum;
		var getBanks = $q.defer();
		promises.push(getBanks.promise);
		$http({
			method: 'GET',
			url: url,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).
		success(function(data, status, headers, config) {
			console.log('success.');
			if(data.status) {
				$scope.bank.id = data.bnkId;
				$scope.bank.name = data.name;
			}
			else {
				$scope.newBank.add = true;
			}

			getBanks.resolve();
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
			getBanks.reject();
		});

		$q.all(promises).then(function() {
			$scope.scanImages = {
				front: 'http://' + configuration.device.url + process.image.front.url,
				back: 'http://' + configuration.device.url + process.image.back.url
			}
			$scope.panes.info = true;
		});
	}

	function setEndorser() {
		_options.DeviceSettings.Endorser = {};
		if($scope.ProcessOptions.Endorse === 'BACK' || $scope.ProcessOptions.Endorse === 'BOTH') {
			_options.DeviceSettings.Endorser.PrintData = $scope.Endorser.PrintData;
			_options.DeviceSettings.Endorser.PrintFont = $scope.Endorser.PrintFont;
			_options.DeviceSettings.Endorser.PrintStyle = $scope.Endorser.PrintStyle;
		}

		if($scope.ProcessOptions.Endorse === 'FRONT' || $scope.ProcessOptions.Endorse === 'BOTH') {
			_options.DeviceSettings.Endorser.PrintFrontData = $scope.Endorser.PrintFrontData;
			_options.DeviceSettings.Endorser.PrintFrontFont = $scope.Endorser.PrintFrontFont;
			_options.DeviceSettings.Endorser.PrintFrontStyle = $scope.Endorser.PrintFrontStyle;
		}
	}

	function setImageOptions() {
		var imageOptions = {};

		for(var i = 1; i <= $scope.ImageOptions.Num; i++) {
			imageOptions['Number'] = $scope.ImageOptions.Num;
			angular.forEach($scope.ImageOptions, function(value, key) {
				if(key !== 'Num') {
					var numberedKey = key + i;
					imageOptions[numberedKey] = $scope.ImageOptions[key];
				}
			});

			var side = '';
			if(i === 1) {
				side = 'FRONT';
			}
			else {
				side = 'BACK';
			}
			imageOptions['ImageSide' + i] = side;
		}

		_options.DeviceSettings.ImageOptions = imageOptions;
	}

	function setOptions() {
		if($scope.ProcessOptions.Endorse !== 'NO') {
			setEndorser();
		}
		setImageOptions();
		setProcessOptions();
	}

	function setProcessOptions() {
		_options.DeviceSettings.ProcessOptions = $scope.ProcessOptions;
	}

	// **************************************************
	// public.
	//
	//
	// **************************************************
	$scope.customers = [];
	$scope.scannedData = null;
	$scope.showOptions = false;

	$scope.bank = {
		id: '',
		name: '',
		invalid: false
	};

	$scope.newBank = {
		add: false,
		name: ''
	};

	$scope.customer = {
		id: '',
		name: {
			first: '',
			last: ''
		},
		photo: null,
		search: false,
		selected: false,
		invalid: false
	};

	$scope.newCustomer = {
		add: false,
		name: {
			first: '',
			last: ''
		},
		address1: '',
		address2: '',
		city: '',
		state: '',
		zipcode: '',
		phone: '',
		photo: null
	};

	$scope.issuer = {
		id: '',
		name: '',
		invalid: false
	};

	$scope.newIssuer = {
		add: false,
		name: '',
		address1: '',
		address2: '',
		city: '',
		state: '',
		zipcode: '',
		phone: '',
		email: ''
	};

	$scope.Endorser = {
		'PrintData': '',
		'PrintFont': 'INTFONT2',
		'PrintStyle': 'NORMAL',
		'PrintFrontData': '',
		'PrintFrontFont': 'INTFONT2',
		'PrintFrontStyle': 'NORMAL'
	};

	$scope.ImageOptions = {
		'Num': '2',
		'ImageColor': 'COL24',
		'Resolution': '200x200',
		'Compression': 'JPEG',
		'FileType': 'JPG'
	};

	$scope.panes = {
		scan: true,
		info: false
	};

	$scope.ProcessOptions = {
		'ReadMICR': 'E13B',
		'Endorse': 'NO',
		'DocFeed': 'MANUAL',
		'DocFeedTimeout': '5000',
		'MICRFmtCode': '0'
	};

	$scope.scanImages = {
		front: '',
		back: ''
	};

	$scope.usStates = [
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

	$scope.bankAdd = function() {
		if($scope.bankForm.$invalid) {
			var cont = true;

			if($scope.newBank.name === '') {
				$scope.bankForm.name.$invalid = true;
				$scope.bankForm.name.$dirty = true;
				cont = false;
			}

			if(!cont) {
				return;
			}
		}

		var data = $scope.newBank;
		data.account = process.MICR.bankNum;

		var url = 'http://stx.localhost:8888/q/bank/add';
		$http({
			method: 'POST',
			url: url,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			data: data
		}).
		success(function(data, status, headers, config) {
			console.log('success.');
			if(data.status) {
				$scope.bank.id = data.bnkId;
				$scope.bank.name = data.name;
				$scope.newBank.add = false;
			}
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};

	$scope.customerAdd = function() {
		if($scope.customerForm.$invalid) {
			var cont = true;

			if($scope.newCustomer.name.first === '') {
				$scope.customerForm.firstname.$invalid = true;
				$scope.customerForm.firstname.$dirty = true;
				cont = false;
			}

			if($scope.newCustomer.name.last === '') {
				$scope.customerForm.lastname.$invalid = true;
				$scope.customerForm.lastname.$dirty = true;
				cont = false;
			}

			if(!cont) {
				return;
			}
		}

		var upload = $q.defer();

		var ele = document.getElementById('upload-photo');
		if(ele.files.length) {
			var f = ele.files[0];
			var r = new FileReader();

			r.onloadend = function(e) {
				var data = e.target.result;
				$scope.newCustomer.photo = data;
				upload.resolve();
			};

			r.readAsDataURL(f);
		}
		else {
			upload.resolve();
		}

		$q.all([ upload.promise ]).then(function() {
			console.log('photo uploaded.');

			var url = 'http://stx.localhost:8888/q/customer/add';
			$http({
				method: 'POST',
				url: url,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				data: $scope.newCustomer
			}).
			success(function(data, status, headers, config) {
				console.log('success.');
				console.log(data);
				$scope.customer.id = data.cusId;
				$scope.customer.name.first = $scope.newCustomer.name.first;
				$scope.customer.name.last = $scope.newCustomer.name.last;
				$scope.customer.photo = $scope.newCustomer.photo;
				$scope.customer.selected = true;
				$scope.newCustomer.add = false;
			}).
			error(function(data, status, headers, config) {
				console.log('error.');
			});
		});
	};

	$scope.customerAddCancel = function() {
		initNewCustomer();
		document.getElementById('upload-photo').value = '';
	};

	$scope.customerClear = function() {
		initCustomer();
		initNewCustomer();
	};

	$scope.customerNew = function() {
		initNewCustomer();
		$scope.newCustomer.add = true;

		document.getElementById('upload-photo').value = '';
	};

	$scope.customerSearch = function() {
		if($scope.customer.name.first === '' || $scope.customer.name.last === '') {
			return;
		}

		var url = 'http://stx.localhost:8888/q/customers/' + $scope.customer.name.first + '/' + $scope.customer.name.last;
		$http({
			method: 'GET',
			url: url,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).
		success(function(data, status, headers, config) {
			console.log('success.');
			$scope.customers = data.customers;
			$scope.customer.search = true;
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};

	$scope.customerSearchByCompany = function() {
		var url = 'http://stx.localhost:8888/q/customers/' + $scope.issuer.id;
		$http({
			method: 'GET',
			url: url,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).
		success(function(data, status, headers, config) {
			console.log('success.');
			$scope.customers = data.customers;
			$scope.customer.search = true;
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};

	$scope.customerSelect = function(i) {
		initNewCustomer();
		var customer = $scope.customers[i];

		$scope.customer.id = customer.cusId;
		$scope.customer.name.first = customer.firstname;
		$scope.customer.name.last = customer.lastname;
		$scope.customer.photo = customer.photo;
		$scope.customer.search = false;
		$scope.customer.selected = true;

		$scope.customer.invalid = false;
	};

	$scope.issuerAdd = function() {
		if($scope.issuerForm.$invalid) {
			var cont = true;

			if($scope.newIssuer.name === '') {
				$scope.issuerForm.name.$invalid = true;
				$scope.issuerForm.name.$dirty = true;
				cont = false;
			}

			if(!cont) {
				return;
			}
		}

		var data = $scope.newIssuer;
		data.account = process.MICR.acct;
		data.routing = process.MICR.transit;

		var url = 'http://stx.localhost:8888/q/issuer/add';
		$http({
			method: 'POST',
			url: url,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			data: data
		}).
		success(function(data, status, headers, config) {
			console.log('success.');
			if(data.status) {
				$scope.issuer.id = data.issId;
				$scope.issuer.name = data.name;
				$scope.newIssuer.add = false;
			}
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};

	$scope.save = function() {
		var save = true;

		if(process.MICR.amt === '') {
			$scope.scanForm.amount.$invalid = true;
			$scope.scanForm.amount.$dirty = true;
			save = false;
		}

		if($scope.customer.id === '') {
			$scope.customer.invalid = true;
			save = false;
		}

		if($scope.issuer.id === '') {
			$scope.issuer.invalid = true;
			save = false;
		}

		if($scope.bank.id === '') {
			$scope.bank.invalid = true;
			save = false;
		}

		if(save) {
			process.cusId = $scope.customer.id;
			process.issId = $scope.issuer.id;
			process.bnkId = $scope.bank.id;
			process.stxUrl = 'http://' + configuration.device.url;
			process.image.FileType = $scope.ImageOptions.FileType;

			$http({
				method: 'POST',
				url: 'http://stx.localhost:8888/q/check',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				data: process
			}).
			success(function(data, status, headers, config) {
				console.log('success.');
				console.log(data);
				cleanup();
			}).
			error(function(data, status, headers, config) {
				console.log('error.');
				console.log(data);
			});
		}
	};

	$scope.scan = function() {
		if(!configuration.testing) {
			setOptions();

			console.log('sending...');
			var dataSend = _x2js.json2xml_str(_options);
			$http({
				method: 'POST',
				url: 'http://' + configuration.device.url + '/Excella?DeviceScan',
				headers: {
					'Accept': 'application/xml',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: dataSend
			}).
			success(function(data, status, headers, config) {
				console.log('success - ' + status + '.');
				processScan(_x2js.xml_str2json(data));
			}).
			error(function(data, status, headers, config) {
				console.log('fail - ' + status + '.');
			});
		}
		else {
			var data = _x2js.xml_str2json(configuration.testData);
			processScan(data);
		}
	};

	$scope.toggleOptions = function() {
		$scope.showOptions = !$scope.showOptions;
	};
}]);
