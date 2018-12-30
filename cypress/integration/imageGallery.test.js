context("Simple file upload test", () => {
    it("should allow file to be selected by clicking the button", () => {
        cy.visitStory("Image%20Gallery");

        cy.get("#my-image-gallery")
            .dropFile("avatar1.jpeg", "image/jpeg")
            .dropFile("avatar2.jpeg", "image/jpeg")
            .find("ul > li")
            .should(elements => expect(elements).to.have.length(3));

        cy.get("#my-image-gallery")
            .dropFile("avatar2.jpeg", "invalid")
            .find("ul > li")
            .should(elements => expect(elements).to.have.length(3));

        cy.get("#wrapper").contains("An error occurred.");

        cy.get("#my-image-gallery")
            .dropFile("avatar3.jpeg", "image/jpeg")
            .find("ul > li")
            .should(elements => expect(elements).to.have.length(4));
    });
});
