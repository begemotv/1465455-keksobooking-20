'use strict';

// массивы для случайной генерации в объектах объявления
var LISTING_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var LISTING_CHECKIN_CHECKOUT = ['12:00', '13:00', '14:00'];
var LISTING_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var LISTING_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var getRandomNumber = function (max) { // рандомизатор для объектов объявления
  return Math.floor(Math.random() * Math.floor(max));
};

var getRandomNumberRange = function (min, max) { // рандомизатор для объектов объявления
  return Math.floor(Math.random() * (max - min) + min);
};

var getImgSize = function () { // для получения ширины и высоты блока, где будут появляться метки, но сомнительно выглядит
  var myImg = document.querySelector('.map__pins');
  var currWidth = myImg.clientWidth;
  var currHeight = myImg.clientHeight;
  return [currWidth, currHeight];
};

var imgWidthHeight = getImgSize(); // получаем предельные размеры изображения по ширине и высоте
var currWidth = imgWidthHeight[0];
var currHeight = imgWidthHeight[1];

var getRandomFeaturesArr = function (features) { // создает массив квартирных фич случайной длины, но насколько я понимаю здесь могут появляться повторяющиеся элементы
  var featuresArr = new Array(getRandomNumberRange(2, 6));
  for (var i = 0; i < featuresArr.length; i++) {
    featuresArr[i] = features[getRandomNumber(features.length)];
  }
  return featuresArr;
};

var getRandomPhotosArr = function (photos) { // создает массив квартирных фотографий. также есть проблема повторов
  var photosArr = new Array(getRandomNumberRange(1, 3));
  for (var i = 0; i < photosArr.length; i++) {
    photosArr[i] = photos[getRandomNumber(photos.length)];
  }
  return photosArr;
};

var getListingsArr = function () {
  var arr = [];
  for (var i = 0; i < 8; i++) {
    arr.push({
      author: {
        avatar: 'img/avatars/user' + '0' + getRandomNumberRange(1, 9) + '.png'},
      offer: {
        title: 'Комфортное жилище на любой вкус',
        address: getRandomNumberRange(0, currWidth) + ', ' + getRandomNumberRange(0, currHeight),
        price: getRandomNumberRange(10, 200),
        type: LISTING_TYPE[getRandomNumber(LISTING_TYPE.length)],
        rooms: getRandomNumberRange(1, 5),
        guests: getRandomNumberRange(1, 9),
        checkin: LISTING_CHECKIN_CHECKOUT[getRandomNumber(LISTING_CHECKIN_CHECKOUT.length)],
        checkout: LISTING_CHECKIN_CHECKOUT[getRandomNumber(LISTING_CHECKIN_CHECKOUT.length)],
        features: getRandomFeaturesArr(LISTING_FEATURES),
        description: 'Великолепное место для отдыха',
        photos: getRandomPhotosArr(LISTING_PHOTOS)}, // - массив строк случайной длины. В поле объекта фото копировать оригинальный массив и с shift или другими методами. Скопировать чтобы мы не перетерли оригинальный массив
      location: {
        x: getRandomNumberRange(1, currWidth),
        y: getRandomNumberRange(130, 630)}
    });
  }
  return arr;
};

var listings = getListingsArr();
console.log(listings);

var mapState = document.querySelector('.map');
mapState.classList.remove('.map--faded');

var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // забираем темплейт пина

var renderPin = function (param) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style = 'left:' + param.location.x + 'px;' + 'top:' + ' ' + param.location.y + 'px;'; // какое смещение?
  pinElement.children[0].src = param.author.avatar;
  pinElement.children[0].alt = param.offer.title;
  return pinElement;
};

var pinsFragment = document.createDocumentFragment();
for (var i = 0; i < listings.length; i++) {
  pinsFragment.appendChild(renderPin(listings[i]));
}
mapPins.appendChild(pinsFragment);
console.log(mapPins);
