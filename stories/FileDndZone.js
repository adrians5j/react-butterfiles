// @flow
import React from "react";
import Files from "./../src/Files";
import Story from "./Story";
import getPropsKnobs from "./utils/getPropsKnobs";

type Props = {};
type State = {
    files: Array<*>,
    errors: Array<*>
};

class FileDndZone extends React.Component<Props, State> {
    state = {
        files: [],
        errors: []
    };

    handleSuccess = (files: *) => {
        this.setState({ files, errors: [] });
    };

    handleErrors = (errors: *) => {
        this.setState({ files: [], errors });
    };

    render() {
        const props = getPropsKnobs();
        return (
            <Story>
                <title>File field with drag and drop</title>
                <description>
                    Shows how to simply enable drag and drop and still allow users to select files
                    by clicking on a button.
                </description>
                <example>
                    <Files
                        {...props}
                        onSuccess={this.handleSuccess}
                        onError={this.handleErrors}
                    >
                        {({ browseFiles, getDropZoneProps }) => {
                            return (
                                <div>
                                    <label>Drag and drop files.</label>
                                    <div
                                        {...getDropZoneProps({
                                            style: {
                                                width: 600,
                                                minHeight: 200,
                                                border: "2px lightgray dashed"
                                            }
                                        })}
                                    >
                                        <ol>
                                            {this.state.files.map(file => (
                                                <li key={file.name}>{file.name}</li>
                                            ))}
                                            {this.state.errors.map(error => (
                                                <li key={error.id}>
                                                    {error.file ? (
                                                        <span>
                                                            {error.file.name} - {error.type}
                                                        </span>
                                                    ) : (
                                                        error.type
                                                    )}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                    <div>
                                        Dragging not convenient? Click{" "}
                                        <button onClick={browseFiles}>here</button> to select files.
                                    </div>
                                </div>
                            );
                        }}
                    </Files>
                </example>
                <code>{code(props)}</code>
            </Story>
        );
    }
}

const code = props => /* React */ `
<Files
    ${props}
    onSuccess={this.handleSuccess}
    onError={this.handleErrors}
>
    {({ browseFiles, getDropZoneProps }) => {
        return (
            <div>
                <label>Drag and drop files.</label>
                <div
                    {...getDropZoneProps({
                        style: {
                            width: 600,
                            minHeight: 200,
                            border: "2px lightgray dashed"
                        }
                    })}
                >
                    <ol>
                        {this.state.files.map(file => (
                            <li key={file.name}>{file.name}</li>
                        ))}
                        {this.state.errors.map(error => (
                            <li key={error.id}>
                                {error.file ? (
                                    <span>
                                        {error.file.name} - {error.type}
                                    </span>
                                ) : (
                                    error.type
                                )}
                            </li>
                        ))}
                    </ol>
                </div>
                <div>
                    Dragging not convenient? Click{" "}
                    <button onClick={browseFiles}>here</button> to select files.
                </div>
            </div>
        );
    }}
</Files>
`;

export default FileDndZone;
