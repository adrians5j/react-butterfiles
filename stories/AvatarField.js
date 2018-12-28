// @flow
import React from "react";
import Files from "./../src/Files";
import Story from "./Story";
import getPropsKnobs from "./utils/getPropsKnobs";
import ImageCropper from "./utils/ImageCropper";

type Props = {};
type State = {
    files: Array<*>,
    errors: Array<*>,
    cropper: boolean
};

const style = {
    width: 200,
    minHeight: 200,
    border: "2px lightgray dashed"
};

class AvatarField extends React.Component<Props, State> {
    state = {
        files: [],
        errors: [],
        cropper: false
    };

    handleSuccess = (files: *) => {
        this.setState({ files, errors: [], cropper: true });
    };

    handleErrors = (errors: *) => {
        this.setState({ files: [], errors });
    };

    render() {
        const props = getPropsKnobs({ accept: false, multiple: false });
        return (
            <Story>
                <title>Avatar field</title>
                <description>
                    A simple avatar field that initializes cropper (uses "cropperjs" lib) once an
                    image was selected.
                    <br />
                    <br />
                    <code>convertToBase64</code> flag is utilized in order to automatically convert
                    the image source to base64. This will enable us to crop the image immediately
                    after the selection was made.
                </description>
                <example>
                    <Files
                        accept={["image/jpg", "image/jpeg", "image/png"]}
                        convertToBase64
                        {...props}
                        onSuccess={this.handleSuccess}
                        onError={this.handleErrors}
                    >
                        {({ browseFiles, getDropZoneProps }) => (
                            <>
                                <label>Avatar</label>
                                {this.state.cropper ? (
                                    <div style={style}>
                                        <ImageCropper>
                                            {({ getImgProps, getDataURL }) => (
                                                <div>
                                                    <img
                                                        {...getImgProps({
                                                            src: this.state.files[0].src.base64,
                                                            style: {
                                                                maxWidth: "100%"
                                                            }
                                                        })}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            this.setState(state => {
                                                                state.files[0].src.base64 = getDataURL();
                                                                state.cropper = false;
                                                                return state;
                                                            });
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            )}
                                        </ImageCropper>
                                    </div>
                                ) : (
                                    <div
                                        onClick={browseFiles}
                                        {...getDropZoneProps({
                                            style: { ...style, cursor: "pointer" }
                                        })}
                                    >
                                        {this.state.files[0] && (
                                            <img
                                                style={{ width: "100%" }}
                                                src={this.state.files[0].src.base64}
                                            />
                                        )}

                                        {this.state.errors.length > 0 && (
                                            <div>An error occured.</div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </Files>
                </example>
                <code>{code(props)}</code>
            </Story>
        );
    }
}

const code = props => /* React */ `
<Files
    accept={["image/jpg", "image/jpeg", "image/png"]}
    convertToBase64
    ${props}
    onSuccess={this.handleSuccess}
    onError={this.handleErrors}
>
    {({ browseFiles, getDropZoneProps }) => (
        <>
            <label>Avatar</label>
            {this.state.cropper ? (
                <div style={style}>
                    <ImageCropper>
                        {({ getImgProps, getDataURL }) => (
                            <div>
                                <img
                                    {...getImgProps({
                                        src: this.state.files[0].src.base64,
                                        style: {
                                            maxWidth: "100%"
                                        }
                                    })}
                                />
                                <button
                                    onClick={() => {
                                        this.setState(state => {
                                            state.files[0].src.base64 = getDataURL();
                                            state.cropper = false;
                                            return state;
                                        });
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        )}
                    </ImageCropper>
                </div>
            ) : (
                <div
                    onClick={browseFiles}
                    {...getDropZoneProps({
                        style: { ...style, cursor: "pointer" }
                    })}
                >
                    {this.state.files[0] && (
                        <img
                            style={{ width: "100%" }}
                            src={this.state.files[0].src.base64}
                        />
                    )}
                    {this.state.errors.length > 0 && (
                        <div>An error occured.</div>
                    )}
                </div>
            )}
        </>
    )}
</Files>
`;

export default AvatarField;
