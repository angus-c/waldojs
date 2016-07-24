import compare from 'just-compare';

const GLOBAL = (typeof window == 'object') ? window : global;

const find = {
  byName(what, where) {
    return this.searchMaybe('propName', 'string', what, where);
  },
  byType(what, where) {
    return this.searchMaybe('type', 'function', what, where);
  },
  byValue(what, where) {
    return this.searchMaybe('value', null, what, where);
  },
  byValueCoerced(what, where) {
    return this.searchMaybe('valueCoerced', null, what, where);
  },
  custom(fn, where) {
    return this.searchMaybe(fn, null, null, where);
  },
  searchMaybe(util, expected, what, where) {
    // integrity check arguments
    if (expected && typeof what != expected) {
      throw new Error(`${what} must be ${expected}`);
    }
    // only console.log if we are the global function
    if (this === GLOBAL.waldo) {
      GLOBAL.DEBUG = true;
    }
    return search(util, what, where);
  }
}

function search(util, what, where = GLOBAL) {
  util = searchBy[util] || util;

  let data;
  let alreadySeen;

  const path = (where == GLOBAL) ? 'GLOBAL' : 'SRC';
  let queue = [{ where, path }];
  let seen = [];

  let matches = [];
  matches.log = function () {
    this.forEach(m => m.log());
  };

  // a non-recursive solution to avoid call stack limits
  // http://www.jslab.dk/articles/non.recursive.preorder.traversal.part4
  while ((data = queue.pop())) {
    let {where, path} = data;

    for (const prop in where) {
      // IE may throw errors when accessing/coercing some properties
      try {
        if (where.hasOwnProperty(prop)) {
          // inspect objects
          if ([where[prop]] == '[object Object]') {
            // check if already searched (prevents circular references)
            for (
              var i = -1;
              seen[++i] && !(alreadySeen = compare(seen[i].where, where[prop]) && seen[i]);
            );
            // add to stack
            if (!alreadySeen) {
              data = { where: where[prop], path: `${path}.${prop}`};
              queue.push(data);
              seen.push(data);
            }
          }
          // if match detected, push it.
          if (util(what, where, prop)) {
            const type = alreadySeen ? `<${alreadySeen.path}>` : typeof where[prop];
            const match = new Match(
              {path: `${path}.${prop}`, obj: where, prop, type});
            matches.push(match);
            GLOBAL.DEBUG && match.log();
          }
        }
      } catch(e) {}
    }
  }

  return matches;
}

const searchBy = {
  propName(what, where, prop) {
    return what == prop;
  },
  type(what, where, prop) {
    return where[prop] instanceof what;
  },
  value(what, where, prop) {
    return where[prop] === what;
  },
  valueCoerced(what, where, prop) {
    return where[prop] == what;
  }
};

class Match {
  constructor(props) {
    Object.assign(this, props);
    this.value = this.obj[this.prop];
  }

  toString() {
    let {path, type} = this;
    return `${path} -> (${type}) ${this.logValue()}`;
  }

  logValue() {
    const val = this.value;
    // if value is an object then just toString it
    const isPrimitive = x => Object(x) !== x;
    return isPrimitive(val) || Array.isArray(val) ?
      val :
      {}.toString.call(val);
  }

  log() {
    console.log(this.toString());
  }
}

// for console running
GLOBAL.waldo = Object.assign({}, find, {debug: true});

export default find;
