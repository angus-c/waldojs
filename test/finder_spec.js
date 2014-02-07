//dummy objects
window.foo = {a:3};
window.bar = [1,2,3,4,5]
window.baz = function(x) {return x*x};

describe("waldo", function() {
  it("should findByName", function() {
    spyOn(window, 'tests');
    find.byName('foo');
    expect(window.traverse).toHaveBeenCalledWith(window.tests.propName, 'foo');
  });
});