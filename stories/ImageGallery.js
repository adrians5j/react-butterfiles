// @flow
import React from "react";
import Files from "./../src/Files";
import Story from "./Story";
import type { SelectedFile } from "./../src/Files";
import { css } from "emotion";

type Props = {};
type State = {
    files: Array<*>,
    errors: Array<*>,
    dragging: boolean
};

const gallery = css({
    width: 500,
    minHeight: 500,
    border: "1px lightgray dashed",
    "&.dragging": {
        backgroundColor: "#80808008"
    },
    ul: {
        padding: 10,
        margin: 0
    },
    li: {
        margin: 2,
        cursor: "pointer",
        border: "1px lightgray solid",
        width: 128,
        height: 128,
        overflow: "hidden",
        display: "inline-block",
        position: "relative",
        float: "left",
        "&.new-image": {
            textAlign: "center",
            color: "lightgray",
            div: {
                fontSize: 30,
                marginTop: 40
            }
        },
        img: {
            maxWidth: "100%"
        }
    }
});

class ImageGallery extends React.Component<Props, State> {
    state = {
        files: [],
        errors: [],
        dragging: false
    };

    handleErrors = (errors: *) => {
        this.setState({ errors });
    };

    handleFiles = async (files: Array<SelectedFile>, selectedIndex: number = 0) => {
        this.setState({ errors: [] }, async () => {
            const newValue = [...this.state.files];

            const convertedImages = [];
            for (let i = 0; i < files.length; i++) {
                const image = files[i];
                convertedImages.push({
                    src: image.src.base64,
                    name: image.name,
                    size: image.size,
                    type: image.type
                });
            }

            newValue.splice(selectedIndex, 0, ...convertedImages);
            this.setState({ files: newValue });
        });
    };

    render() {
        return (
            <Story>
                <title>Image gallery</title>
                <description>
                    A simple image gallery. By default, images will be appended to the list. If an
                    image is clicked, images will be inserted after it.
                </description>
                <example>
                    <div id="wrapper">
                        <Files
                            id={"image-gallery"}
                            multiple
                            convertToBase64
                            accept={["image/jpg", "image/jpeg", "image/png"]}
                            onError={this.handleErrors}
                            onSuccess={files => {
                                // Will append images at the end of the list.
                                this.handleFiles(files, this.state.files.length);
                            }}
                        >
                            {({ browseFiles, getDropZoneProps, getLabelProps }) => (
                                <div>
                                    <label {...getLabelProps()}>Upload images</label>
                                    <div
                                        {...getDropZoneProps({
                                            id: "my-image-gallery",
                                            className:
                                                gallery + (this.state.dragging ? " dragging" : ""),
                                            onDragEnter: () => this.setState({ dragging: true }),
                                            onDragLeave: () => this.setState({ dragging: false }),
                                            onDrop: () => this.setState({ dragging: false })
                                        })}
                                    >
                                        <ul>
                                            {this.state.files.map((image, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        browseFiles({
                                                            onErrors: this.handleErrors,
                                                            onSuccess: files => {
                                                                // Will insert images after the clicked image.
                                                                this.handleFiles(files, index + 1);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <img src={image.src} />
                                                </li>
                                            ))}
                                            <li
                                                className="new-image"
                                                onClick={() => {
                                                    browseFiles({
                                                        onErrors: this.handleErrors,
                                                        onSuccess: files => {
                                                            // Will append images at the end of the list.
                                                            this.handleFiles(
                                                                files,
                                                                this.state.files.length
                                                            );
                                                        }
                                                    });
                                                }}
                                            >
                                                <div>+</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </Files>

                        {this.state.errors.length > 0 && <div>An error occurred.</div>}
                    </div>
                </example>
                <code>{code()}</code>
            </Story>
        );
    }
}

const code = () => `
<div>
    <Files
        multiple
        convertToBase64
        accept={["image/jpg", "image/jpeg", "image/png"]}
        onError={this.handleErrors}
        onSuccess={files =>
            // Will append images at the end of the list.
            this.handleFiles(files, this.state.files.length)
        }
    >
        {({ browseFiles, getDropZoneProps }) => (
            <div
                {...getDropZoneProps({
                    className:
                        gallery + (this.state.dragging ? " dragging" : ""),
                    onDragEnter: () => this.setState({ dragging: true }),
                    onDragLeave: () => this.setState({ dragging: false }),
                    onDrop: () => this.setState({ dragging: false })
                })}
            >
                <ul>
                    {this.state.files.map((image, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                browseFiles({
                                    onErrors: this.handleErrors,
                                    onSuccess: files => {
                                        // Will insert images after the clicked image.
                                        this.handleFiles(files, index + 1);
                                    }
                                });
                            }}
                        >
                            <img src={image.src} />
                        </li>
                    ))}
                    <li
                        className="new-image"
                        onClick={() => {
                            browseFiles({
                                onErrors: this.handleErrors,
                                onSuccess: files => {
                                    // Will append images at the end of the list.
                                    this.handleFiles(
                                        files,
                                        this.state.files.length
                                    );
                                }
                            });
                        }}
                    >
                        <div>+</div>
                    </li>
                </ul>
            </div>
        )}
    </Files>
    {this.state.errors.length > 0 && <div>An error occurred.</div>}
</div>
`;

export default ImageGallery;
