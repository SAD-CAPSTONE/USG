window.fbAsyncInit = function() {
    FB.init({
      appId      : '1996268293765350',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });

    FB.AppEvents.logPageView();

  };

  (function(d, s, id){
     let js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
