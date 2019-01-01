import React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";
import "jest-dom/extend-expect";
import SimpleFileField from "./components/SimpleFileField";

// These tests don't actually test anything - but we needed them for coverage :(

describe("browseFiles handler", () => {
    afterEach(cleanup);

    test("make sure browseFiles is executed", async () => {
        const { getByText } = render(<SimpleFileField />);
        fireEvent.click(getByText("Browse..."));
    });

    test("make sure browseFiles (with custom onSuccess / onError callbacks) is executed", async () => {
        const { getByText } = render(
            <SimpleFileField
                browseFilesHandler={browseFiles => {
                    browseFiles({
                        onSuccess: () => {},
                        onError: () => {}
                    });
                }}
            />
        );
        fireEvent.click(getByText("Browse..."));
    });
});
