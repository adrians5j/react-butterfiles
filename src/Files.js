// @flow
import * as React from "react";
import bytes from "bytes";
import readFileContent from "./utils/readFileContent";
import generateId from "./utils/generateId";

export type SelectedFile = {
    id: string,
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
    file?: SelectedFile | File
};

export type BrowseFilesParams = {
    onSuccess?: (files: Array<SelectedFile>) => void,
    onError?: (errors: Array<FileError>, files: Array<SelectedFile>) => void
};

export type RenderPropParams = {
    browseFiles: BrowseFilesParams => void,
    getDropZoneProps: (additionalProps: ?Object) => Object,
    getLabelProps: (additionalProps: ?Object) => Object
};

export type FilesRules = {
    accept: Array<string>,
    multiple: boolean,
    maxSize: string,
    multipleMaxSize: string,
    multipleMaxCount: ?number,
    convertToBase64: boolean,
    onSuccess?: (files: Array<SelectedFile>) => void,
    onError?: (errors: Array<FileError>, files: Array<SelectedFile>) => void
};

export type Props = FilesRules & {
    children: RenderPropParams => React.Node,
    id?: string
};

class Files extends React.Component<Props> {
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
    id: string;
    constructor() {
        super();
        this.input = null;
        this.browseFilesPassedParams = null;
        this.id = generateId();
    }

    validateFiles = (files: Array<SelectedFile> | Array<File>): Array<FileError> => {
        const { multiple, multipleMaxSize, multipleMaxCount, accept, maxSize } = this.props;

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
    };

    processSelectedFiles = async (eventFiles: Array<File>) => {
        if (eventFiles.length === 0) {
            return;
        }

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
                id: generateId(),
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
                    const file: File = (files[i].src.file: any);
                    files[i].src.base64 = await readFileContent(file);
                }
            }

            callbacks.onSuccess && callbacks.onSuccess(files);
        }

        // Reset the browseFiles arguments.
        this.input.value = "";
        this.browseFilesPassedParams = null;
    };

    /**
     * Extracted into a separate method just for testing purposes.
     */
    onDropFilesHandler = async ({ e, onSuccess, onError }: Object) => {
        this.browseFilesPassedParams = { onSuccess, onError };
        e.dataTransfer &&
            e.dataTransfer.files &&
            (await this.processSelectedFiles(e.dataTransfer.files));
    };

    /**
     * Extracted into a separate method just for testing purposes.
     */
    browseFilesHandler = ({ onSuccess, onError }: Object) => {
        this.browseFilesPassedParams = { onSuccess, onError };
        this.input && this.input.click();
    };

    render() {
        const { multiple, accept, id } = this.props;
        return (
            <React.Fragment>
                {this.props.children({
                    getLabelProps: (props: ?Object) => {
                        return {
                            ...props,
                            htmlFor: id || this.id
                        };
                    },
                    validateFiles: this.validateFiles,
                    browseFiles: ({ onSuccess, onError }: BrowseFilesParams = {}) => {
                        this.browseFilesHandler({ onSuccess, onError });
                    },
                    getDropZoneProps: ({
                        onSuccess,
                        onError,
                        onDragOver,
                        onDrop,
                        ...rest
                    }: Object = {}) => {
                        return {
                            ...rest,
                            onDragOver: e => {
                                e.preventDefault();
                                typeof onDragOver === "function" && onDragOver();
                            },
                            onDrop: async e => {
                                e.preventDefault();
                                typeof onDrop === "function" && onDrop();
                                this.onDropFilesHandler({ e, onSuccess, onError });
                            }
                        };
                    }
                })}

                <input
                    id={id || this.id}
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
            </React.Fragment>
        );
    }
}

export default Files;
