import React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";
import "jest-dom/extend-expect";
import Files from "react-butterfiles";
describe("getDropZoneProps ", () => {
    afterEach(cleanup);

    test("without custom callbacks", async () => {
        const { getByTestId } = render(
            <Files>
                {({ getDropZoneProps }) => <div data-testid="dropZone" {...getDropZoneProps()} />}
            </Files>
        );

        // This does not work (dataTransfer ends up being undefined).
        fireEvent.drop(getByTestId("dropZone"), {});
    });

    test("with custom onDrop and onDragOver callbacks", async () => {
        let dropped = false;
        let draggedOver = false;

        const { getByTestId } = render(
            <Files>
                {({ getDropZoneProps }) => (
                    <div
                        {...getDropZoneProps({
                            onDragOver: () => {
                                draggedOver = true;
                            },
                            onDrop: () => {
                                dropped = true;
                            },
                            "data-testid": "dropZone"
                        })}
                    />
                )}
            </Files>
        );

        // This does not work (dataTransfer ends up being undefined).
        fireEvent.drop(getByTestId("dropZone"), {});

        fireEvent.dragOver(getByTestId("dropZone"));

        expect(dropped).toBe(true);
        expect(draggedOver).toBe(true);
    });

    test("testing drop internal handler (faking File instances) - without and with custom onSuccess / onError handlers", async () => {
        let instance = null;

        class FilesField extends React.Component {
            constructor() {
                super();
                instance = this;
                this.ref = React.createRef();
                this.state = {
                    files: []
                };
            }

            render() {
                return (
                    <Files
                        multipleMaxCount={3}
                        multiple
                        ref={this.ref}
                        onSuccess={files => {
                            this.setState({ files });
                        }}
                    >
                        {() => (
                            <ul>
                                {this.state.files.map(file => {
                                    return <li key={file.id}>{file.name}</li>;
                                })}
                            </ul>
                        )}
                    </Files>
                );
            }
        }

        const { getByText, queryByText, container } = render(<FilesField />);

        await instance.ref.current.onDropFilesHandler({
            e: {
                dataTransfer: {
                    files: [
                        new File(["content-of-file1.png"], "file1.png", {
                            type: "image/png"
                        }),
                        new File(["content-of-file2.png"], "file2.png", {
                            type: "image/png"
                        }),
                        new File(["content-of-file3.jpg"], "file3.jpg", {
                            type: "image/jpg"
                        })
                    ]
                }
            }
        });

        expect(container).toContainElement(getByText(/file1\.png/));
        expect(container).toContainElement(getByText(/file2\.png/));
        expect(container).toContainElement(getByText(/file3\.jpg/));

        // Drop triggered with custom onSuccess and onError handlers (must override default ones).
        let onSuccessTriggered = false;
        let onErrorTriggered = false;

        const e = {
            dataTransfer: {
                files: [
                    new File(["content-of-file4.png"], "file4.png", {
                        type: "image/png"
                    }),
                    new File(["content-of-file5.png"], "file5.png", {
                        type: "image/png"
                    }),
                    new File(["content-of-file6.jpg"], "file6.jpg", {
                        type: "image/jpg"
                    })
                ]
            }
        };

        await instance.ref.current.onDropFilesHandler({
            onSuccess() {
                onSuccessTriggered = true;
            },
            e
        });

        await instance.ref.current.onDropFilesHandler({
            onError() {
                onErrorTriggered = true;
            },
            e: {
                dataTransfer: {
                    files: [
                        ...e.dataTransfer.files,
                        new File(["content-of-file6.jpg"], "file6.jpg", {
                            type: "image/jpg"
                        })
                    ]
                }
            }
        });

        expect(container).not.toContainElement(queryByText(/file4\.png/));
        expect(container).not.toContainElement(queryByText(/file5\.png/));
        expect(container).not.toContainElement(queryByText(/file6\.jpg/));

        expect(onSuccessTriggered).toBe(true);
        expect(onErrorTriggered).toBe(true);
    });
});
