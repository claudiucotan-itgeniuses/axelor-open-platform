(function(){

var ui = angular.module('axelor.ui');

this.FormListCtrl = FormListCtrl;
this.FormListCtrl.$inject = ["$scope", "$element", "$compile", "DataSource", "ViewService"];

function FormListCtrl($scope, $element, $compile, DataSource, ViewService) {
	
	DSViewCtrl('form', $scope, $element);

	$scope._viewParams.$viewScope = $scope;
	
	var view = $scope._views['trail'];
	setTimeout(function(){
		$scope.$apply(function(){
			if (view.deferred)
				view.deferred.resolve($scope);
		});
	});
	
	var ds = $scope._dataSource;
	var dsChild = DataSource.create(ds._model, {
		
	});
	
	var params = $scope._viewParams.params || {};
	var sortBy = params['trail-order'] && params['trail-order'].split(/\s*,\s*/);
	var childField = params['trail-child-field'] || 'children';

	$scope.onShow = function(viewPromise) {
		viewPromise.then(function() {
			$scope.updateRoute();
			if ($scope.records === undefined)
				$scope.onReload();
		});
	};

	$scope.getRouteOptions = function() {
		return {
			mode: "trail"
		};
	};
	
	$scope.setRouteOptions = function(options) {
		$scope.updateRoute();
	};
	
	$scope.canCreate = function() {
		return this._canCreate;
	};
	
	$scope.canExpand = function(item) {
		return !item.$expanded && hasChildren(item);
	};

	$scope.onNew = function() {
		this._canCreate = true;
		$scope.$broadcast("trail:on-new");
	};
	
	$scope.onCancel = function() {
		this._canCreate = false;
	};
	
	$scope.onReload = function() {
		this._canCreate = false;
		return ds.search({
			sortBy: sortBy
		}).success(function(records, page) {
			$scope.records = records;
		});
	};
	
	function hasChildren(item) {
		return !_.isEmpty(item[childField]);
	}
	
	function findChildren(item) {
		var items = item[childField];
		return items;
	}
	
	$scope.onExpand = function(item) {
		
		var record = _.isNumber(item) ? _.find($scope.records, function(rec) { return item === rec.id; }) : item;
		var current = record.$children || [];
		var children = findChildren(record);
		
		var ids = _.pluck(children, 'id');
		var criterion = {
			'fieldName': 'id',
			'operator': 'inSet',
			'value': ids
		};

		var filter = {
			operator: 'and',
			criteria: [criterion]
		};

		return dsChild.search({
			filter: filter,
			archived: true,
			limit: -1
		}).success(function(records, page) {
			current = current.concat(records);
			record.$children = current;
			record.$expanded = true;
		});
	};

	$scope.onRecord = function(record) {
		this._canCreate = false;
		var found = _.find($scope.records, function(item) {
			return item.id == record.id;
		});
		
		if (found) {
			return _.extend(found, record);
		}
		
		if (!record.parent) {
			return $scope.records.unshift(record);
		}

		var parent = _.find($scope.records, function(item) {
			return item.id == record.parent.id;
		});

		parent.$children = parent.$children || [];
		parent.$children.push(record);
	};
	
	$scope.show();
}

ui.directive('uiFormList', function() {

	return {
		
		controller: FormListCtrl,
		
		link: function(scope, element, attrs) {

		},
		
		template: '<div class="trail-list">'+
			'<div ng-repeat="item in records" ui-trail-form></div>'+
		'</div>'
	};
});

TrailFormCtrl.$inject = ['$scope', '$element', 'DataSource', 'ViewService'];
function TrailFormCtrl($scope, $element, DataSource, ViewService) {
	
	var params = $scope.$parent._viewParams;
	var view = _.find(params.views, function(view) {
		return view.type === 'form';
	});
	
	if ($scope._editForm) {
		view = {
			type: view.type,
			name: $scope._editForm
		};
	}

	params = _.extend({}, {
		'title': params.title,
		'model': params.model,
		'domain': params.domain,
		'context': params.context,
		'viewType': 'form',
		'views': [view],
		'params': params.params
	});

	$scope._viewParams = params;
	$scope._childField = (params.params || {})['trail-child-field'];
	
	ViewCtrl.call(this, $scope, DataSource, ViewService);
	FormViewCtrl.call(this, $scope, $element);
	
	// trail forms are by default editable
	$scope.setEditable(true);
	
	$scope.updateRoute = function(options) {
		
	};
	
	$scope.confirmDirty = function(fn) {
		return fn();
	};
	
	$scope.onShow = function(viewPromise) {
		viewPromise.then(function() {
			var record = $scope.$parent.item;
			if (record) {
				record.__expandable = $scope.$parent.canExpand(record);
			}
			$scope.edit(record);
		});
	};
	
	$scope.$on("on:new", function() {
		var trailScope = $scope.$parent.$parent;
		if (trailScope) {
			trailScope.onReload();
		}
	});
	
	$scope.$on("trail:record", function(e, record) {
		var parent = $scope.$parent || {};
		if (parent.onRecord) {
			parent.onRecord(record);
		}
	});

	$scope.$on("trail:expand", function(e, id) {
		var parent = $scope.$parent || {};
		if (parent.onExpand) {
			parent.onExpand(id).then(function() {
				$scope.record.__expandable = false;
			});
		}
	});

	$scope.show();
}

function trailWidth(scope, element) {
	var params = scope._viewParams.params || {};
	var width = params['trail-width'];
	if (width) {
		element.width(width);
	}
}

ui.directive("uiTrailForm", function() {

	return {
		scope: {},
		replace: true,
		controller: TrailFormCtrl,
		link: function(scope, element, attrs) {
			trailWidth(scope, element);
		},
		template:
		'<div ui-view-form x-handler="this" class="trail-form"></div>'
	};
});

TrailEditorCtrl.$inject = ['$scope', '$element', 'DataSource', 'ViewService'];
function TrailEditorCtrl($scope, $element, DataSource, ViewService) {
	
	var params = _.clone($scope.$parent._viewParams);
	if (params.params && params.params['trail-edit-form']) {
		$scope._editForm = params.params['trail-edit-form'];
	}
	
	$scope.$on("trail:on-new", function(e) {
		$scope.edit(null);
	});
	
	TrailFormCtrl.apply(this, arguments);
}

ui.directive("uiTrailEditor", function() {

	return {
		scope: {},
		controller: TrailEditorCtrl,
		link: function(scope, element, attrs) {
			trailWidth(scope, element);
		},
		template:
		'<div ui-view-form x-handler="this" class="trail-editor"></div>'
	};
});

}).call(this);
