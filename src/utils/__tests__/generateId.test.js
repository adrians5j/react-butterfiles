import generateId from "react-butterfiles/utils/generateId";

test("generateId must generate a random ID", async () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1.length > 0).toBe(true);
    expect(id2.length > 0).toBe(true);
    expect(id2 === id1).toBe(false);
});
