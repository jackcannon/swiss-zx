# swiss-zx (Swiss Army Knife for zx)

A collection of helper functions and useful little things for Google's zx

Uses `swiss-ak`

- [swiss-zx (Swiss Army Knife for zx)](#swiss-zx-swiss-army-knife-for-zx)
- [Install](#install)
- [$$ (double dollar)](#-double-dollar)
  - [$$.utils.intoLines](#utilsintolines)
  - [$$.utils.removeTrailSlash](#utilsremovetrailslash)
  - [$$.utils.trailSlash](#utilstrailslash)
  - [$$.utils.removeDoubleSlashes](#utilsremovedoubleslashes)
  - [$$.ls](#ls)
  - [$$.rm](#rm)
  - [$$.mkdir](#mkdir)
  - [$$.cp](#cp)
  - [$$.mv](#mv)
  - [$$.touch](#touch)
  - [$$.cat](#cat)
  - [$$.grep](#grep)
  - [$$.find](#find)
    - [find Options](#find-options)
  - [$$.findDirs](#finddirs)
  - [$$.findFiles](#findfiles)
  - [$$.rsync](#rsync)
  - [$$.sync](#sync)
  - [$$.isFileExist](#isfileexist)
  - [$$.isDirExist](#isdirexist)
  - [$$.readFile](#readfile)
  - [$$.writeFile](#writefile)
  - [$$.readJSON](#readjson)
  - [$$.writeJSON](#writejson)
- [ask](#ask)
  - [ask.text](#asktext)
  - [ask.autotext](#askautotext)
  - [ask.number](#asknumber)
  - [ask.boolean](#askboolean)
  - [ask.booleanAlt](#askbooleanalt)
  - [ask.select](#askselect)
  - [ask.multiselect](#askmultiselect)
  - [ask.crud](#askcrud)
  - [ask.validate](#askvalidate)
  - [ask.imitate](#askimitate)
  - [ask.prefill](#askprefill)
  - [ask.loading](#askloading)
  - [ask.pause](#askpause)
  - [ask.countdown](#askcountdown)
  - [ask.rename](#askrename)
  - [ask.fileExplorer](#askfileexplorer)
  - [ask.multiFileExplorer](#askmultifileexplorer)
  - [ask.section](#asksection)
  - [ask.utils](#askutils)
    - [ask.utils.itemsToPromptObjects](#askutilsitemstopromptobjects)
- [Breadcrumb](#breadcrumb)
  - [getBreadcrumb](#getbreadcrumb)
- [out](#out)
  - [out.pad](#outpad)
  - [out.center](#outcenter)
  - [out.left](#outleft)
  - [out.right](#outright)
  - [out.justify](#outjustify)
  - [out.align](#outalign)
  - [out.wrap](#outwrap)
  - [out.moveUp](#outmoveup)
  - [out.loading](#outloading)
  - [out.limitToLength](#outlimittolength)
  - [out.truncate](#outtruncate)
  - [out.utils](#oututils)
    - [out.utils.getTerminalWidth](#oututilsgetterminalwidth)
    - [out.utils.getLines](#oututilsgetlines)
    - [out.utils.getNumLines](#oututilsgetnumlines)
    - [out.utils.getLinesWidth](#oututilsgetlineswidth)
    - [out.utils.getLogLines](#oututilsgetloglines)
    - [out.utils.getNumLogLines](#oututilsgetnumloglines)
    - [out.utils.getLogLinesWidth](#oututilsgetloglineswidth)
    - [out.utils.joinLines](#oututilsjoinlines)
    - [out.utils.hasColor](#oututilshascolor)
- [table](#table)
  - [table.print](#tableprint)
    - [table.print Options](#tableprint-options)
  - [table.printObjects](#tableprintobjects)
  - [table.utils](#tableutils)
    - [table.utils.objectsToTable](#tableutilsobjectstotable)
    - [table.utils.transpose](#tableutilstranspose)
    - [table.utils.concatRows](#tableutilsconcatrows)
- [os](#os)
  - [closeFinder](#closefinder)
- [chlk](#chlk)
  - [gray0](#gray0)
  - [gray1](#gray1)
  - [gray2](#gray2)
  - [gray3](#gray3)
  - [gray4](#gray4)
  - [gray5](#gray5)
  - [grays](#grays)
  - [gray](#gray)
- [clr](#clr)
- [lineCounter](#linecounter)
  - [getLineCounter](#getlinecounter)
    - [lc.log](#lclog)
    - [lc.wrap](#lcwrap)
    - [lc.add](#lcadd)
    - [lc.get](#lcget)
    - [lc.clear](#lcclear)
    - [lc.clearBack](#lcclearback)
    - [lc.checkpoint](#lccheckpoint)
    - [lc.clearToCheckpoint](#lccleartocheckpoint)
- [ffmpeg](#ffmpeg)
  - [getProbeValue](#getprobevalue)
  - [getProbe](#getprobe)
  - [getTotalFrames](#gettotalframes)
  - [ffmpeg](#ffmpeg-1)
  - [toFFmpegTimeFormat](#toffmpegtimeformat)
- [gm](#gm)
  - [gm.convert](#gmconvert)
  - [gm.composite](#gmcomposite)
  - [gm.ask](#gmask)
    - [gm.ask.flags](#gmaskflags)
  - [gm.utils](#gmutils)
    - [gm.utils.supportedFlags](#gmutilssupportedflags)
    - [gm.utils.printFlagsTable](#gmutilsprintflagstable)
    - [gm.utils.flagsObjToArray](#gmutilsflagsobjtoarray)
- [LogUtils](#logutils)
  - [LogUtils.getLogStr](#logutilsgetlogstr)
  - [LogUtils.processLogContents](#logutilsprocesslogcontents)
  - [LogUtils.getLog](#logutilsgetlog)
- [PathUtils](#pathutils)
  - [explodePath](#explodepath)
- [progressBarUtils](#progressbarutils)
  - [getColouredProgressBarOpts](#getcolouredprogressbaropts)

# Install

```bash
npm install swiss-ak swiss-zx
```

or

```bash
yarn add swiss-ak swiss-zx
```

# $$ (double dollar)

## $$.utils.intoLines

Turns ProcessOutput into string array, split into lines

```typescript
$$.utils.intoLines($`echo "1\n2\n3"`); // ['1', '2', '3']
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.utils.removeTrailSlash

Remove trailing slash from path (if one exists)

```typescript
'/path/to/file/' -> '/path/to/file'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.utils.trailSlash

Ensures there's a trailing slash on path

```typescript
'/path/to/file' -> '/path/to/file/'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.utils.removeDoubleSlashes

Removes double slashes from path (an bug with Unix paths)

```typescript
'/path/to//file' -> '/path/to/file'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.ls

Wrapper for ls (list) command

```typescript
await $$.ls('example'); // ['a', 'b']
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.rm

Wrapper for rm (remove) command

```typescript
await $$.rm('example'); // same as $`rm -rf 'example'`
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.mkdir

Wrapper for mkdir (make directory) command

```typescript
await $$.mkdir('example'); // same as $`mkdir -p 'example'`
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.cp

Wrapper for cp (copy) command

```typescript
await $$.cp('example1', 'example2'); // same as $`cp -r 'example1' 'example2'`
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.mv

Wrapper for mv (move) command

```typescript
await $$.mv('example1', 'example2'); // same as $`mv 'example1' 'example2'`
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.touch

Wrapper for touch (create blank file) command

```typescript
await $$.touch('example'); // same as $`touch 'example'`
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.cat

Wrapper for cat (concatenate) command

```typescript
await $$.cat('example'); // same as $`cat 'example'`
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.grep

Wrapper for grep (**G**lobal **R**egular **E**xpression **P**rint) command

```typescript
await $$.grep('example', '.'); // same as $`grep 'example' '.'`
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.find

Helper function for finding files

```typescript
await $$.find('.', { type: 'f' }); // ['a', 'b']
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### find Options

| Name                  | Required | Example      | Description                                                                                                                                                             |
| --------------------- | :------: | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                  |    ✖     | `'f'`        | Type of item to find<br><br>d = directory<br>f = regular file<br>b = block special<br>c = character special<br>l = symbolic link<br>p = FIFO<br>s = socket              |
| maxdepth              |    ✖     | `1`          | Maximum depth to search                                                                                                                                                 |
| name                  |    ✖     | `'file.png'` | Name of file/directory to find                                                                                                                                          |
| regex                 |    ✖     | `.*file.*`   | Regular expression to match<br><br>**IMPORTANT:** use String.raw to make sure the backslashes are escaped<br><br>`` const regex = String.raw`^.*\.js$` // '^.*\.js$' `` |
| removePath            |    ✖     | `false`      | If true, removes the path from the result (so you just get the file/directory name)                                                                                     |
| contentsOnly          |    ✖     | `false`      | If true, removes trailing slashes from the results.                                                                                                                     |
| removeTrailingSlashes |    ✖     | `false`      | If true, includes files that start with a dot.                                                                                                                          |

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.findDirs

Find all directories in a given directory (shallow)

```typescript
await $$.findDirs('.'); // ['a', 'b']
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.findFiles

Find all files in a given directory (shallow)

```typescript
await $$.findFiles('.'); // ['a', 'b']
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.rsync

Wrapper for rsync command

```typescript
await $$.rsync('example1', 'example2'); // same as $`rsync -crut 'example1' 'example2'`
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.sync

Helper function for syncing files

```typescript
await $$.sync('example1', 'example2'); // same as $`rsync -crut 'example1' 'example2' --delete`
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.isFileExist

Check if a file exists

```typescript
await $$.isFileExist('example'); // true
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.isDirExist

Check if a directory exists

```typescript
await $$.isDirExist('example'); // true
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.readFile

Read a file's contents

```typescript
await $$.readFile('example'); // 'hello world'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.writeFile

Write to a file

```typescript
await $$.writeFile('example', 'hello world'); // saves a new file called 'example' with the contents 'hello world'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.readJSON

Read a JSON file

```typescript
await $$.readJSON('example.json'); // { hello: 'world' }
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## $$.writeJSON

Write to a JSON file

```typescript
await $$.writeJSON('example.json', { hello: 'world' }); // saves a new file called 'example.json' with the contents {'hello':'world'}
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# ask

A collection of user input functions that use the `prompts` library

## ask.text

Get a text input from the user.

```typescript
const name = await ask.text('What is your name?'); // 'Jack'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.autotext

Get a text input from the user, with auto-completion.

```typescript
const name = await ask.autotext('What is your name?', ['Jack', 'Jane', 'Joe']); // 'Jack'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.number

Get a number input from the user.

```typescript
const age = await ask.number('How old are you?'); // 30
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.boolean

Get a boolean input from the user (yes or no)

```typescript
const isCool = await ask.boolean('Is this cool?'); // true
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.booleanAlt

Get a boolean input from the user (yes or no)

Alternative interface to ask.boolean

```typescript
const isCool = await ask.boolean('Is this cool?'); // true
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.select

Get the user to select an option from a list.

```typescript
const colour = await ask.select('Whats your favourite colour?', ['red', 'green', 'blue']); // 'red'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.multiselect

Get the user to select multiple options from a list.

```typescript
const colours = await ask.multiselect('Whats your favourite colours?', ['red', 'green', 'blue']); // ['red', 'green']
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.crud

Get the user to select a CRUD (**C**reate, **R**ead, **U**pdate and **D**elete) action

Values returned are: 'none' | 'create' | 'update' | 'delete' | 'delete-all'

```typescript
const action = await ask.crud('What do you want to do next?'); // 'none'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.validate

Validate the result of an `ask` prompt

```typescript
const name = await ask.validate(
  () => ask.text('What is your name?'),
  (name) => name.length > 0
); // 'Jack'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.imitate

Imitate the display of a prompt

```typescript
ask.imitate(true, 'What is your name?', 'Jack');
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.prefill

Auto-fills an ask prompt with the provided value, if defined.

Continues to display the 'prompt', but already 'submitted'

Good for keeping skipping parts of forms, but providing context and keeping display consistent

```typescript
let data = {};
const name1 = ask.prefill(data.name, 'What is your name?', ask.text); // User input

data = { name: 'Jack' };
const name2 = ask.prefill(data.name, 'What is your name?', ask.text); // Jack
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.loading

Display an animated loading indicator that imitates the display of a prompt

```typescript
const loader = ask.loading('What is your name?');
// ...
loader.stop();
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.pause

Pause the program until the user presses enter

```typescript
await ask.pause();
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.countdown

Animated countdown for a given number of seconds

```typescript
await ask.countdown(5);
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.rename

Ask the user to rename a file or directory

```typescript
await ask.rename('/path/to/file.txt', '/path/to/new-file.txt');
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.fileExplorer

Get a file from the user

```typescript
const file = await ask.fileExplorer('Select a file');
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.multiFileExplorer

Like fileExplorer but allows multiple selections within a single directory

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.section

Allows information to be displayed before a question, and follow up questions to be asked, while only leaving the 'footprint' of a single question afterwards.

```typescript
const ans1 = await ask.text('Question 1:');
const ans2 = await ask.section(
  'Question 2:',
  (lc: LineCounter) => {
    lc.log('Some information');
  },
  (qst) => ask.text(qst),
  () => ask.text('Question 2b:')
);
```

During the section, it looks like this:

```
Question 1: answer1
┄┄┄┄┄◦┄┄┄┄┄┄┄◦┄┄┄┄┄┄┄◦┄┄┄┄┄┄┄◦┄┄┄┄┄┄
Some information
┄┄┄┄┄◦┄┄┄┄┄┄┄◦┄┄┄┄┄┄┄◦┄┄┄┄┄┄┄◦┄┄┄┄┄┄
Question 2: answer2
Question 2b: answer2b
```

After the last question in the section has been submitted, it looks like this:

```
Question 1: answer1
Question 2a: [ answer2, answer2b ]
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ask.utils

### ask.utils.itemsToPromptObjects

Take an array of items and convert them to an array of prompt objects

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# Breadcrumb

Provides a consistent format and style for questions/prompts

```typescript
const bread = getBreadcrumb();
bread(); // ''
bread('a'); // 'a'
bread('a', 'b'); // 'a › b'
bread('a', 'b', 'c'); // 'a › b › c'

const sub = bread.sub('a', 'b');
sub(); // 'a › b'
sub('c'); // 'a › b › c'
sub('c', 'd'); // 'a › b › c › d'

const subsub = sub.sub('c', 'd');
subsub(); // 'a › b › c › d'
subsub('e'); // 'a › b › c › d › e'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## getBreadcrumb

Returns an empty breadcrumb object

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# out

## out.pad

Pad before and after the given text with the given character.

```typescript
pad('foo', 3, 1, '-'); // '---foo-'
pad('bar', 10, 5, '_'); // '__________bar_____'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.center

Align the given text to the center within the given width of characters/columns

```typescript
out.center('foo', 10); // '   foo    '
out.center('something long', 10); // 'something long'
out.center('lines\n1\n2', 5);
// 'lines' + '\n' +
// '  1  ' + '\n' +
// '  2  '
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.left

Align the given text to the left within the given width of characters/columns

```typescript
out.left('foo', 10); // 'foo       '
out.left('something long', 10); // 'something long'
out.left('lines\n1\n2', 5);
// 'lines' + '\n' +
// '1    ' + '\n' +
// '2    '
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.right

Align the given text to the right within the given width of characters/columns

```typescript
out.right('foo', 10); // '       foo'
out.right('something long', 10); // 'something long'
out.right('lines\n1\n2', 5);
// 'lines' + '\n' +
// '    1' + '\n' +
// '    2'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.justify

Evenly space the text horizontally across the given width.

Giving a width of 0 will use the terminal width

```typescript
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
out.justify(out.wrap(lorem, 20), 20);
// 'Lorem  ipsum   dolor' + '\n' +
// 'sit            amet,' + '\n' +
// 'consectetur         ' + '\n' +
// 'adipiscing      elit'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.align

Align the given text to the given alignment within the given width of characters/columns

Giving a width of 0 will use the terminal width

```typescript
out.align('foo', 'left', 10); // 'foo       '
out.align('something long', 'center', 10); // 'something long'
out.align('lines\n1\n2', 'right', 5);
// 'lines' + '\n' +
// '    1' + '\n' +
// '    2'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.wrap

Wrap the given text to the given width of characters/columns

```typescript
wrap('This is a sentence', 15);
// 'This is' + '\n' +
// 'a sentence'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.moveUp

Move the terminal cursor up X lines, clearing each row.

Useful for replacing previous lines of output

```typescript
moveUp(1);
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.loading

Display an animated loading indicator

```typescript
const loader = out.loading();
// Loading...
loader.stop();
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.limitToLength

Limit the length of a string to the given length

```typescript
out.limitToLength('This is a very long sentence', 12); // 'This is a ve'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.truncate

Limit the length of a string to the given length, and add an ellipsis if necessary

```typescript
out.truncate('This is a very long sentence', 15); // 'This is a ve...'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.utils

### out.utils.getTerminalWidth

Get maximum terminal width (columns)

```typescript
print.utils.getTerminalWidth(); // 127
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### out.utils.getLines

Split multi-line text into an array of lines

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### out.utils.getNumLines

Get how many lines a string or array of lines has

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### out.utils.getLinesWidth

Get how wide a string or array of lines has

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### out.utils.getLogLines

Split a log-formatted multi-line text into an array of lines

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### out.utils.getNumLogLines

Get how many lines a log-formatted string or array of lines has

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### out.utils.getLogLinesWidth

Get how wide a log-formatted string or array of lines has

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### out.utils.joinLines

Join an array of lines into a single multi-line string

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### out.utils.hasColor

Determine whether a given string contains any chalk-ed colours

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# table

## table.print

Print a table

```typescript
const header = [['Name', 'Age']];
const body = [
  ['John', '25'],
  ['Jane', '26']
];
table.print(body, header);

// ┏━━━━━━┳━━━━━┓
// ┃ Name ┃ Age ┃
// ┡━━━━━━╇━━━━━┩
// │ John │ 25  │
// │ Jane │ 26  │
// └──────┴─────┘
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### table.print Options

| Name            | Default              | Description                                                                |
| --------------- | -------------------- | -------------------------------------------------------------------------- |
| wrapperFn       | `fn.noact`           | Function to wrap each line of the table in (e.g. chalk.blue)               |
| overrideChar    | `''` (`─`, `│`, etc) | Character to use instead of lines                                          |
| overrideHorChar | `''` (`─`)           | Character to use instead of horizontal lines                               |
| overrideVerChar | `''` (`│`)           | Character to use instead of vertical lines                                 |
| drawOuter       | `true`               | Whether to draw the outer border of the table                              |
| drawRowLines    | `true`               | Whether to draw lines between rows (other than separating header and body) |
| drawColLines    | `true`               | Whether to draw lines between columns                                      |
| colWidths       | `[]`                 | Preferred width (in number of characters) of each column                   |
| align           | `'left'`             | How the table should be aligned on the screen                              |
| alignCols       | `['left']`           | How each column should be aligned (values repeated for all columns)        |
| transpose       | `false`              | Change rows into columns and vice versa                                    |
| transposeBody   | `false`              | Change rows into columns and vice versa (body only)                        |
| margin          | `0`                  | How much spacing to leave around the outside of the table                  |

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## table.printObjects

Print a table of given objects

```typescript
const objs = [
  // objs
  { a: '1', b: '2', c: '3' },
  { a: '0', c: '2' },
  { b: '4' },
  { a: '6' }
];
const header = {
  a: 'Col A',
  b: 'Col B',
  c: 'Col C'
};
const options = {}; // same as table.print options
table.printObjects(objs, header, options);

// ┏━━━━━━━┳━━━━━━━┳━━━━━━━┓
// ┃ Col A ┃ Col B ┃ Col C ┃
// ┡━━━━━━━╇━━━━━━━╇━━━━━━━┩
// │ 1     │ 2     │ 3     │
// ├───────┼───────┼───────┤
// │ 0     │       │ 2     │
// ├───────┼───────┼───────┤
// │       │ 4     │       │
// ├───────┼───────┼───────┤
// │ 6     │       │       │
// └───────┴───────┴───────┘
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## table.utils

### table.utils.objectsToTable

Process an array of objects into a table format (string[][])

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### table.utils.transpose

Change rows into columns and vice versa

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### table.utils.concatRows

Concatenate header and body rows into one list of rows

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# os

## closeFinder

Close all Mac OS X Finder windows.

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# chlk

A few renames of chalk colours

## gray0

Gray 0 (0-5). Equivalent to chalk.black

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## gray1

Gray 1 (0-5). Equivalent to chalk.gray.dim

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## gray2

Gray 2 (0-5). Equivalent to chalk.white.dim

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## gray3

Gray 3 (0-5). Equivalent to chalk.whiteBright.dim

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## gray4

Gray 4 (0-5). Equivalent to chalk.white

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## gray5

Gray 5 (0-5). Equivalent to chalk.whiteBright

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## grays

Grays between 0 and 5.

```typescript
grays[2]; // gray2
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## gray

Grays between 0 and 5.

```typescript
gray(2); // gray2
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# clr

A collection of shortcuts and aliases for chalk functions

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# lineCounter

## getLineCounter

Get line counter for counter output lines

```typescript
const lc = getLineCounter();
lc.log('hello'); // 1
lc.wrap(undefined, () => table.print(['hello', 'world'])); // 1
lc.add(1); // 3
lc.get(); // 3
lc.clear(); // 0
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### lc.log

Same as console.log, but adds to the lc counter

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### lc.wrap

Wraps a function, and adds a given number (of the result of the function) to the line counter

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### lc.add

Adds a given number to the line counter

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### lc.get

returns the line counter

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### lc.clear

clears the line counter, and moves the cursor up by the value of the line counter

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### lc.clearBack

Clears a given number of lines, and updates the line counter

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### lc.checkpoint

Records a 'checkpoint' that can be returned to later

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### lc.clearToCheckpoint

Clear lines up to a previously recorded checkpoint

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# ffmpeg

## getProbeValue

Get a value from ffprobe output

```typescript
const probe = await getProbe('file.mp4', 'width'); // '1280'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## getProbe

Get the probe of a file as an object

```typescript
const probe = await getProbe('file.mp4'); // { width: 1280, height: 720, ... }
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## getTotalFrames

Get the total number of frames in a video file.

```typescript
const num = await getTotalFrames('video.mp4'); // 120 (2 secs at 60fps)
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## ffmpeg

Wrapper for ffmpeg command that provides progress bar to track progress

```typescript
const progBarOpts = {}; // Same options as getProgressBar
await ffmpeg(() => $`ffmpeg -y -i ${a} ${b} -progress ${pr}`, pr, framesNum, progBarOpts);
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## toFFmpegTimeFormat

Convert a number of milliseconds to a time format usable by FFmpeg.

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# gm

## gm.convert

Wrapper function for gm (GraphicsMagick) convert command

```typescript
const converted = await gm.convert(input, output, {});
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## gm.composite

Wrapper function for gm (GraphicsMagick) composite command

Has extra functionality for using a 'Screen' blending mode (similar to Photoshop)

```typescript
const composited = await gm.composite(change, base, out, undefined, {});
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## gm.ask

### gm.ask.flags

Advanced input for choosing which flags to use.

```typescript
const flags = await gm.ask.flags('example');
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## gm.utils

### gm.utils.supportedFlags

An object containing the supported flags and their types (or options).

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### gm.utils.printFlagsTable

Prints a table of flags and their values.

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### gm.utils.flagsObjToArray

Converts a FlagsObj to an array of flags and values (for zx).

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# LogUtils

## LogUtils.getLogStr

Get a string for a given object as it would be printed by console.log

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## LogUtils.processLogContents

Process an item to be logged

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## LogUtils.getLog

Get a log function for a given prefix

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# PathUtils

## explodePath

'Explodes' a path into its components

- path: The full original path as it was passed in.
- dir: the directory path of the given path
- folders: the ancestral folders of the given dir as an array
- name: the name of the file, not including the extension
- ext: the extension of the file, not including the dot
- filename: the full name of the file, including the extension (and dot)

```typescript
const { path, dir, folders, name, ext, filename } = explodePath('/path/to/file.txt');

console.log(path); // '/path/to/file.txt'
console.log(dir); // '/path/to'
console.log(folders); // [ 'path', 'to' ]
console.log(name); // 'file'
console.log(ext); // 'txt'
console.log(filename); // 'file.txt'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# progressBarUtils

## getColouredProgressBarOpts

Helper for providing a consistent set of options for a progress bar, and colouring them appropriately

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)
