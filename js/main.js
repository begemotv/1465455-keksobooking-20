'use strict';

var LISTING_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var LISTING_CHECKIN_CHECKOUT = ['12:00', '13:00', '14:00'];
var LISTING_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var LISTING_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var getRandomNumber = function (max) {
  return Math.floor(Math.random() * Math.floor(max));
};

var getRandomNumberRange = function (min, max) {
  return Math.random() * (max - min) + min;
};

var imgSize = function () {
  var myImg = document.querySelector('.map__pins');
  var currWidth = myImg.clientWidth;
  var currHeight = myImg.clientHeight;

var listing = {
  author: { // в ТЗ каждое свойство объекта обернуто в кавычки. их правильно указывать без кавычек, чтобы иметь возможность обращаться к свойствам объекта?
    avatar: 'img/avatars/user' + '0' + getRandomNumberRange(1, 9) + '.png', // адреса изображений не должны повторяться. не совсем понял как это осуществить. через массив?
  },
  offer: {
    title: 'Комфортное жилище на любой вкус', // здесь просто болванка?
    address: 'getRandomNumberRange(0, currWidth)' + ', ' + 'getRandomNumberRange(0, currHeight)',
    price: getRandomNumberRange(10, 200),
    type: LISTING_TYPE[getRandomNumber(LISTING_TYPE.length)],
    rooms: getRandomNumberRange(1, 5),
    guests: getRandomNumberRange(1, 9),
    checkin: LISTING_CHECKIN_CHECKOUT[getRandomNumber(LISTING_CHECKIN_CHECKOUT.length)],
    checkout: LISTING_CHECKIN_CHECKOUT[getRandomNumber(LISTING_CHECKIN_CHECKOUT.length)],
    features: [LISTING_FEATURES[getRandomNumber(LISTING_FEATURES.length)], LISTING_FEATURES[getRandomNumber(LISTING_FEATURES.length)], LISTING_FEATURES[getRandomNumber(LISTING_FEATURES.length)]] // массив случайно длины пока не придумал как сделать
    description: 'Великолепное место для отдыха', // здесь тоже болванка?
    photos: [LISTING_PHOTOS[getRandomNumber(LISTING_PHOTOS.length)], LISTING_PHOTOS[getRandomNumber(LISTING_PHOTOS.length)]] // массив случайно длины пока не придумал как сделать
  },
  location: {
    x: getRandomNumberRange(1, currWidth),
    y: getRandomNumberRange(130, 630)
  }
};

var getListings = function () {
  var listings = [];
  for (var i = 0; i < 8; i++) {
    listings.push(listing);
  }
  return listings;
};

var mapState = document.querySelector('.map');
mapState.classList.remove('.map--faded');

// var card = mapState.querySelector('#card');

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
