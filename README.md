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
  - [ask.select](#askselect)
  - [ask.multiselect](#askmultiselect)
  - [ask.validate](#askvalidate)
  - [ask.imitate](#askimitate)
  - [ask.loading](#askloading)
  - [ask.pause](#askpause)
  - [ask.countdown](#askcountdown)
  - [ask.rename](#askrename)
  - [ask.fileExplorer](#askfileexplorer)
- [out](#out)
  - [out.pad](#outpad)
  - [out.center](#outcenter)
  - [out.left](#outleft)
  - [out.right](#outright)
  - [out.wrap](#outwrap)
  - [out.moveUp](#outmoveup)
  - [out.loading](#outloading)
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
- [lineCounter](#linecounter)
  - [getLineCounter](#getlinecounter)
    - [lc.log](#lclog)
    - [lc.wrap](#lcwrap)
    - [lc.add](#lcadd)
    - [lc.get](#lcget)
    - [lc.clear](#lcclear)
- [ffmpeg](#ffmpeg)
  - [getProbeValue](#getprobevalue)
  - [getProbe](#getprobe)
  - [getTotalFrames](#gettotalframes)
  - [ffmpeg](#ffmpeg-1)
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
- [printTable](#printtable)
  - [printTable](#printtable-1)
    - [printTable Options](#printtable-options)

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

## find Options

| Name                  | Required | Example      | Description                                                                                                                                                |
| --------------------- | :------: | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                  |    ✖     | `'f'`        | Type of item to find<br><br>d = directory<br>f = regular file<br>b = block special<br>c = character special<br>l = symbolic link<br>p = FIFO<br>s = socket |
| maxdepth              |    ✖     | `1`          | Maximum depth to search                                                                                                                                    |
| name                  |    ✖     | `'file.png'` | Name of file/directory to find                                                                                                                             |
| regex                 |    ✖     | `.*file.*`   | Regular expression to match                                                                                                                                |
| removePath            |    ✖     | `false`      | If true, removes the path from the result (so you just get the file/directory name)                                                                        |
| contentsOnly          |    ✖     | `false`      | If true, removes trailing slashes from the results.                                                                                                        |
| removeTrailingSlashes |    ✖     | `false`      | If true, includes files that start with a dot.                                                                                                             |

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
center('foo', 10); // '   foo    '
center('something long', 10); // 'something long'
center('lines\n1\n3', 5);
// 'lines' +
// '  1  ' +
// '  2  '
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.left

Align the given text to the left within the given width of characters/columns

```typescript
left('foo', 10); // 'foo       '
left('something long', 10); // 'something long'
left('lines\n1\n3', 5);
// 'lines' +
// '1    ' +
// '2    '
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.right

Align the given text to the right within the given width of characters/columns

```typescript
right('foo', 10); // '       foo'
right('something long', 10); // 'something long'
right('lines\n1\n3', 5);
// 'lines' +
// '    1' +
// '    2'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

## out.wrap

Wrap the given text to the given width of characters/columns

```typescript
wrap('This is a sentence', 15);
// 'This is' +
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

# lineCounter

## getLineCounter

Get line counter for counter output lines

```typescript
const lc = getLineCounter();
lc.log('hello'); // 1
lc.wrap(undefined, () => printTable(['hello', 'world'])); // 1
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

Wrapper for ffmpeg command

```typescript
const progBarOpts = {}; // Same options as getProgressBar
await ffmpeg(() => $`ffmpeg -y -i ${a} ${b} -progress ${pr}`, pr, framesNum, progBarOpts);
```

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

- dir: the directory path of the given path
- name: the name of the file, not including the extension
- ext: the extension of the file, not including the dot
- filename: the full name of the file, including the extension (and dot)

```typescript
const { dir, name, ext, filename } = explodePath('/path/to/file.txt');

console.log(dir); // '/path/to'
console.log(name); // 'file'
console.log(ext); // 'txt'
console.log(filename); // 'file.txt'
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

# printTable

## printTable

Print a table

```typescript
const header = [['Name', 'Age']];
const body = [
  ['John', '25'],
  ['Jane', '26']
];
printTable(body, header);

// ┏━━━━━━┳━━━━━┓
// ┃ Name ┃ Age ┃
// ┡━━━━━━╇━━━━━┩
// │ John │ 25  │
// │ Jane │ 26  │
// └──────┴─────┘
```

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)

### printTable Options

| Name            | Default              | Description                                                  |
| --------------- | -------------------- | ------------------------------------------------------------ |
| wrapperFn       | `fn.noact`           | Function to wrap each line of the table in (e.g. chalk.blue) |
| overrideChar    | `''` (`─`, `│`, etc) | Character to use instead of lines                            |
| overrideHorChar | `''` (`─`)           | Character to use instead of horizontal lines                 |
| overrideVerChar | `''` (`│`)           | Character to use instead of vertical lines                   |
| drawOuter       | `true`               | Whether to draw the outer border of the table                |

[↑ Back to top ↑](#swiss-zx-swiss-army-knife-for-zx)
