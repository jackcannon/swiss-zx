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
$$.cd(dir: string): ProcessPromise
```

Change the current working directory

```typescript
await $$.pwd(); // '/Users/username'
await $$.cd('./some/folder');
await $$.pwd(); // '/Users/username/some/folder'
```

|  #  | Parameter Name | Required | Type     | Default |
|:---:|:---------------|:---------|:---------|:--------|
| *0* | `dir`          | *No*     | `string` | `'.'`   |

| Return Type      |
|------------------|
| `ProcessPromise` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### pwd

```typescript
$$.pwd(): Promise<string>
```

Get the current working directory

```typescript
await $$.pwd(); // '/Users/username'
await $$.cd('./some/folder');
await $$.pwd(); // '/Users/username/some/folder'
```

| Return Type       |
|-------------------|
| `Promise<string>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### ls

```typescript
$$.ls(dir: string, flags: string[]): Promise<string[]>
```

Wrapper for ls (list) command

```typescript
await $$.ls('example') // ['a', 'b']
```

|  #  | Parameter Name | Required | Type       | Default |
|:---:|:---------------|:---------|:-----------|:--------|
| *0* | `dir`          | *No*     | `string`   | `'.'`   |
| *1* | `flags`        | *No*     | `string[]` | `[]`    |

| Return Type         |
|---------------------|
| `Promise<string[]>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### rm

```typescript
$$.rm(item: string): ProcessPromise
```

Wrapper for rm (remove) command

```typescript
await $$.rm('example') // same as $`rm -rf 'example'`
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `item`         | **Yes**  | `string` |

| Return Type      |
|------------------|
| `ProcessPromise` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### mkdir

```typescript
$$.mkdir(item: string): ProcessPromise
```

Wrapper for mkdir (make directory) command

```typescript
await $$.mkdir('example') // same as $`mkdir -p 'example'`
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `item`         | **Yes**  | `string` |

| Return Type      |
|------------------|
| `ProcessPromise` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### cp

```typescript
$$.cp(a: string, b: string): ProcessPromise
```

Wrapper for cp (copy) command

```typescript
await $$.cp('example1', 'example2') // same as $`cp -r 'example1' 'example2'`
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `a`            | **Yes**  | `string` |
| *1* | `b`            | **Yes**  | `string` |

| Return Type      |
|------------------|
| `ProcessPromise` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### mv

```typescript
$$.mv(a: string, b: string): ProcessPromise
```

Wrapper for mv (move) command

```typescript
await $$.mv('example1', 'example2') // same as $`mv 'example1' 'example2'`
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `a`            | **Yes**  | `string` |
| *1* | `b`            | **Yes**  | `string` |

| Return Type      |
|------------------|
| `ProcessPromise` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### touch

```typescript
$$.touch(item: string): ProcessPromise
```

Wrapper for touch (create blank file) command

```typescript
await $$.touch('example') // same as $`touch 'example'`
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `item`         | **Yes**  | `string` |

| Return Type      |
|------------------|
| `ProcessPromise` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### cat

```typescript
$$.cat(item: string): ProcessPromise
```

Wrapper for cat (concatenate) command

```typescript
await $$.cat('example') // same as $`cat 'example'`
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `item`         | **Yes**  | `string` |

| Return Type      |
|------------------|
| `ProcessPromise` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### grep

```typescript
$$.grep(pattern: string, file: string): Promise<string[]>
```

Wrapper for grep (**G**lobal **R**egular **E**xpression **P**rint) command

```typescript
await $$.grep('example', '.') // same as $`grep 'example' '.'`
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `pattern`      | **Yes**  | `string` |
| *1* | `file`         | **Yes**  | `string` |

| Return Type         |
|---------------------|
| `Promise<string[]>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### find

```typescript
$$.find(dir: string, options: FindOptions): Promise<string[]>
```

Helper function for finding files

```typescript
await $$.find('.', { type: 'f' }) // ['a', 'b']
```

|  #  | Parameter Name | Required | Type          | Default |
|:---:|:---------------|:---------|:--------------|:--------|
| *0* | `dir`          | *No*     | `string`      | `'.'`   |
| *1* | `options`      | *No*     | `FindOptions` | `{}`    |

| Return Type         |
|---------------------|
| `Promise<string[]>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

#### FindOptions

```typescript
$$.FindOptions;
```

Options for $$.find (and related other tools)

