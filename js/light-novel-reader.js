var app = angular.module('light-novel-reader', ['ui.bootstrap']);
app.service("messageService",function(){
	this.message = function(type,message){
		var alertMessage = 'sa';
		switch(type){
		case 0:
			alertMessage = '<div id="alertMessage" style="position:absolute;left:40%;top:0;" class="alert alert-info alert-dismissable fade in">'+
			message+
   			'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;'+
     	'</div>';
			break;
		case 1:
			alertMessage = '<div id="alertMessage" style="position:absolute;left:40%;top:0;" class="alert alert-danger alert-dismissable fade in">'+
			message+
   			'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;'+
     	'</div>';
			break;
		}
		$('body').append(alertMessage);
		setTimeout(function(){$('#alertMessage').alert('close');},2000);
	};
});
app.directive('dynamic', function ($compile) {
	  return {
	    restrict: 'A',
	    replace: true,
	    link: function (scope, ele, attrs) {
	      scope.$watch(attrs.dynamic, function(html) {
	        ele.html(html);
	        $compile(ele.contents())(scope);
	      });
	    }
	  };
});
app.controller('lightNovelCrtl',function($scope,$http,$timeout,messageService){
	$scope.loadingDisplay = "block";
	$scope.content = "";
	$http.get('novel.json').success(function(data){
		$scope.index = 0;
		$scope.disableAll = false;
		$scope.loadText = "";
		$scope.hideOriginalUrl = true;
		$scope.fontSize = "14";
		$scope.fontFamily = "inherit";
		$scope.originalUrl = "";
		$scope.chapterContent = "";
		$scope.loadingDisplay = "none";
		$scope.novel = data.novel;
		$scope.contributors = data.novel.contributors;
		$scope.stories = data.novel.stories;
		$scope.selectedStory = "None";
		$scope.chapters = [];
		$scope.selectedChapter = "None";
		$scope.content = '<div class="row">'+
		'<center>' +
		'<h2 style="margin-top:10%;">Welcome to {{novel.name}} reader</h2>'+
		'<br/><br/><br/>'+
		'<input class="btn btn-primary" type="button" ng-click="enterReaderClick()" value="ENTER"/>'+
		'<br/><br/>'+
		'<p>This translation is all possible because of</p>' +	
		'<table>'+
		'<tr ng-repeat="contributor in contributors"><td style="text-align:center;"><a href="{{contributor.url}}">{{contributor.name}}</a></td></tr>' +
		'</table>'+
		'</center>' +
		'</div>';
		$scope.enterReaderClick = function(){
			$scope.content = '<div class="row">' +
			'<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">' +
			 '<div class="navbar-header">' +
		      '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">' +
		        '<span class="sr-only">Toggle navigation</span>' +
		        '<span class="icon-bar"></span>' +
		        '<span class="icon-bar"></span>' +
		        '<span class="icon-bar"></span>' +
		      '</button>' +
		    '</div>' +
		    '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">' +
		      '<ul class="nav navbar-nav" style="text-align:center;">' +
		      	'<li><a style="color:white;font-weight:bold;" href="#">{{novel.name}}</a></li>' +
		        '<li><a style="color:white;font-weight:bold;" href="#">Stories:</a></li>' +
		        '<li><select ng-disabled="disableAll" style="margin-top:8px;" class="form-control" ng-model="selectedStory" ng-change="selectedStoryChange()"><option selected="selected" value="None">None</option><option ng-repeat="story in stories" value="{{story.name}}">{{story.name}}</option></select></li>' +
		        '<li><a style="color:white;font-weight:bold;" href="#">Chapters:</a></li>' +
		        '<li><select ng-disabled="disableAll" style="margin-top:8px;" class="form-control" ng-model="selectedChapter" ng-change="selectedChapterChange()"><option selected="selected" value="None">None</option><option ng-repeat="chapter in chapters" value="{{chapter.id}}">{{chapter.id}}</option></select></li>' +		        
		        '<li class="dropdown">'+
		          '<a href="#" style="color:white;font-weight:bold;" class="dropdown-toggle" data-toggle="dropdown">Fonts<span class="caret"></span></a>'+
		          '<ul class="dropdown-menu" role="menu">'+
		          	'<li><a href="#">Font Size:</a></li>'+
		            '<li><select class="form-control" ng-model="fontSize"><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option>'+
		            '<option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option>'+
		            '<option value="25">25</option>'+
		            '<option value="26">26</option>'+
		            '<option value="27">27</option>'+
		            '<option value="28">28</option>'+
		            '<option value="29">29</option>'+
		            '<option value="30">30</option>'+
		            '<option value="31">31</option>'+
		            '</select></li>'+
		            '<li><a href="#">Font Family:</a></li>' +
		            '<li><select class="form-control" ng-model="fontFamily"><option value="inherit">inherit</option><option value="Arial">Arial</option><option value="Times New Roman">Times New Roman</option><option value="Georgia">Georgia</option>'+
		            '<option value="Avant Garde">Avant Garde</option>'+
		            '<option value="Futura">Futura</option>'+
		            '<option value="Helvetica">Helvetica</option>'+
		            '<option value="Tahoma">Tahoma</option>'+
		            '<option value="Verdana">Verdana</option>'+
		            '<option value="Baskerville">Baskerville</option>'+
		            '<option value="Rockwell">Rockwell</option>'+
		            '</select></li>' +
		          '</ul>' +
		        '</li>' +
		        '<li><a style="color:white;font-weight:bold;" target="_blank" ng-hide="hideOriginalUrl" href="{{originalUrl}}">View Original</a></li>' +
		        '<li><input ng-disabled="disableAll" type="button" style="margin-top:8px;margin-left:5px;" class="btn btn-primary" value="Special Thanks" data-toggle="modal" data-target="#specialThanksModal"/></li>' +
		        '<li><input ng-disabled="disableAll" type="button" style="margin-top:8px;margin-left:5px;" class="btn btn-primary" value="Full View" ng-hide="(selectedStory == \'None\')" ng-click="fullViewClick();"/></li>' +
		      '</ul>' +
		     '</div>' +
		    '</nav>' +
			'</div>' + 
			'<div style="margin-top:60px;" class="row">' +
			'<div dynamic="chapterContent" style="overflow:auto;list-style-type:none;font-size:{{fontSize}}px;font-family:{{fontFamily}}"></div>'+
			'</div>' +
			'<div class="modal fade" id="specialThanksModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
			  '<div class="modal-dialog">' +
			    '<div class="modal-content">' +
			      '<div class="modal-header">' +
			        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
			        '<h4 class="modal-title" id="loginModalLabel">Special Thanks To!!!</h4>' +
			      '</div>' +
			      '<div class="ng-scope">' +
			      '<div id="login-body" class="modal-body">' +
			      '<div>' +			      	
			        '<center>' +
			        '<div ng-repeat="contributor in contributors"><a href="{{contributor.url}}">{{contributor.name}}</a></div>' +
			        '</center>' +			        
			      '</div>' +
			      '</div>' +
			      '</div>' +
			      '<div class="modal-footer">' +
			        'Support this Translators' +
			      '</div>' +
			    '</div>' +
			  '</div>' +
			'</div>';
			$timeout(function() {
				 $('.dropdown-menu select, .dropdown-menu label').click(function(e) {
				        e.stopPropagation();
				    });
			}, 10);
		};
		$scope.scrollClick = function(divId){
			$("html, body").scrollTop($("#"+divId).offset().top-70);
		}
		$scope.fullViewClick = function(){
			$scope.index = 0;
			$scope.hideOriginalUrl = true;
			$scope.disableAll = true;
			$scope.originalUrl = "";
			$scope.chapterContent = "";
			$scope.selectedChapter = "None";
			$scope.loadText = '<center><h1 style="margin-top:50px;margin-bottom:50px;">' + $scope.selectedStory + '</h1></center>'+
			'<p align="left"><div id="index"><a href="#"><h2>Index</h2></a></div></p><p>';
			for(var n=0;n<$scope.chapters.length;n++){
				$scope.loadText += '<a ng-click="scrollClick(\'Chapter' + $scope.chapters[n].id +'\');" href="#Chapter' + $scope.chapters[n].id + '"><h4>Chapter ' + $scope.chapters[n].id + '</h4></a>';
			}
			$scope.loadText += '</p><br/><br/>';
			$scope.loadingDisplay = "block";
			$scope.loadChapter();
			//$scope.chapterContent = $scope.loadText;
		}
		$scope.loadChapter = function(){
			if($scope.index < $scope.chapters.length){
				$scope.loadText += '<div id="Chapter' + $scope.chapters[$scope.index].id + '"><a ng-click="scrollClick(\'index\')" href="#index"><h4>Chapter ' + $scope.chapters[$scope.index].id + '</h4></a></div>';
				$http.get("getUrl.php?translator=" + $scope.chapters[$scope.index].type + "&url=" + $scope.chapters[$scope.index].url).success(function(data){					
					$scope.loadText += data;
					$scope.index++;
					$scope.loadChapter();
				});
			}
			else{
				$scope.disableAll = false;
				$scope.loadingDisplay = "none";
				$scope.chapterContent = $scope.loadText;
				setTimeout(function(){$(".mw-editsection").remove();$(".thumbimage").remove();$("#mw-navigation").remove();$("#footer").remove();$(".printfooter").remove();$(".references").remove();$(".ng-scope table").remove();},200);
			}
		}
		$scope.selectedStoryChange = function(){
			if($scope.selectedStory == "None"){
				$scope.chapters = [];
				$scope.selectedChapter = "None";
				$scope.hideOriginalUrl = true;
				$scope.originalUrl = "";
				$scope.chapterContent = "";
			}
			for(var n = 0;n < $scope.stories.length;n++){
				if($scope.stories[n].name == $scope.selectedStory){
					$scope.chapters = $scope.stories[n].chapters;
					if($scope.chapters.length > 0){
						$timeout(function() {
							$scope.selectedChapter = $scope.chapters[0].id;
							$scope.selectedChapterChange();
						}, 10);
					}
					else{
						$scope.selectedChapter = "None";
					}
				}
			}
			//console.log("Selected Story is " + $scope.selectedStory);
		};
		$scope.selectedChapterChange = function(){
			if($scope.selectedChapter != "None"){
				$scope.chapterContent = "";
				for(var n = 0;n < $scope.chapters.length;n++){
					if($scope.chapters[n].id == $scope.selectedChapter){
						$scope.loadingDisplay = "block";
						var type = $scope.chapters[n].type;
						var url = $scope.chapters[n].url;
						$http.get("getUrl.php?translator=" + $scope.chapters[n].type + "&url=" + $scope.chapters[n].url).success(function(data){
							$scope.loadingDisplay = "none";
							$scope.hideOriginalUrl = false;
							$scope.originalUrl = url;
							$scope.chapterContent = data;
							if(type == "baka-tsuki"){
								setTimeout(function(){$(".mw-editsection").remove();$(".thumbimage").remove();$("#mw-navigation").remove();$("#footer").remove();$(".printfooter").remove();$(".references").remove();$(".ng-scope table").remove();},200);								
							}
						});
					}
				}
			}
			else{
				$scope.hideOriginalUrl = true;
				$scope.originalUrl = "";
				$scope.chapterContent = "";
			}
			//console.log("Selected Chapter is " + $scope.selectedChapter);
		};
		
	});
});