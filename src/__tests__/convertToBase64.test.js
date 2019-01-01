import React from "react";
import { render, cleanup, fireEvent, waitForElement } from "react-testing-library";
import "jest-dom/extend-expect";
import SimpleFileField from "./components/SimpleFileField";

const files = [
    new File(["content-of-file1.png"], "file1.png", {
        type: "image/png"
    }),
    new File(["content-of-file2.png"], "file2.png", {
        type: "image/png"
    }),
    new File(["content-of-file3.jpg"], "file3.jpg", {
        type: "image/jpg"
    })
];

describe("convertToBase64 prop tests", () => {
    afterEach(cleanup);

    test("all files must be converted to base64", async () => {
        // "convertToBase64" not passed
        const { getByLabelText, getByText } = render(
            <SimpleFileField
                files={{ multiple: true, convertToBase64: true }}
                renderFiles={files => (
                    <div>
                        Selected files:
                        <ul>
                            {files.map(file => {
                                return <li key={file.id}>{file.src.base64}</li>;
                            })}
                        </ul>
                    </div>
                )}
            />
        );

        await fireEvent.change(getByLabelText(/select files/i), {
            target: { files }
        });

        await waitForElement(() => {
            return Promise.all([
                getByText("data:image/png;base64,Y29udGVudC1vZi1maWxlMS5wbmc="),
                getByText("data:image/png;base64,Y29udGVudC1vZi1maWxlMi5wbmc="),
                getByText("data:image/jpg;base64,Y29udGVudC1vZi1maWxlMy5qcGc=")
            ]);
        });
    });
});
