import React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";
import "jest-dom/extend-expect";
import SimpleFileField from "./components/SimpleFileField";

const files = [
    new File(["(⌐□_□)"], "file1.png", {
        type: "image/png"
    }),
    new File(["(⌐□_□)"], "file2.png", {
        type: "image/png"
    }),
    new File(["(⌐□_□)"], "file3.jpg", {
        type: "image/jpg"
    })
];

describe("accept prop tests", () => {
    afterEach(cleanup);

    test("trigger error callback if invalid file type submitted", () => {
        // "accept" not passed
        const { getByLabelText, container, getByText } = render(
            <SimpleFileField files={{ multiple: true, accept: ["image/png"] }} />
        );

        fireEvent.change(getByLabelText(/select files/i), {
            target: { files }
        });

        expect(container).toContainElement(getByText(/unsupportedFileType/));
    });

    test("trigger success callback if all files are of allowed type", () => {
        const { getByLabelText, container, getByText } = render(
            <SimpleFileField files={{ multiple: true, accept: ["image/png", "image/jpg"] }} />
        );
        fireEvent.change(getByLabelText(/select files/i), {
            target: { files }
        });

        expect(container).toContainElement(getByText(/file1\.png/));
        expect(container).toContainElement(getByText(/file2\.png/));
        expect(container).toContainElement(getByText(/file3\.jpg/));
    });
});
