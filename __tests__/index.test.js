test('Testing to see if Jest works 2', () => {
 expect(1).toBe(1)
})

test('Jest should use the test DB', ()=> {
 expect(process.env.DB_DATABASE).toBe('test_db');
})
