// @flow
import * as React from "react";
import Files from "react-butterfiles";
import type { FilesRules, SelectedFile, FileError } from "react-butterfiles";

type Props = {
    files: FilesRules,
    renderFiles: (files: Array<SelectedFile>) => React.Node,
    renderErrors: (errors: Array<FileError>) => React.Node
};
type State = { files: Array<SelectedFile>, errors: Array<FileError>, tries: number };

class SimpleFileField extends React.Component<Props, State> {
    static defaultProps = {
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
        tries: 0
    };

    render() {
        return (
            <Files
                {...this.props.files}
                onSuccess={files => {
                    this.setState({ files, tries: this.state.tries + 1 });
                }}
                onError={errors => {
                    this.setState({ errors, tries: this.state.tries + 1 });
                }}
            >
                {({ getLabelProps, getDropZoneProps }) => (
                    <div>
                        <label {...getLabelProps()}>Select files...</label>
                        <div {...getDropZoneProps()} />

                        <div>Tries: {this.state.tries}</div>
                        {this.props.renderFiles(this.state.files)}
                        {this.props.renderErrors(this.state.errors)}
                    </div>
                )}
            </Files>
        );
    }
}

export default SimpleFileField;
