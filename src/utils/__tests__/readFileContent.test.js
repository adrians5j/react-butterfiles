import readFileContent from "react-butterfiles/utils/readFileContent";

/**
 * Create an instance of File, out of a dataURL
 * @param dataUrl
 * @param filename
 * @returns {File}
 */
function dataURLtoFile(dataUrl, filename) {
    let arr = dataUrl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

test("generateId must generate a random ID", async () => {
    const file = dataURLtoFile("data:text/plain;base64,aGVsbG8gd29ybGQ=", "hello.txt");

    expect(file instanceof File).toBe(true);
    const result = await readFileContent(file);
    expect(result).toBe("data:text/plain;charset=undefined,hello%20world");
});
