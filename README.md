# react-butterfiles

<p align="center">
  <a href="https://travis-ci.org/doitadrian/react-butterfiles.svg?branch=master">
    <img alt="Build Status" src="https://travis-ci.org/doitadrian/react-butterfiles.svg?branch=master">
  </a>
  
  <img alt="Build Status" src="https://img.shields.io/npm/dw/react-butterfiles.svg">
  <img alt="Build Status" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">  
  <img alt="Build Status" src="https://img.shields.io/npm/types/react-butterfiles.svg">
    
</p>

A small component for building file upload fields of any type, for example a simple file upload button or 
an image gallery field with drag and drop support and preview of selected images. 

## Install
```
npm install --save react-butterfiles
```

Or if you prefer yarn: 
```
yarn add react-butterfiles
```

## Quick Example:
Create a simple upload button that accepts multiple PDF - 3 files max, max 2MB 
per file and max 10MB for the whole selection.

```
import Files from "react-butterfiles";
```

```
<Files
    multiple={true} 
    maxSize="2mb"
    multipleMaxCount={3}
    multipleMaxSize="10mb"
    accept={["application/pdf","image/jpg","image/jpeg"]}
    onSuccess={files => this.setState({ files })}
    onError={errors => this.setState({ errors })}
>
    {({ browseFiles }) => (
        <>
            <button onClick={browseFiles}>Upload PDF</button>
            <ol>
                {this.state.files.map(file => (
                    <li key={file.name}>{file.name}</li>
                ))}
                {this.state.errors.map(error => (
                    <li key={error.file.name}>
                        {error.file.name} - {error.type}
                    </li>
                ))}
            </ol>
        </>
    )}
</BrowseFiles>
```

More examples on https://react-butterfiles.netlify.com.

## Props

Component takes the following props:


| Prop                | Type                                    | Default   | Description                                                                                                           |
| :------------------ | :-------------------------------------- | :-------- | :-------------------------------------------------------------------------------------------------------------------- |
| `accept`              | `array`                                   | `[]`        | Defines which file types will be accepted. Example: `["application/pdf"]`.                                            |
| `multiple`            | `boolean`                                 | `false`     | Allow multiple file selection by setting this prop to `true.                                                          |
| `maxFileSize`         | `string`                                  | `"2mb"`     | Defines maximum file size (bytes lib used behind the scenes). Example: `"10mb"`                                       |
| `multipleMaxSize`     | `string`                                  | `"10mb"`    | Useful only if `multiple` prop is set to `true`. Defines max. file size of all selected files.                      |
| `multipleMaxCount`    | `number`                                  | `null`    | Useful only if `multiple` prop is set to `true`. Defines max. allowed selected files.                    |
| `convertToBase64`     | `boolean`                                 | `false`     | If `true`, selected files will also be converted to baser64 format (useful when working with images / thumbnails).    |
| `onSuccess`           | `(files: Array<BrowseFilesFile>) => void` | `undefined` | Callback that will get executed once a valid file selection has been made (via browse files dialog or drag and drop). |
| `onError`             | `(errors: Array<FileError>) => void`      | `undefined` | Callback that will get executed once an invalid file selection has been made. More info about possible errors below.  |

## Selection error types

| Type                | Description
| :------------------ | :-------------------
| `unsupportedFileType`              | This can only happen via drag and drop since file browser dialog won't let users choose files of invalid type.
| `maxSizeExceeded`            | File size is greater than `maxFileSize` value.
| `multipleMaxCountExceeded`            | File size is greater than `maxFileSize` value.
| `multipleMaxSizeExceeded` | File size is greater than `multipleMaxSize` value.
| `multipleNotAllowed`         | This can only happen via drag and drop since file browser dialog won't let users choose files of invalid type.
