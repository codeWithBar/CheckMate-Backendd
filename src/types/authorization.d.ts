// Without adding this declaration file, TS compiler will complain that there is no user property of the request type of express
// at routes/users req.user for example
// And also relative paths are added to the typeroots config option but I don't know whether this is necessary or not
// also the program needs to be run with  the --files flag
declare namespace Express {
  export interface Request {
    header(arg0: string): unknown;
    user: any;
  }
}
