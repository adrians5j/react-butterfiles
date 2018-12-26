# react-browse-files

<p align="center">
  <a href="https://travis-ci.org/adrian1358/react-browse-files.svg?branch=master">
    <img alt="Build Status" src="https://travis-ci.org/adrian1358/react-browse-files.svg?branch=master">
  </a>
  
  <img alt="Build Status" src="https://img.shields.io/npm/dw/react-browse-files.svg">
  <img alt="Build Status" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">  
  <img alt="Build Status" src="https://img.shields.io/npm/types/react-browse-files.svg">
    
</p>

A small component for building file upload fields of any type, for example a simple file upload button or 
an image gallery field with drag and drop support and preview of selected images. 

## Install
```
npm install --save react-browse-files
```

Or if you prefer yarn: 
```
yarn add react-browse-files
```

## Quick Example:
Create a simple upload button that accepts multiple PDF files (max 2MB per file / max 10MB for the whole selection).

```javascript
import BrowseFiles from "react-browse-files";
```

```javascript
<BrowseFiles
    multiple={true} 
    maxSize="2mb"
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

More examples on https://react-browse-files.netlify.com.

## Props

Component takes the following props:


| Prop                | Type                                    | Default   | Description                                                                                                           |
| :------------------ | :-------------------------------------- | :-------- | :-------------------------------------------------------------------------------------------------------------------- |
| `accept`              | `array`                                   | `[]`        | Defines which file types will be accepted. Example: `["application/pdf"]`.                                            |
| `multiple`            | `boolean`                                 | `false`     | Allow multiple file selection by setting this prop to `true.                                                          |
| `maxFileSize`         | `string`                                  | `"2mb"`     | Defines maximum file size (bytes lib used behind the scenes). Example: `"10mb"`                                       |
| `multipleMaxFileSize` | `string`                                  | `"10mb"`    | Useful only if `multiple` prop is set to `true. Defines maximum file size of all selected files.                      |
| `convertToBase64`     | `boolean`                                 | `false`     | If `true`, selected files will also be converted to baser64 format (useful when working with images / thumbnails).    |
| `onSuccess`           | `(files: Array<BrowseFilesFile>) => void` | `undefined` | Callback that will get executed once a valid file selection has been made (via browse files dialog or drag and drop). |
| `onError`             | `(errors: Array<FileError>) => void`      | `undefined` | Callback that will get executed once an invalid file selection has been made. More info about possible errors below.  |

## Selection error types

| Type                | Description
| :------------------ | :-------------------
| `unsupportedFileType`              | This can only happen via drag and drop since file browser dialog won't let users choose files of invalid type.
| `maxSizeExceeded`            | File size is greater than `maxFileSize` value.
| `multipleMaxFileSize` | File size is greater than `maxFileSize` value.
| `multipleNotAllowed`         | This can only happen via drag and drop since file browser dialog won't let users choose files of invalid type.
