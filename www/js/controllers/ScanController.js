stx.controller('ScanController', ['$scope', '$http', 'process', function($scope, $http, process) {
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

	var testData = '<?xml version="1.0" encoding="utf-8"?>'
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

	$scope.ProcessOptions = {
		'ReadMICR': 'E13B',
		'Endorse': 'NO',
		'DocFeed': 'MANUAL',
		'DocFeedTimeout': '5000',
		'MICRFmtCode': '0'
	};

	$scope.ImageOptions = {
		'Num': '2',
		'ImageColor': 'GRAY8',
		'Resolution': '200x200',
		'Compression': 'JPEG',
		'FileType': 'JPG'
	};

	$scope.Endorser = {
		'PrintData': '',
		'PrintFont': 'INTFONT2',
		'PrintStyle': 'NORMAL',
		'PrintFrontData': '',
		'PrintFrontFont': 'INTFONT2',
		'PrintFrontStyle': 'NORMAL'
	};

	function setOptions() {
		if($scope.ProcessOptions.Endorse !== 'NO') {
			setEndorser();
		}
		setImageOptions();
		setProcessOptions();
	}

	function setEndorser()  {
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

	function setProcessOptions() {
		_options.DeviceSettings.ProcessOptions = $scope.ProcessOptions;
	}

	$scope.scan = function() {
		var data = _x2js.xml_str2json(testData);
		process.start(data);

		console.log(process.doc);
		console.log(process.MICR);
		console.log(process.image);

		/*
		setOptions();

		console.log(_options);

		var dataSend = _x2js.json2xml_str(_options);

		console.log('sending...');
		console.log(dataSend);
		_scan.data = dataSend;
		$http(_scan).
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
}]);
