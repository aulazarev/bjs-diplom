class Profile {
  constructor({ username, name: { firstName, lastName }, password }) {
    this.username = username;
    this.name = { firstName, lastName };
    this.password = password;
  }

  //Добавление нового пользователя
  createUser(callback) {
    return ApiConnector.createUser({
      username: this.username,
      name: this.name,
      password: this.password
    }, (err, data) => {
      console.log(`Создание нового пользователя ${this.username}...`);
      callback(err, data);
    });
  }

  //Авторизация
  performLogin(callback) {
    return ApiConnector.performLogin({
      username: this.username,
      name: this.name,
      password: this.password
    }, (err, data) => {
      console.log(`Авторизация пользователя ${this.username}...`);
      callback(err, data);
    });
  }

  //Добавление денег в личный кошелек
  addMoney({ currency, amount }, callback) {
    console.log(`Добавление ${amount} ${currency} пользователю ${this.username}`);
    return ApiConnector.addMoney({ currency, amount }, (err, data) => {
      console.log(`Добавлено ${amount} ${currency} пользователю ${this.username}`);
      callback(err, data);
    });
  }

  //Конвертация валют
  convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
    return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
      console.log(`Конвертация из ${fromCurrency} в ${targetCurrency}...`);
      callback(err, data);
    });
  }

  //Перевод денег другому пользователю
  transferMoney({ to, amount }, callback) {
    return ApiConnector.transferMoney({ to, amount }, (err, data) => {
      console.log(`Перевод ${amount} пользователю ${to}...`);
      callback(err, data);
    });
  }
}

//Функция получения курса валют с сервера
const exchangeRate = callback => {
  return ApiConnector.getStocks((err, data) => {
    console.log(`Получение курса валют с сервера...`);
    callback(err, data);
  });
};

function main() {
  const Ivan = new Profile({
    username: "Ivan",
    name: { firstName: "Ivan", lastName: "Ivanov" },
    password: "qweQWE123"
  });

  const Petr = new Profile({
    username: "Petr",
    name: { firstName: "Petr", lastName: "Petrov" },
    password: "asdASD123"
  });

  Ivan.createUser((err, data) => {
    if (err) {
      console.error("Ошибка создания нового пользователя.");
    } else {
      console.log(`Пользователь ${Ivan.username} создан.`);
      Ivan.performLogin((err, data) => {
        if (err) {
          console.error("Ошибка авторизации пользователя.");
        } else {
          console.log(`Пользователь ${Ivan.username} авторизован.`);
          const money = { currency: "RUB", amount: 100 };
          Ivan.addMoney(money, (err, data) => {
            if (err) {
              console.error("Ошибка добавления денег пользователю.");
            } else {
              console.log(
                `Зачислено ${money.amount} ${money.currency} пользователю ${Ivan.username}.`
              );
              exchangeRate((err, data) => {
                if (err) {
                  console.error("Ошибка при выявлении курса.");
                } else {
                  let result = data[7].RUB_NETCOIN;
                  const convert = {
                    fromCurrency: money.currency,
                    targetCurrency: "NETCOIN",
                    targetAmount: result * money.amount
                  };
                  Ivan.convertMoney(convert, (err, data) => {
                    if (err) {
                      console.error("Ошибка конвертации денег.");
                    } else {
                      console.log(
                        `Конвертировано ${money.amount} ${convert.fromCurrency} в ${convert.targetAmount} ${convert.targetCurrency}.`
                      );
                      Petr.createUser((err, data) => {
                        if (err) {
                          console.error("Ошибка создания нового пользователя.");
                        } else {
                          console.log(`Пользователь ${Petr.username} создан.`);
                          const transfer = {
                            to: "Petr",
                            amount: convert.targetAmount
                          };
                          Ivan.transferMoney(transfer, (err, data) => {
                            if (err) {
                              console.error("Ошибка перевода денег.");
                            } else {
                              console.log(
                                `Переведено ${transfer.amount} пользователю ${transfer.to}.`
                              );
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

main();