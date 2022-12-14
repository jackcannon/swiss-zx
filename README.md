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
- [os](#os)
  - [closeFinder](#closefinder)
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

# os

## closeFinder

Close all Mac OS X Finder windows.

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
