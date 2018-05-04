const add = (a, b) => a + b;
const generateGreeting = (name = 'Annonymous') => `Hello ${name}!`;

test('should add two numbers', () => {
    const result = add(3, 4);
    expect(result).toBe(7);
});

test('should greet name', () => {
    const result = generateGreeting('Yoav');
    expect(result).toBe(`Hello Yoav!`);
});

test('should generate greeting for no name', () => {
    const result = generateGreeting();
    expect(result).toBe(`Hello Annonymous!`);
});