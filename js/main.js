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
var ECS_KEY = 27;
var ENT_KEY = 13;
var MOUSE_LEFT_BUTTON = 0;

var MIN_TITLE_LENGTH = 30;
var MAX_TITLE_LENGTH = 100;

var mapElement = document.querySelector('.map') // находим родительский элемент для вставки
var mapPins = document.querySelector('.map__pins');
var mapPinMain = mapPins.querySelector('.map__pin--main');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var adFormElement = document.querySelector('.ad-form');
var mapFilters = mapFiltersContainer.querySelector('.map__filters')

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
      photos: LISTING_PHOTOS.slice(getRandomNumber(LISTING_PHOTOS.length - 1))
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

//

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card'); // сохраняем темплейт карточки
// var mapFiltersContainer = document.querySelector('.map__filters-container'); //находим перед чем будем их вставлять

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

  offerAuthorAvatar.src = param.author.avatar;
  offerTitle.textContent = param.offer.title;
  offerAddress.textContent = param.offer.address;
  offerPrice.textContent = param.offer.price + "₽/ночь";
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

  fragment.append(cardElement);
  return fragment;
};

var cardsFragment = document.createDocumentFragment();
for (var i = 0; i < listings.length; i++) {
  cardsFragment.appendChild(renderCard(listings[i]));
}
mapElement.insertBefore(cardsFragment, mapFiltersContainer);

// добавление атрибутов disabled
// var adFormElement = document.querySelector('.ad-form');
var formAvatar = adFormElement.querySelector('#avatar');
var formTitle = adFormElement.querySelector('#title');
var formAddress = adFormElement.querySelector('#address');
var formType = adFormElement.querySelector('#type');
var formPrice = adFormElement.querySelector('#price');
var formTimein = adFormElement.querySelector('#timein');
var formTimeout = adFormElement.querySelector('#timeout');
var formRoomNumber = adFormElement.querySelector('#room_number');
var formCapacity = adFormElement.querySelector('#capacity');
var formFeatures = adFormElement.querySelector('.features');
var formDescription = adFormElement.querySelector('#description');
var formImages = adFormElement.querySelector('#images');
var formSubmit = adFormElement.querySelector('.ad-form__element--submit');

formAvatar.setAttribute('disabled', 'disabled');
formTitle.setAttribute('disabled', 'disabled');
formAddress.setAttribute('disabled', 'disabled');
formType.setAttribute('disabled', 'disabled');
formPrice.setAttribute('disabled', 'disabled');
formTimein.setAttribute('disabled', 'disabled');
formTimeout.setAttribute('disabled', 'disabled');
formRoomNumber.setAttribute('disabled', 'disabled');
formCapacity.setAttribute('disabled', 'disabled');
formFeatures.setAttribute('disabled', 'disabled');
formDescription.setAttribute('disabled', 'disabled');
formImages.setAttribute('disabled', 'disabled');
formSubmit.setAttribute('disabled', 'disabled');

formAddress.value = Math.round(mapPinMain.offsetLeft - (PIN_WIDTH / 2))
  + ', ' + Math.round(mapPinMain.offsetTop - (PIN_WIDTH / 2));

// var mapFilters = mapFiltersContainer.querySelector('.map__filters')

var getRandomAddress = function () {
  return getRandomNumber(mapElement.offsetWidth - PIN_WIDTH * 2) + ', ' + getRandomNumber(MAX_Y - (MIN_Y + PIN_HEIGHT));
}

var setActiveState = function () {
  listings = getListingsArr();
  var pinsFragment = addPinsToFragment(listings);
  renderPinsToDom(mapPins, pinsFragment);
  mapElement.classList.remove('.map--faded'); // Блок с картой .map содержит класс map--faded;
  adFormElement.classList.remove('.ad-form--disabled'); // Форма заполнения информации об объявлении .ad-form содержит класс ad-form--disabled;
  formAvatar.removeAttribute('disabled');
  formTitle.removeAttribute('disabled');
  formAddress.removeAttribute('disabled');
  formType.removeAttribute('disabled');
  formPrice.removeAttribute('disabled');
  formTimein.removeAttribute('disabled');
  formTimeout.removeAttribute('disabled');
  formRoomNumber.removeAttribute('disabled');
  formCapacity.removeAttribute('disabled');
  formFeatures.removeAttribute('disabled');
  formDescription.removeAttribute('disabled');
  formImages.removeAttribute('disabled');
  formSubmit.removeAttribute('disabled'); // Все <input> и <select> формы .ad-form заблокированы с помощью атрибута disabled, добавленного на них или на их родительские блоки fieldset;
  mapFilters.classList.remove('.ad-form--disabled'); // Форма с фильтрами .map__filters заблокирована так же, как и форма .ad-form;
  // Единственное доступное действие в неактивном состоянии — перемещение метки .map__pin--main, являющейся контролом указания адреса объявления. Первое взаимодействие с меткой (mousedown) переводит страницу в активное состояние.
  formAddress.value = getRandomAddress();
}



// eventListeners

mapPinMain.addEventListener('mousedown', function (evt) {
  var btnCode = evt.button;
  if (btnCode === MOUSE_LEFT_BUTTON) {
    setActiveState();
  }
})

mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.key === ENT_KEY) {
    setActiveState();
  }
});

// валидация
var checkFormTitleValidity = function () {
  var titleLength = formTitle.value.length;

  if (titleLength < MIN_TITLE_LENGTH) {
    formTitle.setCustomValidity('Еще ' + (MIN_TITLE_LENGTH - titleLength) + ' симв.');
  } else if (titleLength < MAX_TITLE_LENGTH) {
    formTitle.setCustomValidity('Удалите лишние ' + (titleLength - MIN_TITLE_LENGTH) + ' симв.');
  } else {
    formTitle.setCustomValidity('');
  }
};

var checkRoomCapacity = function (evt) {
  if (formRoomNumber.value < evt.target.value) {
    formCapacity.setCustomValidity('Количество гостей не может превышать количество комнат');
  } else if (evt.target.value === 0 && formRoomNumber.value !== 100) {
    formCapacity.setCustomValidity('«Не для гостей» можно выбрать только 100 комнат');
  } else if (formRoomNumber.value === 100 && evt.target.value !== 0) {
    formCapacity.setCustomValidity('100 комнат — «не для гостей»');
  } else {
    formCapacity.setCustomValidity('');
  }
  console.log(evt.target.value)
  console.log(formRoomNumber.value)
}

formTitle.addEventListener('input', checkFormTitleValidity)
formCapacity.addEventListener('change', checkRoomCapacity)

console.log(formPrice.validity)
