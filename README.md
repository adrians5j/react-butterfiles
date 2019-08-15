# 🦋 react-butterfiles
[![Build Status](https://travis-ci.org/doitadrian/react-butterfiles.svg?branch=master)](https://travis-ci.org/doitadrian/react-butterfiles)
[![Coverage Status](https://coveralls.io/repos/github/doitadrian/react-butterfiles/badge.svg?branch=master)](https://coveralls.io/github/doitadrian/react-butterfiles?branch=master)
[![](https://img.shields.io/npm/dw/react-butterfiles.svg)](https://www.npmjs.com/package/react-butterfiles) 
[![](https://img.shields.io/npm/v/react-butterfiles.svg)](https://www.npmjs.com/package/react-butterfiles)
![](https://img.shields.io/npm/types/react-butterfiles.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
  
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
Create a simple file field which consists of a drop zone and a file upload button (for cases where drag 
and drop is not convenient). Multiple PDF / JPG files are accepted, but with the following restrictions:
 - 3 files max
 - max 2MB in size per file
 - max 10MB in size for the whole selection 

```javascript
import Files from "react-butterfiles";
```

```javascript
<Files
    multiple={true} 
    maxSize="2mb"
    multipleMaxSize="10mb"
    multipleMaxCount={3}
    accept={["application/pdf","image/jpg","image/jpeg"]}
    onSuccess={files => this.setState({ files })}
    onError={errors => this.setState({ errors })}
>
    {({ browseFiles, getDropZoneProps, getLabelProps }) => (
        <>
            <label {...getLabelProps()}>Your files</label>
            <div {...getDropZoneProps({ className: "myDropZone" })}/>
            <button onClick={browseFiles}>Select files...</button>
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
</Files>
```

More examples on https://react-butterfiles.netlify.com.

## Props

| Prop                | Type                                    | Default   | Description                                                                                                           |
| :------------------ | :-------------------------------------- | :-------- | :-------------------------------------------------------------------------------------------------------------------- |
| `accept`              | `Array<string>`                                   | `[]`        | Defines which file types will be accepted. Example: `["application/pdf"]`.                                            |
| `multiple`            | `boolean`                                 | `false`     | Allow multiple file selection by setting this prop to `true.                                                          |
| `maxSize`         | `string`                                  | `"2mb"`     | Defines maximum file size (bytes lib used behind the scenes). Example: `"10mb"`                                       |
| `multipleMaxSize`     | `string`                                  | `"10mb"`    | Useful only if `multiple` prop is set to `true`. Defines max. file size of all selected files.                      |
| `multipleMaxCount`    | `number`                                  | `null`    | Useful only if `multiple` prop is set to `true`. Defines max. allowed selected files.                    |
| `convertToBase64`     | `boolean`                                 | `false`     | If `true`, selected files will also be converted to baser64 format (useful when working with images / thumbnails).    |
| `onSuccess`           | `(files: Array<SelectedFile>) => void` | `undefined` | Callback that will get executed once a valid file selection has been made (via browse files dialog or drag and drop). Each file will have a random `id` assigned to it. |
| `onError`             | `(errors: Array<FileError>) => void`      | `undefined` | Callback that will get executed once an invalid file selection has been made. Each error will have a random `id` assigned to it. More info about possible errors below.  |

### Render (children) prop

Render prop gives you access to three callbacks:

| Prop                | Type                                    |  Description                      |
| :------------------ | :-------------------------------------- | :----------------------------------
| `browseFiles`       | `BrowseFilesParams => void`             | Once executed, file browser will be shown. Useful for file upload buttons. The callback can also accept custom `onSuccess` and `onError` callbacks, that will override the main ones. |
| `validate`       | `(files: Array<File>) => Array<FileError>`             | Enables manual validation of files. Eg. after editing the selected image in an image editor. |
| `getDropZoneProps`  | `(additionalProps: ?Object) => Object`  | Props that need to be spread to a drop zone. Additional props can be passed, for example `className` or `style`. |
| `getLabelProps`  | `(additionalProps: ?Object) => Object`  | Props that need to be spread to your file field's label. Additional props can be passed, for example `className` or `style`. |

Note that you don't need to have both upload file and drop zone, you can use only one if that's your requirement. 
For example, to create a simple file field, you would only need to use the `browseFiles` callback.

## Selection error types
While selecting and dropping files, if there are one or more that do not comply with the rules that were set via props, an `onError` callback will be triggered, with all of the errors passed as the first argument.

Every error in the array will have one of the following error types.

| Type                | Description
| :------------------ | :-------------------
| `unsupportedFileType`              | This can only happen via drag and drop since file browser dialog won't let users choose files of invalid type.
| `maxSizeExceeded`            | One or more file sizes are greater than `maxSize` value.
| `multipleMaxCountExceeded`            | User selected more files than allowed (more than `multipleMaxCount`).
| `multipleMaxSizeExceeded` | User selected one or more files with their total size greater than allowed (more than `multipleMaxSize`).
| `multipleNotAllowed`         | This can only happen via drag and drop since file browser dialog won't let users select two or more files if `multiple` was not set to `true`.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars0.githubusercontent.com/u/5121148?v=4" width="100px;" alt="Adrian Smijulj"/><br /><sub><b>Adrian Smijulj</b></sub>](https://github.com/doitadrian)<br />[💻](https://github.com/doitadrian/react-butterfiles/commits?author=doitadrian "Code") [📖](https://github.com/doitadrian/react-butterfiles/commits?author=doitadrian "Documentation") [💡](#example-doitadrian "Examples") [👀](#review-doitadrian "Reviewed Pull Requests") [⚠️](https://github.com/doitadrian/react-butterfiles/commits?author=doitadrian "Tests") | [<img src="https://avatars3.githubusercontent.com/u/15904136?v=4" width="100px;" alt="readeral"/><br /><sub><b>readeral</b></sub>](https://github.com/readeral)<br />[💻](https://github.com/doitadrian/react-butterfiles/commits?author=readeral "Code") [📖](https://github.com/doitadrian/react-butterfiles/commits?author=readeral "Documentation") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
