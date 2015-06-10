import src from '../src/waldo';
import waldo from '../lib/waldo';
import waldoMin from '../lib/waldo.min';

const GLOBAL = (typeof window == 'object') ? window : global;

// dummy objects
GLOBAL.testObj = {
  obj: {d: 4},
  arr1: [1, 2, 3, 4, 5],
  arr2: ['a', 'b', 'c'],
  fn: function () {},
  num: 1
}
GLOBAL.testObj.circ = {a: 3, b: GLOBAL.testObj.obj};

let logSpy, matches;

function testMatches(matches, expectedMatches) {
  expect(matches.length).toEqual(expectedMatches.length);
  expectedMatches.forEach((match, i) => {
    expect(matches[i].toString()).toEqual(match);
  });
  if (GLOBAL.DEBUG) {
    if (expectedMatches.length) {
      expect(console.log).toHaveBeenCalledWith(
        expectedMatches[expectedMatches.length - 1]);
    } else {
      expect(console.log).not.toHaveBeenCalled();
    }
  }
}

[waldo, waldoMin].forEach(find => {
  [true, false].forEach(debug => {
    find.debug(debug);

    describe('waldo', () => {
      beforeEach(() => {
        logSpy = spyOn(console, 'log').and.callThrough();
      });

      describe('findByName', () => {
        it('should find root level object', () => {
          matches = find.byName('circ');
          testMatches(matches, [
            `GLOBAL.testObj.circ -> (object) ${GLOBAL.testObj.circ}`
          ]);
        });

        it('should find root level array', () => {
          matches = find.byName('arr1');
          testMatches(matches, [
            `GLOBAL.testObj.arr1 -> (object) ${GLOBAL.testObj.arr1}`
          ]);
        });

        it('should find nested property', () => {
          matches = find.byName('a');
          testMatches(matches, [
            'GLOBAL.testObj.circ.a -> (number) 3'
          ]);
        });

        it('should detect circular references', () => {
          matches = find.byName('d');
          testMatches(matches, [
            'GLOBAL.testObj.obj.d -> (<GLOBAL.testObj.obj>) 4'
          ]);
        });
      });

      describe('findByType', () => {
        it('should find first class objects types', () => {
          matches = find.byType(Array, {obj: GLOBAL.testObj, path: 'testObj'});
          testMatches(matches, [
            `testObj.arr1 -> (object) ${GLOBAL.testObj.arr1}`,
            `testObj.arr2 -> (object) ${GLOBAL.testObj.arr2}`
          ]);
          logSpy.calls.reset();
          matches = find.byType(Function, {obj: GLOBAL.testObj, path: 'testObj'});
          testMatches(matches, [
            `testObj.fn -> (function) ${GLOBAL.testObj.fn}`
          ]);
        });
        it('should not find primitive types', () => {
          matches = find.byType(String, {obj: GLOBAL.testObj, path: 'testObj'});
          testMatches(matches, []);
        });
      });

      describe('findByValue', () => {
        it('should find number', () => {
          matches = find.byValue(3, {obj: GLOBAL.testObj, path: 'testObj'});
          testMatches(matches, [
            'testObj.circ.a -> (number) 3'
          ]);
        });
        it('should find number and detect circular reference', () => {
          matches = find.byValue(4, {obj: GLOBAL.testObj, path: 'testObj'});
          testMatches(matches, [
            'testObj.obj.d -> (<testObj.obj>) 4'
          ]);
        });
        it('should find complex value', () => {
          matches = find.byValue(GLOBAL.testObj.arr2, {obj: GLOBAL.testObj, path: 'testObj'});
          testMatches(matches, [
            `testObj.arr2 -> (object) ${GLOBAL.testObj.arr2}`
          ]);
        });
      });

      describe('findByValueCoreced', () => {
        it('should find number equivalent of a string', () => {
          matches = find.byValueCoerced('3', {obj: GLOBAL.testObj, path: 'testObj'});
          testMatches(matches, [
            'testObj.circ.a -> (number) 3'
          ]);
        });
        it('should not find falsey values when non exist', () => {
          matches = find.byValueCoerced(false, {obj: GLOBAL.testObj, path: 'testObj'});
          testMatches(matches, []);
        });
      });

      describe('findByCustomFilter', () => {
        it('should return custom filter matches', () => {
          matches = find.custom((searchTerm, obj, prop) => (obj[prop] === 1) && (prop == 'num'));
          testMatches(matches, [
            'GLOBAL.testObj.num -> (number) 1'
          ]);
        });
        it('should report no matches when no custom filter matches', () => {
          matches = find.custom((searchTerm, obj, prop) => (obj[prop] === 1) && (prop == 'pie'));
          testMatches(matches, []);
        });
        // TODO: test searchTerm param
      });
    });
  });
});
