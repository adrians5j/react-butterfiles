import React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";
import "jest-dom/extend-expect";
import SimpleFileField from "./components/SimpleFileField";

describe("empty files test", () => {
    afterEach(cleanup);

    test("trigger callbacks only if some files were passed", () => {
        const { getByLabelText, getByText, container } = render(<SimpleFileField />);

        const file1 = new File(["(⌐□_□)"], "file1.png", {
            type: "image/png"
        });

        const file2 = new File(["(⌐□_□)"], "file2.png", {
            type: "image/png"
        });

        fireEvent.change(getByLabelText(/select files/i), { target: { files: [file1] } });
        expect(container).toContainElement(getByText(/Tries: 1/));

        fireEvent.change(getByLabelText(/select files/i), { target: { files: [] } });
        expect(container).toContainElement(getByText(/Tries: 1/));

        fireEvent.change(getByLabelText(/select files/i), { target: { files: [file1, file2] } });
        expect(container).toContainElement(getByText(/Tries: 2/));
    });
});
