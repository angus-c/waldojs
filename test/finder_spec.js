import src from '../src/finder';
import waldo from '../lib/waldo';
import waldoMin from '../lib/waldo.min';

const global = (typeof window == 'object') ? window : global;

// dummy objects
global.testObj = {
  obj: {d: 4},
  arr1: [1, 2, 3, 4, 5],
  arr2: ['a', 'b', 'c'],
  fn: function () {},
  num: 1
}

global.testObj.circ = {a: 3, b: global.testObj.obj};
let logSpy, query;

function testMatches(query, expectedMatches) {
  expect(query.matches.length).toEqual(expectedMatches.length);
  expectedMatches.forEach((match, i) => {
    expect(query.matches[i].toString()).toEqual(match);
  });
  if (global.DEBUG) {
    if (expectedMatches.length) {
      expect(console.log).toHaveBeenCalledWith(
        expectedMatches[expectedMatches.length - 1]);
    } else {
      expect(console.log).not.toHaveBeenCalled();
    }
  }
}

[src, waldo, waldoMin].forEach(find => {
  [false, true].forEach(debug => {
    find.debug(debug);

    describe('waldo', () => {
      beforeEach(() => {
        logSpy = spyOn(console, 'log').and.callThrough();
      });

      describe('findByName', () => {
        it('should find root level object', () => {
          query = find.byName('circ');
          testMatches(query, [
            `global.testObj.circ -> (object) ${global.testObj.circ}`
          ]);
        });

        it('should find root level array', () => {
          query = find.byName('arr1');
          testMatches(query, [
            `global.testObj.arr1 -> (object) ${global.testObj.arr1}`
          ]);
        });

        it('should find nested property', () => {
          query = find.byName('a');
          testMatches(query, [
            'global.testObj.circ.a -> (number) 3'
          ]);
        });

        it('should detect circular references', () => {
          query = find.byName('d');
          testMatches(query, [
            'global.testObj.obj.d -> (<global.testObj.obj>) 4'
          ]);
        });
      });

      describe('findByType', () => {
        it('should find first class objects types', () => {
          query = find.byType(Array, {obj: global.testObj, path: 'testObj'});
          testMatches(query, [
            `testObj.arr1 -> (object) ${global.testObj.arr1}`,
            `testObj.arr2 -> (object) ${global.testObj.arr2}`
          ]);
          logSpy.calls.reset();
          query = find.byType(Function, {obj: global.testObj, path: 'testObj'});
          testMatches(query, [
            `testObj.fn -> (function) ${global.testObj.fn}`
          ]);
        });
        it('should not find primitive types', () => {
          query = find.byType(String, {obj: global.testObj, path: 'testObj'});
          testMatches(query, []);
        });
      });

      describe('findByValue', () => {
        it('should find number', () => {
          query = find.byValue(3, {obj: global.testObj, path: 'testObj'});
          testMatches(query, [
            'testObj.circ.a -> (number) 3'
          ]);
        });
        it('should find number and detect circular reference', () => {
          query = find.byValue(4, {obj: global.testObj, path: 'testObj'});
          testMatches(query, [
            'testObj.obj.d -> (<testObj.obj>) 4'
          ]);
        });
        it('should find complex value', () => {
          query = find.byValue(global.testObj.arr2, {obj: global.testObj, path: 'testObj'});
          testMatches(query, [
            `testObj.arr2 -> (object) ${global.testObj.arr2}`
          ]);
        });
      });

      describe('findByValueCoreced', () => {
        it('should find number equivalent of a string', () => {
          query = find.byValueCoerced('3', {obj: global.testObj, path: 'testObj'});
          testMatches(query, [
            'testObj.circ.a -> (number) 3'
          ]);
        });
        it('should not find falsey values when non exist', () => {
          query = find.byValueCoerced(false, {obj: global.testObj, path: 'testObj'});
          testMatches(query, []);
        });
      });

      describe('findByCustomeFilter', () => {
        it('should return custom filter matches', () => {
          query = find.custom((searchTerm, obj, prop) => (obj[prop] === 1) && (prop == 'num'));
          testMatches(query, [
            'global.testObj.num -> (number) 1'
          ]);
        });
        it('should report no matches when no custom filter matches', () => {
          query = find.custom((searchTerm, obj, prop) => (obj[prop] === 1) && (prop == 'pie'));
          testMatches(query, []);
        });
        // TODO: test searchTerm param
      });
    });
  });
});
