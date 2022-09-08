# TYPESCRIPT AST PARSER VISUAL STUDIO CODE EXTENSION

This Visual Studio extension does static analysis on TypeScript code to help people during development.

## Extension Overview

This extension parses the Typescript's abstract syntax tree to perform static analysis and shows values for variables in the file without compiling the program. Making it easier to debug Typescript code

## Installation

*Option 1: Install using Visual Studio Extension Manager*

* Open Visual Studio

* Click the Extensions button on the toolbar on the left of the screen or press Ctrl+Shift+X

* In the search box type 'medFive'

* Typescript Static Analysis should be returned as the result

* Press 'Install'

*Option 2:Install using Web Browser*

* Open a web browser

* Navigate to https://marketplace.visualstudio.com/items?itemName=medFive.typescript-static-analysis

* Press 'Install'

*Option 3: Install from .vsix file*

* Double-click the .vsix file or select the file and press 'Enter'. 

* Follow the prompts. 

* When the extension is installed, you can use the Manage Extensions dialog box to enable it

## How to Use

```python
npm run test

```
## Usage

```python
 git clone https://github.com/visual-studio-code-extensions/visual-studio-code-extension-project.git

 npm install in the terminal

```
 * Press F5 to run the sample


## Debug

F5 and open the sample folder and click sample.ts.
Click on 'Run' and then "Start Debugging"

## Testing

![Alt Text](https://user-images.githubusercontent.com/76471403/188575936-e6a2ef3c-68f2-4da8-a8a1-f8cdac0c8ded.gif)

## Key Files

**SRC**|**Purpose**
:-----:|:-----:
analyzeCode.ts|Runs code in the background recursing as code changes
BlockAnalysis.ts|Analyzes user's code in a block
CodeAnalysis.ts|Runs Block Analysis and Variable Statement Analysis in code
CodeLocation.ts|Provides location inside code
coreAnalyzer.ts|Analysis of code core components
createProgramFromFiles.ts|Custom file compiler into a program
editVariable.ts|Defines user variables and updates type and values
extension.ts|Main code that runs when extension is activated
getDecorations.ts|Highlights, underlines, colors user's code
getNodePosition.ts|Provides node positions in the user's code
logTrace.ts|Trace Program Actions
mapStack.ts|Breaks down and maps extension user's code
operations.ts|Defines operations performed in the user's code to be performed in the background
VariableStatementAnalysis.ts|Break down and classifies user variables


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

To make a pull request:

 [GitHub Desktop](https://desktop.github.com/)


* have the repository locally
> git clone https://github.com/visual-studio-code-extensions/visual-studio-code-extension-project.git
* make sure its updated
> git checkout main
> git pull
* make a new branch
> git checkout -b <your GitHub alias>\<descriptive branch name>
* push the branch
> git push
if that give you a command run that command
* make your changes
Edit code do stuff
commit and push
> git add  *
> git commit -am "description"
> git push
* Make a pull request

Please make sure to update tests as appropriate.

## License
[Unlicensed](https://unlicense.org/)
