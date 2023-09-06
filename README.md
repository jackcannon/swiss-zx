# swiss-zx (Swiss Army Knife for zx)

A collection of helper functions and useful little things for Google's zx

Uses `swiss-ak`

<!-- DOCS: TOC START -->

  - [**Table of Contents**](#)
    - [**$$ (double dollar)**](#-double-dollar)
    - [**os**](#os)
    - [**ffmpegTools**](#ffmpegtools)
    - [**gm**](#gm)

<!-- DOCS: TOC END -->

# Install

```bash
npm install swiss-zx
```

or

```bash
yarn add swiss-zx
```

<!-- DOCS: MAIN START -->

## $$ (double dollar)
  - [**$$ (double dollar)**](#-double-dollar)
    - [cd](#cd)
    - [pwd](#pwd)
    - [ls](#ls)
    - [rm](#rm)
    - [mkdir](#mkdir)
    - [cp](#cp)
    - [mv](#mv)
    - [touch](#touch)
    - [cat](#cat)
    - [grep](#grep)
    - [**find**](#find)
      - [FindOptions](#findoptions)
      - [FindType](#findtype)
    - [findDirs](#finddirs)
    - [findFiles](#findfiles)
    - [**findModified**](#findmodified)
      - [ModifiedFile](#modifiedfile)
    - [lastModified](#lastmodified)
    - [rsync](#rsync)
    - [sync](#sync)
    - [isFileExist](#isfileexist)
    - [isDirExist](#isdirexist)
    - [readFile](#readfile)
    - [writeFile](#writefile)
    - [readJSON](#readjson)
    - [writeJSON](#writejson)
    - [pipe](#___pipe)
    - [**exiftool**](#exiftool)
      - [ExifToolAttributesObj](#exiftoolattributesobj)
      - [ExifToolAttributes](#exiftoolattributes)
    - [**utils**](#___utils)
      - [intoLines](#intolines)

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### cd

```typescript
$$.cd;
```

Change the current working directory

```typescript
await $$.pwd(); // '/Users/username'
await $$.cd('./some/folder');
await $$.pwd(); // '/Users/username/some/folder'
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### pwd

```typescript
$$.pwd;
```

Get the current working directory

```typescript
await $$.pwd(); // '/Users/username'
await $$.cd('./some/folder');
await $$.pwd(); // '/Users/username/some/folder'
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### ls

```typescript
$$.ls;
```

Wrapper for ls (list) command

```typescript
await $$.ls('example') // ['a', 'b']
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### rm

```typescript
$$.rm;
```

Wrapper for rm (remove) command

```typescript
await $$.rm('example') // same as $`rm -rf 'example'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### mkdir

```typescript
$$.mkdir;
```

Wrapper for mkdir (make directory) command

```typescript
await $$.mkdir('example') // same as $`mkdir -p 'example'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### cp

```typescript
$$.cp;
```

Wrapper for cp (copy) command

```typescript
await $$.cp('example1', 'example2') // same as $`cp -r 'example1' 'example2'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### mv

```typescript
$$.mv;
```

Wrapper for mv (move) command

```typescript
await $$.mv('example1', 'example2') // same as $`mv 'example1' 'example2'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### touch

```typescript
$$.touch;
```

Wrapper for touch (create blank file) command

```typescript
await $$.touch('example') // same as $`touch 'example'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### cat

```typescript
$$.cat;
```

Wrapper for cat (concatenate) command

```typescript
await $$.cat('example') // same as $`cat 'example'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### grep

```typescript
$$.grep;
```

Wrapper for grep (**G**lobal **R**egular **E**xpression **P**rint) command

```typescript
await $$.grep('example', '.') // same as $`grep 'example' '.'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### find

```typescript
$$.find;
```

Helper function for finding files

```typescript
await $$.find('.', { type: 'f' }) // ['a', 'b']
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

#### FindOptions

```typescript
$$.FindOptions;
```

Options for $$.find (and related other tools)

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

#### FindType

```typescript
$$.FindType;
```

Type of item to find

|   | Description       |
|---|-------------------|
| d | directory         |
| f | regular file      |
| b | block special     |
| c | character special |
| l | symbolic link     |
| p | FIFO              |
| s | socket            |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### findDirs

```typescript
$$.findDirs;
```

Find all directories in a given directory (shallow)

```typescript
await $$.findDirs('.') // ['a', 'b']
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### findFiles

```typescript
$$.findFiles;
```

Find all files in a given directory (shallow)

```typescript
await $$.findFiles('.') // ['a', 'b']
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### findModified

```typescript
$$.findModified;
```

Similar to $$.find, but returns a list of ModifiedFile objects, which includes information on what each item was last modified.

```typescript
await $$.findModified('.')
// [
//   {
//     lastModified: 1689206400000,
//     path: './a.mp4',
//     dir: '.',
//     folders: ['.'],
//     name: 'a',
//     ext: 'mp4',
//     filename: 'a.mp4'
//   }
// ]
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

#### ModifiedFile

```typescript
$$.ModifiedFile;
```

Returned by $$.findModified.

Extends `swiss-node`'s `ExplodedPath`, adding a new `lastModified` number property.

```typescript
{
  lastModified: 1689206400000,
  path: './a.mp4',
  dir: '.',
  folders: ['.'],
  name: 'a',
  ext: 'mp4',
  filename: 'a.mp4'
}
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### lastModified

```typescript
$$.lastModified;
```

Returns the last modified time of a file or files within a directory.

```typescript
await $$.lastModified('a.mp4') // 1689206400000
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### rsync

```typescript
$$.rsync;
```

Wrapper for rsync command

```typescript
await $$.rsync('example1', 'example2') // same as $`rsync -rut 'example1' 'example2'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### sync

```typescript
$$.sync;
```

Helper function for syncing files

```typescript
await $$.sync('example1', 'example2') // same as $`rsync -rut 'example1' 'example2' --delete`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### isFileExist

```typescript
$$.isFileExist;
```

Check if a file exists

```typescript
await $$.isFileExist('example') // true
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### isDirExist

```typescript
$$.isDirExist;
```

Check if a directory exists

```typescript
await $$.isDirExist('example') // true
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### readFile

```typescript
$$.readFile;
```

Read a file's contents

```typescript
await $$.readFile('example') // 'hello world'
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### writeFile

```typescript
$$.writeFile;
```

Write to a file

```typescript
await $$.writeFile('example', 'hello world') // saves a new file called 'example' with the contents 'hello world'
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### readJSON

```typescript
$$.readJSON;
```

Read a JSON file

```typescript
await $$.readJSON('example.json') // { hello: 'world' }
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### writeJSON

```typescript
$$.writeJSON;
```

Write to a JSON file

```typescript
await $$.writeJSON('example.json', { hello: 'world' }) // saves a new file called 'example.json' with the contents {'hello':'world'}
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### <span id="___pipe">pipe</span>

```typescript
$$.pipe;
```

Pipes a series of $ or $$ commands sequentially

```typescript
await $$.pipe([
  () => gm.convert(basePath, gm.PIPE, opts1),
  () => gm.composite(changePath, gm.PIPE, gm.PIPE, changePath, opts2)
]);
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### exiftool

```typescript
$$.exiftool;
```

Usage:
```typescript
$$.exiftool('/path/to/file.jpg', {'Copyright': 'Eg val'});
$$.exiftool('/path/to/file.jpg', {'Copyright': 'Eg val'}, undefined, '/path/to/new_file.jpg');
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

#### ExifToolAttributesObj

```typescript
$$.ExifToolAttributesObj;
```

Interface for the attributes returned by exiftool

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

#### ExifToolAttributes

```typescript
$$.ExifToolAttributes;
```

Type for the names of the attributes returned by exiftool

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### <span id="___utils">utils</span>

#### intoLines

```typescript
$$.utils.intoLines;
```

Turns ProcessOutput into string array, split into lines

```typescript
utils.intoLines($`echo "1\n2\n3"`) // ['1', '2', '3']
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

## os
  - [**os**](#os)
    - [closeFinder](#closefinder)

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### closeFinder

```typescript
closeFinder;
os.closeFinder;
```

Close all Mac OS X Finder windows.

```typescript
await closeFinder();
```

<p style="text-align: right" align="right"><a href="#os"> [↑ Back to <b>os</b> ↑] </a></p>

## ffmpegTools
  - [**ffmpegTools**](#ffmpegtools)
    - [ffmpeg](#ffmpeg)
    - [toFFmpegTimeFormat](#toffmpegtimeformat)
    - [**getProbe**](#getprobe)
      - [ProbeResult](#proberesult)
    - [getProbeValue](#getprobevalue)
    - [getTotalFrames](#gettotalframes)

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### ffmpeg

```typescript
ffmpeg;
ffmpegTools.ffmpeg;
```

Wrapper for ffmpeg command that provides progress bar to track progress

```typescript
const progBarOpts = {}; // Same options as getProgressBar
await ffmpeg(() => $`ffmpeg -y -i ${a} ${b} -progress ${pr}`, pr, framesNum, progBarOpts);
```

<p style="text-align: right" align="right"><a href="#ffmpegtools"> [↑ Back to <b>ffmpegTools</b> ↑] </a></p>

### toFFmpegTimeFormat

```typescript
ffmpegTools.toFFmpegTimeFormat;
```

Convert a number of milliseconds to a time format usable by FFmpeg.

<p style="text-align: right" align="right"><a href="#ffmpegtools"> [↑ Back to <b>ffmpegTools</b> ↑] </a></p>

### getProbe

```typescript
ffmpegTools.getProbe;
```

Get the probe of a file as an object

```typescript
const probe = await getProbe('file.mp4'); // { width: 1280, height: 720, ... }
```

<p style="text-align: right" align="right"><a href="#ffmpegtools"> [↑ Back to <b>ffmpegTools</b> ↑] </a></p>

#### ProbeResult

```typescript
ffmpegTools.ProbeResult;
```

Note: this interface is a guide, and other properties may exist, and some may be have different types

<p style="text-align: right" align="right"><a href="#ffmpegtools"> [↑ Back to <b>ffmpegTools</b> ↑] </a></p>

### getProbeValue

```typescript
ffmpegTools.getProbeValue;
```

Get a value from ffprobe output

```typescript
const probe = await getProbe('file.mp4', 'width'); // '1280'
```

<p style="text-align: right" align="right"><a href="#ffmpegtools"> [↑ Back to <b>ffmpegTools</b> ↑] </a></p>

### getTotalFrames

```typescript
ffmpegTools.getTotalFrames;
```

Get the total number of frames in a video file.

```typescript
const num = await getTotalFrames('video.mp4'); // 120 (2 secs at 60fps)
```

<p style="text-align: right" align="right"><a href="#ffmpegtools"> [↑ Back to <b>ffmpegTools</b> ↑] </a></p>

## gm
  - [**gm**](#gm)
    - [**convert**](#convert)
      - [ConvertFlagsObj](#convertflagsobj)
    - [**composite**](#composite)
      - [CompositeFlagsObj](#compositeflagsobj)
      - [ChangeAndMaskFlags](#changeandmaskflags)
    - [pipe](#gm_pipe)
    - [PIPE](#gm_pipe_constant)
    - [**Types**](#types)
      - [CommonFlagsObj](#commonflagsobj)
      - [FlagsObj](#flagsobj)
      - [channel](#channel)
    - [**utils**](#gm_utils)
      - [flagsObjToArray](#flagsobjtoarray)
      - [channelComposeCopyMap](#channelcomposecopymap)
      - [**supportedFlags**](#supportedflags)
        - [GMCommand](#gmcommand)
        - [SupportedFlag](#supportedflag)

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### convert

```typescript
gm.convert;
```

Wrapper function for gm (GraphicsMagick) convert command

```typescript
const converted = await gm.convert(input, output, {});
```

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

#### ConvertFlagsObj

```typescript
gm.ConvertFlagsObj;
```

Options configuration for the `gm.convert` function

Extends CommonFlagsObj

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

### composite

```typescript
gm.composite;
```

Wrapper function for gm (GraphicsMagick) composite command

Has extra functionality for using a 'Screen' blending mode (similar to Photoshop)

```typescript
const composited = await gm.composite(change, base, out, undefined, {});
```

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

#### CompositeFlagsObj

```typescript
gm.CompositeFlagsObj;
```

Options configuration for the `gm.composite` function

Extends CommonFlagsObj

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

#### ChangeAndMaskFlags

```typescript
gm.ChangeAndMaskFlags;
```

If compositing with a mask, you can specify the change and mask flags separately

```typescript
{
  change?: CompositeFlagsObj;
  mask?: CompositeFlagsObj;
}
```

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

### <span id="gm_pipe">pipe</span>

```typescript
gm.pipe;
```

Pipe a series of gm commands together

```typescript
await pipe(basePath, outPath, [
  (p) => convert(p, p, opts1),
  (p) => composite(changePath, p, p, changePath, opts2)
]);
```

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

### <span id="gm_pipe_constant">PIPE</span>

```typescript
gm.PIPE;
```

A shortcut constant for the GraphicsMagick pipe path which is `MIFF:-`

This can be used in place any path parameter to pipe the result of a gm command to another gm command

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

### Types

#### CommonFlagsObj

```typescript
gm.CommonFlagsObj;
```

Option configuration options that are common to both `gm.convert` and `gm.composite`

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

#### FlagsObj

```typescript
gm.FlagsObj;
```

`ConvertFlagsObj & CompositeFlagsObj`

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

#### channel

```typescript
gm.channel;
```

`'red' | 'green' | 'blue' | 'cyan' | 'magenta' | 'yellow' | 'black' | 'opacity' | 'gray' | 'matte'`

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

### <span id="gm_utils">utils</span>

#### flagsObjToArray

```typescript
gm.utils.flagsObjToArray;
```

Converts a FlagsObj to an array of flags and values (for zx).

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

#### channelComposeCopyMap

```typescript
gm.utils.channelComposeCopyMap;
```

A dictionary for mapping channel names to their respective compose copy names.

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

#### supportedFlags

```typescript
gm.utils.supportedFlags;
```

An object containing the supported flags and their types (or options).

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

##### GMCommand

```typescript
gm.utils.GMCommand;
```

An internal string indictor for which gm command to use.

Only used in configuration for `gm.utils.SupportedFlag`.

```typescript
'convert' | 'composite'
```

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

##### SupportedFlag

```typescript
gm.utils.SupportedFlag;
```

An internal configuration object for a supported flag.

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

<!-- DOCS: MAIN END -->
