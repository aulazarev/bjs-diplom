"use strict";

const userForm = new UserForm();

userForm.loginFormCallback = data =>
  ApiConnector.login(data, response => {
    if (response.success) {
      location.reload();
      console.log(`OK`);
    } else {
      userForm.setLoginErrorMessage("Логин не верен");
    }
  });

userForm.registerFormCallback = data =>
  ApiConnector.register(data, response => {
    if (response.success) {
      location.reload();
      console.log(`OK`);
    } else {
      userForm.setRegisterErrorMessage("Ошибка регистрации");
    }
  });