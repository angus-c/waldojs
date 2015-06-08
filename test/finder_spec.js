import src from '../src/finder';
import waldo from '../lib/waldo';
import waldoMin from '../lib/waldo.min';

const global = window || global;

// dummy objects
global.testObj = {
  obj: {d: 4},
  arr1: [1, 2, 3, 4, 5],
  arr2: ['a', 'b', 'c'],
  fn: function () {},
  num: 1
}

global.testObj.circ = {a: 3, b: global.testObj.obj};
let logSpy;

[src, waldo, waldoMin].forEach(find => {
  describe('waldo', () => {
    beforeEach(() => {
      logSpy = spyOn(console, 'log').and.callThrough();
    });
    describe('findByName', () => {
      it('should find root level object', () => {
        find.byName('circ');
        expect(console.log).toHaveBeenCalledWith(
          `global.testObj.circ -> (object) ${global.testObj.circ}`);
      });
      it('should find root level array', () => {
        find.byName('arr1');
        expect(console.log).toHaveBeenCalledWith(
          `global.testObj.arr1 -> (object) ${global.testObj.arr1}`);
      });
      it('should find nested property', () => {
        find.byName('a');
        expect(console.log).toHaveBeenCalledWith(
          'global.testObj.circ.a -> (number) 3');
      });
      it('should detect circular references', () => {
        find.byName('d');
        expect(console.log).toHaveBeenCalledWith(
          'global.testObj.obj.d -> (<global.testObj.obj>) 4');
      });
    });

    describe('findByType', () => {
      it('should find first class objects types', () => {
        find.byType(Array, {obj: global.testObj, path: 'testObj'});
        // TODO need to check for multiple matches
        expect(console.log).toHaveBeenCalledWith(
          `testObj.arr1 -> (object) ${global.testObj.arr1}`);
        logSpy.calls.reset();
        find.byType(Function, {obj: global.testObj, path: 'testObj'});
        expect(console.log).toHaveBeenCalledWith(
          `testObj.fn -> (function) ${global.testObj.fn}`);
      });
      it('should not find primitive types', () => {
        find.byType(String, {obj: global.testObj, path: 'testObj'});
        expect(console.log).not.toHaveBeenCalled();
      });
    });

    describe('findByValue', () => {
      it('should find number', () => {
        find.byValue(3, {obj: global.testObj, path: 'testObj'});
        expect(console.log).toHaveBeenCalledWith(
          'testObj.circ.a -> (number) 3');
      });
      it('should find number and detect circular reference', () => {
        find.byValue(4, {obj: global.testObj, path: 'testObj'});
        expect(console.log).toHaveBeenCalledWith(
          'testObj.obj.d -> (<testObj.obj>) 4');
      });
      it('should find complex value', () => {
        find.byValue(global.testObj.arr2, {obj: global.testObj, path: 'testObj'});
        expect(console.log).toHaveBeenCalledWith(
          `testObj.arr2 -> (object) ${global.testObj.arr2}`);
      });
    });

    describe('findByValueCoreced', () => {
      it('should find number equivalent of a string', () => {
        find.byValueCoerced('3', {obj: global.testObj, path: 'testObj'});
        expect(console.log).toHaveBeenCalledWith(
          'testObj.circ.a -> (number) 3');
      });
      it('should not find falsey values when non exist', () => {
        find.byValueCoerced(false, {obj: global.testObj, path: 'testObj'});
        expect(console.log).not.toHaveBeenCalled();
      });
    });

    describe('findByCustomeFilter', () => {
      it('should return custom filter matches', () => {
        find.custom((searchTerm, obj, prop) => (obj[prop] === 1) && (prop == 'num'));
        expect(console.log).toHaveBeenCalledWith('global.testObj.num -> (number) 1');
      });
      it('should report no matches when no custom filter matches', () => {
        find.custom((searchTerm, obj, prop) => (obj[prop] === 1) && (prop == 'pie'));
        expect(console.log).not.toHaveBeenCalled();
      });
      // TODO: test searchTerm param
    });
  });
});
