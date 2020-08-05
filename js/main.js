/* eslint-disable semi */
'use strict';

// массивы для случайной генерации в объектах объявления
var LISTING_TYPE = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var LISTING_TYPE_RUS = [
  'Дворец',
  'Квартира',
  'Дом',
  'Бунгало'
];
var LISTING_CHECKIN_CHECKOUT = [
  '12:00',
  '13:00',
  '14:00'
];
var LISTING_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var LISTING_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var NUMBER_OF_ADS = 8;
var PIN_WIDTH = 65;
var PIN_HEIGHT = 84;
var MAX_Y = 630;
var MIN_Y = 130;
var ESC_KEY = 27;
var ENT_KEY = 13;
var MOUSE_LEFT_BUTTON = 0;

var MIN_TITLE_LENGTH = '30';
var MAX_TITLE_LENGTH = '100';
var MAX_PRICE = '100';

var mapElement = document.querySelector('.map') // находим родительский элемент для вставки
var mapPins = document.querySelector('.map__pins');
var mapPinMain = mapPins.querySelector('.map__pin--main');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var adFormElement = document.querySelector('.ad-form');
var mapFilters = mapFiltersContainer.querySelector('.map__filters')
var formFieldsets = adFormElement.querySelectorAll('fieldset');
var formSelects = mapFilters.querySelectorAll('select');

var formTitle = adFormElement.querySelector('#title');
var formAddress = adFormElement.querySelector('#address');
var formType = adFormElement.querySelector('#type');
var formPrice = adFormElement.querySelector('#price');
var formTimein = adFormElement.querySelector('#timein');
var formTimeout = adFormElement.querySelector('#timeout');
var formRoomNumber = adFormElement.querySelector('#room_number');
var formCapacity = adFormElement.querySelector('#capacity');
// var formImages = adFormElement.querySelector('#images');
// var formSubmit = adFormElement.querySelector('.ad-form__element--submit');

var getRandomNumber = function (max) { // рандомизатор для объектов объявления
  return Math.round(Math.random() * max);
};

var getListingsArr = function () {
  var arr = [];

  for (var i = 0; i < NUMBER_OF_ADS; i++) {
    var locationX = PIN_WIDTH + getRandomNumber(mapElement.offsetWidth - PIN_WIDTH * 2);
    var locationY = MIN_Y + getRandomNumber(MAX_Y - (MIN_Y + PIN_HEIGHT));

    var cardItem = {};

    cardItem.author = {
      avatar: 'img/avatars/user0' + (i + 1) + '.png'
    };
    cardItem.offer = {
      title: 'Комфортное жилище на любой вкус',
      address: locationX + ', ' + locationY,
      price: getRandomNumber(1200),
      type: LISTING_TYPE[getRandomNumber(LISTING_TYPE.length - 1)],
      rooms: getRandomNumber(5),
      guests: getRandomNumber(9),
      checkin: LISTING_CHECKIN_CHECKOUT[getRandomNumber(LISTING_CHECKIN_CHECKOUT.length - 1)],
      checkout: LISTING_CHECKIN_CHECKOUT[getRandomNumber(LISTING_CHECKIN_CHECKOUT.length - 1)],
      features: LISTING_FEATURES.slice(getRandomNumber(LISTING_FEATURES.length - 1)),
      description: 'Великолепное место для отдыха',
      photos: LISTING_PHOTOS.slice(getRandomNumber(LISTING_PHOTOS.length - 1)),
      advertId: i
    };
    cardItem.location = {
      x: locationX,
      y: locationY
    };
    arr.push(cardItem);
  }
  return arr;
};

var listings = getListingsArr();

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // забираем темплейт пина

var renderPin = function (param) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.alt = param.offer.title;
  pinElement.style = 'left:' + param.location.x + 'px;' + 'top:' + ' ' + param.location.y + 'px;'; // какое смещение?
  pinElement.children[0].src = param.author.avatar;
  pinElement.children[0].alt = param.offer.title;
  pinElement.setAttribute('data-advert-id', param.offer.advertId);
  return pinElement;
};

var addPinsToFragment = function (arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < listings.length; i++) {
    fragment.appendChild(renderPin(listings[i]));
  }
  return fragment;
}

var renderPinsToDom = function (container, fragment) {
  container.append(fragment);
}

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var renderOfferFeatures = function (arrOfferFeatures, cardElement) {
  var featuresElement = cardElement.querySelector('.popup__features');
  var featureElement;

  for (var i = 0; i < featuresElement.children.length; i++) {
    featuresElement.children[i].classList.add('hidden');
  }

  for (var j = 0; j < arrOfferFeatures.length; j++) {
    featureElement = featuresElement.querySelector('[class*="popup__feature--' + arrOfferFeatures[j] + '"]');
    featureElement.classList.remove('hidden');
  }
};

