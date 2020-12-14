# PasswordKeeper

> PasswordKeeper is a free password generator/manager tool build with React allows you to create and store random strong passwords and access from anywhere!

<p align="center">
  <img src="./screenshot.gif" alt="screenshot" width="100%" />
</p>

Optionally, you can store your generated passwords to cloud [Firebase](https://console.firebase.google.com/) database. All passwords will be hashed using [cryptoJS](https://www.npmjs.com/package/crypto-js) as a second layer of protecion, but you still can retrieve them when you need.

You will need to sign-in with your Google account using [Firebase Authentication](https://firebase.google.com/docs/auth) and then, all the stored passwords will be bounded to this account.

> Please note that it's always recommended that you shouldn't use any online service to generate passwords for highly sensitive information.
