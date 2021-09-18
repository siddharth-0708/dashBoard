async function signUpSubmit(firstName, lastName, email, password, mobile){
    const params = {
        "email_address": email.value,
        "first_name": firstName.value,
        "last_name": lastName.value,
        "mobile_number": mobile.value,
        "password": password.value
      }
      try {
        const rawPromise = fetch('http://localhost:8080/api/v1/signup',{
            body: JSON.stringify(params),
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json;charset=UTF-8"
            }
        })
        const rawResponse = await rawPromise;
        result = await rawResponse.json();

        // rawPromise.then(function(result){
        //   //result is raw response
        //   return result.json();
        // }).then((data)=>{
        //     console.log(data);
        // })
        
      if(rawResponse.ok){ 
          window.location.href = "./login.html";
      }else{
          const error = new Error();
          error.message = error.message ?  error.message : "something happened";
          throw error;
      }

      } catch (error) {
          
      }
}


//not needed JUST REMEMBER PROMISES GIVE YOU A RESULT AND THAT RESULT AND AGAIN BE SENT TO ANOTHER PROMISE LIKE ,JSON()
// async function rohit(){
//   async function sid(){
//     return cashew;
//   }
//   var j = await sid();
//   console.log(j);
//   var p = await j();
//   console.log(p);
// }
// async function cashew() {
//   return new Promise(function(accept, reject){
//     setTimeout(function(){
//       accept(100);
//     },5000);
//   })
// }