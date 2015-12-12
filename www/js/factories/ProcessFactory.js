stx.factory('process', ['$q', function($q) {
	'use strict';

	function Process() {
		this.cusId = null;
		this.issId = null;
		this.bnkId = null;

		this.doc = {
			height: null,
			units: null,
			width: null
		};

		this.MICR = {
			acct: null,
			amt: null,
			aux: null,
			bankNum: null,
			chkType: null,
			country: null,
			decode: null,
			EPC: null,
			font: null,
			onUs: null,
			out: null,
			parseSts0: null,
			parseSts1: null,
			raw: null,
			serNum: null,
			TPC: null,
			transit: null
		};

		this.image = {
			front: {
				SHAKey: null,
				size: null,
				url: null
			},
			back: {
				SHAKey: null,
				size: null,
				url: null
			}
		};
	}

	Process.prototype.start = function(data) {
		var docInfo = data.DeviceInformation.DocInfo;

		this.doc.height = docInfo.DocHeight;
		this.doc.units = docInfo.DocUnits;
		this.doc.width = docInfo.DocWidth;

		this.MICR.acct = docInfo.MICRAcct;
		this.MICR.amt = docInfo.MICRAmt;
		this.MICR.aux = docInfo.MICRAux;
		this.MICR.bankNum = docInfo.MICRBankNum;
		this.MICR.chkType = docInfo.MICRChkType;
		this.MICR.country = docInfo.MICRCountry;
		this.MICR.decode = docInfo.MICRDecode;
		this.MICR.EPC = docInfo.MICREPC;
		this.MICR.font = docInfo.MICRFont;
		this.MICR.onUs = docInfo.MICROnUs;
		this.MICR.out = docInfo.MICROut;
		this.MICR.parseSts0 = docInfo.MICRParseSts0;
		this.MICR.parseSts1 = docInfo.MICRParseSts1;
		this.MICR.raw = docInfo.MICRRaw;
		this.MICR.serNum = docInfo.MICRSerNum;
		this.MICR.TPC = docInfo.MICRTPC;
		this.MICR.transit = docInfo.MICRTransit;

		var imageInfo = data.DeviceInformation.ImageInfo;

		this.image.front.SHAKey = imageInfo.ImageSHA1Key1;
		this.image.front.size = imageInfo.ImageSize1;
		this.image.front.url = imageInfo.ImageURL1;
		this.image.back.SHAKey = imageInfo.ImageSHA1Key2;
		this.image.back.size = imageInfo.ImageSize2;
		this.image.back.url = imageInfo.ImageURL2;
	};

	return new Process();
}]);