var renderCard = function (param) {
  var fragment = document.createDocumentFragment();
  var cardElement = cardTemplate.cloneNode(true);
  var offerAuthorAvatar = cardElement.querySelector('.popup__avatar');
  var offerTitle = cardElement.querySelector('.popup__title');
  var offerAddress = cardElement.querySelector('.popup__text--address');
  var offerPrice = cardElement.querySelector('.popup__text--price');
  var offerType = cardElement.querySelector('.popup__type');
  var offerRoomsGuests = cardElement.querySelector('.popup__text--capacity');
  var offerCheckInOut = cardElement.querySelector('.popup__text--time');
  var offerDescription = cardElement.querySelector('.popup__description');
  var offerPhotosCollection = cardElement.querySelector('.popup__photos');
  var offerPhoto = cardElement.querySelector('.popup__photo');
  var offerClose = cardElement.querySelector('.popup__close');

  offerAuthorAvatar.src = param.author.avatar;
  offerTitle.textContent = param.offer.title;
  offerAddress.textContent = param.offer.address;
  offerPrice.textContent = param.offer.price + '₽/ночь';
  offerType.textContent = LISTING_TYPE_RUS[LISTING_TYPE.indexOf(param.offer.type)];
  offerRoomsGuests.textContent = param.offer.rooms + ' комнаты для ' + param.offer.guests + ' гостей';
  offerCheckInOut.textContent = 'Заезд после ' + param.offer.checkin + ', выезд до ' + param.offer.checkout;
  renderOfferFeatures(param.offer.features, cardElement);
  offerDescription.textContent = param.offer.description;

  offerPhotosCollection.removeChild(offerPhoto);
  for (var i = 0; i < param.offer.photos.length; i++) {
    var cardPhoto = offerPhoto.cloneNode(true);
    cardPhoto.src = param.offer.photos[i];
    offerPhotosCollection.appendChild(cardPhoto);
  }

  offerClose.addEventListener('mousedown', advertCardCloseHandler);
  document.addEventListener('keydown', advertCardCloseHandler);

  fragment.append(cardElement);
  return fragment;
};

formAddress.value = Math.round(mapPinMain.offsetLeft - (PIN_WIDTH / 2)) +
  ', ' + Math.round(mapPinMain.offsetTop - (PIN_WIDTH / 2));

var setActiveState = function () {
  listings = getListingsArr();
  var pinsFragment = addPinsToFragment(listings);
  renderPinsToDom(mapPins, pinsFragment);
  mapElement.classList.remove('map--faded');
  adFormElement.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('ad-form--disabled');
  changeStateOfControls(formFieldsets, false);
  changeStateOfControls(formSelects, false);
  setTitleInputValidity(true, MIN_TITLE_LENGTH, MAX_TITLE_LENGTH);
  setPriceInputValidity(true, MAX_PRICE, 'number');
  mapPins.addEventListener('click', mapPinClickHandler);
  formCapacity.addEventListener('input', compareRoomsGuestsHandler);
  formTimein.addEventListener('input', compareInOutHandler);
  formTimeout.addEventListener('input', compareInOutHandler);
  formPrice.addEventListener('change', compareTypePriceHandler);
}

var changeStateOfControls = function (controls, state) {
  controls.forEach(function (control) {
    control.disabled = state;
  });
};

var setNotActiveState = function () {
  changeStateOfControls(formFieldsets, true);
  changeStateOfControls(formSelects, true);

  mapPinMain.addEventListener('keydown', mapActivationHandler);
  mapPinMain.addEventListener('mousedown', mapActivationHandler);
};

var mapPinClickHandler = function (evt) {
  var currentPin = evt.target.closest('.map__pin:not(.map__pin--main)');

  if (currentPin !== null || evt.keyCode === ENT_KEY) {
    var currentPinAdvertId = currentPin.dataset.advertId;
    var cardFragment = renderCard(listings[currentPinAdvertId]);
    if (mapElement.children.length >= 3) {
      advertCardCloseHandler(evt);
    }
    mapElement.insertBefore(cardFragment, mapFiltersContainer);
  }
};

var advertCardCloseHandler = function (evt) {
  if (evt.keyCode === ESC_KEY || evt.button === MOUSE_LEFT_BUTTON || evt.keyCode === ENT_KEY) {
    mapElement.querySelector('.map__card').remove();
  }
};

var mapActivationHandler = function (evt) {
  if (evt.keyCode === ENT_KEY || evt.button === MOUSE_LEFT_BUTTON) {
    setActiveState();
  }
  mapPinMain.removeEventListener('keydown', mapActivationHandler);
  mapPinMain.removeEventListener('mousedown', mapActivationHandler);
};

var setTitleInputValidity = function (isRequired, minLength, maxLength) {
  formTitle.required = isRequired;
  formTitle.setAttribute('minlength', minLength);
  formTitle.setAttribute('maxlength', maxLength);
};

// validation of price input
var setPriceInputValidity = function (isRequired, maxValue, inputType) {
  formPrice.required = isRequired;
  formPrice.max = maxValue;
  formPrice.type = inputType;
};

// handler function for comparison of type and price inputs
var compareTypePriceHandler = function () {
  switch (formType.value) {
    case 'bungalo': formPrice.min = '0';
      break;
    case 'flat': formPrice.min = '1000';
      break;
    case 'house': formPrice.min = '5000';
      break;
    case 'palace': formPrice.min = '10000';
      break;
  }
};

// validation of rooms and guest capacity inputs
var compareRoomsGuestsHandler = function () {
  var errorMessage = '';

  if (+formRoomNumber.value < +formCapacity.value) {
    errorMessage = 'too many people for this apartment';
  }

  if (+formRoomNumber.value === 100 && +formCapacity.value !== 0) {
    errorMessage = 'for so many rooms choose not for guests option';
  }

  if (+formRoomNumber.value !== 100 && +formCapacity.value === 0) {
    errorMessage = 'if not for guests, choose 100 rooms option';
  }

  formCapacity.setCustomValidity(errorMessage);
};

// handler function for comparison of timein and timeout inputs
var compareInOutHandler = function (evt) {
  formTimein.value = evt.target.value;
  formTimeout.value = evt.target.value;
};

setNotActiveState();
