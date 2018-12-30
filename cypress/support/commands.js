/**
 * Uploads a file to an input
 * @memberOf Cypress.Chainable#
 * @name upload_file
 * @function
 * @param {String} selector - element to target
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 */
Cypress.Commands.add("upload_file", (selector, fileUrl, type = "") => {
    return cy.get(selector).then(subject => {
        return cy
            .fixture(fileUrl, "base64")
            .then(Cypress.Blob.base64StringToBlob)
            .then(blob => {
                const el = subject[0];
                const nameSegments = fileUrl.split("/");
                const name = nameSegments[nameSegments.length - 1];
                const testFile = new File([blob], name, { type });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(testFile);
                el.files = dataTransfer.files;
                return subject;
            });
    });
});

Cypress.Commands.add("dropFile", { prevSubject: "element" }, (subject, fileName, type) => {
    return cy
        .fixture(fileName, "base64")
        .then(Cypress.Blob.base64StringToBlob)
        .then(blob => {
            // instantiate File from `application` window, not cypress window
            return cy.window().then(win => {
                const file = new win.File([blob], fileName, { type });
                const dataTransfer = new win.DataTransfer();
                dataTransfer.items.add(file);

                return cy.wrap(subject).trigger("drop", {
                    dataTransfer
                });
            });
        });
});

Cypress.Commands.add("visitStory", story => {
    let url =
        "http://localhost:6006/iframe.html?selectedKind=react-butterfiles&selectedStory=" + story;
    return cy.visit(url);
});