| Property                | Required | Type     | Description                               |
| ----------------------- | -------- | -------- | ----------------------------------------- |
| `type`                  | *No*     | FindType | Type of item to find                      |
| `mindepth`              | *No*     | number   | Minimum depth to search                   |
| `maxdepth`              | *No*     | number   | Maximum depth to search                   |
| `name`                  | *No*     | string   | Name of file/directory to find            |
| `ext`                   | *No*     | string   | Shortcut for regex-ing the file extension |
| `regex`                 | *No*     | string   | Regular expression to match               |
| `removePath`            | *No*     | boolean  | Removes the path from the result          |
| `contentsOnly`          | *No*     | boolean  | Ensures input path has a trailing slash   |
| `removeTrailingSlashes` | *No*     | boolean  | Removes trailing slashes from the results |
| `showHidden`            | *No*     | boolean  | Includes files that start with a dot      |

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
$$.findDirs(dir: string, options: FindOptions): Promise<string[]>
```

Find all directories in a given directory (shallow)

```typescript
await $$.findDirs('.') // ['a', 'b']
```

|  #  | Parameter Name | Required | Type          | Default |
|:---:|:---------------|:---------|:--------------|:--------|
| *0* | `dir`          | *No*     | `string`      | `'.'`   |
| *1* | `options`      | *No*     | `FindOptions` | `{}`    |

| Return Type         |
|---------------------|
| `Promise<string[]>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### findFiles

```typescript
$$.findFiles(dir: string, options: FindOptions): Promise<string[]>
```

Find all files in a given directory (shallow)

```typescript
await $$.findFiles('.') // ['a', 'b']
```

|  #  | Parameter Name | Required | Type          | Default |
|:---:|:---------------|:---------|:--------------|:--------|
| *0* | `dir`          | *No*     | `string`      | `'.'`   |
| *1* | `options`      | *No*     | `FindOptions` | `{}`    |

| Return Type         |
|---------------------|
| `Promise<string[]>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### findModified

```typescript
$$.findModified(dir: string, options: FindOptions): Promise<ModifiedFile[]>
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

|  #  | Parameter Name | Required | Type          | Default |
|:---:|:---------------|:---------|:--------------|:--------|
| *0* | `dir`          | *No*     | `string`      | `'.'`   |
| *1* | `options`      | *No*     | `FindOptions` | `{}`    |

| Return Type               |
|---------------------------|
| `Promise<ModifiedFile[]>` |

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
$$.lastModified(path: string): Promise<number>
```

Returns the last modified time of a file or files within a directory.

```typescript
await $$.lastModified('a.mp4') // 1689206400000
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `path`         | **Yes**  | `string` |

| Return Type       |
|-------------------|
| `Promise<number>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### rsync

```typescript
$$.rsync(a: string, b: string, flags: string[], progressBarOpts: Partial<progressBar.ProgressBarOptions>): Promise<ProcessOutput>
```

Wrapper for rsync command

```typescript
await $$.rsync('example1', 'example2') // same as $`rsync -rut 'example1' 'example2'`
```

|  #  | Parameter Name    | Required | Type                                      | Default |
|:---:|:------------------|:---------|:------------------------------------------|:--------|
| *0* | `a`               | **Yes**  | `string`                                  |         |
| *1* | `b`               | **Yes**  | `string`                                  |         |
| *2* | `flags`           | *No*     | `string[]`                                | `[]`    |
| *3* | `progressBarOpts` | *No*     | `Partial<progressBar.ProgressBarOptions>` |         |

| Return Type              |
|--------------------------|
| `Promise<ProcessOutput>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### sync

```typescript
$$.sync(a: string, b: string, progressBarOpts: Partial<progressBar.ProgressBarOptions>): Promise<ProcessOutput>
```

Helper function for syncing files

```typescript
await $$.sync('example1', 'example2') // same as $`rsync -rut 'example1' 'example2' --delete`
```

|  #  | Parameter Name    | Required | Type                                      |
|:---:|:------------------|:---------|:------------------------------------------|
| *0* | `a`               | **Yes**  | `string`                                  |
| *1* | `b`               | **Yes**  | `string`                                  |
| *2* | `progressBarOpts` | *No*     | `Partial<progressBar.ProgressBarOptions>` |

| Return Type              |
|--------------------------|
| `Promise<ProcessOutput>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### isFileExist

```typescript
$$.isFileExist(file: string): Promise<boolean>
```

Check if a file exists

```typescript
await $$.isFileExist('example') // true
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `file`         | **Yes**  | `string` |

