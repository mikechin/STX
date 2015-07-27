stx.controller('ScanController', ['$scope', '$http', function($scope, $http) {
	'use strict';

	var _x2js = new X2JS();
	var _options = {
		'DeviceSettings': {
			'ImageOptions': {
				'Number': 2,
				'ImageColor1': 'GRAY8',
				'FileType1': 'JPG',
				'Resolution1': '200x200',
				'Compression1': 'JPEG',
				'ImageSide1': 'FRONT',
				'ImageColor2': 'GRAY8',
				'FileType2': 'JPG',
				'Resolution2': '200x200',
				'Compression2': 'JPEG',
				'ImageSide2': 'BACK'
			},
			'Application': {
				'DocUnits': 'ENGLISH',
				'Transfer': 'HTTP'
			},
			'Endorser': {
				'PrintFont': 'INTFONT2',
				'PrintData': 'foo'
			},
		}
	};

	var _stxIpAddress = '192.168.1.101';
	var _scan = {
		method: 'POST',
		url: 'http://' + _stxIpAddress + '/Excella?DeviceScan',
		headers: {
			'Accept': 'application/xml',
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};

	$scope.ProcessOptions = {
		'ReadMICR': 'E13B',
		'Endorse': 'NO',
		'DocFeed': 'MANUAL',
		'DocFeedTimeout': '5000',
		'MICRFmtCode': '0'
	};

	function setOptions() {
		setProcessOptions();
	}

	function setProcessOptions() {
		_options.DeviceSettings.ProcessOptions = $scope.ProcessOptions;
	}

	$scope.scan = function() {
		setOptions();

		console.log(_options);

		var dataSend = _x2js.json2xml_str(_options);

		console.log(dataSend);

		/*
		console.log('sending...');
		_scan.data = dataSend;
		$http(_scan).
		success(function(data, status, headers, config) {
			console.log('success - ' + status + '.');
			console.log(_x2js.xml_str2json(data));
		}).
		error(function(data, status, headers, config) {
			console.log('fail - ' + status + '.');
		});
		*/
	};
}]);
