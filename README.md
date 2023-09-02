# swiss-zx (Swiss Army Knife for zx)

A collection of helper functions and useful little things for Google's zx

Uses `swiss-ak`

<!-- DOCS: TOC START -->

  - [**Table of Contents**](#)
    - [**$$ (double dollar)**](#-double-dollar)
    - [**Exif**](#exif)
    - [**os**](#os)
    - [**ffmpeg**](#ffmpeg)
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
    - [find](#find)
    - [findDirs](#finddirs)
    - [findFiles](#findfiles)
    - [rsync](#rsync)
    - [sync](#sync)
    - [isFileExist](#isfileexist)
    - [isDirExist](#isdirexist)
    - [readFile](#readfile)
    - [writeFile](#writefile)
    - [readJSON](#readjson)
    - [writeJSON](#writejson)
    - [**utils**](#___utils)
      - [intoLines](#intolines)

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### cd
Change the current working directory

```typescript
await $$.pwd(); // '/Users/username'
await $$.cd('./some/folder');
await $$.pwd(); // '/Users/username/some/folder'
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### pwd
Get the current working directory

```typescript
await $$.pwd(); // '/Users/username'
await $$.cd('./some/folder');
await $$.pwd(); // '/Users/username/some/folder'
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### ls
Wrapper for ls (list) command

```typescript
await $$.ls('example') // ['a', 'b']
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### rm
Wrapper for rm (remove) command

```typescript
await $$.rm('example') // same as $`rm -rf 'example'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### mkdir
Wrapper for mkdir (make directory) command

```typescript
await $$.mkdir('example') // same as $`mkdir -p 'example'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### cp
Wrapper for cp (copy) command

```typescript
await $$.cp('example1', 'example2') // same as $`cp -r 'example1' 'example2'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### mv
Wrapper for mv (move) command

```typescript
await $$.mv('example1', 'example2') // same as $`mv 'example1' 'example2'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### touch
Wrapper for touch (create blank file) command

```typescript
await $$.touch('example') // same as $`touch 'example'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### cat
Wrapper for cat (concatenate) command

```typescript
await $$.cat('example') // same as $`cat 'example'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### grep
Wrapper for grep (**G**lobal **R**egular **E**xpression **P**rint) command

```typescript
await $$.grep('example', '.') // same as $`grep 'example' '.'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### find
Helper function for finding files

```typescript
await $$.find('.', { type: 'f' }) // ['a', 'b']
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### findDirs
Find all directories in a given directory (shallow)

```typescript
await $$.findDirs('.') // ['a', 'b']
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### findFiles
Find all files in a given directory (shallow)

```typescript
await $$.findFiles('.') // ['a', 'b']
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### rsync
Wrapper for rsync command

```typescript
await $$.rsync('example1', 'example2') // same as $`rsync -rut 'example1' 'example2'`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### sync
Helper function for syncing files

```typescript
await $$.sync('example1', 'example2') // same as $`rsync -rut 'example1' 'example2' --delete`
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### isFileExist
Check if a file exists

```typescript
await $$.isFileExist('example') // true
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### isDirExist
Check if a directory exists

```typescript
await $$.isDirExist('example') // true
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### readFile
Read a file's contents

```typescript
await $$.readFile('example') // 'hello world'
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### writeFile
Write to a file

```typescript
await $$.writeFile('example', 'hello world') // saves a new file called 'example' with the contents 'hello world'
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### readJSON
Read a JSON file

```typescript
await $$.readJSON('example.json') // { hello: 'world' }
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### writeJSON
Write to a JSON file

```typescript
await $$.writeJSON('example.json', { hello: 'world' }) // saves a new file called 'example.json' with the contents {'hello':'world'}
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### <span id="___utils">utils</span>

#### intoLines
Turns ProcessOutput into string array, split into lines

```typescript
utils.intoLines($`echo "1\n2\n3"`) // ['1', '2', '3']
```

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

## Exif
  - [**Exif**](#exif)
    - [**exiftool**](#exiftool)
      - [ExifToolAttributesObj](#exiftoolattributesobj)
      - [ExifToolAttributes](#exiftoolattributes)

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### exiftool
Usage:
```typescript
$$.exiftool('/path/to/file.jpg', {'Copyright': 'Eg val'});
$$.exiftool('/path/to/file.jpg', {'Copyright': 'Eg val'}, undefined, '/path/to/new_file.jpg');
```

<p style="text-align: right" align="right"><a href="#exif"> [↑ Back to <b>Exif</b> ↑] </a></p>

#### ExifToolAttributesObj
Interface for the attributes returned by exiftool

<p style="text-align: right" align="right"><a href="#exif"> [↑ Back to <b>Exif</b> ↑] </a></p>

#### ExifToolAttributes
Type for the names of the attributes returned by exiftool

<p style="text-align: right" align="right"><a href="#exif"> [↑ Back to <b>Exif</b> ↑] </a></p>

## os
  - [**os**](#os)
    - [closeFinder](#closefinder)

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### closeFinder

```typescript
closeFinder;
```

Close all Mac OS X Finder windows.

```typescript
await closeFinder();
```

<p style="text-align: right" align="right"><a href="#os"> [↑ Back to <b>os</b> ↑] </a></p>

## <span id="ffmpeg">ffmpeg</span>
  - [**ffmpeg**](#ffmpeg)
    - [toFFmpegTimeFormat](#toffmpegtimeformat)
    - [getProbeValue](#getprobevalue)
    - [ProbeResult](#proberesult)
    - [getProbe](#getprobe)
    - [getTotalFrames](#gettotalframes)
    - [ffmpeg](#ffmpeg_ffmpeg)

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### toFFmpegTimeFormat
Convert a number of milliseconds to a time format usable by FFmpeg.

<p style="text-align: right" align="right"><a href="#ffmpeg"> [↑ Back to <b>ffmpeg</b> ↑] </a></p>

### getProbeValue
Get a value from ffprobe output

```typescript
const probe = await getProbe('file.mp4', 'width'); // '1280'
```

<p style="text-align: right" align="right"><a href="#ffmpeg"> [↑ Back to <b>ffmpeg</b> ↑] </a></p>

### ProbeResult
Note: this interface is a guide, and other properties may exist, and some may be have different types

<p style="text-align: right" align="right"><a href="#ffmpeg"> [↑ Back to <b>ffmpeg</b> ↑] </a></p>

### getProbe
Get the probe of a file as an object

```typescript
const probe = await getProbe('file.mp4'); // { width: 1280, height: 720, ... }
```

<p style="text-align: right" align="right"><a href="#ffmpeg"> [↑ Back to <b>ffmpeg</b> ↑] </a></p>

### getTotalFrames
Get the total number of frames in a video file.

```typescript
const num = await getTotalFrames('video.mp4'); // 120 (2 secs at 60fps)
```

<p style="text-align: right" align="right"><a href="#ffmpeg"> [↑ Back to <b>ffmpeg</b> ↑] </a></p>

### <span id="ffmpeg_ffmpeg">ffmpeg</span>
Wrapper for ffmpeg command that provides progress bar to track progress

```typescript
const progBarOpts = {}; // Same options as getProgressBar
await ffmpeg(() => $`ffmpeg -y -i ${a} ${b} -progress ${pr}`, pr, framesNum, progBarOpts);
```

<p style="text-align: right" align="right"><a href="#ffmpeg"> [↑ Back to <b>ffmpeg</b> ↑] </a></p>

## gm
  - [**gm**](#gm)
    - [convert](#convert)
    - [composite](#composite)
    - [**utils**](#gm_utils)
      - [supportedFlags](#supportedflags)
      - [flagsObjToArray](#flagsobjtoarray)

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### convert
Wrapper function for gm (GraphicsMagick) convert command

```typescript
const converted = await gm.convert(input, output, {});
```

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

### composite
Wrapper function for gm (GraphicsMagick) composite command

Has extra functionality for using a 'Screen' blending mode (similar to Photoshop)

```typescript
const composited = await gm.composite(change, base, out, undefined, {});
```

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

### <span id="gm_utils">utils</span>

#### supportedFlags
An object containing the supported flags and their types (or options).

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

#### flagsObjToArray
Converts a FlagsObj to an array of flags and values (for zx).

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

<!-- DOCS: MAIN END -->
