import fs from 'fs';
import colors from 'colors';


const sb_domain = process.env['SB_DOMAIN'] || "";
const is_cf = process.env['IS_CF'] || false;
const auth = process.env['SB_PWD'] || "Searchblox@2022";

const content = "export const env = " + JSON.stringify({sb_domain: sb_domain, is_cf: is_cf, auth: auth}) + ";"

fs.writeFile('src/env.js', content, 'utf8', function(err){
  if(err){
    return console.log(err);
  }
  console.log('env file is written to src/env.js'.green);
});