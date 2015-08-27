stx.controller('ScanController', ['$scope', '$http', 'process', function($scope, $http, process) {
	'use strict';

	// **************************************************
	// private.
	//
	//
	// **************************************************
	var _stxIpAddress = '192.168.1.101';
	var _x2js = new X2JS();
	var _testData = '<?xml version="1.0" encoding="utf-8"?>'
		+ '<DeviceInformation>'
		+ '	<CommandStatus>'
		+ '		<BadData>NONE</BadData>'
		+ '		<CheckDS>F</CheckDS>'
		+ '		<KVErrCnt>0</KVErrCnt>'
		+ '		<ResponseType>CHECK</ResponseType>'
		+ '		<ReturnCode>0</ReturnCode>'
		+ '		<ReturnMsg>OK</ReturnMsg>'
		+ '	</CommandStatus>'
		+ '	<DeviceStatus>'
		+ '		<AccessGuide>LATCHED</AccessGuide>'
		+ '		<AutoFeeder>NOTSUP</AutoFeeder>'
		+ '		<FrontInk>OK</FrontInk>'
		+ '		<FrontPrinter>PRESENT</FrontPrinter>'
		+ '		<IDFeeder>EMPTY</IDFeeder>'
		+ '		<Ink>OK</Ink>'
		+ '		<LED1>NNNN</LED1>'
		+ '		<LED2>GGGG</LED2>'
		+ '		<LED3>NNNN</LED3>'
		+ '		<Lamp1>OK</Lamp1>'
		+ '		<Lamp2>OK</Lamp2>'
		+ '		<ManualFeeder>EMPTY</ManualFeeder>'
		+ '		<Path>OK</Path>'
		+ '		<Printer>PRESENT</Printer>'
		+ '		<RTCBattery>OK</RTCBattery>'
		+ '		<RawSensors>384</RawSensors>'
		+ '		<ScanCalibStatus>FACTORY</ScanCalibStatus>'
		+ '		<SnsrCalibStatus>FACTORY</SnsrCalibStatus>'
		+ '		<StartTimeout>4000</StartTimeout>'
		+ '		<State>ONLINE</State>'
		+ '	</DeviceStatus>'
		+ '	<DocInfo>'
		+ '		<DocHeight>3650</DocHeight>'
		+ '		<DocUnits>ENGLISH</DocUnits>'
		+ '		<DocWidth>8320</DocWidth>'
		+ '		<MICRAcct>7163942209</MICRAcct>'
		+ '		<MICRAmt></MICRAmt>'
		+ '		<MICRAux>22602194</MICRAux>'
		+ '		<MICRBankNum>1329</MICRBankNum>'
		+ '		<MICRChkType>BUSINESS</MICRChkType>'
		+ '		<MICRCountry>USA</MICRCountry>'
		+ '		<MICRDecode>OK</MICRDecode>'
		+ '		<MICREPC></MICREPC>'
		+ '		<MICRFont>E13B</MICRFont>'
		+ '		<MICROnUs> 7163942209U</MICROnUs>'
		+ '		<MICROut>U22602194U T072413298T 7163942209U/0100</MICROut>'
		+ '		<MICRParseSts0>0100</MICRParseSts0>'
		+ '		<MICRParseSts1>11</MICRParseSts1>'
		+ '		<MICRRaw>U22602194U T072413298T 7163942209U</MICRRaw>'
		+ '		<MICRSerNum>22602194</MICRSerNum>'
		+ '		<MICRTPC></MICRTPC>'
		+ '		<MICRTransit>072413298</MICRTransit>'
		+ '	</DocInfo>'
		+ '	<ImageInfo>'
		+ '		<ImageSHA1Key1>NONE</ImageSHA1Key1>'
		+ '		<ImageSHA1Key2>NONE</ImageSHA1Key2>'
		+ '		<ImageSize1>129537</ImageSize1>'
		+ '		<ImageSize2>80138</ImageSize2>'
		+ '		<ImageURL1>/chkimg/FRONT200GRAY8_1.JPG</ImageURL1>'
		+ '		<ImageURL2>/chkimg/BACK200GRAY8_2.JPG</ImageURL2>'
		+ '		<Number>2</Number>'
		+ '	</ImageInfo>'
		+ '</DeviceInformation>';

	var _options = {
		'DeviceSettings': {
			'Application': {
				'DocUnits': 'ENGLISH',
				'Transfer': 'HTTP'
			}
		}
	};

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

	$scope.customer = {
		id: '',
		name: {
			first: '',
			last: ''
		},
		search: false
	};

	$scope.issuer = {
		name: '',
		edit: true
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
		'ImageColor': 'GRAY8',
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

	$scope.customerAdd = function() {
		var url = 'http://stx.localhost:8888/q/customer/add';
		$http({
			method: 'POST',
			url: url,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			data: {
				firstname: $scope.customer.name.first,
				lastname: $scope.customer.name.last
			}
		}).
		success(function(data, status, headers, config) {
			console.log('success.');
			console.log(data);
		}).
		error(function(data, status, headers, config) {
			console.log('error.');

		});
	};

	$scope.customerSearch = function() {
		var url = 'http://stx.localhost:8888/q/customer/' + $scope.customer.name.first + '/' + $scope.customer.name.last;
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
			console.log(data);
			$scope.customers = data.customers;
			console.log($scope.customers);
			$scope.customer.search = true;
		}).
		error(function(data, status, headers, config) {
			console.log('error.');

		});
	};

	$scope.save = function() {
		$http({
			method: 'POST',
			url: 'http://stx.localhost:8888/q/check',
			data: process,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).
		success(function(data, status, headers, config) {
			console.log('success.');
			console.log(data);
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};

	$scope.scan = function() {
		var data = _x2js.xml_str2json(_testData);
		process.start(data);
		$scope.scannedData = process;

		var url = 'http://stx.localhost:8888/q/issuers/' + process.MICR.acct + '/' + process.MICR.transit;
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
			console.log(data);
			if(data.status) {
				$scope.issuer.name = data.name;
				$scope.issuer.edit = false;
			}
			else {
				$scope.issuer.edit = true;
			}

			$scope.panes.info = true;
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});

		/*
		setOptions();

		console.log(_options);

		var dataSend = _x2js.json2xml_str(_options);

		console.log('sending...');
		console.log(dataSend);
		_scan.data = dataSend;

		$http({
			method: 'POST',
			url: 'http://' + _stxIpAddress + '/Excella?DeviceScan',
			headers: {
				'Accept': 'application/xml',
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).
		success(function(data, status, headers, config) {
			console.log('success - ' + status + '.');
			console.log(data);
			console.log(_x2js.xml_str2json(data));
		}).
		error(function(data, status, headers, config) {
			console.log('fail - ' + status + '.');
		});
		*/
	};

	$scope.toggleOptions = function() {
		$scope.showOptions = !$scope.showOptions;
	};
}]);
