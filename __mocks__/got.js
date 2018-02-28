function got() {
  return Promise.resolve({ body: [] });
}

got.post = () => Promise.resolve({ body: [] });

got.get = () => Promise.resolve({ body: [] });

module.exports = jest.fn().mockImplementation(got);