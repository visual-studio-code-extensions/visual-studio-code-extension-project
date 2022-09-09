# TYPESCRIPT AST PARSER VISUAL STUDIO CODE EXTENSION

This Visual Studio extension does static analysis on TypeScript code to help people during development.

## Extension Overview

This extension parses the Typescript's abstract syntax tree to perform static analysis and shows values for variables in the file without compiling the program. Making it easier to debug Typescript code

![Alt Text](https://user-images.githubusercontent.com/76471403/188575936-e6a2ef3c-68f2-4da8-a8a1-f8cdac0c8ded.gif)


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

## Key Files

**SRC**|**Purpose**
:-----:|:-----:
analyzeCode.ts|Parse the Abstract Syntax Tree from the source file and visit every node
BlockAnalysis.ts|Object used to debug scoping analysis in the algorithm
CodeAnalysis.ts|Object to hold BlockAnalysis and VariableStatementAnalysis arrays
CodeLocation.ts|Object to hold location information of each identifier name to highlight
createProgramFromFiles.ts|Create a program from the given code
editVariable.ts|Reassign existing variables
extension.ts|Main code that runs when extension is activated
getDecorations.ts|Highlights, underlines, colors user's code
getNodePosition.ts|Provides node positions to highlight
logTrace.ts|Trace extension for errors
mapStack.ts|Store variables information into a stack of maps
operations.ts|Operations that the extension can process, used by "processExpression"
processExpression|Process all expressions and return value at the end, for example 3+2 gives 5
VariableStatementAnalysis.ts|Object to hold information about every variable


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
