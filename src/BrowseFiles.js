// @flow
import * as React from "react";
import bytes from "bytes";
import readFileContent from "./utils/readFileContent";
import generateId from "./utils/generateId";

export type SelectedFile = {
    name: string,
    type: string,
    size: number,
    src: {
        file: ?File,
        base64: ?string
    }
};

export type FileError = {
    id: string,
    type:
        | "unsupportedFileType"
        | "maxSizeExceeded"
        | "multipleMaxSizeExceeded"
        | "multipleMaxCountExceeded"
        | "multipleNotAllowed",
    file?: SelectedFile
};

export type RenderPropParams = {
    browseFiles: BrowseFilesParams => void,
    getDropZoneProps: (additionalProps: ?Object) => Object
};

export type BrowseFilesParams = {
    onSuccess?: (files: Array<SelectedFile>) => void,
    onError?: (errors: Array<FileError>, files: Array<SelectedFile>) => void
};

export type Props = {
    accept: Array<string>,
    multiple: boolean,
    maxSize: string,
    multipleMaxSize: string,
    multipleMaxCount: ?number,
    convertToBase64: boolean,
    children: RenderPropParams => React.Node,
    onSuccess?: (files: Array<SelectedFile>) => void,
    onError?: (errors: Array<FileError>, files: Array<SelectedFile>) => void
};

class BrowseFiles extends React.Component<Props> {
    static defaultProps = {
        accept: [],
        multiple: false,
        maxSize: "2mb",
        multipleMaxSize: "10mb",
        multipleMaxCount: null,
        convertToBase64: false
    };

    input: any;
    browseFilesPassedParams: ?BrowseFilesParams;
    constructor() {
        super();
        this.input = null;
        this.browseFilesPassedParams = null;
    }

    validateFiles(files: Array<SelectedFile>): Array<Object> {
        const { multiple, multipleMaxSize, multipleMaxCount, accept, maxSize } = this.props;
        if (files.length === 0) {
            return [];
        }

        const errors: Array<FileError> = [];
        let multipleFileSize = 0;

        if (!multiple && files.length > 1) {
            errors.push({
                id: generateId(),
                type: "multipleNotAllowed"
            });

            return errors;
        }

        for (let index = 0; index < files.length; index++) {
            let file = files[index];

            if (Array.isArray(accept) && accept.length && accept.indexOf(file.type) === -1) {
                errors.push({
                    id: generateId(),
                    index,
                    file,
                    type: "unsupportedFileType"
                });
            } else if (maxSize) {
                if (file.size > bytes(maxSize)) {
                    errors.push({
                        id: generateId(),
                        index,
                        file,
                        type: "maxSizeExceeded"
                    });
                }
            }

            if (multiple) {
                multipleFileSize += file.size;
            }
        }

        if (multiple) {
            if (multipleMaxSize && multipleFileSize > bytes(multipleMaxSize)) {
                errors.push({
                    id: generateId(),
                    type: "multipleMaxSizeExceeded",
                    multipleFileSize,
                    multipleMaxSize: bytes(multipleMaxSize)
                });
            }

            if (multipleMaxCount && files.length > multipleMaxCount) {
                errors.push({
                    id: generateId(),
                    type: "multipleMaxCountExceeded",
                    multipleCount: files.length,
                    multipleMaxCount
                });
            }
        }

        return errors;
    }

    processSelectedFiles = async (eventFiles: Array<File>) => {
        const { convertToBase64, onSuccess, onError } = this.props;
        const { browseFilesPassedParams } = this;
        const callbacks = {
            onSuccess,
            onError
        };

        if (browseFilesPassedParams && browseFilesPassedParams.onSuccess) {
            callbacks.onSuccess = browseFilesPassedParams.onSuccess;
        }

        if (browseFilesPassedParams && browseFilesPassedParams.onError) {
            callbacks.onError = browseFilesPassedParams.onError;
        }

        const files: Array<SelectedFile> = [...eventFiles].map(file => {
            return {
                name: file.name,
                type: file.type,
                size: file.size,
                src: {
                    file,
                    base64: null
                }
            };
        });

        const errors = this.validateFiles(files);

        if (errors.length) {
            callbacks.onError && callbacks.onError(errors, files);
        } else {
            if (convertToBase64) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    file.src.base64 = await readFileContent(file.src.file);
                }
            }

            callbacks.onSuccess && callbacks.onSuccess(files);
        }

        // Reset the browseFiles arguments.
        this.input.value = "";
        this.browseFilesPassedParams = null;
    };

    render() {
        const { multiple, accept } = this.props;
        return (
            <div>
                {this.props.children({
                    browseFiles: params => {
                        this.browseFilesPassedParams = params;

                        // Opens the file browser.
                        this.input && this.input.click();
                    },
                    getDropZoneProps: props => {
                        return {
                            ...props,
                            onDragOver: e => e.preventDefault(),
                            onDrop: async e => {
                                e.preventDefault();
                                this.processSelectedFiles(e.dataTransfer.files);
                            }
                        };
                    }
                })}
                <input
                    ref={ref => {
                        if (ref) {
                            this.input = ref;
                        }
                    }}
                    accept={accept}
                    style={{ display: "none" }}
                    type="file"
                    multiple={multiple}
                    onChange={e => this.processSelectedFiles(e.target.files)}
                />
            </div>
        );
    }
}

export default BrowseFiles;
