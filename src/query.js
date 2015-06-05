class Query {
  constructor({searchBy, searchTerm, path}) {
    this.attrs = {searchBy, searchTerm, path};
    this.matches = [];
  }

  toString() {
    let {searchBy, searchTerm} = this.attrs;
    const searchByDescriptions = {
      propName: 'by name',
      type: 'by type',
      value: 'by value',
      valueCoerced: 'by value coerced',
      custom: 'custom function'
    }

    searchBy =
      searchByDescriptions[searchBy] || searchByDescriptions['custom'];

    return `search ${searchBy} for ${searchTerm}`;
  }

  getMatches() {
    return this.matches;
  }

  addMatch(match) {
    this.matches.push(match);
  }

  log() {
    console.log(this);
  }
}

export default Query;
