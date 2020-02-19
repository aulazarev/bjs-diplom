"use strict";

const logoutButton = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();

logoutButton.action = function() {
  ApiConnector.logout(response => {
    if (response.success) {
      location.reload();
      console.log(`OK`);
    } else {
      console.log(`Ошибка`);
    }
  });
};

ApiConnector.current(response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
    console.log(`OK`);
  } else {
    console.log(`Ошибка`);
  }
});

let rateBoard = function() {
  ApiConnector.getStocks(response => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
      console.log(`OK`);
    } else {
      console.log(`Ошибка`);
    }
  });
};

rateBoard();
setInterval(rateBoard, 60000);

moneyManager.addMoneyCallback = data =>
  ApiConnector.addMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      favoritesWidget.setMessage(!response.success, `Баланс пополнен`);
    } else {
      favoritesWidget.setMessage(response.success, `Ошибка`);
    }
  });

moneyManager.conversionMoneyCallback = data =>
  ApiConnector.convertMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      favoritesWidget.setMessage(!response.success, `Конвертация выполнена`);
    } else {
      favoritesWidget.setMessage(response.success, `Ошибка`);
    }
  });

moneyManager.sendMoneyCallback = data =>
  ApiConnector.transferMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      favoritesWidget.setMessage(!response.success, `Перевод выполнен`);
    } else {
      favoritesWidget.setMessage(response.success, `Ошибка`);
    }
  });

ApiConnector.getFavorites(response => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    console.log(`OK`);
  } else {
    console.log(`Ошибка`);
  }
});

favoritesWidget.addUserCallback = data =>
  ApiConnector.addUserToFavorites(data, response => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(!response.success, `Пользователь добавлен`);
    } else {
      favoritesWidget.setMessage(response.success, `Ошибка`);
    }
  });

favoritesWidget.removeUserCallback = data =>
  ApiConnector.removeUserFromFavorites(data, response => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(!response.success, `Пользователь удален`);
    } else {
      favoritesWidget.setMessage(response.success, `Ошибка`);
    }
  });