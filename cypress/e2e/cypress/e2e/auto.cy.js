describe('Тестирование формы логина и восстановления пароля', () => {
  beforeEach(() => {
    cy.visit('https://login.qa.studio');
  });

  it('Позитивный кейс авторизации', () => {
    cy.url().should('include', 'login.qa.studio'); // Проверка URL
    cy.get('input[name="mail"]').first().should('be.visible', { timeout: 10000 }).type('german@dolnikov.ru'); // Поле логина
    cy.get('input[name="pass"]').first().type('iLoveqastudio1'); // Поле пароля
    cy.get('#loginButton').click(); // Кнопка "Войти"

    cy.contains('Авторизация прошла успешно');
    cy.get('img.exitIcon').should('be.visible'); // Кнопка закрыть
  });

  it('Логика восстановления пароля', () => {
    cy.contains('Забыли пароль?').click();
    cy.get('input#mailForgot').should('be.visible', { timeout: 10000 }).type('german@dolnikov.ru'); // Поле для восстановления пароля
    cy.get('#restoreEmailButton').click(); // Кнопка "Отправить код"

    cy.contains('Успешно отправили пароль на e-mail'); // Обновлено сообщение
    cy.get('img.exitIcon').should('be.visible'); // Кнопка закрыть
  });

  it('Негативный кейс авторизации (правильный логин, неправильный пароль)', () => {
    cy.get('input[name="mail"]').first().type('german@dolnikov.ru');
    cy.get('input[name="pass"]').first().type('wrongpassword');
    cy.get('#loginButton').click(); // Кнопка "Войти"

    cy.contains('Такого логина или пароля нет'); // Верное сообщение об ошибке
    cy.get('img.exitIcon').should('be.visible'); // Кнопка закрыть
  });

  it('Негативный кейс авторизации (неправильный логин, правильный пароль)', () => {
    cy.get('input[name="mail"]').first().type('wrongemail@dolnikov.ru');
    cy.get('input[name="pass"]').first().type('iLoveqastudio1');
    cy.get('#loginButton').click(); // Кнопка "Войти"

    cy.contains('Такого логина или пароля нет'); // Верное сообщение об ошибке
    cy.get('img.exitIcon').should('be.visible'); // Кнопка закрыть
  });

  it('Негативный кейс валидации (логин без @)', () => {
    cy.get('input[name="mail"]').first().type('germandolnikov.ru'); // Неправильный логин
    cy.get('input[name="pass"]').first().type('iLoveqastudio1');
    cy.get('#loginButton').click(); // Кнопка "Войти"

    cy.contains('Нужно исправить проблему валидации'); // Верное сообщение об ошибке
  });

  it('Проверка приведения к строчным буквам в логине', () => {
    const email = 'GerMan@Dolnikov.ru';
    cy.get('input[name="mail"]').first().type(email);
    cy.get('input[name="pass"]').first().type('iLoveqastudio1');
    cy.get('#loginButton').click(); // Кнопка "Войти"

    // Проверяем, что текст в поле ввода стал строчными буквами
    cy.get('input[name="mail"]').first().should('have.value', email.toLowerCase());

    // Ожидаем, что авторизация успешна
    cy.contains('Авторизация прошла успешно');
    cy.get('img.exitIcon').should('be.visible'); // Кнопка закрыть
  });
});