angular.module('images', [])
.controller('ImagesController', ['$scope', '$state', 'Config', 'ImageService', 'Messages', 'Pagination', 'ModalService',
function ($scope, $state, Config, ImageService, Messages, Pagination, ModalService) {
  $scope.state = {};
  $scope.state.pagination_count = Pagination.getPaginationCount('images');
  $scope.sortType = 'RepoTags';
  $scope.sortReverse = true;
  $scope.state.selectedItemCount = 0;

  $scope.config = {
    Image: '',
    Registry: ''
  };

  $scope.order = function(sortType) {
    $scope.sortReverse = ($scope.sortType === sortType) ? !$scope.sortReverse : false;
    $scope.sortType = sortType;
  };

  $scope.changePaginationCount = function() {
    Pagination.setPaginationCount('images', $scope.state.pagination_count);
  };

  $scope.selectItems = function (allSelected) {
    angular.forEach($scope.state.filteredImages, function (image) {
      if (image.Checked !== allSelected) {
        image.Checked = allSelected;
        $scope.selectItem(image);
      }
    });
  };

  $scope.selectItem = function (item) {
    if (item.Checked) {
      $scope.state.selectedItemCount++;
    } else {
      $scope.state.selectedItemCount--;
    }
  };

  $scope.pullImage = function() {
    $('#pullImageSpinner').show();
    var image = $scope.config.Image;
    var registry = $scope.config.Registry;
    ImageService.pullImage(image, registry)
    .then(function success(data) {
      $state.reload();
    })
    .catch(function error(err) {
      Messages.error("Failure", err, "Unable to pull image");
    })
    .finally(function final() {
      $('#pullImageSpinner').hide();
    });
  };

  $scope.confirmRemovalAction = function (force) {
    ModalService.confirmImageForceRemoval(function (confirmed) {
      if(!confirmed) { return; }
      $scope.removeAction(force);
    });
  };

  $scope.removeAction = function (force) {
    force = !!force;
    $('#loadImagesSpinner').show();
    var counter = 0;
    var complete = function () {
      counter = counter - 1;
      if (counter === 0) {
        $('#loadImagesSpinner').hide();
      }
    };
    angular.forEach($scope.images, function (i) {
      if (i.Checked) {
        counter = counter + 1;
        ImageService.deleteImage(i.Id, force)
        .then(function success(data) {
          Messages.send("Image deleted", i.Id);
          var index = $scope.images.indexOf(i);
          $scope.images.splice(index, 1);
        })
        .catch(function error(err) {
          Messages.error("Failure", err, 'Unable to remove image');
        })
        .finally(function final() {
          complete();
        });
      }
    });
  };

  function fetchImages() {
    $('#loadImagesSpinner').show();
    ImageService.images()
    .then(function success(data) {
      $scope.images = data;
    })
    .catch(function error(err) {
      Messages.error("Failure", err, "Unable to retrieve images");
      $scope.images = [];
    })
    .finally(function final() {
      $('#loadImagesSpinner').hide();
    });
  }

  fetchImages();
}]);
