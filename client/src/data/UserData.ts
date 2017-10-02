interface Pipeline {
  name: string;
  issues: object[];
}


class UserData {
  full_name: string;
  avatar_id: string;
  _id: string;
  name: string;
  pipelines: Pipeline[] = new Array<Pipeline>()

  constructor() {

  }
}


