# Change Log

All notable changes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.0] - 2022-08-31

### Added

- Initial release

- Preforming static analysis on int/boolean expressions

- Highlight variables calculated

- Be able to hover over variable

- Support const and let expressions

- support reassignment expressions

## [1.0.0] - 2022-09-09

### Added

- Scoping

- Added Readme

- Hover message shows type of variable

- Added support for && and ||

## [1.1.0] - 2022-10-02

### Added

- String operations support(+, ===, !==)

- Common tring methods support (.length, .toLocaleLower/toLocaleUpperCase, .toUpperCase/LowerCase, 
.trim/trimStart/trimEnd, .slice, .sbustring, .at, .charAt, .padEnd/padStart, .repeat, .charCodeAt 
.codePointAt, .includes, .startWith/endWith, .indexOf/lastIndexOf, .concat, .replace)

- Replaced annoying VS code error messages to show errors in hover messages.

- Added support to assignment operations like +=, -=...

## [1.1.1] - 2022-10-06

### Changed

- Parser doesn't throw errors anymore and only shows results if possible to calculate.

- Variables will stay the default colors.

## [1.1.2] - 2022-12-13

### Changed

- Fixed an issue where it was not reading multiple variable definition.