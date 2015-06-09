class Match {
  constructor({path, obj, prop, type}) {
    this.attrs = {path, obj, prop, type, value: obj[prop]};
  }

  toString() {
    let {path, prop, type, value} = this.attrs;
    return `${path}.${prop} -> (${type}) ${value}`;
  }

  getValue() {
    let {obj, prop} = this.attrs;
    return obj[prop];
  }

  log() {
    console.log(this.toString());
  }
}

export default Match;
