//dummy objects
window.blah = {d: 4};
window.foo = {a:3, b: window.blah};
window.bar = [1,2,3,4,5]

describe("waldo", function() {
  describe("findByName", function() {
    beforeEach(function() {
      spyOn(console, 'log');
    });
    it("should find root level object", function() {
      find.byName('foo');
      expect(console.log).toHaveBeenCalledWith('global.foo', '->', '(object)', { a : 3, b : { d : 4 } });
    });
    it("should find root level array", function() {
      find.byName('bar');
      expect(console.log).toHaveBeenCalledWith('global.bar', '->', '(object)', [ 1, 2, 3, 4, 5 ]);
    });
    it("should find nested property", function() {
      find.byName('a');
      expect(console.log).toHaveBeenCalledWith('global.foo.a', '->', '(number)', 3);
    });
    it("should detect circular reference", function() {
      find.byName('d');
      expect(console.log).toHaveBeenCalledWith('global.blah.d', '->', '(<global.blah>)', 4);
    });
  });
  //more to come...
});