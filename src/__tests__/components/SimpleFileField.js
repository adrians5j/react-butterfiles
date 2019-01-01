// @flow
import * as React from "react";
import Files from "react-butterfiles";
import type { FilesRules, SelectedFile, FileError } from "react-butterfiles";

type Props = {
    files: FilesRules,
    renderFiles: (files: Array<SelectedFile>) => React.Node,
    renderErrors: (errors: Array<FileError>) => React.Node,
    browseFilesHandler: Function
};
type State = {
    files: Array<SelectedFile>,
    errors: Array<FileError>,
    counts: {
        tries: number,
        drops: number
    }
};

class SimpleFileField extends React.Component<Props, State> {
    static defaultProps = {
        browseFilesHandler: (browseFiles: Function) => browseFiles(),
        renderFiles: (files: Array<SelectedFile>) => {
            return (
                <div>
                    Selected files:
                    <ul>
                        {files.map(file => {
                            return <li key={file.id}>{file.name}</li>;
                        })}
                    </ul>
                </div>
            );
        },
        renderErrors: (errors: Array<FileError>) => {
            return (
                <div>
                    Errors:
                    <ul>
                        {errors.map(error => {
                            return <li key={error.id}>{error.type}</li>;
                        })}
                    </ul>
                </div>
            );
        }
    };

    state = {
        files: [],
        errors: [],
        counts: {
            tries: 0,
            drops: 0
        }
    };

    render() {
        return (
            <Files
                {...this.props.files}
                onSuccess={files => {
                    this.setState(state => {
                        state.counts.tries++;
                        state.counts.drops++;
                        state.files = files;
                        return state;
                    });
                }}
                onError={errors => {
                    this.setState(state => {
                        state.counts.tries++;
                        state.counts.drops++;
                        state.errors = errors;
                        return state;
                    });
                }}
            >
                {({ getLabelProps, getDropZoneProps, browseFiles }) => (
                    <div>
                        <label {...getLabelProps()}>Select files...</label>
                        <div
                            {...getDropZoneProps({
                                "data-testid": "dropZone",
                                onSuccess: files => {
                                    this.setState(state => {
                                        state.counts.tries++;
                                        state.files = files;
                                        return state;
                                    });
                                },
                                onError: errors => {
                                    this.setState(state => {
                                        state.counts.tries++;
                                        state.errors = errors;
                                        return state;
                                    });
                                }
                            })}
                        />

                        <button onClick={() => this.props.browseFilesHandler(browseFiles)}>
                            Browse...
                        </button>
                        <div>Tries: {this.state.counts.tries}</div>
                        {this.props.renderFiles(this.state.files)}
                        {this.props.renderErrors(this.state.errors)}
                    </div>
                )}
            </Files>
        );
    }
}

export default SimpleFileField;
