function getSubset<T>(actual: T, expected: Partial<T>) {
    const testActual = JSON.parse(JSON.stringify(actual));

    // remove properties from testActual that are not in expected
    const expectedNames = Object.getOwnPropertyNames(expected);
    const actualNames = Object.getOwnPropertyNames(testActual);

    const deleteNames = actualNames.filter((x) => !expectedNames.includes(x));

    for (const name of deleteNames) {
        delete testActual[name];
    }

    return testActual;
}

function getSubsetArray<T extends object>(actual: T[], expected: Partial<T>[]) {
    return actual.map((value, index) => getSubset(value, expected[index]));
}

export function expectSubset<T extends object>(
    actual: T[],
    expected: Partial<T>[]
) {
    expect(actual.length).toBe(expected.length);
    const actualSubset = getSubsetArray(actual, expected);
    expect(actualSubset).toStrictEqual(expected);
}
