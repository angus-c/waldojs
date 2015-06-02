import find from '../src/finder'

//dummy objects
window.testObj = {
  obj: {d: 4},
  arr1: [1, 2, 3, 4, 5],
  arr2: ['a', 'b', 'c'],
  fn: function() {},
  num: 1
}

window.testObj.circ = {a:3, b: window.testObj.obj};
var logSpy;

describe("waldo", function() {
  beforeEach(function() {
    logSpy = spyOn(console, 'log').and.callThrough();
  });
  describe("findByName", function() {
    it("should find root level object", function() {
      find.byName('circ');
      expect(console.log).toHaveBeenCalledWith(`global.testObj.circ -> (object) ${window.testObj.circ}`);
    });
    it("should find root level array", function() {
      find.byName('arr1');
      expect(console.log).toHaveBeenCalledWith(`global.testObj.arr1 -> (object) ${window.testObj.arr1}`);
    });
    it("should find nested property", function() {
      find.byName('a');
      expect(console.log).toHaveBeenCalledWith('global.testObj.circ.a -> (number) 3');
    });
    it("should detect circular reference", function() {
      find.byName('d');
      expect(console.log).toHaveBeenCalledWith('global.testObj.obj.d -> (<global.testObj.obj>) 4');
    });
  });
  describe("findByType", function() {
    it("should find first class objects types", function() {
      find.byType(Array, {obj: window.testObj, path: 'testObj'});
      //TODO need to check for multiple matches
      expect(console.log).toHaveBeenCalledWith(`testObj.arr1 -> (object) ${window.testObj.arr1}`);
      logSpy.calls.reset();
      find.byType(Function, {obj: window.testObj, path: 'testObj'});
      expect(console.log).toHaveBeenCalledWith(`testObj.fn -> (function) ${window.testObj.fn}`);
    });
    it("should not find primitive types", function() {
      find.byType(String, {obj: window.testObj, path: 'testObj'});
      expect(console.log).not.toHaveBeenCalled();
    });
  });
  describe("findByValue", function() {
    it("should find number", function() {
      find.byValue(3, {obj: window.testObj, path: 'testObj'});
      expect(console.log).toHaveBeenCalledWith('testObj.circ.a -> (number) 3');
    });
    it("should find number and detect circular reference", function() {
      find.byValue(4, {obj: window.testObj, path: 'testObj'});
      expect(console.log).toHaveBeenCalledWith('testObj.obj.d -> (<testObj.obj>) 4');
    });
    it("should find complex value", function() {
      find.byValue(window.testObj.arr2, {obj: window.testObj, path: 'testObj'});
      expect(console.log).toHaveBeenCalledWith(`testObj.arr2 -> (object) ${testObj.arr2}`);
    });
  });
  describe("findByValueCoreced", function() {
    it("should find number equivalent of a string", function() {
      find.byValueCoerced('3', {obj: window.testObj, path: 'testObj'});
      expect(console.log).toHaveBeenCalledWith('testObj.circ.a -> (number) 3');
    });
    it("should not find falsey values when non exist", function() {
      find.byValueCoerced(false, {obj: window.testObj, path: 'testObj'});
      expect(console.log).not.toHaveBeenCalledWith();
    });
  });
  describe("findByCustomeFilter", function() {
    it("should return custom filter matches", function() {
      find.custom(function(searchTerm, obj, prop) {return (obj[prop] === 1) && (prop == 'num')});
      expect(console.log).toHaveBeenCalledWith('global.testObj.num -> (number) 1');
    });
    it("should report no matches when no custom filter matches", function() {
      find.custom(function(searchTerm, obj, prop) {return (obj[prop] === 1) && (prop == 'pie')});
      expect(console.log).not.toHaveBeenCalled();
    });
    //TODO: test searchTerm param
  });
});
