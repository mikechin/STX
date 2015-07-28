stx.controller('ScanController', ['$scope', '$http', function($scope, $http) {
	'use strict';

	var _x2js = new X2JS();
	var _options = {
		'DeviceSettings': {
			'Application': {
				'DocUnits': 'ENGLISH',
				'Transfer': 'HTTP'
			}
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

	$scope.ImageOptions = {
		'Num': '1',
		'ImageColor': 'GRAY8',
		'FileType': 'JPG',
		'Resolution': '200x200',
		'Compression': 'JPEG'
	};

	$scope.Endorser = {
		'PrintFont': 'INTFONT2',
		'PrintFrontFont': 'INTFONT2',
		'PrintStyle': 'NORMAL',
		'PrintFrontStyle': 'NORMAL'
	};

	function setOptions() {
		setEndorser();
		setImageOptions();
		setProcessOptions();
	}

	function setEndorser()  {
		_options.DeviceSettings.Endorser = $scope.Endorser;
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