| Return Type        |
|--------------------|
| `Promise<boolean>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### isDirExist

```typescript
$$.isDirExist(dir: string): Promise<boolean>
```

Check if a directory exists

```typescript
await $$.isDirExist('example') // true
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `dir`          | **Yes**  | `string` |

| Return Type        |
|--------------------|
| `Promise<boolean>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### readFile

```typescript
$$.readFile(filepath: string): Promise<string>
```

Read a file's contents

```typescript
await $$.readFile('example') // 'hello world'
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `filepath`     | **Yes**  | `string` |

| Return Type       |
|-------------------|
| `Promise<string>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### writeFile

```typescript
$$.writeFile(filepath: string, contents: string): Promise<void>
```

Write to a file

```typescript
await $$.writeFile('example', 'hello world') // saves a new file called 'example' with the contents 'hello world'
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `filepath`     | **Yes**  | `string` |
| *1* | `contents`     | **Yes**  | `string` |

| Return Type     |
|-----------------|
| `Promise<void>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### readJSON

```typescript
$$.readJSON<T>(filepath: string): Promise<T>
```

Read a JSON file

```typescript
await $$.readJSON('example.json') // { hello: 'world' }
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `filepath`     | **Yes**  | `string` |

| Return Type  |
|--------------|
| `Promise<T>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### writeJSON

```typescript
$$.writeJSON<T>(obj: T): Promise<T>
```

Write to a JSON file

```typescript
await $$.writeJSON('example.json', { hello: 'world' }) // saves a new file called 'example.json' with the contents {'hello':'world'}
```

|  #  | Parameter Name | Required | Type |
|:---:|:---------------|:---------|:-----|
| *0* | `obj`          | **Yes**  | `T`  |

| Return Type  |
|--------------|
| `Promise<T>` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### <span id="___pipe">pipe</span>

```typescript
$$.pipe(processes: ((index?: number, arg?: T) => ProcessPromise)[], arg: T): ProcessPromise
```

Pipes a series of $ or $$ commands sequentially

```typescript
await $$.pipe([
  () => gm.convert(basePath, gm.PIPE, opts1),
  () => gm.composite(changePath, gm.PIPE, gm.PIPE, changePath, opts2)
]);
```

|  #  | Parameter Name | Required | Type                                              |
|:---:|:---------------|:---------|:--------------------------------------------------|
| *0* | `processes`    | **Yes**  | `((index?: number, arg?: T) => ProcessPromise)[]` |
| *1* | `arg`          | *No*     | `T`                                               |

| Return Type      |
|------------------|
| `ProcessPromise` |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

### exiftool

```typescript
$$.exiftool(file: string, setAttr: ExifToolAttributesObj, getAttr: (ExifToolAttributes | string)[], outFile: string): Promise<ExifToolAttributesObj>
```

Usage:
```typescript
$$.exiftool('/path/to/file.jpg', {'Copyright': 'Eg val'});
$$.exiftool('/path/to/file.jpg', {'Copyright': 'Eg val'}, undefined, '/path/to/new_file.jpg');
```

|  #  | Parameter Name | Required | Type                               |
|:---:|:---------------|:---------|:-----------------------------------|
| *0* | `file`         | **Yes**  | `string`                           |
| *1* | `setAttr`      | *No*     | `ExifToolAttributesObj`            |
| *2* | `getAttr`      | *No*     | `(ExifToolAttributes \| string)[]` |
| *3* | `outFile`      | *No*     | `string`                           |

| Return Type                      |
|----------------------------------|
| `Promise<ExifToolAttributesObj>` |

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
$$.utils.intoLines(out: ProcessOutput): string[]
```

Turns ProcessOutput into string array, split into lines

```typescript
utils.intoLines($`echo "1\n2\n3"`) // ['1', '2', '3']
```

|  #  | Parameter Name | Required | Type            |
|:---:|:---------------|:---------|:----------------|
| *0* | `out`          | **Yes**  | `ProcessOutput` |

| Return Type |
|-------------|
| `string[]`  |

<p style="text-align: right" align="right"><a href="#-double-dollar"> [↑ Back to <b>$$ (double dollar)</b> ↑] </a></p>

