(function(){
	angular
	.module('bird-service')
	.service('googleSpreadsheetKeys', [function (){
		//TODO: order by year
		return [{year:'2012', key:'1bYWodUSoDM2AxUjiCE4TD9Ejz1sOww8Ixeksfz53SPw'},
						{year:'2013', key:'1dApI7ZK7Lf_3oahWVS03qEXf5PqjQ8l7tZmaOYUTR6w'},
						{year:'2014', key:'1QKzM9g2AH3wclMfpLSU1g1bVhxO9bs8VUlqWHGI8ggE'},
						{year:'2015', key:'1Zep_03a5XJBdAohuGclDt-bC_Pdv1hQkrYK_UBZC40E'},
						{year:'2016', key:'1APZj3S2WgEXSta_J2mBbOmNIkW2oADYY7btGqW9A5JM'}
		];
	}]);
})();