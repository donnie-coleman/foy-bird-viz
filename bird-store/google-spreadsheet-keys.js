(function(){
	angular
	.module('bird-service')
	.service('googleSpreadsheetKeys', [function (){
		//TODO: order by year
		return [{year:'2012', key:'0ApY2PdXZDxl2dFphWVRpazlmdmhWcXNNazRndmJ3VWc'},
		        {year:'2013', key:'0ApY2PdXZDxl2dDAtdU5FX05saTJaYkNKb3ZzdDU5LXc'},
		        {year:'2014', key:'0ApY2PdXZDxl2dG5WLU80RkI1aHpoQmpjX2R5NUVlWFE'},
		        {year:'2015', key:'0ApY2PdXZDxl2dDFldExKTDdGejJfS1U5dHdWcFZVOXc'},
		        {year:'2016', key:'1APZj3S2WgEXSta_J2mBbOmNIkW2oADYY7btGqW9A5JM'}
		];
	}]);
})();