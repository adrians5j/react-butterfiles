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
    })
];

describe("multiple prop tests", () => {
    afterEach(cleanup);

    test("trigger error callback if multiple not allowed", () => {
        // "multiple" not passed
        const { getByLabelText, container, getByText } = render(
            <SimpleFileField files={{ multiple: true, multipleMaxCount: 2 }} />
        );
        fireEvent.change(getByLabelText(/select files/i), {
            target: {
                files: [
                    ...files,
                    new File(["(⌐□_□)"], "file3.png", {
                        type: "image/png"
                    })
                ]
            }
        });
        expect(container).toContainElement(getByText(/multipleMaxCountExceeded/));
    });

    test("trigger success callback if multiple allowed", () => {
        const { getByLabelText, container, getByText } = render(
            <SimpleFileField files={{ multiple: true }} />
        );
        fireEvent.change(getByLabelText(/select files/i), {
            target: { files }
        });
        expect(container).toContainElement(getByText(/file1\.png/));
        expect(container).toContainElement(getByText(/file2\.png/));
    });
});
