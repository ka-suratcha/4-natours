class APIFeatures {
  //called when create new obj
  constructor(query, queryString) {
    this.query = query; // parse mongoose query obj
    this.queryString = queryString; //query String from express(from route usually access to req.query)
  }

  filter() {
    // ==== 1A.) Filltering
    // have to do hard copy cuz JS, when set a var in to another obj, that new var is a reference to that original obj
    const queryObj = { ...this.queryString }; // shallow copy of req.query, create obj out of that
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // create array of all fields that want to exculde

    // remove fields from query obj by loop over
    excludedFields.forEach((el) => delete queryObj[el]); // delete the field with the name of el

    // ==== 1B.) ADV FILTERRING
    // MongonDB -> { el { '$lt': 'num' } }
    let queryStr = JSON.stringify(queryObj); // JS Obj to JSON String, let cuz edit
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // reaplce $ in front of these -> for MongoDB

    // dont want to query tourd directly -> add to the query that already have
    this.query = this.query.find(JSON.parse(queryStr));

    // console.log(
    //   '\n========== Filltering ==========\n- req.query:',
    //   this.queryString,
    //   '\n\n- req.query that exculded:\t\t\t\t',
    //   queryObj,
    //   '\n- req.query that exculded and add $ (Filttering):\t',
    //   queryStr,
    //   '\n'
    // );

    return this;
  }

  sort() {
    // ==== 2.) Sorting
    if (this.queryString.sort) {
      // Mongoose -> sort(el1 el2)
      const sortBy = this.queryString.sort.split(',').join(' '); //split String with comma -> array of all the string

      this.query = this.query.sort(sortBy);

      // query request from sort
      // console.log(
      //   '\n========== Sorting ==========\n- req.query.sort:\t\t\t',
      //   this.queryString.sort,
      //   '\n- req.query.sort.with.split:\t\t',
      //   this.queryString.sort.split(','),
      //   '\n- req.query.sort.split.join (Sorting):\t',
      //   this.queryString.sort.split(',').join(' '),
      //   '\n'
      // );
      
    } else {
      // default
      // query = query.sort('-__id');
    }

    return this;
  }

  limitFieds() {
    // ==== 3.) Field limiting
    if (this.queryString.fields) {
      // Mongoose -> sort(el1 el2)
      const fields = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(fields);

      // console.log(
      //   '\n========== Field limiting ==========\nreq.query.fields:\t\t\t\t',
      //   this.queryString.fields,
      //   '\nreq.query.fields.with.split\t\t\t',
      //   this.queryString.fields.split(','),
      //   '\nreq.query.fields.split.join (Fileding):\t\t',
      //   this.queryString.fields.split(',').join(' '),
      //   '\n'
      // );

    } else {
      this.query = this.query.select('-__v'); // - is exculding
    }
    return this;
  }

  paginate() {
    // ==== 4.) Pagination
    // convert to number or use default
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;

    // get page before and * with limit per page to get skip
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // page that was req doesnt contain any data (dont existed) -> not really need error

    // console.log(
    //   '\n========== Pagination ==========\npage:\t',
    //   this.queryString.page * 1 || 1,
    //   '\nlimit:\t',
    //   this.queryString.limit * 1 || 100,
    //   '\nskip:\t',
    //   (page - 1) * limit,
    //   '\n'
    // );

    return this;
  }
}

module.exports = APIFeatures;
