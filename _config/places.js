/*
* In javascript the variables are declared in camelcase but I like use snake case,
* if you want you can rename them as you want and remove the rule in .eslintrc line 35
*/
const base_url = env('BASE_URL', 'http://localhost:8000');
const api_url = base_url + '/api/iplaces/v1';


export default {
  categories: api_url + '/categories',
  places: api_url + '/places',
  schedules: api_url + '/schedules',
  
}
