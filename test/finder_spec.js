import waldo from '../lib/waldo';

const GLOBAL = (typeof window == 'object') ? window : global;

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

[waldo, GLOBAL.waldo].forEach(find => {
  describe('waldo', () => {
    beforeEach(() => {
      GLOBAL.DEBUG = null;
      logSpy = spyOn(console, 'log').and.callThrough();
    });

    describe('debug mode', () => {
      it('is only engaged in global version', () => {
        find.byName('test');
        if (find === GLOBAL.waldo) {
          expect(GLOBAL.DEBUG).toEqual(true);
        } else {
          expect(!!GLOBAL.DEBUG).toEqual(false);
        }
      });
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
        matches = find.byType(Array, GLOBAL.testObj);
        testMatches(matches, [
          `SRC.arr1 -> (object) ${GLOBAL.testObj.arr1}`,
          `SRC.arr2 -> (object) ${GLOBAL.testObj.arr2}`
        ]);
        logSpy.calls.reset();
        matches = find.byType(Function, GLOBAL.testObj);
        testMatches(matches, [
          `SRC.fn -> (function) [object Function]`
        ]);
      });
      it('should not find primitive types', () => {
        matches = find.byType(String, GLOBAL.testObj);
        testMatches(matches, []);
      });
    });

    describe('findByValue', () => {
      it('should find number', () => {
        matches = find.byValue(3, GLOBAL.testObj);
        testMatches(matches, [
          'SRC.circ.a -> (number) 3'
        ]);
      });
      it('should find number and detect circular reference', () => {
        matches = find.byValue(4, GLOBAL.testObj);
        testMatches(matches, [
          'SRC.obj.d -> (<SRC.obj>) 4'
        ]);
      });
      it('should find complex value', () => {
        matches = find.byValue(GLOBAL.testObj.arr2, GLOBAL.testObj);
        testMatches(matches, [
          `SRC.arr2 -> (object) ${GLOBAL.testObj.arr2}`
        ]);
      });
    });

    describe('findByValueCoreced', () => {
      it('should find number equivalent of a string', () => {
        matches = find.byValueCoerced('3', GLOBAL.testObj);
        testMatches(matches, [
          'SRC.circ.a -> (number) 3'
        ]);
      });
      it('should not find falsey values when non exist', () => {
        matches = find.byValueCoerced(false, GLOBAL.testObj);
        testMatches(matches, []);
      });
    });

    describe('findByCustomFunction', () => {
      it('should return custom function matches', () => {
        matches = find.custom((what, obj, prop) => (obj[prop] === 1) && (prop == 'num'));
        testMatches(matches, [
          'GLOBAL.testObj.num -> (number) 1'
        ]);
      });
      it('should report no matches when no custom filter matches', () => {
        matches = find.custom((what, obj, prop) => (obj[prop] === 1) && (prop == 'pie'));
        testMatches(matches, []);
      });
      it('should custom search within given object', () => {
        matches = find.custom(
          (what, obj, prop) => {
            return (
              Array.isArray(obj[prop]) &&
              typeof obj[prop][0] == 'string'
            );
          },
          null,
          GLOBAL.testObj
        );
        testMatches(matches, [
          'SRC.arr2 -> (object) a,b,c'
        ]);
      });
      // TODO: test what param
    });
  });
});
