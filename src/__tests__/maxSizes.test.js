import React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";
import "jest-dom/extend-expect";
import SimpleFileField from "./components/SimpleFileField";

describe("maxSize and multipleMaxSize props tests", () => {
    afterEach(cleanup);

    test("trigger success callback if maxSize is not passed", () => {
        const { getByLabelText, container, getByText } = render(
            <SimpleFileField files={{ maxSize: "", multiple: true }} />
        );
        fireEvent.change(getByLabelText(/select files/i), {
            target: {
                files: [
                    new File(["this-is-16-bytes"], "file1.png", {
                        type: "image/png"
                    }),
                    new File(["this-is-16-bytes"], "file2.png", {
                        type: "image/png"
                    })
                ]
            }
        });

        expect(container).toContainElement(getByText(/file1\.png/));
        expect(container).toContainElement(getByText(/file2\.png/));
    });

    test("trigger error callback if size of file is greater than maxSize", () => {
        const { getByLabelText, container, getByText } = render(
            <SimpleFileField files={{ maxSize: "10b" }} />
        );
        fireEvent.change(getByLabelText(/select files/i), {
            target: {
                files: [
                    new File(["this-is-16-bytes"], "file.png", {
                        type: "image/png"
                    })
                ]
            }
        });
        expect(container).toContainElement(getByText(/maxSizeExceeded/));
    });

    test("trigger success callback if size of file is lesser than maxSize ", () => {
        const { getByLabelText, container, getByText } = render(
            <SimpleFileField files={{ maxSize: "10b" }} />
        );
        fireEvent.change(getByLabelText(/select files/i), {
            target: {
                files: [
                    new File(["7-bytes"], "file.png", {
                        type: "image/png"
                    })
                ]
            }
        });
        expect(container).toContainElement(getByText(/file\.png/));
    });

    test("trigger error callback if size of all selected files is greater than multipleMaxSize", () => {
        const { getByLabelText, container, getByText } = render(
            <SimpleFileField files={{ multiple: true, maxSize: "20b", multipleMaxSize: "30b" }} />
        );
        fireEvent.change(getByLabelText(/select files/i), {
            target: {
                files: [
                    new File(["this-is-16-bytes"], "file1.png", {
                        type: "image/png"
                    }),
                    new File(["this-is-16-bytes"], "file2.png", {
                        type: "image/png"
                    })
                ]
            }
        });
        expect(container).toContainElement(getByText(/multipleMaxSizeExceeded/));
    });

    test("trigger success callback if size of all selected files is lesser than multipleMaxSize", () => {
        const { getByLabelText, container, getByText } = render(
            <SimpleFileField files={{ multiple: true, maxSize: "20b", multipleMaxSize: "40b" }} />
        );
        fireEvent.change(getByLabelText(/select files/i), {
            target: {
                files: [
                    new File(["this-is-16-bytes"], "file1.png", {
                        type: "image/png"
                    }),
                    new File(["this-is-16-bytes"], "file2.png", {
                        type: "image/png"
                    })
                ]
            }
        });

        expect(container).toContainElement(getByText(/file1\.png/));
        expect(container).toContainElement(getByText(/file2\.png/));
    });

    test("trigger error callback because maxSize was exceeded (but not multiple max size)", () => {
        const { getByLabelText, container, getByText } = render(
            <SimpleFileField files={{ multiple: true, maxSize: "10b", multipleMaxSize: "40b" }} />
        );
        fireEvent.change(getByLabelText(/select files/i), {
            target: {
                files: [
                    new File(["this-is-16-bytes"], "file1.png", {
                        type: "image/png"
                    })
                ]
            }
        });

        expect(container).toContainElement(getByText(/maxSizeExceeded/));
    });
});
