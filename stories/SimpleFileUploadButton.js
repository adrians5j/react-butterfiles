// @flow
import React from "react";
import BrowseFiles from "./../src/BrowseFiles";
import Story from "./Story";
import getPropsKnobs from "./utils/getPropsKnobs";

type Props = {};
type State = {
    files: Array<*>,
    errors: Array<*>
};

class SimpleFileUploadButton extends React.Component<Props, State> {
    state = {
        files: [],
        errors: []
    };

    render() {
        const props = getPropsKnobs();
        return (
            <Story>
                <title>Simple file upload button</title>
                <description>Click the button to open file browser.</description>
                <example>
                    <BrowseFiles
                        {...props}
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
                </example>
                <code>{code(props)}</code>
            </Story>
        );
    }
}

const code = props => /* React */ `
<BrowseFiles
    ${props}
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
`;

export default SimpleFileUploadButton;
