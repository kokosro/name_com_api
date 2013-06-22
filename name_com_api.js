/*

  Name.com api story,
  Written by Robert Doroftei
  for node.js

*/
var request = require("request");
//var https = require("https");
function name_com_api(account, api_token){
  function add_one_to(to_this){
    return (to_this+1);
  }
  var debug = true;
  function log(say_this){
    if(debug){
      console.log(say_this);
    }
    return say_this;
  }
  function api(account, api_token){
    var s_token = "";
    var waiting_que = {};
    var que_frequence = 20;
    var api_credentials = {
      username: account,
      api_token: api_token
    }
    var default_headers = {
      "Content-type": "application/json"
    };
    var api_url = "https://api.name.com/api";
    if(arguments[2]){
        api_url = "https://api.dev.name.com/api"
    }

    var magic = function(){

    }

    var mark_magic = (function(){
      var magic_infinit = 0;
      function now(){
       return log("u"+(magic_infinit=add_one_to(magic_infinit)));
      }
      return {
        now: function(){
          return now();
        },
        infinit: function(){
          return "u"+magic_infinit;
        }
      }
    })();


    var security_check = (function(){
      var s_token = "";
      var _que = {};
      var frequency = 200;
      var shift_starting = false;
      function no_session_token(pre_approved){
        return (s_token=="")&&(!pre_approved);
      }
      function error(err){
        log(api_url+" error ");
        log(err);
        return false;
      }

      function session_token(){
        if(arguments.length){

          s_token = arguments[0];
          log("new session_token:"+s_token);
          default_headers = {
            "Api-Session-Token": s_token,
            "Content-type": "application/json"
          };
          if(s_token != ""){
            shift_starting = false;
          }
         // console.log(default_headers);
        }
        return s_token;
      }

      function with_some(value){
        log("and some to "+value);
        Math.floor(value+Math.random()*value);
      }

      function que_clean_up(magic_mark){
        log("cleaning que at "+magic_mark);
        delete _que[magic_mark];
      }
      function que_resume(){
        log("que resume");
        for(var magic_mark in _que){
          log("que resume mark "+magic_mark);
          _que[magic_mark]();
          setTimeout(que_clean_up, with_some(frequency), magic_mark);
        }
      }
      function soft_scan(said_what, got_this, luggage){
        log("soft scan of "+said_what+" with luggage: ");
        log(luggage);
        if(got_this.session_token){
          session_token(got_this.session_token);
          que_resume();
        }
      }
      function scan_response(said_this, then_use_it, luggage){

        return function(err, res, body){
          log("scanning response");
          log(body);
          if(err){
            error(said_this,err);
          }
          soft_scan(said_this, JSON.parse(body), luggage);
          then_use_it(JSON.parse(body));
        }
      }
      function make_it_a_memory(say_this, then_use_it,luggage){
        if(luggage){
          log("saving POST "+say_this+" Memory, luggage:");
          log(luggage);
          return function(){
            log("doing POST "+say_this+" Memory, luggage:");
            log(luggage);
            request({
                    url: api_url+say_this,
                    method: "POST",
                    body: JSON.stringify(luggage),
                    headers: default_headers,
                    strictSSL: false,
                  },
                  scan_response(say_this, then_use_it,luggage));

          }
        }else{
          log("saving GET "+say_this+" Memory");
          return function(){
            log("doing GET "+say_this+" Memory");
             request({
                      url: api_url+say_this,
                      method: "GET",
                      headers: default_headers,
                      strictSSL: false,
                    },
                    scan_response(say_this, then_use_it));

          }
        }
      }
      function que(say_this, then_use_it, luggage){
        log("placing in que: "+say_this+" with luggage ");
        log(luggage);
        _que[mark_magic.now()]= make_it_a_memory(say_this, then_use_it, luggage);
      }
      function waiting_on_seal(say_this, then_use_it, luggage){
        log(say_this+" waiting on a seal, with luggage");
        log(luggage);
        que(say_this, then_use_it, luggage);
      }
      function start_shift(){
        if(!shift_starting){
          log("starting shift");

          login(function(){},api_credentials);
        }else{
          log("shift already trying to be started");
        }
      }
      function seal(saying_this, then_using_it, luggage, pre_approved){
        log("Sealing "+saying_this+" with luggage");
        log(luggage);
        if(no_session_token(pre_approved)){
          waiting_on_seal(saying_this, then_using_it, luggage);
          start_shift();
        }else{
          make_it_a_memory(saying_this, then_using_it, luggage)();
        }
      }
      function approved(){
        if(!arguments.length){
          return true
        }
        return arguments[0];
      }
      function login(pontaj, who_is_working){
        log("doing the login rutine");
        shift_starting = true;
        seal("/login",pontaj,who_is_working,approved());
      }
      return {
        begin_shift: function(pontaj,who_is_working){
          login(pontaj,who_s_working);
        },
        talk_with_name_com: function(say_it, then_use_it, luggage){
           seal(say_it, then_use_it, luggage);
        }
      }
    })();


    log(api_url);



    return {
      run_a_test: function(){

        security_check.talk_with_name_com("/hello",function(response){
          log(response);
        });

        security_check.talk_with_name_com("/account/get", function(response){
          log(response);
        });

        security_check.talk_with_name_com("/domain/list", function(response){
          log(response);
        });

        security_check.talk_with_name_com("/domain/check", function(response){

        },{
          "keyword": "butistillhaventfound",
          "tlds": ["com","net","org"],
          "services": ["availability"]
        });


      }
    }


  }


    return api(account, api_token, arguments[2]);
}
module.exports = name_com_api;