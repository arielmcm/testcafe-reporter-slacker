# testcafe-reporter-slacker
[![Build Status](https://travis-ci.org/arielmcm/testcafe-reporter-slacker.svg)](https://travis-ci.org/arielmcm/testcafe-reporter-slacker)

This is the **slacker** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/arielmcm/testcafe-reporter-slacker/master/media/preview.png" alt="preview" />
</p>

## Install

```
npm install testcafe-reporter-slacker
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter slacker
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('slacker') // <-
    .run();
```

## Author
Ariel Campoverde 