## os
  - [**os**](#os)
    - [closeFinder](#closefinder)

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### closeFinder

```typescript
closeFinder(): Promise<void>
os.closeFinder(): Promise<void>
```

Close all Mac OS X Finder windows.

```typescript
await closeFinder();
```

| Return Type     |
|-----------------|
| `Promise<void>` |

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
ffmpeg(command: () => ProcessPromise, progressFileName: string, totalFrames: number, progressBarOpts: progressBar.ProgressBarOptions): Promise<void>
ffmpegTools.ffmpeg(command: () => ProcessPromise, progressFileName: string, totalFrames: number, progressBarOpts: progressBar.ProgressBarOptions): Promise<void>
```

Wrapper for ffmpeg command that provides progress bar to track progress

```typescript
const progBarOpts = {}; // Same options as getProgressBar
await ffmpeg(() => $`ffmpeg -y -i ${a} ${b} -progress ${pr}`, pr, framesNum, progBarOpts);
```

|  #  | Parameter Name     | Required | Type                             | Default                               |
|:---:|:-------------------|:---------|:---------------------------------|:--------------------------------------|
| *0* | `command`          | *No*     | `() => ProcessPromise`           | ``() => $`ffmpeg -progress pr.txt` `` |
| *1* | `progressFileName` | *No*     | `string`                         | `'pr.txt'`                            |
| *2* | `totalFrames`      | *No*     | `number`                         | `1`                                   |
| *3* | `progressBarOpts`  | *No*     | `progressBar.ProgressBarOptions` | `{}`                                  |

| Return Type     |
|-----------------|
| `Promise<void>` |

<p style="text-align: right" align="right"><a href="#ffmpegtools"> [↑ Back to <b>ffmpegTools</b> ↑] </a></p>

### toFFmpegTimeFormat

```typescript
ffmpegTools.toFFmpegTimeFormat(time: ms): string
```

Convert a number of milliseconds to a time format usable by FFmpeg.

```typescript
ffmpegTools.toFFmpegTimeFormat(minutes(3)); // '03:00.000'
ffmpegTools.toFFmpegTimeFormat(minutes(3) + seconds(21)); // '03:21.000'
ffmpegTools.toFFmpegTimeFormat(minutes(3) + seconds(21) + 456); // '03:21.456'
```

|  #  | Parameter Name | Required | Type |
|:---:|:---------------|:---------|:-----|
| *0* | `time`         | **Yes**  | `ms` |

| Return Type |
|-------------|
| `string`    |

<p style="text-align: right" align="right"><a href="#ffmpegtools"> [↑ Back to <b>ffmpegTools</b> ↑] </a></p>

### getProbe

```typescript
ffmpegTools.getProbe(file: string): Promise<ProbeResult>
```

Get the probe of a file as an object

```typescript
const probe = await getProbe('file.mp4'); // { width: 1280, height: 720, ... }
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `file`         | **Yes**  | `string` |

| Return Type            |
|------------------------|
| `Promise<ProbeResult>` |

<p style="text-align: right" align="right"><a href="#ffmpegtools"> [↑ Back to <b>ffmpegTools</b> ↑] </a></p>

#### ProbeResult

```typescript
ffmpegTools.ProbeResult;
```

Note: this interface is a guide, and other properties may exist, and some may be have different types

<p style="text-align: right" align="right"><a href="#ffmpegtools"> [↑ Back to <b>ffmpegTools</b> ↑] </a></p>

### getProbeValue

```typescript
ffmpegTools.getProbeValue(file: string, propertyName: string): Promise<string>
```

Get a value from ffprobe output

```typescript
const probe = await getProbe('file.mp4', 'width'); // '1280'
```

|  #  | Parameter Name | Required | Type     |
|:---:|:---------------|:---------|:---------|
| *0* | `file`         | **Yes**  | `string` |
| *1* | `propertyName` | **Yes**  | `string` |

| Return Type       |
|-------------------|
| `Promise<string>` |

<p style="text-align: right" align="right"><a href="#ffmpegtools"> [↑ Back to <b>ffmpegTools</b> ↑] </a></p>

### getTotalFrames

```typescript
ffmpegTools.getTotalFrames(list: string | string[]): Promise<number>
```

Get the total number of frames in a video file.

```typescript
const num = await getTotalFrames('video.mp4'); // 120 (2 secs at 60fps)
```

|  #  | Parameter Name | Required | Type                 |
|:---:|:---------------|:---------|:---------------------|
| *0* | `list`         | *No*     | `string \| string[]` |

| Return Type       |
|-------------------|
| `Promise<number>` |

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
gm.convert(inPath: string, outPath: string, flags: ConvertFlagsObj): ProcessPromise
```

Wrapper function for gm (GraphicsMagick) convert command

```typescript
const converted = await gm.convert(input, output, {});
```

|  #  | Parameter Name | Required | Type              | Default |
|:---:|:---------------|:---------|:------------------|:--------|
| *0* | `inPath`       | *No*     | `string`          | `PIPE`  |
| *1* | `outPath`      | *No*     | `string`          | `PIPE`  |
| *2* | `flags`        | *No*     | `ConvertFlagsObj` | `{}`    |

| Return Type      |
|------------------|
| `ProcessPromise` |

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
gm.composite(changePath: string, basePath: string, outPath: string, maskPath: string, flags: ChangeAndMaskFlags | CompositeFlagsObj): ProcessPromise
```

Wrapper function for gm (GraphicsMagick) composite command

Has extra functionality for using a 'Screen' blending mode (similar to Photoshop)

```typescript
const composited = await gm.composite(change, base, out, undefined, {});
```

|  #  | Parameter Name | Required | Type                                      | Default |
|:---:|:---------------|:---------|:------------------------------------------|:--------|
| *0* | `changePath`   | *No*     | `string`                                  | `PIPE`  |
| *1* | `basePath`     | *No*     | `string`                                  | `PIPE`  |
| *2* | `outPath`      | *No*     | `string`                                  | `PIPE`  |
| *3* | `maskPath`     | *No*     | `string`                                  | `''`    |
| *4* | `flags`        | *No*     | `ChangeAndMaskFlags \| CompositeFlagsObj` | `{}`    |

| Return Type      |
|------------------|
| `ProcessPromise` |

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
gm.pipe(inPath: string, outPath: string, processes: ((pipeIn?: string, pipeOut?: string, index?: number) => ProcessPromise)[]): ProcessPromise
```

Pipe a series of gm commands together

> WARNING: If inPath is provided, it will be piped in to first process
> WARNING: If outPath is provided, it will be piped out from last process

```typescript
await pipe(basePath, outPath, [
  (p) => convert(p, p, opts1),
  (p) => composite(changePath, p, p, changePath, opts2)
]);
await pipe(undefined, undefined, [
  (p) => convert(basePath, p, opts1),
  (p) => composite(changePath, p, outPath, changePath, opts2)
]);
```

|  #  | Parameter Name | Required | Type                                                                        | Default |
|:---:|:---------------|:---------|:----------------------------------------------------------------------------|:--------|
| *0* | `inPath`       | *No*     | `string`                                                                    |         |
| *1* | `outPath`      | *No*     | `string`                                                                    |         |
| *2* | `processes`    | *No*     | `((pipeIn?: string, pipeOut?: string, index?: number) => ProcessPromise)[]` | `[]`    |

| Return Type      |
|------------------|
| `ProcessPromise` |

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
gm.utils.flagsObjToArray(obj: gm.FlagsObj): (string | number)[]
```

Converts a FlagsObj to an array of flags and values (for zx).

```typescript
gm.utils.flagsObjToArray({ channel: 'red' }); // [ '-channel', 'red' ]
gm.utils.flagsObjToArray({ displace: '10' }); // [ '-displace', '10' ]

gm.utils.flagsObjToArray({ resize: '1080', fill: 'gray', gravity: 'SouthEast' });
// ['-resize', '1080', '-fill', 'gray', '-gravity', 'SouthEast']

gm.utils.flagsObjToArray({ brightness: 150, saturation: 50, hue: 200 });
// [ '-modulate', '150,50,200' ]
```

|  #  | Parameter Name | Required | Type          |
|:---:|:---------------|:---------|:--------------|
| *0* | `obj`          | **Yes**  | `gm.FlagsObj` |

| Return Type            |
|------------------------|
| `(string \| number)[]` |

<p style="text-align: right" align="right"><a href="#gm"> [↑ Back to <b>gm</b> ↑] </a></p>

#### channelComposeCopyMap

```typescript
gm.utils.channelComposeCopyMap;
```

A dictionary for mapping channel names to their respective compose copy names.

```typescript
gm.utils.channelComposeCopyMap['red'] // 'CopyRed'
gm.utils.channelComposeCopyMap['magena'] // 'CopyMagenta'
gm.utils.channelComposeCopyMap['gray'] // 'Copy'
```

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
