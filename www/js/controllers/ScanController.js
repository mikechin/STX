stx.controller('ScanController', ['$scope', '$http', '$q', '$timeout', 'process', 'configuration', function($scope, $http, $q, $timeout, process, configuration) {
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
    $scope.issuers   = [];

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

    // clear red box around amount on subsequent scans.
    $scope.scanForm.amount.$dirty = false;
  }

  function initCustomer() {
    $scope.customer = {
      id: '',
      name: {
        first: '',
        last:  ''
      },
      notes:    '',
      photo:    null,
      search:   false,
      selected: false,
      invalid:  false,
      add:      false
    };
  }

  function processScan(data) {
    var promises = [];

    process.start(data);
    $scope.scannedData       = process;
    $scope.scannedData.notes = '';

    promises.push(getIssuer());
    promises.push(getBank());

    $q.all(promises).then(function() {
      $scope.panes.scan = false;
      $scope.panes.info = true;
    },
    function() {
      $scope.panes.scan = false;
      $scope.panes.info = true;
    });

    saveCheck().then(function(id) {
      $scope.scanImages = {
        front: 'chkimg/' + id + '/front.JPG',
        back:  'chkimg/' + id + '/back.JPG',
      }
    },
    function() {
      console.warn('Error: Could not save check infomation.');
    });
  }

  function getIssuer() {
    console.log('get.', $scope.scannedData.MICR);
    var url = 'http://' + configuration.storage.hostUrl + '/q/issuer/' + $scope.scannedData.MICR.acct + '/' + $scope.scannedData.MICR.transit;
    var d   = $q.defer();

    $http({
      method: 'GET',
      url:    url,
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json'
      }
    }).
    success(function(data, status, headers, config) {
      console.log('success.', data);
      if(data.status) {
        $scope.issuers = data.issuers;
      }
      else {
        $scope.issuer.info    = true;
        $scope.issuer.acct    = $scope.scannedData.MICR.acct;
        $scope.issuer.transit = $scope.scannedData.MICR.transit;

        $scope.$broadcast('issuer-add', { acct: $scope.issuer.acct, transit: $scope.issuer.transit });
      }

      d.resolve();
    }).
    error(function(data, status, headers, config) {
      console.log('error.');
      d.reject();
    });

    return d.promise;
  }

  function getBank() {
    var url = 'http://' + configuration.storage.hostUrl + '/q/bank/' + $scope.scannedData.MICR.bankNum;
    var d   = $q.defer();

    $http({
      method: 'GET',
      url:    url,
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json'
      }
    }).
    success(function(data, status, headers, config) {
      console.log('success.');
      if(data.status) {
        $scope.bank.id   = data.bnkId;
        $scope.bank.name = data.name;
      }
      else {
        $scope.newBank.add = true;
      }

      d.resolve();
    }).
    error(function(data, status, headers, config) {
      console.log('error.');
      d.reject();
    });

    return d.promise;
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

  function saveCheck() {
    var d = $q.defer();

    process.stxUrl         = 'http://' + configuration.device.url;
    process.image.FileType = $scope.ImageOptions.FileType;
    process.error          = false;

    if(process.MICR.decode === 'ERROR') {
      process.error = true;
    }

    saveScan(d);

    return d.promise;
  }

  function saveScan(defer) {
    $http({
      method: 'POST',
      url: 'http://' + configuration.device.url + '/q/check',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: process
    }).
    success(function(data, status, headers, config) {
      console.log('success.');
      console.log(data);
      process.chkId = data.chkId;
      defer.resolve(data.chkId);
    }).
    error(function(data, status, headers, config) {
      console.log('error.');
      console.log(data);
      defer.reject();
    });
  }

  function updateScan() {
    $http({
      method: 'PUT',
      url: 'http://' + configuration.device.url + '/q/check/update/' + process.chkId,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: process
    }).
    success(function(data, status, headers, config) {
      console.log('success.');
      console.log(data);
      $scope.saved = true;
      cleanup();
    }).
    error(function(data, status, headers, config) {
      console.log('error.');
      console.log(data);
    });
  }

  // **************************************************
  // public.
  //
  //
  // **************************************************
  $scope.customers   = [];
  $scope.issuers     = [];
  $scope.scannedData = null;
  $scope.showOptions = false;
  $scope.usStates    = configuration.usStates
  $scope.loading     = false;
  $scope.saved       = false;
  $scope.storage     = configuration.storage;

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
      last:  ''
    },
    notes:    '',
    photo:    null,
    search:   false,
    selected: false,
    invalid:  false,
    info:     false,
  };

  $scope.edit = {
    acct: false,
    routing: false,
    checkNum: false
  };

  $scope.issuer = {
    id:      '',
    name:    '',
    acct:    '',
    transit: '',
    notes:   '',
    invalid: false,
    info:    false,
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

    var url = 'http://' + configuration.storage.hostUrl + '/q/bank/add';
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

  $scope.customerClear = function() {
    initCustomer();
  };

  $scope.customerNew = function() {
    $scope.customer.info   = true;
    $scope.customer.search = false;
    $scope.customers = [];

    $scope.$broadcast('customer-add');
  };

  $scope.$on('customer-updated', function(event, args) {
    $scope.customer = angular.copy(args.data);
  });

  $scope.customerSearch = function() {
    $scope.customer.add  = false;
    $scope.customer.edit = false;

    if($scope.customer.name.first === '' && $scope.customer.name.last === '') {
      $scope.customer.invalid = true;
      return;
    }
    else {
      $scope.customer.invalid = false;
    }

    var url = 'http://' + configuration.storage.hostUrl + '/q/customers/name';
    $http({
      method: 'GET',
      url: url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        firstname: $scope.customer.name.first,
        lastname:  $scope.customer.name.last,
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
    var url = 'http://' + configuration.storage.hostUrl + '/q/customers/' + $scope.issuer.issId;
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
    var customer = $scope.customers[i];

    $scope.customer.id         = customer.cusId;
    $scope.customer.name.first = customer.firstname;
    $scope.customer.name.last  = customer.lastname;
    $scope.customer.notes      = customer.comment;
    $scope.customer.photo      = customer.photo;
    $scope.customer.warn       = customer.warn;
    $scope.customer.danger     = customer.danger;
    $scope.customer.search     = false;
    $scope.customer.selected   = true;

    $scope.customer.invalid    = false;
  };

  $scope.edit = function(area) {
    $scope.edit[area] = !$scope.edit[area];

    if(!$scope.edit[area]) {
      console.log(area);
      switch(area) {
        case 'acct':
        case 'routing':
          getIssuer();
          break;
        default:
      }
    }
  };

  $scope.inputKeyDown = function(event, area) {
    if(event.which === 13) {
      $scope.edit(area);
    }
  };

  $scope.issuerNew = function() {
    $scope.issuer.info    = true;
    $scope.issuer.acct    = $scope.scannedData.MICR.acct;
    $scope.issuer.transit = $scope.scannedData.MICR.transit;

    $scope.$broadcast('issuer-add', { acct: $scope.issuer.acct, transit: $scope.issuer.transit });
  }

  $scope.$on('issuer-updated', function(event, args) {
    $scope.issuer       = angular.copy(args.data);
    $scope.issuer.issId = $scope.issuer.id;
  });

  $scope.save = function() {
    process.notes = $scope.scannedData.notes;

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

    if($scope.issuer.issId === '') {
      $scope.issuer.invalid = true;
      save = false;
    }

    if($scope.bank.id === '') {
      $scope.bank.invalid = true;
      save = false;
    }

    if(save) {
      process.cusId = $scope.customer.id;
      process.issId = $scope.issuer.issId;
      process.bnkId = $scope.bank.id;

      updateScan();
    }
  };

  $scope.scan = function() {
    $scope.saved   = false;
    $scope.loading = true;
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
        $scope.loading = false;
        processScan(_x2js.xml_str2json(data));
      }).
      error(function(data, status, headers, config) {
        console.log('fail - ' + status + '.');
      });
    }
    else {
      var data = _x2js.xml_str2json(configuration.testData);
      $timeout(function() {
        $scope.loading = false;
        processScan(data);
      }, 500);
    }
  };

  $scope.rescan = function() {
    $http({
      method: 'DELETE',
      url: 'http://' + configuration.device.url + '/q/check/delete/' + process.chkId,
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

  };

  $scope.toggleOptions = function() {
    $scope.showOptions = !$scope.showOptions;
  };
}]);
