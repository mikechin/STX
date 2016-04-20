stx.factory('configuration', ['$q', function($q) {
	'use strict';

	function Configuration() {
		this.testing = true;

		this.device = {
			url: this.testing ? 'stx.localhost:8888' : '192.168.1.101'
		};

		this.testData = '<?xml version="1.0" encoding="utf-8"?>'
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
					  + '		<ImageSize1>195118</ImageSize1>'
					  + '		<ImageSize2>89417</ImageSize2>'
					  + '		<ImageURL1>/chkimg/FRONT200COL24_1.JPG</ImageURL1>'
					  + '		<ImageURL2>/chkimg/BACK200COL24_2.JPG</ImageURL2>'
					  + '		<Number>2</Number>'
					  + '	</ImageInfo>'
					  + '</DeviceInformation>';

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
