import React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";
import Files from "react-butterfiles";
import "jest-dom/extend-expect";
import SimpleFileField from "./components/SimpleFileField";

describe("Files tests", () => {
    afterEach(cleanup);

    test("children must be rendered", () => {
        const { getByText } = render(<Files>{() => <div>Child has been rendered.</div>}</Files>);

        getByText("Child has been rendered.");
    });

    test("uploaded files must be shown in the list", () => {
        const { getByLabelText, getByText, container } = render(<SimpleFileField />);

        const file1 = new File(["(⌐□_□)"], "file1.png", {
            type: "image/png"
        });

        fireEvent.change(getByLabelText(/select files/i), { target: { files: [file1] } });
        expect(container).toContainElement(getByText(/file1\.png/));
    });
});
